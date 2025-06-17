const PROGRESS_KEY = 'stringMasterProgress';

type ProgressData = {
  completedLessons: string[]; // Array de IDs das lições completas
};

// Função para ler o progresso salvo
export const getCompletedLessons = (): string[] => {
  try {
    const savedData = localStorage.getItem(PROGRESS_KEY);
    if (savedData) {
      const progress: ProgressData = JSON.parse(savedData);
      return progress.completedLessons || [];
    }
  } catch (error) {
    console.error("Erro ao ler o progresso:", error);
  }
  return [];
};

// Função para marcar uma lição como completa
export const markLessonAsComplete = (lessonId: string): void => {
  try {
    const completedLessons = getCompletedLessons();
    if (!completedLessons.includes(lessonId)) {
      const newProgress: ProgressData = {
        completedLessons: [...completedLessons, lessonId],
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    }
  } catch (error) {
    console.error("Erro ao salvar o progresso:", error);
  }
};
