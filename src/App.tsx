import { useEffect, useState, useRef } from 'react';
import { useCrepePitch, TargetNote } from './useCrepePitch'; // Importa o novo tipo

// Definição das cordas do violão
const GUITAR_STRINGS: TargetNote[] = [
  { name: 'E2', freq: 82.41 },
  { name: 'A2', freq: 110.00 },
  { name: 'D3', freq: 146.83 },
  { name: 'G3', freq: 196.00 },
  { name: 'B3', freq: 246.94 },
  { name: 'E4', freq: 329.63 },
];

// ... (CentsMeter e DebugIndicator permanecem os mesmos)
const CentsMeter = ({ cents }: { cents: number }) => { /* ...código sem alterações... */ };
const DebugIndicator = ({ frequency, confidence }: { frequency: number, confidence: number }) => { /* ...código sem alterações... */ };

type NoteData = { name: string; cents: number; frequency: number; confidence: number; };

function App() {
  // Novo estado para o modo de jogo: 'free' (livre) ou 'tuning' (afinação)
  const [gameMode, setGameMode] = useState<'free' | 'tuning'>('free');
  // Novo estado para rastrear a corda atual no modo de afinação
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

  // A nota alvo é definida pelo modo de jogo
  const targetNote = gameMode === 'tuning' ? GUITAR_STRINGS[currentTargetIndex] : null;

  const { note: detectedNote, status, error, start, stop } = useCrepePitch(targetNote);
  
  const [displayNote, setDisplayNote] = useState<NoteData | null>(null);
  const decayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    if (detectedNote) {
      setDisplayNote(detectedNote);
    } else {
      decayTimeoutRef.current = setTimeout(() => setDisplayNote(null), 750);
    }
    return () => { if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current); };
  }, [detectedNote]);

  const [rawValues, setRawValues] = useState({ freq: 0, conf: 0 });
  useEffect(() => {
    if (detectedNote) setRawValues({ freq: detectedNote.frequency, conf: detectedNote.confidence });
    else setRawValues(prev => ({ freq: prev.freq, conf: 0 }));
  }, [detectedNote]);

  
  const TunerInterface = () => {
    const [isLockedIn, setIsLockedIn] = useState(false);
    const inTuneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (inTuneTimeoutRef.current) clearTimeout(inTuneTimeoutRef.current);
      
      if (displayNote && Math.abs(displayNote.cents) < 8) { // Margem um pouco maior para o lock-in
        inTuneTimeoutRef.current = setTimeout(() => {
          setIsLockedIn(true);
          // Se estamos no modo de afinação, avança para a próxima corda
          if (gameMode === 'tuning') {
            setTimeout(() => {
              setCurrentTargetIndex(prevIndex => (prevIndex + 1));
            }, 500); // Pequeno delay para o usuário ver a confirmação
          }
        }, 1000);
      } else {
        setIsLockedIn(false);
      }
      return () => { if (inTuneTimeoutRef.current) clearTimeout(inTuneTimeoutRef.current); };
    }, [displayNote]);

    // Lógica para o texto de instrução
    let instructionText = "Toque uma nota...";
    if (gameMode === 'tuning') {
      if (currentTargetIndex < GUITAR_STRINGS.length) {
        const stringNum = 6 - currentTargetIndex;
        instructionText = `Toque a ${stringNum}ª Corda (${targetNote?.name})`;
      } else {
        instructionText = "Violão Afinado! 🎉";
      }
    }

    if (!displayNote && currentTargetIndex < GUITAR_STRINGS.length) {
      return (
        <div className="h-[250px] flex flex-col items-center justify-center">
          <p className="text-2xl text-gray-400">{instructionText}</p>
        </div>
      );
    }

    // Se o violão já foi afinado, mostra mensagem de sucesso
    if (currentTargetIndex >= GUITAR_STRINGS.length) {
       return (
        <div className="h-[250px] flex flex-col items-center justify-center">
          <p className="text-4xl text-green-400">{instructionText}</p>
        </div>
      );
    }
    
    const noteToDisplay = displayNote || { name: '--', cents: 0 };
    const isVisuallyInTune = isLockedIn || Math.abs(noteToDisplay.cents) < 5;

    return (
      <div className={`w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center h-[250px] transition-all duration-500 ${isLockedIn ? 'ring-4 ring-green-400' : ''}`}>
        <p className="absolute top-4 text-lg text-blue-300">{instructionText}</p>
        <div className="flex items-baseline space-x-2">
          <p className={`text-8xl font-bold transition-all duration-300 ${isVisuallyInTune ? 'text-green-400' : 'text-blue-300'} ${isLockedIn ? 'scale-110' : ''}`}>
            {noteToDisplay.name.slice(0, -1)}
          </p>
          <p className="text-4xl text-gray-400">{noteToDisplay.name.slice(-1)}</p>
        </div>
        <p className={`text-xl font-medium transition-all duration-300 ${isVisuallyInTune ? 'text-green-400' : 'text-red-400'} ${isLockedIn ? 'scale-110' : ''}`}>
          {noteToDisplay.cents.toFixed(1)} cents
        </p>
        <CentsMeter cents={noteToDisplay.cents} />
      </div>
    );
  };

  const handleStartTuning = () => {
    setGameMode('tuning');
    setCurrentTargetIndex(0);
    start();
  };
  
  const handleStartFreeMode = () => {
    setGameMode('free');
    start();
  };

  const handleStop = () => {
    stop();
    // Reseta o modo de jogo ao parar
    setGameMode('free');
    setCurrentTargetIndex(0);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono relative">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v3.5 - Tuning Mode</p>
      </header>

      <main>
        {status === 'listening' ? (
          <div className="flex flex-col items-center">
            <TunerInterface />
            <button onClick={handleStop} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-xl font-bold">
              Parar
            </button>
          </div>
        ) : (
          <div className="text-center h-[350px] flex flex-col justify-center items-center space-y-4">
            {status === 'initializing' && <p className="text-xl animate-pulse">Inicializando motor de áudio...</p>}
            {status === 'ready' && (
              <>
                <button onClick={handleStartFreeMode} className="px-10 py-5 bg-green-600 hover:bg-green-700 transition-colors rounded-lg text-2xl font-bold w-64">
                  Afinador Livre
                </button>
                <button onClick={handleStartTuning} className="px-10 py-5 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-2xl font-bold w-64">
                  Afinar o Violão
                </button>
              </>
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
