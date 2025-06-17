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
  // MÓDULO 1: FUNDAMENTOS
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
  // MÓDULO 2: MÃO ESQUERDA
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
  // MÓDULO 3: PRIMEIROS ACORDES
  {
    id: 'lesson-4',
    title: 'Acordes: Mi menor (Em)',
    challenges: [
      { id: 'l4c1', instruction: 'Dedo 2 na 5ª corda, 2ª casa. Toque-a.', targetNote: 'B2', string: 5, fret: 2 },
      { id: 'l4c2', instruction: 'Dedo 3 na 4ª corda, 2ª casa. Toque-a.', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l4c3', instruction: 'Arpejo Em: 6ª corda (solta)', targetNote: 'E2', string: 6, fret: 0 },
    ],
  },
  {
    id: 'lesson-5',
    title: 'Acordes: Dó Maior (C)',
    challenges: [
      { id: 'l5c1', instruction: 'Dedo 1 na 2ª corda, 1ª casa. Toque-a.', targetNote: 'C4', string: 2, fret: 1 },
      { id: 'l5c2', instruction: 'Dedo 2 na 4ª corda, 2ª casa. Toque-a.', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l5c3', instruction: 'Dedo 3 na 5ª corda, 3ª casa. Toque-a.', targetNote: 'C3', string: 5, fret: 3 },
    ],
  },
  // MÓDULO 4: TROCA DE ACORDES
  {
    id: 'lesson-8',
    title: 'Troca de Acordes: Em -> C',
    challenges: [
      { id: 'l8c1', instruction: 'Prepare o Mi menor (Em). Toque a 6ª corda.', targetNote: 'E2', string: 6, fret: 0 },
      { id: 'l8c2', instruction: 'Mude para Dó Maior (C). Toque a 5ª corda.', targetNote: 'C3', string: 5, fret: 3 },
      { id: 'l8c3', instruction: 'Volte para Mi menor (Em).', targetNote: 'E2', string: 6, fret: 0 },
      { id: 'l8c4', instruction: 'Finalize em Dó Maior (C).', targetNote: 'C3', string: 5, fret: 3 },
    ],
  },
  // MÓDULO 5: ESCALAS
  {
    id: 'lesson-10',
    title: 'Pentatônica Em: Desenho 1 (Casa 0)',
    challenges: [
      { id: 'l10c1', instruction: '6ª corda, solta', targetNote: 'E2', string: 6, fret: 0 },
      { id: 'l10c2', instruction: '6ª corda, 3ª casa', targetNote: 'G2', string: 6, fret: 3 },
      { id: 'l10c3', instruction: '5ª corda, solta', targetNote: 'A2', string: 5, fret: 0 },
      { id: 'l10c4', instruction: '5ª corda, 2ª casa', targetNote: 'B2', string: 5, fret: 2 },
      { id: 'l10c5', instruction: '4ª corda, solta', targetNote: 'D3', string: 4, fret: 0 },
      { id: 'l10c6', instruction: '4ª corda, 2ª casa', targetNote: 'E3', string: 4, fret: 2 },
    ],
  },
  {
    id: 'lesson-11',
    title: 'Pentatônica Em: Desenho 2 (Casa 3)',
    challenges: [
      { id: 'l11c1', instruction: '6ª corda, 3ª casa', targetNote: 'G2', string: 6, fret: 3 },
      { id: 'l11c2', instruction: '6ª corda, 5ª casa', targetNote: 'A2', string: 6, fret: 5 },
      { id: 'l11c3', instruction: '5ª corda, 2ª casa', targetNote: 'B2', string: 5, fret: 2 },
      { id: 'l11c4', instruction: '5ª corda, 5ª casa', targetNote: 'D3', string: 5, fret: 5 },
      { id: 'l11c5', instruction: '4ª corda, 2ª casa', targetNote: 'E3', string: 4, fret: 2 },
      { id: 'l11c6', instruction: '4ª corda, 5ª casa', targetNote: 'G3', string: 4, fret: 5 },
    ],
  },
  {
    id: 'lesson-12',
    title: 'Pentatônica Em: Desenho 3 (Casa 5)',
    challenges: [
      { id: 'l12c1', instruction: '6ª corda, 5ª casa', targetNote: 'A2', string: 6, fret: 5 },
      { id: 'l12c2', instruction: '6ª corda, 7ª casa', targetNote: 'B2', string: 6, fret: 7 },
      { id: 'l12c3', instruction: '5ª corda, 5ª casa', targetNote: 'D3', string: 5, fret: 5 },
      { id: 'l12c4', instruction: '5ª corda, 7ª casa', targetNote: 'E3', string: 5, fret: 7 },
      { id: 'l12c5', instruction: '4ª corda, 5ª casa', targetNote: 'G3', string: 4, fret: 5 },
      { id: 'l12c6', instruction: '4ª corda, 7ª casa', targetNote: 'A3', string: 4, fret: 7 },
    ],
  },
  {
    id: 'lesson-13',
    title: 'Pentatônica Em: Desenho 4 (Casa 7)',
    challenges: [
      { id: 'l13c1', instruction: '6ª corda, 7ª casa', targetNote: 'B2', string: 6, fret: 7 },
      { id: 'l13c2', instruction: '6ª corda, 10ª casa', targetNote: 'D3', string: 6, fret: 10 },
      { id: 'l13c3', instruction: '5ª corda, 7ª casa', targetNote: 'E3', string: 5, fret: 7 },
      { id: 'l13c4', instruction: '5ª corda, 9ª casa', targetNote: 'F#3', string: 5, fret: 9 },
      { id: 'l13c5', instruction: '4ª corda, 7ª casa', targetNote: 'A3', string: 4, fret: 7 },
      { id: 'l13c6', instruction: '4ª corda, 9ª casa', targetNote: 'B3', string: 4, fret: 9 },
    ],
  },
  {
    id: 'lesson-14',
    title: 'Pentatônica Em: Desenho 5 (Casa 10)',
    challenges: [
      { id: 'l14c1', instruction: '6ª corda, 10ª casa', targetNote: 'D3', string: 6, fret: 10 },
      { id: 'l14c2', instruction: '6ª corda, 12ª casa', targetNote: 'E3', string: 6, fret: 12 },
      { id: 'l14c3', instruction: '5ª corda, 10ª casa', targetNote: 'G3', string: 5, fret: 10 },
      { id: 'l14c4', instruction: '5ª corda, 12ª casa', targetNote: 'A3', string: 5, fret: 12 },
      { id: 'l14c5', instruction: '4ª corda, 9ª casa', targetNote: 'B3', string: 4, fret: 9 },
      { id: 'l14c6', instruction: '4ª corda, 12ª casa', targetNote: 'D4', string: 4, fret: 12 },
    ],
  },
];
