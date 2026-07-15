import { useState, useEffect, useCallback } from 'react';
import { selectVoiceByGender, cleanTextForSpeech } from '../utils/voice';

export interface UseCleanSpeechOptions {
  defaultRate?: number;
}

/**
 * Custom React hook for clean text-to-speech support in Sabush English Club.
 * Strips internal codes, unit prefixes, and metadata before synthesizer invocation
 * with support for state tracking, cleanup, and adjusted pacing speeds.
 */
export function useCleanSpeech(options?: UseCleanSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const defaultRate = options?.defaultRate ?? 0.9;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string, overrideOptions?: { rate?: number }) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Always stifle all active ongoing speech triggers
    window.speechSynthesis.cancel();

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
      setIsSpeaking(false);
      return;
    }

    // Dynamic extraction of selected voice gender setting from localStorage
    let selectedGender: 'male' | 'female' = 'male';
    try {
      const saved = localStorage.getItem('voiceGender');
      if (saved === 'female') {
        selectedGender = 'female';
      }
    } catch (err) {
      console.warn('Failed to retrieve voiceGender preference:', err);
    }

    const rate = overrideOptions?.rate ?? defaultRate;
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // Attach high quality speaker profiles based on dynamic gender setting
    const selectedVoice = selectVoiceByGender(window.speechSynthesis, selectedGender);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.warn('Speech synthesis playback error:', e);
      }
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [defaultRate]);

  // Handle unmount cleanups seamlessly
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}
