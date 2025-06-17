import { useState, useRef, useCallback } from 'react';
import * as ml5 from 'ml5';

const A4_FREQUENCY = 440;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const useCrepePitch = () => {
  const [note, setNote] = useState<{ name: string; cents: number; confidence: number; frequency: number } | null>(null);
  const [status, setStatus] = useState<'ready' | 'listening' | 'error' | 'initializing'>('ready');
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchRef = useRef<any>(null);

  const getPitch = useCallback((err: any, result: { frequency: number, confidence: number } | undefined) => {
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
    setStatus('initializing');
    setError(null);

    try {
      // Passo 1: Obter o stream do microfone PRIMEIRO.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Passo 2: Criar o AudioContext.
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      await audioContext.resume();

      // Passo 3: Inicializar o modelo PASSANDO o stream para ele.
      // A função de callback 'modelReady' será chamada quando o modelo carregar.
      const model = await ml5.pitchDetection(
        './model/',
        audioContext,
        stream,
        () => {
          // Passo 4: SOMENTE APÓS o modelo estar pronto, chame .listen()
          if (pitchRef.current && typeof pitchRef.current.getPitch === 'function') {
            pitchRef.current.getPitch(getPitch);
            setStatus('listening');
          } else {
            throw new Error('Modelo carregado, mas o método .getPitch() não foi encontrado.');
          }
        }
      );
      pitchRef.current = model;

    } catch (err) {
      console.error("Erro detalhado:", err);
      if (err instanceof Error) {
        setError(`Erro ao iniciar: ${err.name} - ${err.message}`);
      } else {
        setError('Ocorreu um erro desconhecido ao iniciar.');
      }
      setStatus('error');
    }
  }, [getPitch]);

  const stop = useCallback(() => {
    if (pitchRef.current) {
        // A biblioteca ml5 não tem um método .stop() explícito para pitchDetection
        // A parada é feita fechando o stream e o audio context
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    pitchRef.current = null;
    setStatus('ready');
    setNote(null);
  }, []);

  return { note, status, error, start, stop };
};
