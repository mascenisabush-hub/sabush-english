/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnglishLevel } from '../types';
import { Compass, Sparkles, Building2, Globe2, CheckCircle } from 'lucide-react';
import { Mascot } from './Mascot';

interface LevelSelectionProps {
  currentLevel: EnglishLevel;
  onSelectLevel: (level: EnglishLevel) => void;
}

export function LevelSelection({ currentLevel, onSelectLevel }: LevelSelectionProps) {
  const levels = [
    {
      id: 'beginner' as EnglishLevel,
      title: 'Iniciante (Beginner)',
      tagline: 'Aprender do Absoluto Zero',
      icon: Compass,
      color: 'border-slate-200 bg-white hover:border-blue-300',
      activeColor: 'border-blue-500 bg-white shadow-md shadow-blue-500/5 scale-[1.01]',
      badgeColors: { bg: 'bg-blue-50 text-blue-600 border-blue-200/10', text: 'text-blue-600', selectBadge: 'bg-blue-600' },
      description: 'Perfeito para quem nunca estudou inglês ou quer aprender regras fundamentais e saudações essenciais.',
      topics: [
        'Cumprimentos comuns e apresentações',
        'Verbo "To Be" e segredos de vocabulário',
        'Estruturar as suas primeiras frases do zero',
        'Dicas de pronúncia escrita (fonética simples)',
      ],
    },
    {
      id: 'intermediate' as EnglishLevel,
      title: 'Intermediário (Intermediate)',
      tagline: 'Inglês de Trabalho e Comércio',
      icon: Building2,
      color: 'border-slate-200 bg-white hover:border-orange-300',
      activeColor: 'border-orange-500 bg-white shadow-md shadow-orange-500/5 scale-[1.01]',
      badgeColors: { bg: 'bg-orange-50 text-orange-600 border-orange-200/10', text: 'text-orange-650', selectBadge: 'bg-orange-600' },
      description: 'Ideal para quem já fala o básico, mas precisa de vocabulário técnico para reuniões, e-mails e negócios.',
      topics: [
        'Termos corporativos, reuniões e agendas',
        'Negociação de preços, descontos e trocos',
        'E-mails profissionais e relatórios simples',
        'Melhorar a fluidez ao telemóvel ou online',
      ],
    },
    {
      id: 'advanced' as EnglishLevel,
      title: 'Avançado (Advanced)',
      tagline: 'Fluência e Liderança',
      icon: Globe2,
      color: 'border-slate-200 bg-white hover:border-emerald-300',
      activeColor: 'border-emerald-500 bg-white shadow-md shadow-emerald-500/5 scale-[1.01]',
      badgeColors: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/10', text: 'text-emerald-700', selectBadge: 'bg-emerald-600' },
      description: 'Focado em candidatar-se a ONGs internacionais, grandes empresas e falar com investidores globais.',
      topics: [
        'Simulações reais de entrevistas de emprego',
        'Candidaturas de emprego e currículos de valor',
        'Expressões e gírias de negócios mais comuns',
        'Regras avançadas de gramática e escrita formal',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Smooth blue gradient section header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-5 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <h2 className="text-lg font-black tracking-tight flex items-center space-x-1.5 uppercase tracking-wide">O seu Nível de Estudo</h2>
        <p className="text-xs text-slate-100/90 leading-relaxed font-semibold mt-1">
          Mude o seu nível à hora que desejar. As lições e o Tutor de IA adaptar-se-ão automaticamente ao seu ritmo.
        </p>
      </div>

      {/* Large Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          const isSelected = currentLevel === lvl.id;
          
          return (
            <div
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
              className={`cursor-pointer rounded-3xl p-5 border-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected ? lvl.activeColor : lvl.color
              }`}
            >
              {isSelected && (
                <div className={`absolute top-0 right-0 ${lvl.badgeColors.selectBadge} text-white rounded-bl-2xl px-3 py-1 text-[10px] font-black tracking-wider flex items-center space-x-1 uppercase shadow-sm`}>
                  <CheckCircle className="w-3.5 h-3.5 stroke-[3] text-yellow-300" />
                  <span>Activo</span>
                </div>
              )}

              <div className="flex items-center space-x-3.5">
                {/* Pastel rounded square icon badge */}
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl shrink-0 ${lvl.badgeColors.bg}`}>
                  <Icon className="w-5.5 h-5.5 stroke-[2.2px]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight leading-snug">{lvl.title}</h3>
                  <span className={`text-[9px] uppercase tracking-widest font-black ${lvl.badgeColors.text}`}>{lvl.tagline}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mt-3.5 leading-relaxed font-semibold">
                {lvl.description}
              </p>

              {/* Scope Checklist of Syllabus */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Conteúdo Recomendado:</span>
                <div className="grid grid-cols-1 gap-2">
                  {lvl.topics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-2.5 text-xs text-slate-650 text-slate-600 font-medium">
                      <div className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mascot Advice box in polished white with a clean pastel badge */}
      <div className="bg-white rounded-3xl p-5 border border-slate-250 border-slate-200 shadow-sm flex items-start space-x-4">
        <div className="w-11 h-11 bg-orange-50 text-orange-600 border border-orange-200/30 rounded-xl flex items-center justify-center shrink-0">
          <Mascot expression="thinking" size="sm" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Conselho de Sabush</h4>
          <p className="text-xs text-slate-550 text-slate-600 leading-relaxed font-semibold">
            Se tem dúvidas, selecione o nível <strong>Iniciante</strong> para fortalecer a sua fonética, ou <strong>Intermediário</strong> para termos práticos do comércio internacional e logística africana.
          </p>
        </div>
      </div>
    </div>
  );
}
