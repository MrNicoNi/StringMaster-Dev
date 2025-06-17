import { useState, useRef, useCallback, useEffect } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Referência para o nosso loop

  const start = useCallback(async () => {
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
      if (err instanceof Error) {
        setError(`Erro ao iniciar: ${err.name} - ${err.message}`);
      } else {
        setError('Ocorreu um erro desconhecido ao iniciar.');
      }
      setStatus('error');
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
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

  // O EFEITO QUE CRIA O LOOP DE ESCUTA
  useEffect(() => {
    if (status === 'listening' && pitchRef.current) {
      // Inicia o loop que pede o pitch a cada 100ms
      intervalRef.current = setInterval(() => {
        pitchRef.current.getPitch((err: any, frequency: number | null) => {
          // A biblioteca CREPE retorna a frequência diretamente, e a confiança não é fornecida neste método
          if (err) {
            console.error(err);
            setError("Erro na detecção de pitch.");
            setStatus('error');
            return;
          }
          
          if (frequency) {
            // Vamos usar uma confiança fixa de 1.0, já que CREPE é robusto
            const confidence = 1.0; 
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
        });
      }, 100); // Pede o pitch 10 vezes por segundo
    }

    // Função de limpeza para parar o loop quando o status muda
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  return { note, status, error, start, stop };
};
