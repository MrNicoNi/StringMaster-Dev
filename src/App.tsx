import { useEffect, useState, useRef } from 'react';
import { useCrepePitch } from './useCrepePitch';
import { lessons, Lesson } from './lessons';
import { getCompletedLessons, markLessonAsComplete } from './progressService'; // Importa nosso novo serviço

// ... (CentsMeter e outros componentes visuais permanecem os mesmos)
type NoteData = { name: string; cents: number; frequency: number; confidence: number; };
const CentsMeter = ({ cents }: { cents: number }) => { /* ...código sem alterações... */ };
const ExerciseScreen = ({ lesson, onComplete, onExit }: { lesson: Lesson, onComplete: () => void, onExit: () => void }) => { /* ...código sem alterações... */ };
const FreeTunerScreen = ({ onExit }: { onExit: () => void }) => { /* ...código sem alterações... */ };

// COMPONENTE PRINCIPAL: APP (COM LÓGICA DE PROGRESSO)
function App() {
  const [appState, setAppState] = useState<'menu' | 'lesson' | 'tuner'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // NOVO ESTADO para rastrear o progresso
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Carrega o progresso do localStorage quando o app inicia
  useEffect(() => {
    setCompletedLessons(getCompletedLessons());
  }, []);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setAppState('lesson');
  };
  
  const handleLessonComplete = () => {
    if (selectedLesson) {
      // Marca a lição como completa e atualiza o estado
      markLessonAsComplete(selectedLesson.id);
      setCompletedLessons(getCompletedLessons());
    }
    alert('Parabéns, você completou a lição!');
    setAppState('menu');
    setSelectedLesson(null);
  };
  
  const handleSelectTuner = () => {
    setAppState('tuner');
  };

  const handleExit = () => {
    setAppState('menu');
    setSelectedLesson(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4 font-mono relative">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">StringMaster</h1>
        <p className="text-xl text-blue-300">v4.5 - Progress Tracking</p>
      </header>

      <main>
        {appState === 'menu' && (
          <div className="space-y-6">
            <div className="w-full max-w-md">
              <h2 className="text-2xl text-blue-300 mb-4">Lições</h2>
              <div className="space-y-4">
                {lessons.map(lesson => {
                  // Verifica se a lição está no nosso array de progresso
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <button 
                      key={lesson.id} 
                      onClick={() => handleSelectLesson(lesson)} 
                      className="w-full flex items-center justify-between px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white text-xl rounded-lg transition-colors"
                    >
                      <span>{lesson.title}</span>
                      {/* Mostra o checkmark se estiver completa */}
                      {isCompleted && <span className="text-green-400 text-2xl">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={handleSelectTuner} className="px-10 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-lg">Usar Afinador Livre</button>
          </div>
        )}

        {appState === 'lesson' && selectedLesson && (
          <ExerciseScreen lesson={selectedLesson} onComplete={handleLessonComplete} onExit={handleExit} />
        )}
        
        {appState === 'tuner' && (
          <FreeTunerScreen onExit={handleExit} />
        )}
      </main>
    </div>
  );
}

export default App;

// NOTA: Os componentes ExerciseScreen, FreeTunerScreen e CentsMeter precisam estar aqui.
// Eu os omiti para brevidade, mas o código completo da resposta anterior deve ser usado.
