/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Landmark, 
  Sparkles, 
  LogIn, 
  TrendingUp, 
  CheckCircle2, 
  RefreshCw, 
  Loader2,
  Sliders,
  Image as ImageIcon,
  Trophy,
  BookOpen,
  Mic,
  Briefcase,
  Plane,
  Volume2,
  ArrowRight
} from 'lucide-react';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
// @ts-ignore
import heroBanner from '../assets/images/hero_banner.png';
import { getInspirationCards } from '../firebase';
import { InspirationCard, PhrasePack } from '../types';
import { InspirationCardView } from './InspirationCardView';
import { DEFAULT_INSPIRATION_CARDS } from './InspirationCardsGallery';
import { LESSONS } from '../data';
import { getCategoriesForGoal, getRecommendationForGoal } from '../utils/goalMapping';
import { PHRASE_PACKS } from '../utils/phrasePacks';
import { WordOfTheDayWidget } from './WordOfTheDayWidget';
import { FirebaseUserProfile } from '../firebase';

interface HomeProps {
  onStartLearning: () => void;
  onNavigateToAbout: () => void;
  userLevel: string;
  onNavigateToTab?: (tab: string) => void;
  onSelectCategory?: (category: string) => void;
  learningGoal?: string;
  completedPacks?: string[];
  onSelectPhrasePack?: (pack: PhrasePack) => void;
  userProfile?: FirebaseUserProfile | null;
  onProfileUpdate?: (updates: Partial<FirebaseUserProfile>) => void;
  streak?: number;
}

