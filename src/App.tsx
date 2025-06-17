import { useEffect, useState, useRef } from 'react';
import { useCrepePitch } from './useCrepePitch';
import { lessons, Lesson, Challenge } from './lessons'; // Importa nossa estrutura de lições

// Tipos e componentes visuais (sem alterações)
type NoteData = { name: string; cents: number; frequency: number; confidence: number; };
const CentsMeter = ({ cents }: { cents: number }) => { /* ...código sem alterações... */ };
const DebugIndicator = ({ frequency, confidence }: { frequency: number, confidence: number }) => { /* ...código sem alterações... */ };

// Novo componente para renderizar a lista de lições
const LessonMenu = ({ onSelectLesson }: { onSelectLesson: (lesson: Lesson) => void }) => (
  <div className="w-full max-w-md">
    <h2 className="text-2xl text-blue-300 mb-4">Lições</h2>
    <div className="space-y-4">
      {lessons.map(lesson => (
        <button 
          key={lesson.id} 
          onClick={() => onSelectLesson(lesson)}
          className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white text-xl rounded-lg transition-colors"
        >
          {lesson.title}
        </button>
      ))}
    </div>
  </div>
);

// Novo componente para a tela do exercício
const ExerciseScreen = ({ lesson, onComplete }: { lesson: Lesson, onComplete: () => void }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentChallenge = lesson.challenges[challengeIndex];
  const targetNoteName = currentChallenge?.targetNote;

  const { note: detectedNote, status } = useCrepePitch(targetNoteName ? { name: targetNoteName, freq: 0 } : null);

  useEffect(() => {
    if (detectedNote && detectedNote.name === targetNoteName) {
      setIsCorrect(true);
      
      // Limpa qualquer timeout anterior para evitar múltiplos avanços
      if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current);

      correctTimeoutRef.current = setTimeout(() => {
        const nextIndex = challengeIndex + 1;
        if (nextIndex < lesson.challenges.length) {
          setChallengeIndex(nextIndex);
          setIsCorrect(false);
        } else {
          onComplete(); // Lição concluída!
        }
      }, 1200); // 1.2 segundos para o usuário ver a confirmação
    }

    return () => {
      if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current);
    }
  }, [detectedNote, challengeIndex, lesson.challenges.length, onComplete, targetNoteName]);

  if (!currentChallenge) {
    return null; // A lição acabou, o onComplete cuidará da transição
  }

  return (
    <div className={`w-full max-w-md p-8 rounded-xl transition-all duration-500 ${isCorrect ? 'bg-green-900/50 ring-4 ring-green-400' : 'bg-gray-800'}`}>
      <div className="text-center">
        <p className="text-gray-400 text-lg">Lição: {lesson.title}</p>
        <p className="text-white text-3xl font-bold my-4">{currentChallenge.instruction}</p>
        <div className="h-16 mt-4">
          {isCorrect && <p className="text-green-400 text-4xl animate-pulse">Correto!</p>}
          {status === 'initializing' && <p className="text-blue-300">Preparando o microfone...</p>}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [appState, setAppState] = useState<'menu' | 'lesson' | 'tuner'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { start, stop } = useCrepePitch(); // Hook genérico para controle

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setAppState('lesson');
    start(); // Inicia o microfone para a lição
  };

  const handleLessonComplete = () => {
    alert('Parabéns, você completou a lição!');
    stop();
    setAppState('menu');
    setSelectedLesson(null);
  };
  
  const handleSelectTuner = () => {
    setAppState('tuner');
    start();
  };

  const handleExit = () => {
    stop();
    setAppState('menu');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono relative">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v4.0 - Lesson Engine</p>
      </header>

      <main>
        {appState === 'menu' && (
          <div className="space-y-6">
            <LessonMenu onSelectLesson={handleSelectLesson} />
            <button onClick={handleSelectTuner} className="px-10 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-lg">
              Usar Afinador Livre
            </button>
          </div>
        )}

        {appState === 'lesson' && selectedLesson && (
          <div>
            <ExerciseScreen lesson={selectedLesson} onComplete={handleLessonComplete} />
            <button onClick={handleExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">
              Sair da Lição
            </button>
          </div>
        )}
        
        {appState === 'tuner' && (
          <div>
            {/* O afinador livre pode ser reimplementado aqui, se necessário */}
            <p className="text-2xl">Afinador Livre Ativado</p>
            <button onClick={handleExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">
              Voltar ao Menu
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

// NOTA: Os componentes CentsMeter e DebugIndicator precisam ser colados aqui para o código funcionar.
// Eu os omiti para brevidade, mas eles devem ser incluídos no arquivo final.
