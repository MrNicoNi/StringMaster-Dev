import { useEffect, useState, useRef } from 'react';
import { useCrepePitch } from './useCrepePitch';
import { lessons, Lesson } from './lessons';

// Tipos e componentes visuais (sem alterações)
type NoteData = { name: string; cents: number; frequency: number; confidence: number; };
const CentsMeter = ({ cents }: { cents: number }) => { /* ...código sem alterações... */ };

// Componente para a tela de exercício (COM A LÓGICA DE CONCLUSÃO CORRIGIDA)
const ExerciseScreen = ({ lesson, onComplete, onExit }: { lesson: Lesson, onComplete: () => void, onExit: () => void }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // NOVO ESTADO
  const correctTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentChallenge = lesson.challenges[challengeIndex];
  const targetNoteName = currentChallenge?.targetNote;

  const { note: detectedNote, status, start, stop } = useCrepePitch(targetNoteName);

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
          // Marca como completo e prepara para sair
          setIsCompleted(true);
          setTimeout(() => {
            onComplete();
          }, 2000); // Mostra a mensagem de sucesso por 2 segundos
        }
      }, 1200);
    }
    return () => { if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current); }
  }, [detectedNote, status, challengeIndex, lesson.challenges.length, onComplete, targetNoteName]);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  // Se a lição foi completada, mostra a tela de parabéns
  if (isCompleted) {
    return (
      <div className="w-full max-w-md p-8 rounded-xl bg-green-900/50 ring-4 ring-green-400">
        <div className="text-center">
          <p className="text-white text-4xl font-bold my-4 animate-pulse">Lição Concluída! 🎉</p>
          <p className="text-green-300 text-xl">Parabéns!</p>
        </div>
      </div>
    );
  }

  // Se ainda não começou a ouvir, mostra o botão "Começar"
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

  // Se não há um desafio (estado impossível, mas seguro)
  if (!currentChallenge) return null;

  // Renderização normal do desafio
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


// ... (O resto do App.tsx, FreeTunerScreen, App, etc., permanece o mesmo)
// ... (Cole o restante do código da resposta anterior aqui)
const FreeTunerScreen = ({ onExit }: { onExit: () => void }) => { /* ...código sem alterações... */ };
function App() { /* ...código sem alterações... */ }
export default App;
