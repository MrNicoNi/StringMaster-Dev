import { useState, useRef, useCallback, useEffect } from 'react';
import * as ml5 from 'ml5';

const A4_FREQUENCY = 440;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const useCrepePitch = () => {
  const [note, setNote] = useState<{ name: string; cents: number; confidence: number; frequency: number } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'listening' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchRef = useRef<any>(null);

  const modelReady = () => {
    console.log('Modelo CREPE carregado.');
    setStatus('ready');
  };

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
      
      setNote({
        name: `${NOTE_NAMES[noteNameIndex]}${octave}`,
        cents,
        confidence,
        frequency,
      });
    } else {
      setNote(null);
    }
  }, []);

  const start = useCallback(async () => {
    try {
      if (!pitchRef.current || status === 'loading') {
        return;
      }
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.resume();
      
          // ... dentro da função start
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioContextRef.current = audioContext;
          streamRef.current = stream;
          
          // VERIFICAÇÃO DE SEGURANÇA ADICIONADA
          if (pitchRef.current && typeof pitchRef.current.listen === 'function') {
            pitchRef.current.listen(getPitch, stream);
            setStatus('listening');
          } else {
            throw new Error('Modelo de áudio (pitchRef) não está pronto ou não tem o método .listen().');
          }
          // ...

    } catch (err) {
      console.error("Erro detalhado do microfone:", err);
      
      if (err instanceof Error) {
        setError(`Erro ao iniciar microfone: ${err.name}. Verifique o hardware e as permissões do sistema.`);
      } else {
        setError('Ocorreu um erro desconhecido ao acessar o microfone.');
      }
      
      setStatus('error');
    }
  }, [getPitch, status]);

  const stop = useCallback(() => {
    if (pitchRef.current) pitchRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setStatus('ready');
    setNote(null);
  }, []);
  
  useEffect(() => {
    try {
      const model = ml5.pitchDetection('./model/', undefined, undefined, modelReady);
      pitchRef.current = model;
    } catch (e) {
      console.error(e);
      setError('Falha ao inicializar o motor de áudio ml5. Verifique a conexão.');
      setStatus('error');
    }

    return () => { stop(); };
  }, [stop]);

  return { note, status, error, start, stop };
}; 