export function HomeView({ 
  onStartLearning, 
  onNavigateToAbout, 
  userLevel, 
  onNavigateToTab, 
  onSelectCategory, 
  learningGoal,
  completedPacks = [],
  onSelectPhrasePack,
  userProfile = null,
  onProfileUpdate = () => {},
  streak = 0
}: HomeProps) {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const firestoreCards = await getInspirationCards();
        if (!active) return;
        if (firestoreCards && firestoreCards.length > 0) {
          setCards(firestoreCards);
        } else {
          setCards(DEFAULT_INSPIRATION_CARDS);
        }
      } catch (err) {
        console.warn("Error fetching inspiration cards for home:", err);
        if (active) {
          setCards(DEFAULT_INSPIRATION_CARDS);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleNextCard = () => {
    if (cards.length <= 1) return;
    setCurrentIdx((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Banner — responsive: legible coded hero on phones, full brand image on tablet/desktop */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200" id="home_hero_banner">

        {/* Phone version (below sm breakpoint): the wide raster banner becomes illegible at phone width, so use real scalable text instead */}
        <div className="sm:hidden bg-gradient-to-br from-slate-50 to-blue-50 p-5">
          <SabushLogo size="sm" onDark={false} />
          <div className="inline-flex items-center space-x-1.5 bg-brand-navy-600/10 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-brand-navy-700 border border-brand-navy-600/20 uppercase mt-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-600 fill-brand-gold-600" />
            <span>Aprenda Inglês com Confiança</span>
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-brand-navy-700 mt-3">
            Fale Inglês com a Melhor Metodologia! 🇲🇿
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-2">
            Do Iniciante à Fluência — Inglês prático para a vida real, com suporte inteligente de IA.
          </p>
        </div>

        {/* Tablet/desktop version: full brand banner image (all text stays readable at this size) */}
        <img
          src={heroBanner}
          alt="Sabush English Club — Aprenda Inglês com Confiança"
          className="hidden sm:block w-full h-auto object-cover"
        />

        <div className="bg-brand-navy-700 p-5 sm:p-6">
          {/* CTA Group for 90-Day guided and exploration flows */}
          <div className="flex flex-col sm:flex-row items-center gap-3 no-print">
            <button
              onClick={() => onNavigateToTab?.('confidence_path')}
              className="w-full sm:flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-950 active:scale-95 py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2.5 cursor-pointer min-h-[48px] border border-transparent"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>Caminho da Confiança (90 Dias)</span>
            </button>

            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white active:scale-95 py-3.5 px-5 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer min-h-[48px] border border-white/20"
            >
              <span>Explorar Todas as Aulas</span>
              <LogIn className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Recomendado para o seu objetivo Section */}
      {(() => {
        const rec = getRecommendationForGoal(learningGoal);
        const IconComponent = rec.category === 'Negócios' ? Briefcase 
                            : rec.category === 'Viagem' ? Plane 
                            : rec.category === 'Gramática' ? BookOpen 
                            : Mic;
        const colorClass = rec.category === 'Negócios' ? 'from-indigo-50 to-blue-50 border-indigo-200 text-indigo-950'
                         : rec.category === 'Viagem' ? 'from-rose-50 to-pink-50 border-rose-200 text-rose-950'
                         : rec.category === 'Gramática' ? 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
                         : 'from-sky-50 to-blue-50 border-sky-200 text-sky-950';
        const badgeColor = rec.category === 'Negócios' ? 'bg-indigo-600 text-white'
                         : rec.category === 'Viagem' ? 'bg-rose-600 text-white'
                         : rec.category === 'Gramática' ? 'bg-emerald-600 text-white'
                         : 'bg-sky-600 text-white';
                         
        return (
          <div className={`bg-gradient-to-br ${colorClass} rounded-3xl p-5 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`} id="home_recommended_goal_card">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl ${badgeColor} shadow-md shrink-0 mt-1 sm:mt-0`}>
                <IconComponent className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-800 border border-slate-200">
                  <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span>Recomendado para o seu objetivo</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">{rec.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold max-w-lg">
                  {rec.description}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onSelectCategory?.(rec.category)}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer min-h-[44px] ${badgeColor} hover:brightness-110 active:scale-95 text-white`}
            >
              <span>Estudar {rec.category}</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
            </button>
          </div>
        );
      })()}

      {/* Daily Challenge & Notifications Service Worker Widget */}
      <WordOfTheDayWidget 
        userProfile={userProfile} 
        onProfileUpdate={onProfileUpdate} 
        streak={streak} 
      />

      {/* Pacotes Práticos Horizontal Scroll Section */}
      <div className="space-y-3" id="home-phrase-packs-section">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <span>Pacotes Práticos 🎯</span>
          </h3>
          <span className="text-[9px] text-[#2563eb] bg-blue-50/70 border border-blue-200/40 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest leading-none">
            Objetivos Reais
          </span>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {(() => {
            const sortedPacks = [...PHRASE_PACKS].sort((a, b) => {
              const aMatch = a.learningGoal === learningGoal;
              const bMatch = b.learningGoal === learningGoal;
              if (aMatch && !bMatch) return -1;
              if (!aMatch && bMatch) return 1;
              return 0;
            });

            return sortedPacks.map((pack) => {
              const isCompleted = completedPacks?.includes(pack.id);
              const isMatch = pack.learningGoal === learningGoal;
              
              return (
                <button
                  key={pack.id}
                  onClick={() => onSelectPhrasePack?.(pack)}
                  className={`flex-none w-72 bg-white rounded-2xl border transition-all text-left flex flex-col p-4 relative cursor-pointer active:scale-95 shadow-sm group ${
                    isMatch 
                      ? 'border-blue-200 bg-gradient-to-br from-blue-50/10 to-white hover:border-blue-400' 
                      : 'border-slate-200 hover:border-slate-350'
                  }`}
                >
                  {/* Badge if matching user's goal */}
                  {isMatch && (
                    <div className="absolute top-3 right-3 bg-blue-50 text-[#2563eb] border border-blue-100 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                      Para Mim
                    </div>
                  )}

                  {/* Badge if completed */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center space-x-0.5">
                      <span>✓ Concluído</span>
                    </div>
                  )}

                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-xl shrink-0 mb-3 group-hover:scale-105 transition-transform">
                    {pack.icon}
                  </div>

                  <div className="space-y-1 flex-1">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight leading-snug">
                      {pack.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed font-semibold line-clamp-2">
                      {pack.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between w-full border-t border-slate-100 pt-2.5 text-[9px] font-black uppercase tracking-wider text-brand-navy-600">
                    <span>Ver Pacote</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
                  </div>
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* Redesigned Bento Study Stations / Shortcuts (Pastel badged bento items) */}
      {onNavigateToTab && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateToTab('levels')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all text-center flex flex-col items-center space-y-2 cursor-pointer shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders className="w-5 h-5 stroke-[2.2] text-blue-600 fill-blue-200" />
            </div>
            <span className="text-[10px] font-black text-slate-700 leading-none">Nível</span>
          </button>

          <button
            onClick={() => onNavigateToTab('gallery')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all text-center flex flex-col items-center space-y-2 cursor-pointer shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 stroke-[2.2] text-purple-600 fill-purple-200" />
            </div>
            <span className="text-[10px] font-black text-slate-700 leading-none">Dicas</span>
          </button>

          <button
            onClick={() => onNavigateToTab('progress')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all text-center flex flex-col items-center space-y-2 cursor-pointer shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 stroke-[2.2] text-amber-500 fill-amber-200" />
            </div>
            <span className="text-[10px] font-black text-slate-700 leading-none">Progresso</span>
          </button>
        </div>
      )}

      {/* Categorias Populares Grid */}
      <div className="space-y-3" id="home-categories-section">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <span>Categorias Populares 🔥</span>
          </h3>
          <span className="text-[9px] text-[#2563eb] bg-blue-50/70 border border-blue-200/40 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest leading-none">
            Por Tópico
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(() => {
            const rawCategories = [
              {
                id: 'gramatica',
                name: 'Gramática',
                icon: BookOpen,
                bgColor: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                iconFill: 'fill-emerald-200',
                borderColor: 'border-emerald-200/40',
                count: LESSONS.filter(l => l.level === userLevel && l.categories?.includes('Gramática')).length
              },
              {
                id: 'conversacao',
                name: 'Conversação',
                icon: Mic,
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600',
                iconFill: 'fill-blue-200',
                borderColor: 'border-blue-200/40',
                count: LESSONS.filter(l => l.level === userLevel && l.categories?.includes('Conversação')).length
              },
              {
                id: 'vocabulario',
                name: 'Vocabulário',
                icon: Sparkles,
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600',
                iconFill: 'fill-purple-200',
                borderColor: 'border-purple-200/40',
                count: LESSONS.filter(l => l.level === userLevel && l.categories?.includes('Vocabulário')).length
              },
              {
                id: 'negocios',
                name: 'Negócios',
                icon: Briefcase,
                bgColor: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                iconFill: 'fill-indigo-200',
                borderColor: 'border-indigo-200/40',
                count: LESSONS.filter(l => l.level === userLevel && l.categories?.includes('Negócios')).length
              },
              {
                id: 'viagem',
                name: 'Viagem',
                icon: Plane,
                bgColor: 'bg-rose-50',
                iconColor: 'text-rose-600',
                iconFill: 'fill-rose-200',
                borderColor: 'border-rose-200/40',
                count: LESSONS.filter(l => l.level === userLevel && l.categories?.includes('Viagem')).length
              },
              {
                id: 'pronuncia',
                name: 'Pronúncia',
                icon: Volume2,
                bgColor: 'bg-amber-50',
                iconColor: 'text-amber-600',
                iconFill: 'fill-amber-200',
                borderColor: 'border-amber-200/40',
                count: LESSONS.filter(l => l.level === userLevel && l.categories?.includes('Pronúncia')).length
              }
            ];
            
            const preferred = getCategoriesForGoal(learningGoal);
            return [...rawCategories].sort((a, b) => {
              const aPref = preferred.includes(a.name);
              const bPref = preferred.includes(b.name);
              if (aPref && !bPref) return -1;
              if (!aPref && bPref) return 1;
              return 0;
            });
          })().map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory?.(cat.name)}
                className="bg-white p-4.5 rounded-3xl border border-slate-200/80 hover:border-slate-350 hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col justify-between h-32 cursor-pointer shadow-sm active:scale-95 group relative"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.bgColor} ${cat.iconColor} border ${cat.borderColor} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className={`w-5 h-5 stroke-[2.2] ${cat.iconFill}`} />
                </div>
                <div className="space-y-0.5 mt-2">
                  <span className="text-xs font-extrabold text-slate-800 block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">
                    {cat.count} {cat.count === 1 ? 'aula' : 'aulas'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Daily Inspiration Card */}
      <div className="space-y-3.5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm" id="home_daily_inspiration_wrapper">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[9px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-black uppercase tracking-widest inline-block">Recarga de Vocabulário</span>
            <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight flex items-center space-x-1.5 mt-0.5">
              <span>Refresque a sua Mente 🌅</span>
            </h3>
          </div>
          <button
            onClick={handleNextCard}
            className="text-[10px] bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold px-3.5 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer min-h-[30px]"
            title="Sugerir outro cartão"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
            <span>Mudar</span>
          </button>
        </div>

        {loading ? (
          <div className="aspect-[3/4] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin text-brand-navy-800" />
          </div>
        ) : cards.length > 0 ? (
          <InspirationCardView card={cards[currentIdx]} />
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col items-center justify-center space-y-3 min-h-[180px]">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            <h4 className="font-extrabold text-sm text-slate-700">Novas dicas em breve!</h4>
            <p className="text-xs text-slate-400 max-w-xs font-semibold leading-relaxed">
              Estamos a preparar novas cartas de vocabulário e expressões para ti. Volta a verificar mais tarde!
            </p>
          </div>
        )}
      </div>

      {/* Mozambique Context Opportunities Card with soft pastel square badges */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600 fill-indigo-200 stroke-[2.2]" />
          <span>Falar Inglês em Moçambique</span>
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          <div className="flex items-start space-x-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
            <div className="bg-amber-50 text-amber-600 border border-amber-200/30 p-2.5 rounded-xl mt-0.5 shrink-0">
              <Landmark className="w-5 h-5 stroke-[2.2] text-amber-600 fill-amber-200" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-navy-800">Empregabilidade &amp; Carreiras</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                As principais multinacionais e ONGs em Maputo, Beira e Nampula exigem inglês nas interviews e testes.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
            <div className="bg-rose-50 text-rose-650 border border-rose-200/30 p-2.5 rounded-xl mt-0.5 shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.2] text-rose-600 fill-rose-100" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-navy-900">Turismo &amp; Negócios Globais</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Comunique-se com investidores na logística, mineração e turismo nas nossas estâncias ou praias fantásticas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our App Features checklist with clean pastel markers */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight">O que vai encontrar no Club:</h3>
        
        <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-250 shrink-0 mt-0.5 stroke-[2.2]" />
            <span><strong>Aulas Passo-a-Passo:</strong> Exercícios práticos e didáticos do nível iniciante ao avançado.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-250 shrink-0 mt-0.5 stroke-[2.2]" />
            <span><strong>Pronúncia Descomplicada:</strong> Guias de áudio e fonética figurada simples adaptada para falantes de português.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-250 shrink-0 mt-0.5 stroke-[2.2]" />
            <span><strong>Tutor de IA Integrado:</strong> Esclareça as suas dúvidas linguísticas instantaneamente, 24 horas por dia.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-250 shrink-0 mt-0.5 stroke-[2.2]" />
            <span><strong>Económico e Super Leve:</strong> Otimizado para consumir o mínimo do seu plano de dados móveis.</span>
          </li>
        </ul>
      </div>

      {/* Mozambique Friendly Notice Footer */}
      <div className="text-center bg-blue-50/50 p-4 rounded-2xl border border-blue-200/35">
        <p className="text-xs text-blue-800 font-bold leading-relaxed">
          💡 Sabia? Estudar 10 minutos por dia no Sabush English Club ajuda a adquirir vocabulário de negócios de forma 3x mais rápida.
        </p>
      </div>

      {/* Warm Explanatory About Card / Section with clean white card & pastel badge */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 shadow-sm" id="home_about_cta_card">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-[#047857] uppercase">
          Escola Oficial de Inglês Moçambicana 🇲🇿
        </div>
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200">
          <Mascot expression="talking" size="sm" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Leia Sobre Nós &amp; Blog</h4>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
            Deseja saber mais sobre quem somos, o funcionamento da nossa metodologia de retenção, ver os contactos de WhatsApp/Email ou ler as dicas exclusivas do nosso Blog?
          </p>
        </div>
        <button
          onClick={onNavigateToAbout}
          className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white border border-transparent font-extrabold py-3.5 px-4 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-all cursor-pointer min-h-[44px] shadow-sm uppercase tracking-wider"
          id="home_about_cta_btn"
        >
          <span>Ler Sobre Nós &amp; Blog</span>
        </button>
      </div>
    </div>
  );
}
