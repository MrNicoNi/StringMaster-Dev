import { useEffect, useState, useRef } from 'react';
import { useCrepePitch } from './useCrepePitch';
import { lessons, Lesson, Challenge } from './lessons';

// ... (Tipos e componentes CentsMeter, DebugIndicator permanecem os mesmos)
type NoteData = { name: string; cents: number; frequency: number; confidence: number; };
const CentsMeter = ({ cents }: { cents: number }) => { /* ...código sem alterações... */ };
const DebugIndicator = ({ frequency, confidence }: { frequency: number, confidence: number }) => { /* ...código sem alterações... */ };


// Componente para a tela de exercício
const ExerciseScreen = ({ lesson, onComplete, onExit }: { lesson: Lesson, onComplete: () => void, onExit: () => void }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentChallenge = lesson.challenges[challengeIndex];
  const targetNoteName = currentChallenge?.targetNote;

  // O hook agora inicia no estado 'ready'
  const { note: detectedNote, status, start, stop } = useCrepePitch(targetNoteName);

  // A lógica de acerto agora depende da nota detectada
  useEffect(() => {
    if (status === 'listening' && detectedNote && detectedNote.name === targetNoteName) {
      setIsCorrect(true);
      if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current);
      correctTimeoutRef.current = setTimeout(() => {
        const nextIndex = challengeIndex + 1;
        if (nextIndex < lesson.challenges.length) {
          setChallengeIndex(nextIndex);
          setIsCorrect(false);
        } else {
          onComplete();
        }
      }, 1200);
    }
    return () => { if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current); }
  }, [detectedNote, status, challengeIndex, lesson.challenges.length, onComplete, targetNoteName]);

  // Limpa o estado ao sair
  useEffect(() => {
    return () => stop();
  }, [stop]);

  if (!currentChallenge) return null;

  // RENDERIZAÇÃO CONDICIONAL BASEADA NO STATUS
  if (status !== 'listening') {
    return (
      <div>
        <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 text-center">
          <p className="text-gray-400 text-lg">Lição: {lesson.title}</p>
          <p className="text-white text-3xl font-bold my-4">Pronto para começar?</p>
          <button onClick={start} className="mt-4 px-10 py-5 bg-green-600 hover:bg-green-700 rounded-lg text-2xl">Começar</button>
        </div>
        <button onClick={onExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">Sair da Lição</button>
      </div>
    );
  }

  return (
    <div>
      <div className={`w-full max-w-md p-8 rounded-xl transition-all duration-500 ${isCorrect ? 'bg-green-900/50 ring-4 ring-green-400' : 'bg-gray-800'}`}>
        <div className="text-center">
          <p className="text-gray-400 text-lg">Lição: {lesson.title}</p>
          <p className="text-white text-3xl font-bold my-4">{currentChallenge.instruction}</p>
          <div className="h-16 mt-4">
            {isCorrect && <p className="text-green-400 text-4xl animate-pulse">Correto!</p>}
          </div>
        </div>
      </div>
      <button onClick={onExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">Sair da Lição</button>
    </div>
  );
};

// Componente para o Afinador Livre
const FreeTunerScreen = ({ onExit }: { onExit: () => void }) => {
    const { note: detectedNote, status, start } = useCrepePitch(null);
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

    if (status !== 'listening') {
      return (
        <div>
          <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 text-center">
            <p className="text-white text-3xl font-bold my-4">Afinador Livre</p>
            <button onClick={start} className="mt-4 px-10 py-5 bg-green-600 hover:bg-green-700 rounded-lg text-2xl">Iniciar Microfone</button>
          </div>
          <button onClick={onExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">Voltar ao Menu</button>
        </div>
      );
    }
    
    // ... (resto da lógica do afinador livre)
    const noteToDisplay = displayNote;
    if (!noteToDisplay) {
        return <div className="h-[250px] flex items-center justify-center"><p className="text-2xl text-gray-400">Toque uma nota...</p></div>;
    }
    const isInTune = Math.abs(noteToDisplay.cents) < 5;
    return (
        <div>
            <div className={`w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center h-[250px]`}>
                <div className="flex items-baseline space-x-2">
                    <p className={`text-8xl font-bold ${isInTune ? 'text-green-400' : 'text-blue-300'}`}>{noteToDisplay.name.slice(0, -1)}</p>
                    <p className="text-4xl text-gray-400">{noteToDisplay.name.slice(-1)}</p>
                </div>
                <p className={`text-xl font-medium ${isInTune ? 'text-green-400' : 'text-red-400'}`}>{noteToDisplay.cents.toFixed(1)} cents</p>
                <CentsMeter cents={noteToDisplay.cents} />
            </div>
            <button onClick={onExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">Voltar ao Menu</button>
        </div>
    );
};


function App() {
  // ... (O componente App principal e seus estados permanecem os mesmos)
  const [appState, setAppState] = useState<'menu' | 'lesson' | 'tuner'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const handleSelectLesson = (lesson: Lesson) => { setSelectedLesson(lesson); setAppState('lesson'); };
  const handleLessonComplete = () => { alert('Parabéns, você completou a lição!'); setAppState('menu'); setSelectedLesson(null); };
  const handleSelectTuner = () => { setAppState('tuner'); };
  const handleExit = () => { setAppState('menu'); setSelectedLesson(null); };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono relative">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v4.2 - User Gesture</p>
      </header>
      <main>
        {appState === 'menu' && ( /* ...código do menu sem alterações... */ )}
        {appState === 'lesson' && selectedLesson && ( <ExerciseScreen lesson={selectedLesson} onComplete={handleLessonComplete} onExit={handleExit} /> )}
        {appState === 'tuner' && ( <FreeTunerScreen onExit={handleExit} /> )}
      </main>
    </div>
  );
}

export default App;
