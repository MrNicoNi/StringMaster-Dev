import { useEffect, useState } from 'react'; // Importa useState e useEffect do react
import { useCrepePitch } from './useCrepePitch';

// Componente visual para o medidor de afinação
const CentsMeter = ({ cents }: { cents: number }) => {
  const percentage = (cents + 50);
  const isInTune = Math.abs(cents) < 5;

  return (
    <div className="w-full max-w-sm bg-gray-700 rounded-full h-4 my-4 relative">
      <div className="absolute left-1/2 top-0 h-full w-1 bg-green-500 transform -translate-x-1/2"></div>
      <div
        className="absolute top-0 h-4 w-1 rounded-full transition-all duration-75"
        style={{
          left: `${percentage}%`,
          backgroundColor: isInTune ? '#4ade80' : '#f87171',
          transform: `translateX(-${percentage}%)`
        }}
      ></div>
    </div>
  );
};

// Componente para o indicador de depuração
const DebugIndicator = ({ frequency, confidence }: { frequency: number, confidence: number }) => {
  return (
    <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-gray-800 p-2 rounded">
      <span>Freq: {frequency.toFixed(2)} Hz</span>
      <span className="ml-4">Conf: {confidence.toFixed(2)}</span>
    </div>
  );
};

function App() {
  const { note, status, error, start, stop } = useCrepePitch();
  
  // Estado para os valores brutos, vivendo no componente principal
  const [rawValues, setRawValues] = useState({ freq: 0, conf: 0 });

  // Efeito que observa a 'note' e atualiza os valores brutos
  useEffect(() => {
    if (note) {
      setRawValues({ freq: note.frequency, conf: note.confidence });
    }
    // Não reseta quando a nota é nula, para vermos o último valor capturado
  }, [note]);


  const TunerInterface = () => {
    if (!note) {
      return (
        <div className="h-[250px] flex flex-col items-center justify-center">
          <p className="text-2xl text-gray-400">Toque uma nota...</p>
        </div>
      );
    }
    
    const isInTune = Math.abs(note.cents) < 5;

    return (
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center h-[250px]">
        <div className="flex items-baseline space-x-2">
          <p className={`text-8xl font-bold transition-colors duration-200 ${isInTune ? 'text-green-400' : 'text-blue-300'}`}>
            {note.name.slice(0, -1)}
          </p>
          <p className="text-4xl text-gray-400">{note.name.slice(-1)}</p>
        </div>
        <p className={`text-xl font-medium ${isInTune ? 'text-green-400' : 'text-red-400'}`}>
          {note.cents.toFixed(1)} cents
        </p>
        <CentsMeter cents={note.cents} />
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono relative">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v3.1 - Debug Mode</p>
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
      
      {/* O indicador de depuração agora vive aqui, fora das condicionais */}
      {status === 'listening' && <DebugIndicator frequency={rawValues.freq} confidence={rawValues.conf} />}
    </div>
  );
}

export default App;
