export type Challenge = {
  id: string;
  instruction: string;
  targetNote: string;
  string: number;
  fret: number;
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
      { id: 'l1c1', instruction: 'Toque a 1ª corda (Mi agudo)', targetNote: 'E4', string: 1, fret: 0 },
      { id: 'l1c2', instruction: 'Toque a 2ª corda (Si)', targetNote: 'B3', string: 2, fret: 0 },
      { id: 'l1c3', instruction: 'Toque a 3ª corda (Sol)', targetNote: 'G3', string: 3, fret: 0 },
      { id: 'l1c4', instruction: 'Toque a 4ª corda (Ré)', targetNote: 'D3', string: 4, fret: 0 },
      { id: 'l1c5', instruction: 'Toque a 5ª corda (Lá)', targetNote: 'A2', string: 5, fret: 0 },
      { id: 'l1c6', instruction: 'Toque a 6ª corda (Mi grave)', targetNote: 'E2', string: 6, fret: 0 },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Mão Esquerda: Exercício Cromático',
    challenges: [
      { id: 'l2c1', instruction: '6ª corda, 1ª casa (Dedo 1)', targetNote: 'F2', string: 6, fret: 1 },
      { id: 'l2c2', instruction: '6ª corda, 2ª casa (Dedo 2)', targetNote: 'F#2', string: 6, fret: 2 },
      { id: 'l2c3', instruction: '6ª corda, 3ª casa (Dedo 3)', targetNote: 'G2', string: 6, fret: 3 },
      { id: 'l2c4', instruction: '6ª corda, 4ª casa (Dedo 4)', targetNote: 'G#2', string: 6, fret: 4 },
    ],
  },
  {
    id: 'lesson-3',
    title: 'Mão Esquerda: Independência (Aranha)',
    challenges: [
      { id: 'l3c1', instruction: '6ª corda, 1ª casa (Dedo 1)', targetNote: 'F2', string: 6, fret: 1 },
      { id: 'l3c2', instruction: '5ª corda, 3ª casa (Dedo 3)', targetNote: 'C3', string: 5, fret: 3 },
      { id: 'l3c3', instruction: '6ª corda, 2ª casa (Dedo 2)', targetNote: 'F#2', string: 6, fret: 2 },
      { id: 'l3c4', instruction: '5ª corda, 4ª casa (Dedo 4)', targetNote: 'C#3', string: 5, fret: 4 },
    ],
  },
  // NOVA LIÇÃO ADICIONADA
  {
    id: 'lesson-4',
    title: 'Primeiros Acordes: Mi menor (Em)',
    challenges: [
      { id: 'l4c1', instruction: 'Posicione o Dedo 2 na 5ª corda, 2ª casa. Toque-a.', targetNote: 'B2', string: 5, fret: 2 },
      { id: 'l4c2', instruction: 'Mantenha o Dedo 2 e posicione o Dedo 3 na 4ª corda, 2ª casa. Toque-a.', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l4c3', instruction: 'Ótimo! Agora toque o arpejo completo, começando pela 6ª corda.', targetNote: 'E2', string: 6, fret: 0 },
      { id: 'l4c4', instruction: 'Arpejo Em: 5ª corda', targetNote: 'B2', string: 5, fret: 2 },
      { id: 'l4c5', instruction: 'Arpejo Em: 4ª corda', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l4c6', instruction: 'Arpejo Em: 3ª corda', targetNote: 'G3', string: 3, fret: 0 },
      { id: 'l4c7', instruction: 'Arpejo Em: 2ª corda', targetNote: 'B3', string: 2, fret: 0 },
      { id: 'l4c8', instruction: 'Arpejo Em: 1ª corda', targetNote: 'E4', string: 1, fret: 0 },
 {
    id: 'lesson-5',
    title: 'Acordes Essenciais: Dó Maior (C)',
    challenges: [
      { id: 'l5c1', instruction: 'Posicione o Dedo 1 na 2ª corda, 1ª casa. Toque-a.', targetNote: 'C4', string: 2, fret: 1 },
      { id: 'l5c2', instruction: 'Adicione o Dedo 2 na 4ª corda, 2ª casa. Toque-a.', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l5c3', instruction: 'Adicione o Dedo 3 na 5ª corda, 3ª casa. Toque-a.', targetNote: 'C3', string: 5, fret: 3 },
      { id: 'l5c4', instruction: 'Shape montado! Agora, o arpejo, começando da 5ª corda.', targetNote: 'C3', string: 5, fret: 3 },
      { id: 'l5c5', instruction: 'Arpejo C: 4ª corda', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l5c6', instruction: 'Arpejo C: 3ª corda (solta)', targetNote: 'G3', string: 3, fret: 0 },
      { id: 'l5c7', instruction: 'Arpejo C: 2ª corda', targetNote: 'C4', string: 2, fret: 1 },
      { id: 'l5c8', instruction: 'Arpejo C: 1ª corda (solta)', targetNote: 'E4', string: 1, fret: 0 },
    ],
  },
