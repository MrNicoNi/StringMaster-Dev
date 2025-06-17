import { useState, useRef, useCallback } from 'react';
import * as ml5 from 'ml5';

const A4_FREQUENCY = 440;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const useCrepePitch = () => {
  const [note, setNote] = useState<{ name: string; cents: number; confidence: number; frequency: number } | null>(null);
  const [status, setStatus] = useState<'ready' | 'listening' | 'error' | 'initializing'>('ready'); // Removido 'loading'
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchRef = useRef<any>(null);

  const getPitch = useCallback((err: any, result: { frequency: number, confidence: number } | undefined) => {
    // ... (esta função permanece exatamente a mesma)
    if (err) {
      console.error(err);
      setError("Ocorreu um erro na detecção de pitch.");
      setStatus('error');
      return;
    }
    if (result && result.frequency && result.confidence > 0.85) {
      const { frequency, confidence } = result;
      const semitonesFromA4 = 12 * Math.log2(frequency / A4_FREQUENCY);
      const nearestNoteIndex = Math.round(semitonesFromA4);
      const targetFrequency = A4_FREQUENCY * Math.pow(2, nearestNoteIndex / 12);
      const cents = 1200 * Math.log2(frequency / targetFrequency);
      const noteNameIndex = (nearestNoteIndex + 9 + 12) % 12;
      const octave = Math.floor((nearestNoteIndex + 9) / 12) + 4;
      setNote({ name: `${NOTE_NAMES[noteNameIndex]}${octave}`, cents, confidence, frequency });
    } else {
      setNote(null);
    }
  }, []);

  const start = useCallback(async () => {
    setStatus('initializing'); // Novo estado para mostrar que estamos carregando
    setError(null);

    try {
      // INICIALIZAÇÃO "SOB DEMANDA"
      if (!pitchRef.current) {
        console.log('Inicializando modelo ml5 sob demanda...');
        const model = await ml5.pitchDetection(
          './model/', 
          new (window.AudioContext || (window as any).webkitAudioContext)(),
          undefined
        );
        pitchRef.current = model;
        console.log('Modelo ml5 carregado com sucesso.');
      }

      const audioContext = pitchRef.current.audioContext;
      await audioContext.resume();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      if (pitchRef.current && typeof pitchRef.current.listen === 'function') {
        pitchRef.current.listen(getPitch, stream);
        setStatus('listening');
      } else {
        throw new Error('Modelo de áudio (pitchRef) não está pronto ou não tem o método .listen().');
      }

    } catch (err) {
      console.error("Erro detalhado:", err);
      if (err instanceof Error) {
        setError(`Erro ao iniciar: ${err.message}`);
      } else {
        setError('Ocorreu um erro desconhecido ao iniciar.');
      }
      setStatus('error');
    }
  }, [getPitch]);

  const stop = useCallback(() => {
    // ... (esta função permanece exatamente a mesma)
    if (pitchRef.current) pitchRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setStatus('ready');
    setNote(null);
  }, []);
  
  // O useEffect foi removido, pois a inicialização agora é no 'start'

  return { note, status, error, start, stop };
};
