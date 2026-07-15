/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import { Sparkles, Languages, Volume2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InspirationCard } from '../types';
import { useCleanSpeech } from '../hooks/useCleanSpeech';

interface InspirationCardViewProps {
  card: InspirationCard;
  onNext?: () => void;
  showNextBtn?: boolean;
}

export function InspirationCardView({ card, onNext, showNextBtn = false }: InspirationCardViewProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const { speak } = useCleanSpeech({ defaultRate: 0.9 });
  
  const [lowDataMode, setLowDataMode] = useState(() => localStorage.getItem('lowDataMode') === 'true');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLowDataModeChange = () => {
      setLowDataMode(localStorage.getItem('lowDataMode') === 'true');
    };
    window.addEventListener('lowDataModeChanged', handleLowDataModeChange);
    return () => {
      window.removeEventListener('lowDataModeChanged', handleLowDataModeChange);
    };
  }, []);

  useEffect(() => {
    // Reset loaded state when card changes
    setLoaded(false);
  }, [card]);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Vocabulário':
        return {
          bg: 'bg-brand-red-600',
          border: 'border-brand-red-500',
          text: 'text-brand-gold-400',
          label: 'Vocabulário',
        };
      case 'Erro Comum':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-400',
          text: 'text-[#ffffff]',
          label: 'Erro Comum',
        };
      case 'Dica de Inglês':
      default:
        return {
          bg: 'bg-brand-navy-700',
          border: 'border-brand-navy-600',
          text: 'text-brand-gold-300',
          label: 'Dica Prática',
        };
    }
  };

  const theme = getCategoryTheme(card.category);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-red-650/30 flex flex-col justify-between bg-brand-navy-950 text-white select-none">
      {/* Scenic Background Image */}
      <div className="absolute inset-0 z-0">
        {lowDataMode && !loaded ? (
          <div className={`absolute inset-0 w-full h-full ${
            card.category === 'Vocabulário' ? 'bg-gradient-to-br from-red-950 to-rose-950' :
            card.category === 'Erro Comum' ? 'bg-gradient-to-br from-amber-950 to-orange-950' :
            'bg-gradient-to-br from-slate-900 to-slate-950'
          } flex flex-col items-center justify-center p-4 z-0`}>
            <ImageIcon className="w-12 h-12 text-white/20 mb-3" />
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="bg-white/15 hover:bg-white/25 border border-white/20 text-[#ffffff] px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer select-none"
            >
              Carregar Imagem
            </button>
          </div>
        ) : (
          <img
            src={card.imageUrl}
            alt="Visual scenic background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80 filter saturate-[0.8] brightness-[0.7] transform scale-100 uppercase transition-all duration-700 hover:scale-105"
            onError={(e) => {
              // Safe fallback if image fails loading or Storage url is empty
              e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800';
            }}
          />
        )}
        {/* Soft custom ambient overlays for extreme readability contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/40 to-brand-navy-950/50 z-1" />
      </div>

      {/* Card Header Content */}
      <div className="p-5 z-10 flex justify-between items-center shrink-0">
        {/* Category Label Tag with high-contrast borders */}
        <div className={`inline-flex items-center space-x-1 ${theme.bg} ${theme.border} border px-3-4 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#ffffff] shadow-sm`}>
          <Sparkles className="w-3 h-3 text-brand-gold-400 fill-brand-gold-400 shrink-0" />
          <span>{theme.label}</span>
        </div>

        {/* Listen Icon */}
        <button
          onClick={() => speak(card.englishContent)}
          className="bg-brand-navy-900/90 text-brand-gold-400 hover:bg-brand-navy-800 active:scale-95 border border-brand-red-500/25 p-2 rounded-full transition-all cursor-pointer shadow-md min-h-[40px] min-w-[40px] flex items-center justify-center"
          title="Ouvir Pronúncia"
          aria-label="Ouvir Pronúncia"
        >
          <Volume2 className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Educational Core Content Container with deep readable backdrop */}
      <div className="px-6 py-4 z-10 flex-1 flex flex-col justify-center items-center text-center space-y-4">
        {/* English Highlight Text (Huge display styling) */}
        <div className="space-y-2 max-w-full px-1">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#ffffff] leading-normal font-sans break-words text-shadow-sm select-text selection:bg-brand-red-600">
            {card.englishContent}
          </h3>

          {/* Optional Figurative Phonetics/Pronunciation helper */}
          {card.pronunciation && (
            <p className="text-xs text-brand-gold-400 font-mono italic select-none">
              Pronúncia: &ldquo;{card.pronunciation}&rdquo;
            </p>
          )}
        </div>

        {/* Translation Banner with toggle control */}
        <div className="w-full pt-2 flex flex-col items-center">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#ffffff] bg-black/40 hover:bg-black/60 border border-slate-500/30 px-3.5 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 mb-2.5"
            aria-expanded={showTranslation}
          >
            <Languages className="w-3.5 h-3.5 text-brand-gold-400" />
            <span>{showTranslation ? 'Ocultar Tradução' : 'Revelar Tradução'}</span>
          </button>

          <div className="h-16 flex items-center justify-center text-center w-full">
            <AnimatePresence mode="wait">
              {showTranslation ? (
                <motion.p
                  key="translation-visible"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, _y: -5 }}
                  className="text-sm font-semibold text-slate-100 max-w-xs leading-relaxed select-text"
                >
                  {card.portugueseTranslation}
                </motion.p>
              ) : (
                <motion.p
                  key="translation-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="text-[10.5px] italic text-slate-400 max-w-xs"
                >
                  Toque acima para revelar o significado em português moçambicano.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Card Footer controls */}
      <div className="p-5 z-10 bg-gradient-to-t from-brand-navy-950 to-brand-navy-950/0 shrink-0">
        {showNextBtn && onNext && (
          <button
            onClick={() => {
              setShowTranslation(false);
              onNext();
            }}
            className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-[#ffffff] font-extrabold text-xs tracking-wider py-3.5 rounded-2xl border border-transparent hover:border-brand-gold-400 transition-all cursor-pointer uppercase flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <span>Próximo Cartão</span>
            <Sparkles className="w-4 h-4 text-brand-gold-300" />
          </button>
        )}
      </div>
    </div>
  );
}
