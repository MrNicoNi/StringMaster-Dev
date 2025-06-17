export type Challenge = {
  id: string;
  instruction: string;
  targetNote: string;
};

export type Lesson = {
  id: string;
  title: string;
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
  {
    id: 'lesson-2',
    title: 'Mão Esquerda: Exercício Cromático',
    challenges: [
      { id: 'l2c1', instruction: '6ª corda, 1ª casa (Dedo 1)', targetNote: 'F2' },
      { id: 'l2c2', instruction: '6ª corda, 2ª casa (Dedo 2)', targetNote: 'F#3' },
      { id: 'l2c3', instruction: '6ª corda, 3ª casa (Dedo 3)', targetNote: 'G2' },
      { id: 'l2c4', instruction: '6ª corda, 4ª casa (Dedo 4)', targetNote: 'G#2' },
    ],
  },
  // NOVA LIÇÃO ADICIONADA
  {
    id: 'lesson-3',
    title: 'Mão Esquerda: Independência (Aranha)',
    challenges: [
      { id: 'l3c1', instruction: '6ª corda, 1ª casa (Dedo 1)', targetNote: 'F2' },
      { id: 'l3c2', instruction: '5ª corda, 3ª casa (Dedo 3)', targetNote: 'C3' },
      { id: 'l3c3', instruction: '6ª corda, 2ª casa (Dedo 2)', targetNote: 'F#2' },
      { id: 'l3c4', instruction: '5ª corda, 4ª casa (Dedo 4)', targetNote: 'C#3' },
    ],
  },
];
