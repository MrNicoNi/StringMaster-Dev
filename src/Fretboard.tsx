import React from 'react';

interface FretboardProps {
  highlightString?: number;
  highlightFret?: number;
}

const FRET_COUNT = 12;
const STRING_THICKNESS = [1.5, 2, 2.5, 3, 4, 5]; // Fios em pixels para as cordas

export const Fretboard: React.FC<FretboardProps> = ({ highlightString, highlightFret }) => {
  const strings = Array.from({ length: 6 }, (_, i) => i);
  const frets = Array.from({ length: FRET_COUNT }, (_, i) => i + 1);

  // Calcula a posição do marcador
  const markerTop = highlightString ? `${((highlightString - 1) / 5) * 100}%` : '-100%';
  const markerLeft = highlightFret ? `${(highlightFret - 0.5) / FRET_COUNT * 100}%` : '-100%';

  return (
    <div className="w-full max-w-xl mx-auto my-4 p-4 bg-gray-700 rounded-lg relative select-none">
      {/* Cordas */}
      <div className="relative h-24 flex flex-col justify-between">
        {strings.map(s => (
          <div 
            key={s} 
            className="bg-gray-400" 
            style={{ height: `${STRING_THICKNESS[s]}px` }}
          ></div>
        ))}
      </div>

      {/* Trastes */}
      {frets.map(f => (
        <div 
          key={f} 
          className="absolute top-0 h-full w-1 bg-gray-500"
          style={{ left: `${f / FRET_COUNT * 100}%` }}
        ></div>
      ))}
      
      {/* Marcador de Posição */}
      <div 
        className="absolute w-8 h-8 bg-green-400 rounded-full transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 shadow-lg ring-2 ring-white"
        style={{ top: markerTop, left: markerLeft, opacity: highlightFret !== undefined ? 1 : 0 }}
      ></div>
    </div>
  );
};
