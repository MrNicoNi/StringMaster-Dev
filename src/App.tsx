import { useEffect, useState, useRef } from 'react';
import { useCrepePitch } from './useCrepePitch';

// CentsMeter e DebugIndicator permanecem os mesmos
const CentsMeter = ({ cents }: { cents: number }) => {
  const [smoothedCents, setSmoothedCents] = useState(cents);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const smoothingFactor = 0.05;
    const animate = () => {
      setSmoothedCents(currentSmoothedCents => {
        const newSmoothedCents = currentSmoothedCents + (cents - currentSmoothedCents) * smoothingFactor;
        if (Math.abs(cents - newSmoothedCents) < 0.01) return cents;
        return newSmoothedCents;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cents]);

  const percentage = (smoothedCents + 50);
  const isInTune = Math.abs(smoothedCents) < 5;

  return (
    <div className="w-full max-w-sm bg-gray-700 rounded-full h-4 my-4 relative">
      <div className="absolute left-1/2 top-0 h-full w-1 bg-green-500 transform -translate-x-1/2"></div>
      <div
        className="absolute top-0 h-4 w-1 rounded-full"
        style={{
          left: `${percentage}%`,
          backgroundColor: isInTune ? '#4ade80' : '#f87171',
          transform: `translateX(-${percentage}%)`
        }}
      ></div>
    </div>
  );
};

const DebugIndicator = ({ frequency, confidence }: { frequency: number, confidence: number }) => {
  return (
    <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-gray-800 p-2 rounded">
      <span>Freq: {frequency.toFixed(2)} Hz</span>
      <span className="ml-4">Conf: {confidence.toFixed(2)}</span>
    </div>
  );
};


// O TIPO DA NOTA AGORA É SEPARADO PARA REUTILIZAÇÃO
type NoteData = {
  name: string;
  cents: number;
  frequency: number;
  confidence: number;
};


function App() {
  // O 'note' do nosso hook useCrepePitch
  const { note: detectedNote, status, error, start, stop } = useCrepePitch();
  
  // O NOVO ESTADO: a nota que será exibida na UI, com persistência
  const [displayNote, setDisplayNote] = useState<NoteData | null>(null);
  const decayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpa qualquer timer de decaimento anterior
    if (decayTimeoutRef.current) {
      clearTimeout(decayTimeoutRef.current);
    }

    if (detectedNote) {
      // Se uma nota é detectada, atualiza a exibição imediatamente
      setDisplayNote(detectedNote);
    } else {
      // Se o sinal for perdido, inicia um timer de 750ms
      decayTimeoutRef.current = setTimeout(() => {
        setDisplayNote(null); // Limpa a exibição somente após o timer
      }, 750); // Tempo de persistência em milissegundos
    }

    return () => {
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
      }
    };
  }, [detectedNote]); // Este efeito reage à nota detectada pelo hook

  const [rawValues, setRawValues] = useState({ freq: 0, conf: 0 });

  useEffect(() => {
    if (detectedNote) {
      setRawValues({ freq: detectedNote.frequency, conf: detectedNote.confidence });
    } else {
      setRawValues(prev => ({ freq: prev.freq, conf: 0 }));
    }
  }, [detectedNote]);

  
  const TunerInterface = () => {
    const [isLockedIn, setIsLockedIn] = useState(false);
    const inTuneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (inTuneTimeoutRef.current) clearTimeout(inTuneTimeoutRef.current);
      
      // A lógica de "lock-in" agora usa a 'displayNote'
      if (displayNote && Math.abs(displayNote.cents) < 5) {
        inTuneTimeoutRef.current = setTimeout(() => setIsLockedIn(true), 1000);
      } else {
        setIsLockedIn(false);
      }

      return () => {
        if (inTuneTimeoutRef.current) clearTimeout(inTuneTimeoutRef.current);
      };
    }, [displayNote]);

    // A interface agora reage à 'displayNote', não à 'detectedNote'
    if (!displayNote) {
      return (
        <div className="h-[250px] flex flex-col items-center justify-center">
          <p className="text-2xl text-gray-400">Toque uma nota...</p>
        </div>
      );
    }
    
    const isVisuallyInTune = isLockedIn || Math.abs(displayNote.cents) < 5;

    return (
      <div className={`w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center h-[250px] transition-all duration-500 ${isLockedIn ? 'ring-4 ring-green-400' : ''}`}>
        <div className="flex items-baseline space-x-2">
          <p className={`text-8xl font-bold transition-all duration-300 ${isVisuallyInTune ? 'text-green-400' : 'text-blue-300'} ${isLockedIn ? 'scale-110' : ''}`}>
            {displayNote.name.slice(0, -1)}
          </p>
          <p className="text-4xl text-gray-400">{displayNote.name.slice(-1)}</p>
        </div>
        <p className={`text-xl font-medium transition-all duration-300 ${isVisuallyInTune ? 'text-green-400' : 'text-red-400'} ${isLockedIn ? 'scale-110' : ''}`}>
          {displayNote.cents.toFixed(1)} cents
        </p>
        <CentsMeter cents={displayNote.cents} />
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono relative">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v3.4 - Note Persistence</p>
      </header>

      <main>
        {status === 'listening' ? (
          <div className="flex flex-col items-center">
            <TunerInterface />
            <button onClick={stop} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-xl font-bold">
              Parar
            </button>
          </div>
        ) : (
          <div className="text-center h-[350px] flex flex-col justify-center items-center">
            {status === 'initializing' && <p className="text-xl animate-pulse">Inicializando motor de áudio...</p>}
            {status === 'ready' && (
              <button onClick={start} className="px-10 py-5 bg-green-600 hover:bg-green-700 transition-colors rounded-lg text-2xl font-bold animate-pulse">
                Iniciar Afinador
              </button>
            )}
            {status === 'error' && <p className="text-red-500 bg-red-900/50 p-4 rounded-lg">{error || 'Ocorreu um erro.'}</p>}
          </div>
        )}
      </main>
      
      {status === 'listening' && <DebugIndicator frequency={rawValues.freq} confidence={rawValues.conf} />}
    </div>
  );
}

export default App;
