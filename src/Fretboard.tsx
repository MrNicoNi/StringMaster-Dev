import React from 'react';

interface FretboardProps {
  highlightString?: number;
  highlightFret?: number;
}

const FRET_COUNT = 12;
const STRING_THICKNESS = [1.5, 2, 2.5, 3, 4, 5]; // Espessura em pixels
const INLAY_FRETS = [3, 5, 7, 9];
const DOUBLE_INLAY_FRET = 12;

export const Fretboard: React.FC<FretboardProps> = ({ highlightString, highlightFret }) => {
  const strings = Array.from({ length: 6 }, (_, i) => i);
  const frets = Array.from({ length: FRET_COUNT }, (_, i) => i + 1);

  // Calcula a posição do marcador de nota
  const markerTop = highlightString ? `${((highlightString - 1) / 5) * 100}%` : '-100%';
  // Ajusta a posição para centralizar no traste
  const markerLeft = highlightFret !== 0 
    ? `${(highlightFret - 0.5) / FRET_COUNT * 100}%` 
    : `${(0.25) / FRET_COUNT * 100}%`; // Posição para corda solta

  return (
    // Container principal com textura de madeira e sombra
    <div className="w-full max-w-xl mx-auto my-6 p-4 bg-gradient-to-b from-[#8c5a2b] to-[#593a1a] rounded-lg shadow-xl border-2 border-black/20 relative select-none">
      
      {/* Pestana (Nut) */}
      <div className="absolute left-0 top-0 h-full w-2 bg-gray-200 border-r-2 border-gray-400"></div>

      <div className="relative h-28 flex flex-col justify-between ml-2">
        {/* Cordas com efeito metálico */}
        {strings.map(s => (
          <div 
            key={s} 
            className="bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-full"
            style={{ height: `${STRING_THICKNESS[s]}px` }}
          ></div>
        ))}

        {/* Trastes metálicos */}
        {frets.map(f => (
          <div 
            key={f} 
            className="absolute top-[-2px] h-[116px] w-1 bg-gradient-to-b from-gray-500 via-gray-300 to-gray-500 rounded-sm"
            style={{ left: `${f / FRET_COUNT * 100}%` }}
          ></div>
        ))}
        
        {/* Marcadores de Posição (Inlays) */}
        <div className="absolute inset-0">
          {INLAY_FRETS.map(fret => (
            <div key={`inlay-${fret}`} className="absolute w-3 h-3 bg-gray-400/50 rounded-full top-1/2 -translate-y-1/2 transform" style={{ left: `calc(${(fret - 0.5) / FRET_COUNT * 100}% - 0.375rem)` }}></div>
          ))}
          {/* Double dot inlay */}
          <div className="absolute w-3 h-3 bg-gray-400/50 rounded-full top-1/3 -translate-y-1/2 transform" style={{ left: `calc(${(DOUBLE_INLAY_FRET - 0.5) / FRET_COUNT * 100}% - 0.375rem)` }}></div>
          <div className="absolute w-3 h-3 bg-gray-400/50 rounded-full top-2/3 -translate-y-1/2 transform" style={{ left: `calc(${(DOUBLE_INLAY_FRET - 0.5) / FRET_COUNT * 100}% - 0.375rem)` }}></div>
        </div>

        {/* Marcador de Nota Ativa (com glow) */}
        <div 
          className="absolute w-8 h-8 bg-teal-400 rounded-full transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-teal-400/50 ring-4 ring-teal-300/70"
          style={{ top: markerTop, left: markerLeft, opacity: highlightFret !== undefined ? 1 : 0 }}
        ></div>
      </div>
    </div>
  );
};
