import { useEffect, useState, useRef } from 'react';
import { useCrepePitch } from './useCrepePitch';
import { lessons, Lesson } from './lessons';

// TIPO DE DADOS DA NOTA
type NoteData = { name: string; cents: number; frequency: number; confidence: number; };

// COMPONENTE VISUAL: MEDIDOR DE CENTS
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

// COMPONENTE VISUAL: INDICADOR DE DEBUG
const DebugIndicator = ({ frequency, confidence }: { frequency: number, confidence: number }) => {
  return (
    <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-gray-800 p-2 rounded">
      <span>Freq: {frequency.toFixed(2)} Hz</span>
      <span className="ml-4">Conf: {confidence.toFixed(2)}</span>
    </div>
  );
};

// COMPONENTE DE TELA: EXERCÍCIO
const ExerciseScreen = ({ lesson, onComplete, onExit }: { lesson: Lesson, onComplete: () => void, onExit: () => void }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
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
          setIsCompleted(true);
          setTimeout(onComplete, 2000);
        }
      }, 1200);
    }
    return () => { if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current); }
  }, [detectedNote, status, challengeIndex, lesson.challenges.length, onComplete, targetNoteName]);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  if (isCompleted) {
    return (
      <div className="w-full max-w-md p-8 rounded-xl bg-green-900/50 ring-4 ring-green-400">
        <div className="text-center">
          <p className="text-white text-4xl font-bold my-4 animate-pulse">Lição Concluída! 🎉</p>
        </div>
      </div>
    );
  }

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

  if (!currentChallenge) return null;

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

// COMPONENTE DE TELA: AFINADOR LIVRE
const FreeTunerScreen = ({ onExit }: { onExit: () => void }) => {
    const { note: detectedNote, status, start, stop } = useCrepePitch(null);
    const [displayNote, setDisplayNote] = useState<NoteData | null>(null);
    const decayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [rawValues, setRawValues] = useState({ freq: 0, conf: 0 });

    useEffect(() => { return () => { stop(); }; }, [stop]);

    useEffect(() => {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
        if (detectedNote) {
            setDisplayNote(detectedNote);
            setRawValues({ freq: detectedNote.frequency, conf: detectedNote.confidence });
        } else {
            decayTimeoutRef.current = setTimeout(() => setDisplayNote(null), 750);
            setRawValues(prev => ({ freq: prev.freq, conf: 0 }));
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
    
    return (
        <div className="relative">
            <div className={`w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center h-[250px]`}>
                {!displayNote ? (
                    <p className="text-2xl text-gray-400">Toque uma nota...</p>
                ) : (
                    <>
                        <div className="flex items-baseline space-x-2">
                            <p className={`text-8xl font-bold ${Math.abs(displayNote.cents) < 5 ? 'text-green-400' : 'text-blue-300'}`}>{displayNote.name.slice(0, -1)}</p>
                            <p className="text-4xl text-gray-400">{displayNote.name.slice(-1)}</p>
                        </div>
                        <p className={`text-xl font-medium ${Math.abs(displayNote.cents) < 5 ? 'text-green-400' : 'text-red-400'}`}>{displayNote.cents.toFixed(1)} cents</p>
                        <CentsMeter cents={displayNote.cents} />
                    </>
                )}
            </div>
            <button onClick={onExit} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-xl">Voltar ao Menu</button>
            <DebugIndicator frequency={rawValues.freq} confidence={rawValues.conf} />
        </div>
    );
};

// COMPONENTE PRINCIPAL: APP
function App() {
  const [appState, setAppState] = useState<'menu' | 'lesson' | 'tuner'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setAppState('lesson');
  };
  
  const handleLessonComplete = () => {
    // A tela de "Parabéns" já foi mostrada, agora só voltamos ao menu.
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
        <p className="text-xl text-blue-300">v4.3 - Stable Lesson Engine</p>
      </header>

      <main>
        {appState === 'menu' && (
          <div className="space-y-6">
            <div className="w-full max-w-md">
              <h2 className="text-2xl text-blue-300 mb-4">Lições</h2>
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <button key={lesson.id} onClick={() => handleSelectLesson(lesson)} className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white text-xl rounded-lg transition-colors">
                    {lesson.title}
                  </button>
                ))}
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
