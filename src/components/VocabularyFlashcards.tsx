/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCw, 
  Check, 
  Bookmark, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { Mascot } from './Mascot';
import { VocabularyCard, getWordTopic } from './VocabularyCard';

interface VocabularyWord {
  en: string;
  pt: string;
  pronunciation: string;
  lessonId?: string;
  lessonTitle?: string;
}

interface VocabularyFlashcardsProps {
  words: VocabularyWord[];
  onPlayAudio: (word: string) => void;
  completedLessonsCount: number;
  getWordLeitnerState: (wordEn: string) => { box: number; nextReviewDate: string; lastReviewedAt: string };
  onUpdateLeitner: (wordEn: string, correct: boolean) => void;
}

export function VocabularyFlashcards({ 
  words, 
  onPlayAudio, 
  completedLessonsCount,
  getWordLeitnerState,
  onUpdateLeitner
}: VocabularyFlashcardsProps) {
  const [deck, setDeck] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(false);

  // Initialize and preserve deck
  useEffect(() => {
    if (words && words.length > 0) {
      setDeck([...words]);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [words]);

  const activeWord = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex + 1 < deck.length) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeWord) {
      onPlayAudio(activeWord.en);
      setAudioFeedback(true);
      setTimeout(() => setAudioFeedback(false), 800);
    }
  };

  const handleSelfAssess = (correct: boolean) => {
    if (!activeWord) return;
    onUpdateLeitner(activeWord.en, correct);
    
    // Automatically advance to the next card after a brief moment to feel the click
    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 150);
      }
    }, 400);
  };

  if (!activeWord) {
    return (
      <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs text-slate-500 font-bold border border-slate-100">
        Nenhum termo disponível para estudo. Complete lições primeiro!
      </div>
    );
  }

  const wordState = getWordLeitnerState(activeWord.en);
  const isWordMastered = wordState.box === 5;
  const progressPercent = Math.min(100, Math.floor(((currentIndex + 1) / deck.length) * 100));
  const topic = getWordTopic(activeWord.en, activeWord.pt, activeWord.lessonTitle);

  return (
    <div className="space-y-4 animate-fade-in" id="vocabulary-review-flashcards">
      {/* Tracker & Shuffler Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase block">Estudo por Cartões (Spaced Repetition)</span>
          <span className="text-xs font-black text-brand-navy-900 flex items-center space-x-1.5">
            <span>Ficha {currentIndex + 1} de {deck.length}</span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.2 rounded-full">
              Caixa {wordState.box} {isWordMastered && "⭐"}
            </span>
          </span>
        </div>

        <button
          onClick={handleShuffle}
          className="text-[10px] uppercase font-black tracking-wider text-brand-red-650 hover:text-brand-red-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer min-h-[36px]"
          title="Embaralhar baralho"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Baralhar</span>
        </button>
      </div>

      {/* Progress Bar of Deck */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand-red-600 transition-all duration-300 rounded-full" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* Redesigned Premium Vocabulary Card Component */}
      <VocabularyCard
        word={activeWord.en}
        pronunciation={activeWord.pronunciation}
        translation={activeWord.pt}
        topic={topic}
        onPlayAudio={onPlayAudio}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onSelfAssess={handleSelfAssess}
        cardIndex={currentIndex}
      />

      {/* Manual Swiper Navigation controls */}
      <div className="flex gap-2.5">
        <button
          disabled={currentIndex === 0}
          onClick={handlePrev}
          className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed font-extrabold text-slate-700 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all min-h-[44px] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          disabled={currentIndex + 1 === deck.length}
          onClick={handleNext}
          className="flex-1 bg-brand-navy-800 hover:bg-brand-navy-900 text-white disabled:opacity-40 disabled:cursor-not-allowed font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all min-h-[44px] cursor-pointer"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Memory Helper Tips box with Mascot */}
      <div className="bg-slate-50/50 p-4 border border-slate-200/60 rounded-2xl flex items-center space-x-3.5 text-xs">
        <div className="p-1 bg-brand-navy-900 rounded-xl">
          <Mascot expression="talking" size="sm" onDark={true} />
        </div>
        <p className="text-slate-600 font-semibold leading-relaxed">
          <strong>Dica Leitner:</strong> Acerte para passar a palavra para a próxima caixa de estudo espaçado, ou use os cartões sempre que quiser praticar de forma livre! No verso, diga se acertou para atualizar o sistema.
        </p>
      </div>
    </div>
  );
}
