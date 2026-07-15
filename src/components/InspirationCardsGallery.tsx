/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Filter, Grid, Layers, X, HelpCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getInspirationCards } from '../firebase';
import { InspirationCard } from '../types';
import { InspirationCardView } from './InspirationCardView';

// Beautiful default preset cards to guarantee an instantly filled database and zero blank states
export const DEFAULT_INSPIRATION_CARDS: InspirationCard[] = [
  {
    cardId: 'preset_1',
    category: 'Vocabulário',
    englishContent: 'Stunning',
    portugueseTranslation: 'Significa "deslumbrante" ou "maravilhoso". Usado para descrever belezas naturais incríveis. Exemplo: "Bazaruto beaches are stunning!" (As praias de Bazaruto são deslumbrantes!)',
    pronunciation: 'stâ-nin',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
  },
  {
    cardId: 'preset_2',
    category: 'Erro Comum',
    englishContent: 'I have 25 years old ❌ ➔ I am 25 years old',
    portugueseTranslation: 'Para expressar idade em inglês, utilizamos sempre o verbo "to be" (ser/estar) e nunca o verbo "have" (ter).',
    pronunciation: 'ai em tuenti-faiv i-ârz old',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800'
  },
  {
    cardId: 'preset_3',
    category: 'Dica de Inglês',
    englishContent: 'I would like some water, please',
    portugueseTranslation: 'A forma mais correta e polida de pedir água ou café num hotel ou restaurante, em vez do direto "I want water" (eu quero água).',
    pronunciation: 'ai uud laik sâm uá-ter pliz',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800'
  },
  {
    cardId: 'preset_4',
    category: 'Vocabulário',
    englishContent: 'Endeavor',
    portugueseTranslation: 'Significa um esforço dedicado, empenho ou um projeto profissional sério. Exemplo: "A new business endeavor in Maputo." (Um novo empreendimento comercial em Maputo.)',
    pronunciation: 'en-dé-vor',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  {
    cardId: 'preset_5',
    category: 'Erro Comum',
    englishContent: 'Explain me the lesson ❌ ➔ Explain the lesson to me',
    portugueseTranslation: 'O verbo "explain" exige a preposição "to" antes da pessoa a quem se explica algo.',
    pronunciation: 'ex-plein dâ lé-son tu mi',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800'
  },
  {
    cardId: 'preset_6',
    category: 'Dica de Inglês',
    englishContent: 'By all means!',
    portugueseTranslation: 'Expressão idiomática de afirmação polida equivalente a "Sem dúvida!" ou "Com toda a certeza!". Exemplo: "May I sit here? - By all means!"',
    pronunciation: 'bai ól míns',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
  }
];

interface InspirationCardsGalleryProps {
  onGoBack: () => void;
  onNavigateHome: () => void;
  onRegisterBack?: (handler: (() => void) | null) => void;
}

export function InspirationCardsGallery({ onGoBack, onNavigateHome, onRegisterBack }: InspirationCardsGalleryProps) {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Vocabulário' | 'Erro Comum' | 'Dica de Inglês'>('Todos');
  const [activeCard, setActiveCard] = useState<InspirationCard | null>(null);

  // Low-data mode state and tap-to-load list
  const [lowDataMode, setLowDataMode] = useState(() => localStorage.getItem('lowDataMode') === 'true');
  const [loadedCardIds, setLoadedCardIds] = useState<Set<string>>(new Set());

  // Listen to immediate low-data mode toggle changes
  useEffect(() => {
    const handleLowDataModeChange = () => {
      setLowDataMode(localStorage.getItem('lowDataMode') === 'true');
    };
    window.addEventListener('lowDataModeChanged', handleLowDataModeChange);
    return () => {
      window.removeEventListener('lowDataModeChanged', handleLowDataModeChange);
    };
  }, []);

  // Load cards from Firestore or fall back to preset cards
  const loadCardsData = async () => {
    try {
      setLoading(true);
      const firestoreCards = await getInspirationCards();
      if (firestoreCards && firestoreCards.length > 0) {
        setCards(firestoreCards);
      } else {
        // If Firestore is empty, use local fallback presets temporarily to protect student UX
        setCards(DEFAULT_INSPIRATION_CARDS);
      }
    } catch (e) {
      console.error('Error loading inspiration cards:', e);
      setCards(DEFAULT_INSPIRATION_CARDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCardsData();
  }, []);

  // Register android back handler
  useEffect(() => {
    if (onRegisterBack) {
      if (activeCard) {
        onRegisterBack(() => setActiveCard(null));
      } else {
        onRegisterBack(onGoBack);
      }
    }
    return () => {
      if (onRegisterBack) onRegisterBack(null);
    };
  }, [activeCard, onGoBack, onRegisterBack]);

  const filteredCards = cards.filter(card => {
    if (activeFilter === 'Todos') return true;
    return card.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Immersive Gallery Header */}
      <div className="bg-brand-navy-900 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg border-2 border-brand-red-650" id="gallery_header">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-brand-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#ffffff] border border-brand-red-500">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-400 fill-brand-gold-400" />
              <span>Inspiração &amp; Recarga Mental</span>
            </div>
            <h2 className="text-xl font-black leading-tight mt-1 text-[#ffffff]">
              Cartões de Inspiração
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed max-w-lg font-medium">
              Relaxe a mente entre uma lição e outra. Descubra vocabulário de elite, correções essenciais de erros comuns e dicas práticas de conversação expressas em lindas paisagens.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl border border-slate-200/90 whitespace-nowrap overflow-x-auto scrollbar-none shadow-sm shrink-0">
        {(['Todos', 'Vocabulário', 'Erro Comum', 'Dica de Inglês'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-black tracking-wide rounded-xl cursor-pointer select-none transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-brand-navy-800 text-brand-gold-400 shadow-sm border border-brand-navy-900'
                  : 'text-slate-650 hover:text-brand-navy-900 hover:bg-slate-300/40'
              }`}
            >
              <span>{filter}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Display of Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-slate-200/80 rounded-2xl animate-pulse border border-slate-300/50" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/90 space-y-3.5">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-full inline-block">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-1.5">
            <p className="font-extrabold text-sm text-brand-navy-900">Nenhum cartão publicado nesta categoria</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Em breve, novos cartões de inspiração serão disponibilizados para energizar a sua aprendizagem!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="inspiration_cards_grid">
          {filteredCards.map((card, idx) => {
            const isPreset = card.cardId.startsWith('preset_');
            return (
              <motion.div
                key={card.cardId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                onClick={() => setActiveCard(card)}
                className="group relative aspect-[4/5] sm:aspect-[3/4] p-4.5 rounded-3xl overflow-hidden cursor-pointer shadow-md select-none border border-slate-200 hover:border-brand-red-500/50 hover:shadow-xl transition-all"
              >
                {/* Background image preview */}
                {lowDataMode && !loadedCardIds.has(card.cardId) ? (
                  <div className={`absolute inset-0 w-full h-full ${
                    card.category === 'Vocabulário' ? 'bg-gradient-to-br from-red-950 to-rose-950' :
                    card.category === 'Erro Comum' ? 'bg-gradient-to-br from-amber-950 to-orange-950' :
                    'bg-gradient-to-br from-slate-900 to-slate-950'
                  } flex flex-col items-center justify-center p-4 z-0`}>
                    <ImageIcon className="w-8 h-8 text-white/30 mb-2 animate-pulse" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLoadedCardIds(prev => {
                          const next = new Set(prev);
                          next.add(card.cardId);
                          return next;
                        });
                      }}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-[#ffffff] px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer select-none"
                    >
                      Carregar Imagem
                    </button>
                  </div>
                ) : (
                  <img
                    src={card.imageUrl}
                    alt={card.englishContent}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] transform group-hover:scale-105 transition-all duration-500 z-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                )}
                {/* Overlay color */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/30 to-brand-navy-950/40 z-1" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between items-start text-white">
                  {/* Category badge */}
                  <span className="bg-brand-navy-950/80 backdrop-blur-sm border border-brand-red-500/25 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-brand-gold-400">
                    {card.category}
                  </span>

                  {/* Text preview */}
                  <div className="w-full space-y-1">
                    <p className="font-black text-sm tracking-tight line-clamp-2 md:text-sm text-[#ffffff] leading-snug">
                      {card.englishContent}
                    </p>
                    <p className="text-[10px] text-slate-300 font-semibold line-clamp-2">
                      {card.portugueseTranslation}
                    </p>
                  </div>
                </div>

                {/* Light visual indicator badge */}
                {isPreset && (
                  <span className="absolute top-4 right-4 bg-brand-navy-800/80 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-slate-300 z-10 border border-slate-500/30 select-none">
                    Standard
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Immersive Overlay Model when clicking a card */}
      <AnimatePresence>
        {activeCard && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCard(null)}
              className="fixed inset-0 bg-brand-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            />

            {/* Floating Container containing core card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm sm:max-w-md mx-auto z-55"
            >
              {/* Close Button top-right offset */}
              <button
                onClick={() => setActiveCard(null)}
                className="absolute -top-12 right-2 bg-brand-navy-900 border border-brand-red-500/30 text-slate-200 hover:text-white p-2.5 rounded-full shadow-lg z-55 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Fechar Cartão"
                aria-label="Fechar Cartão"
              >
                <X className="w-5 h-5 stroke-[2px]" />
              </button>

              <InspirationCardView card={activeCard} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
