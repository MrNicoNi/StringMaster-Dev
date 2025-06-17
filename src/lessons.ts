export type Challenge = {
  id: string;
  instruction: string; // Ex: "Toque a 1ª corda (Mi agudo)"
  targetNote: string; // Ex: "E4"
};

export type Lesson = {
  id: string;
  title: string; // Ex: "Fundamentos: As Cordas Soltas"
  challenges: Challenge[];
};

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Fundamentos: As Cordas Soltas',
    challenges: [
      { id: 'l1c1', instruction: 'Toque a 1ª corda (Mi agudo)', targetNote: 'E4' },
      { id: 'l1c2', instruction: 'Toque a 2ª corda (Si)', targetNote: 'B3' },
      { id: 'l1c3', instruction: 'Toque a 3ª corda (Sol)', targetNote: 'G3' },
      { id: 'l1c4', instruction: 'Toque a 4ª corda (Ré)', targetNote: 'D3' },
      { id: 'l1c5', instruction: 'Toque a 5ª corda (Lá)', targetNote: 'A2' },
      { id: 'l1c6', instruction: 'Toque a 6ª corda (Mi grave)', targetNote: 'E2' },
    ],
  },
  // Futuramente, poderíamos adicionar mais lições aqui
  // {
  //   id: 'lesson-2',
  //   title: 'Escala de Dó Maior',
  //   challenges: [ ... ]
  // }
];
