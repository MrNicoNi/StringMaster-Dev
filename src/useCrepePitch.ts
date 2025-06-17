import { useState, useRef, useCallback, useEffect } from 'react';
import * as ml5 from 'ml5';

const A4_FREQUENCY = 440;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type TargetNote = {
  name: string;
  freq: number;
};

export const useCrepePitch = (targetNoteName: string | null = null) => {
  const [note, setNote] = useState<{ name: string; cents: number; confidence: number; frequency: number } | null>(null);
  const [status, setStatus] = useState<'ready' | 'listening' | 'error' | 'initializing'>('ready');
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  const start = useCallback(async () => {
    if (status === 'listening' || status === 'initializing') return;
    setStatus('initializing');
    setError(null);
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const model = await ml5.pitchDetection('./model/', audioContext, stream);
      audioContextRef.current = audioContext;
      streamRef.current = stream;
      pitchRef.current = model;
      setStatus('listening');
    } catch (err) {
      console.error("Erro detalhado:", err);
      if (err instanceof Error) setError(`Erro ao iniciar: ${err.name} - ${err.message}`);
      else setError('Ocorreu um erro desconhecido ao iniciar.');
      setStatus('error');
    }
  }, [status]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    pitchRef.current = null;
    setStatus('ready');
    setNote(null);
  }, []);

  useEffect(() => {
    const getPitchLoop = () => {
      if (!pitchRef.current) return;

      pitchRef.current.getPitch((err: any, frequency: number | null) => {
        if (err || !frequency) {
          setNote(null);
        } else {
          const semitonesFromA4 = 12 * Math.log2(frequency / A4_FREQUENCY);
          const nearestNoteIndex = Math.round(semitonesFromA4);
          const noteNameIndex = (((nearestNoteIndex + 9) % 12) + 12) % 12;
          const octave = Math.floor((nearestNoteIndex + 9) / 12) + 4;
          const currentNoteName = `${NOTE_NAMES[noteNameIndex]}${octave}`;

          if (targetNoteName && currentNoteName !== targetNoteName) {
            setNote(null);
          } else {
            const targetFrequency = A4_FREQUENCY * Math.pow(2, nearestNoteIndex / 12);
            const cents = 1200 * Math.log2(frequency / targetFrequency);
            setNote({ name: currentNoteName, cents, confidence: 1.0, frequency });
          }
        }
        
        // Garante que o loop continue apenas se ainda estivermos no estado 'listening'
        if (animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(getPitchLoop);
        }
      });
    };

    if (status === 'listening' && pitchRef.current) {
      // Inicia o loop
      animationFrameRef.current = requestAnimationFrame(getPitchLoop);
    } else {
      // Garante que o loop pare se o status não for mais 'listening'
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // Função de limpeza para parar o loop quando o componente for desmontado
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [status, targetNoteName]); // O efeito agora também depende da 'targetNoteName'

  return { note, status, error, start, stop };
};
