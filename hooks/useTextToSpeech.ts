
import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const play = useCallback((text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
        setIsSpeaking(false);
    }
    synth.speak(utterance);
    setIsSpeaking(true);
  }, [synth]);

  const stop = useCallback(() => {
    synth.cancel();
    setIsSpeaking(false);
  }, [synth]);

  useEffect(() => {
    return () => {
      // Cleanup: cancel any speech when the component unmounts
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, [synth]);

  return { isSpeaking, play, stop };
};
