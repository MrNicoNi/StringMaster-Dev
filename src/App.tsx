import { useCrepePitch } from './useCrepePitch';

// Componente visual para o medidor de afinação
const CentsMeter = ({ cents }: { cents: number }) => {
  // Converte cents (-50 a +50) para uma porcentagem (0 a 100)
  const percentage = (cents + 50); 
  const isInTune = Math.abs(cents) < 5; // Consideramos "afinado" com uma margem de 5 cents

  return (
    <div className="w-full max-w-sm bg-gray-700 rounded-full h-4 my-4 relative">
      {/* Marcador central de "afinado" */}
      <div className="absolute left-1/2 top-0 h-full w-1 bg-green-500 transform -translate-x-1/2"></div>
      {/* Indicador móvel */}
      <div
        className="absolute top-0 h-4 w-1 rounded-full transition-all duration-75"
        style={{ 
          left: `${percentage}%`,
          backgroundColor: isInTune ? '#4ade80' : '#f87171', // Verde se afinado, vermelho se não
          transform: `translateX(-${percentage}%)`
        }}
      ></div>
    </div>
  );
};

function App() {
  const { note, status, error, start, stop } = useCrepePitch();

  const TunerInterface = () => {
    if (!note) {
      return <div className="h-[250px] flex items-center justify-center"><p className="text-2xl text-gray-400">Toque uma nota...</p></div>;
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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v3.0 - Base Estável</p>
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
            {status === 'loading' && <p className="text-xl animate-pulse">Carregando motor de áudio...</p>}
            {status === 'ready' && (
              <button onClick={start} className="px-10 py-5 bg-green-600 hover:bg-green-700 transition-colors rounded-lg text-2xl font-bold animate-pulse">
                Iniciar Afinador
              </button>
            )}
            {status === 'error' && <p className="text-red-500 bg-red-900/50 p-4 rounded-lg">{error || 'Ocorreu um erro.'}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
