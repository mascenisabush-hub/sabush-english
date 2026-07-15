/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { EnglishLevel } from '../types';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { auth } from '../firebase';
import { 
  Compass, 
  Building2, 
  Globe2, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Award, 
  Sparkles, 
  Briefcase, 
  Plane, 
  GraduationCap, 
  MessageCircle,
  Phone,
  Clock,
  HelpCircle,
  Volume2,
  LogOut,
  Brain,
  Rocket,
  TrendingUp,
  User
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (level: EnglishLevel, goal: string, whatsappNumber?: string, whatsappNotificationsEnabled?: boolean) => void;
  onLogout: () => void;
}

interface Question {
  id: number;
  question: string;
  isPortuguese: boolean;
  options: { text: string; points: number }[];
  translation?: string;
}

export function Onboarding({ onComplete, onLogout }: OnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result' | 'goal' | 'whatsapp'>('welcome');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [suggestedLevel, setSuggestedLevel] = useState<EnglishLevel>('beginner');
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>('beginner');
  const [selectedGoal, setSelectedGoal] = useState<string>('work');

  // WhatsApp Onboarding step states
  const [whatsappNum, setWhatsappNum] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [whatsappErr, setWhatsappErr] = useState<string | null>(null);

  const handleLogOut = () => {
    onLogout();
  };

  const handleQuizBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    } else {
      setStep('welcome');
    }
  };

  // Short 9-question placement quiz curated for adult learners in Mozambique
  const questions: Question[] = [
    {
      id: 1,
      question: 'Já estudou ou teve contacto regular com a língua inglesa anteriormente?',
      isPortuguese: true,
      options: [
        { text: 'Não, vou começar absolutamente do zero.', points: 0 },
        { text: 'Tenho algumas noções básicas de tempos de escola ou contatos pontuais.', points: 1 },
        { text: 'Consigo entender textos simples e manuais básicos, mas não sei dialogar.', points: 2 },
        { text: 'Sim, já fiz cursos básicos ou estudo regularmente por conta própria.', points: 3 },
      ]
    },
    {
      id: 2,
      question: 'Qual é o seu nível de contacto diário ou semanal com o inglês?',
      isPortuguese: true,
      options: [
        { text: 'Raramente utilizo ou leio qualquer palavra em inglês.', points: 0 },
        { text: 'Intermédio (músicas, filmes com legenda ou termos na internet).', points: 1 },
        { text: 'Mais ativo (uso aplicativos no telemóvel, livros ou documentação de TI).', points: 2 },
      ]
    },
    {
      id: 3,
      question: 'Se um estrangeiro em Moçambique lhe pedisse direções em inglês, qual seria a sua reação?',
      isPortuguese: true,
      options: [
        { text: 'Ficaria bloqueado(a) e não conseguiria responder nada.', points: 0 },
        { text: 'Conseguiria falar saudações simples como "Hi" e tentaria indicar por gestos.', points: 1 },
        { text: 'Explicaria caminhos fáceis devagar com vocabulário simples.', points: 2 },
        { text: 'Responderia fluentemente com indicações claras e precisas.', points: 3 },
      ]
    },
    {
      id: 4,
      question: 'Compreensão: Como se traduz profissionalmente "Good morning, how are you today?"',
      isPortuguese: false,
      options: [
        { text: 'Boa tarde, qual é o seu cargo no projeto?', points: 0 },
        { text: 'Bom dia, como está hoje?', points: 2 },
        { text: 'Olá, onde fica o terminal de transportes?', points: 0 },
        { text: 'Boa noite, qual é a tarifa cobrada?', points: 0 },
      ]
    },
    {
      id: 5,
      question: 'Complete a frase correctamente: "He ___ in Maputo and works for a logistics company."',
      isPortuguese: false,
      options: [
        { text: 'lives', points: 2 },
        { text: 'live', points: 0 },
        { text: 'living', points: 0 },
        { text: 'lived last year', points: 1 },
      ]
    },
    {
      id: 6,
      question: 'Vocabulário do dia-a-dia de negócios: Qual é a tradução correcta para a frase "I am looking for a job"?',
      isPortuguese: false,
      options: [
        { text: 'Estou à procura de uma casa.', points: 0 },
        { text: 'Estou à procura de um emprego/trabalho.', points: 2 },
        { text: 'Estou a ver fotos de viagens.', points: 0 },
        { text: 'Quero ligar para o meu chefe.', points: 0 },
      ]
    },
    {
      id: 7,
      question: 'Gramática comercial: Complete "We need to schedule the meeting. Can we do ___ tomorrow?"',
      isPortuguese: false,
      options: [
        { text: 'it', points: 2 },
        { text: 'its', points: 0 },
        { text: 'at', points: 0 },
        { text: 'them', points: 0 },
      ]
    },
    {
      id: 8,
      question: 'Prática de conversação: Qual das opções é mais educada para recusar uma oferta numa negociação profissional?',
      isPortuguese: false,
      options: [
        { text: 'No. No way.', points: 0 },
        { text: 'I am afraid we cannot accept that offer under these conditions.', points: 3 },
        { text: 'Get out, I dont want this.', points: 0 },
        { text: 'I say no now.', points: 1 },
      ]
    },
    {
      id: 9,
      question: 'Nível avançado: "By the time the project manager arrived, the team ___ finished compiled reports."',
      isPortuguese: false,
      options: [
        { text: 'already has', points: 1 },
        { text: 'had already', points: 3 },
        { text: 'is going to', points: 0 },
        { text: 'have being', points: 0 },
      ]
    }
  ];

  const handleSelectOption = (points: number, optionIdx: number) => {
    setAnswers({ ...answers, [currentQuestionIdx]: points });
  };

  const handleNextQuizStep = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Calculate total points and estimate level
      const totalPoints = Object.keys(answers).reduce((acc, key) => {
        return acc + (answers[Number(key)] || 0);
      }, 0);
      
      let level: EnglishLevel = 'beginner';
      if (totalPoints >= 15) {
        level = 'advanced';
      } else if (totalPoints >= 6) {
        level = 'intermediate';
      }

      setSuggestedLevel(level);
      setSelectedLevel(level);
      setStep('result');
    }
  };

  const currentQuestion = questions[currentQuestionIdx];
  const hasSelectedAns = answers[currentQuestionIdx] !== undefined;

  // Render Welcome Module
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between max-w-md mx-auto relative overflow-hidden font-sans">
        
        {/* Soft blob/wave shapes for depth */}
        <div className="absolute top-12 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-emerald-50/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Botanical Leaf Illustration (Bottom-Left) */}
        <div className="absolute bottom-[-15px] left-[-15px] w-40 h-40 opacity-[0.22] pointer-events-none select-none z-10">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M10,110 C35,100 50,75 55,45" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22,100 C12,88 24,80 28,82 C32,84 32,95 22,100 Z" fill="#10b981" />
            <path d="M30,88 C20,76 31,68 35,71 C39,74 38,84 30,88 Z" fill="#3b82f6" opacity="0.9" />
            <path d="M40,75 C30,62 42,55 46,58 C50,61 48,71 40,75 Z" fill="#059669" />
            <path d="M47,60 C38,48 48,41 52,44 C56,47 54,56 47,60 Z" fill="#60a5fa" opacity="0.8" />
            <path d="M52,44 C44,32 54,26 56,29 C58,32 58,40 52,44 Z" fill="#34d399" />
          </svg>
        </div>

        {/* Decorative Botanical Leaf Illustration (Bottom-Right) */}
        <div className="absolute bottom-[-15px] right-[-15px] w-40 h-40 opacity-[0.22] pointer-events-none select-none z-10">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M110,110 C85,100 70,75 65,45" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M98,100 C108,88 96,80 92,82 C88,84 88,95 98,100 Z" fill="#3b82f6" />
            <path d="M90,88 C100,76 89,68 85,71 C81,74 82,84 90,88 Z" fill="#10b981" opacity="0.9" />
            <path d="M80,75 C90,62 78,55 74,58 C70,61 72,71 80,75 Z" fill="#2563eb" />
            <path d="M73,60 C82,48 72,41 68,44 C64,47 66,56 73,60 Z" fill="#34d399" opacity="0.8" />
            <path d="M68,44 C76,32 66,26 64,29 C62,32 62,40 68,44 Z" fill="#60a5fa" />
          </svg>
        </div>

        {/* TOP BAR */}
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="w-5 h-5 flex items-center justify-center bg-blue-50 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          </div>
          <span className="text-xs font-black text-brand-navy-950 uppercase tracking-widest absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            Sabush English Club
          </span>
          <button
            onClick={handleLogOut}
            type="button"
            className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 font-bold transition-all bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer shadow-sm"
          >
            <div className="w-4 h-4 rounded-full bg-slate-200/80 flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-slate-600" />
            </div>
            <span>Sair</span>
            <LogOut className="w-3 h-3 text-slate-500" />
          </button>
        </header>

        {/* MAIN BODY */}
        <div className="flex-1 flex flex-col justify-center px-5 py-6 space-y-6 overflow-y-auto max-w-sm mx-auto w-full z-20">
          
          {/* HERO SECTION */}
          <div className="flex flex-col items-center text-center space-y-3 px-2">
            <SabushLogo size="md" onDark={false} className="shadow-sm border-slate-200" />
            
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-600 block" />
              <span className="text-[9px] text-blue-700 font-extrabold uppercase tracking-widest">
                SABUSH ENGLISH CLUB
              </span>
              <Sparkles className="w-3 h-3 text-blue-600 block" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-3xl font-black text-brand-navy-950 tracking-tight leading-none">
                Aprender Inglês
              </h1>
              <h2 className="text-3xl font-black text-blue-600 tracking-tight leading-none">
                Do Zero à Fluência
              </h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mt-1">
              Bem-vindo à primeira escola móvel desenhada para o quotidiano profissional de Moçambique.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="space-y-3 w-full">
            {/* Card 1 */}
            <div className="bg-blue-50/70 border border-blue-100/50 rounded-2xl p-4 flex items-start space-x-3.5 shadow-sm transition-all hover:scale-[1.01] hover:bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-extrabold text-brand-navy-950 uppercase tracking-wider">Aulas Inteligentes</h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Vocabulário com fonética figurada compreensível para si.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-2xl p-4 flex items-start space-x-3.5 shadow-sm transition-all hover:scale-[1.01] hover:bg-emerald-50">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/10">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-extrabold text-brand-navy-950 uppercase tracking-wider">Pronúncia Fácil</h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Ouça nativos offline sem gastar dados.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-amber-50/70 border border-amber-100/50 rounded-2xl p-4 flex items-start space-x-3.5 shadow-sm transition-all hover:scale-[1.01] hover:bg-amber-50">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/10">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-extrabold text-brand-navy-950 uppercase tracking-wider">Tutor Sabush com IA</h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Esclareça as suas dúvidas 24/7.</p>
              </div>
            </div>
          </div>

        </div>

        {/* CALL TO ACTION ACCENT */}
        <div className="p-5 space-y-3 z-20 w-full bg-white/70 backdrop-blur-md border-t border-slate-100">
          <button
            onClick={() => setStep('quiz')}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3.5 px-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-md flex items-center justify-between cursor-pointer min-h-[48px] shadow-blue-500/15"
          >
            <Rocket className="w-4 h-4 text-white" />
            <span className="flex-1 text-center">Fazer Teste de Nível</span>
            <ArrowRight className="w-5 h-5 text-white stroke-[3px]" />
          </button>
          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1 px-4 leading-relaxed">
            <span>💡 Dê o primeiro passo de 2 minutos para descobrir o seu nível ideal.</span>
          </p>
        </div>

      </div>
    );
  }

  // Render Placement Quiz Module
  if (step === 'quiz') {
    const progressPercent = Math.floor(((currentQuestionIdx) / questions.length) * 100);

    return (
      <div className="min-h-screen bg-white text-[#0f172a] flex flex-col justify-between max-w-md mx-auto font-sans relative">
        {/* Floating Logout Button */}
        <div className="absolute top-3.5 right-4 z-50">
          <button
            onClick={handleLogOut}
            type="button"
            className="text-[9px] text-[#ffffff]/80 hover:text-white bg-[#0f172a]/40 hover:bg-[#0f172a]/60 border border-[#ffffff]/10 px-2.5 py-1 rounded-lg cursor-pointer transition-all font-semibold flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>

        {/* Navy Header with progress indicators */}
        <div className="bg-brand-navy-800 text-white p-5 border-b border-brand-navy-900 shadow-md">
          <div className="flex items-center justify-between pb-3.5">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-brand-gold-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffffff]">Teste de Colocação</span>
            </div>
            <span className="text-xs bg-brand-gold-400 text-brand-navy-900 px-2.5 py-1 rounded-full font-black pr-14">
              Q{currentQuestionIdx + 1} de {questions.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-brand-navy-700 rounded-full overflow-hidden border border-brand-navy-800 shadow-inner">
            <div 
              className="h-full bg-brand-gold-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <div className="flex-1 p-5 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-brand-navy-50 text-brand-navy-800 px-3 py-1.5 rounded-xl border border-brand-navy-100">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
              <span className="text-[10.5px] font-bold uppercase tracking-wider">
                {currentQuestion.isPortuguese ? "Avaliação de Perfil" : "Gramática e Compreensão"}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-brand-navy-900 leading-snug tracking-tight">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Interactive Multiple Choice options */}
          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((opt, oIdx) => {
              const matchesSelected = answers[currentQuestionIdx] === opt.points;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(opt.points, oIdx)}
                  type="button"
                  className={`w-full py-4 px-4.5 rounded-2xl text-left text-xs font-bold border-2 transition-all flex items-center justify-between min-h-[52px] select-none cursor-pointer ${
                    matchesSelected
                      ? 'bg-brand-gold-50 border-brand-gold-500 text-brand-gold-900 font-extrabold shadow-[0_4px_12px_rgba(220,167,16,0.15)]'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="leading-relaxed flex-1 pr-1">{opt.text}</span>
                  {matchesSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-gold-500 flex items-center justify-center text-brand-navy-900 text-[10px] font-black shrink-0 ml-1.5">✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer actions with Large targets */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleQuizBack}
            className="px-4 py-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Voltar</span>
          </button>
          
          <button
            disabled={!hasSelectedAns}
            onClick={handleNextQuizStep}
            className={`flex-1 py-4 rounded-xl text-sm font-extrabold tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer min-h-[48px] ${
              hasSelectedAns
                ? 'bg-brand-navy-800 text-brand-gold-400 font-extrabold shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40'
            }`}
          >
            <span>{currentQuestionIdx < questions.length - 1 ? "Próxima Pergunta" : "Finalizar & Ver Nível"}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>
      </div>
    );
  }

  // Result Selection Override Screen
  if (step === 'result') {
    const levelDetails = {
      beginner: {
        title: 'Iniciante (Beginner Level)',
        desc: 'Recomendamos iniciar do absoluto zero para consolidar regras de fonética, pequenos diálogos de apresentação diária, e o uso de "To Be".',
        icon: Compass,
      },
      intermediate: {
        title: 'Intermediário (Intermediate Level)',
        desc: 'Para fins de comércio, negócios básicos e reuniões em escritórios. Melhorar vocabulário técnico e e-mails profissionais rápidos.',
        icon: Building2,
      },
      advanced: {
        title: 'Avançado (Advanced Level)',
        desc: 'Gostou do desafio! Foco em entrevistas para ONGs em Maputo ou liderança de equipas internacionais, expressão formal complexa e gramática estruturada.',
        icon: Globe2,
      }
    };

    const details = levelDetails[selectedLevel];
    const SuggestedIcon = levelDetails[suggestedLevel].icon;

    return (
      <div className="min-h-screen bg-slate-50 text-[#0f172a] flex flex-col justify-between max-w-md mx-auto font-sans p-6 relative">
        {/* Floating Logout Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogOut}
            type="button"
            className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-200/50 hover:bg-slate-200 border border-slate-300/30 px-3 py-1.5 rounded-xl cursor-pointer transition-all font-semibold flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="flex justify-center flex-col items-center text-center space-y-3">
            <Mascot expression="happy" size="lg" />
            <span className="text-[10px] bg-brand-gold-100 text-brand-gold-800 px-3 py-1 rounded-full font-black uppercase tracking-wider block">
              Resultado Calculado
            </span>
            <h2 className="text-xl font-extrabold text-brand-navy-900 tracking-tight leading-snug px-3">
              O seu nível sugerido é: <br />
              <span className="text-brand-gold-600 font-black">{levelDetails[suggestedLevel].title}</span>
            </h2>
          </div>

          {/* Sugg explanation box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-center">
            <div className="inline-flex p-3 bg-brand-navy-800 text-brand-gold-400 rounded-2xl mx-auto">
              <SuggestedIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Com base no seu perfil de contacto e acerto nas respostas práticas, recomendamos iniciar no nível <strong>{suggestedLevel === 'beginner' ? 'Iniciante' : suggestedLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}</strong>.
            </p>
          </div>

          {/* Explicit Manual Choice toggler to let them confirm or change level */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block text-center">Deseja mudar o nível sugerido? Selecione:</span>
            
            <div className="grid grid-cols-1 gap-2.5">
              {(['beginner', 'intermediate', 'advanced'] as EnglishLevel[]).map((lvl) => {
                const isChosen = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center space-x-3 cursor-pointer ${
                      isChosen
                        ? 'border-brand-gold-500 bg-white text-brand-navy-950 font-black shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-500'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isChosen ? 'bg-brand-navy-800 text-brand-gold-400' : 'bg-slate-100 text-slate-400'}`}>
                      {lvl === 'beginner' ? <Compass className="w-4 h-4" /> : lvl === 'intermediate' ? <Building2 className="w-4 h-4" /> : <Globe2 className="w-4 h-4" />}
                    </div>
                    <div className="text-xs flex-1">
                      <span className="block font-semibold tracking-tight leading-none">
                        Nível {lvl === 'beginner' ? 'Iniciante' : lvl === 'intermediate' ? 'Intermediário' : 'Avançado'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {lvl === 'beginner' ? 'Para saudações e do zero' : lvl === 'intermediate' ? 'Inglês corporativo e comércio' : 'Fluência e emprego global'}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChosen ? 'border-brand-gold-500 bg-brand-gold-400 text-white' : 'border-slate-300'}`}>
                      {isChosen && <div className="w-2 h-2 bg-brand-navy-900 rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="pt-4 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              setStep('quiz');
              setCurrentQuestionIdx(questions.length - 1);
            }}
            className="px-4 py-3.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Voltar</span>
          </button>
          
          <button
            onClick={() => setStep('goal')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer min-h-[44px]"
          >
            <span>Confirmar Nível &amp; Continuar</span>
            <ArrowRight className="w-4 h-4 text-white stroke-[2.5px]" />
          </button>
        </div>
      </div>
    );
  }

  // Choose primary goal for study context
  if (step === 'goal') {
    const goals = [
      { id: 'work', label: 'Trabalho & Melhores Carreiras', info: 'Para multinacionais, ONGs locais, ou comércio diário.', icon: Briefcase },
      { id: 'travel', label: 'Viagens & Turismo', info: 'Para hotelaria, guias turísticos e receber visitantes em Moçambique.', icon: Plane },
      { id: 'studies', label: 'Estudos & Investigação', info: 'Para bolsas, mestrados e materiais de alta tecnologia.', icon: GraduationCap },
      { id: 'conversation', label: 'Conversação & Vida Diária', info: 'Mais focado em interagir no estrangeiro de forma informal.', icon: MessageCircle },
    ];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between max-w-md mx-auto font-sans p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-50 bg-opacity-70 rounded-full blur-3xl animate-pulse" />

        {/* Floating Logout Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogOut}
            type="button"
            className="text-[10px] text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border border-slate-300/50 px-3 py-1.5 rounded-xl cursor-pointer transition-all font-semibold flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Sair da Conta</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-3xl border border-blue-200/50 shadow-inner">
              <Award className="w-8 h-8 fill-blue-600/30 text-blue-600 animate-pulse block" />
            </div>
            <h2 className="text-xl font-black text-brand-navy-950 tracking-tight leading-snug">
              Qual é o seu principal objectivo ao aprender inglês?
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Iremos partilhar sugestões focadas no seu quotidiano para personalizar melhor a sua viagem no Sabush Club.
            </p>
          </div>

          {/* Goals Selection list */}
          <div className="space-y-2.5">
            {goals.map((g) => {
              const GoalIcon = g.icon;
              const isSelected = selectedGoal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-white text-brand-navy-950 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-150 text-slate-500'}`}>
                    <GoalIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-extrabold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{g.label}</h4>
                    <p className="text-[10px] text-slate-400 leading-snug mt-1">{g.info}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Final Trigger buttons */}
        <div className="pt-4 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setStep('result')}
            className="px-4 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Voltar</span>
          </button>
          
          <button
            onClick={() => setStep('whatsapp')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center space-x-2.5 cursor-pointer min-h-[48px]"
          >
            <span>Confirmar &amp; Continuar</span>
            <ArrowRight className="w-5 h-5 text-white stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'whatsapp') {
    const handleFinalize = () => {
      let cleanPhone = whatsappNum.trim().replace(/\s+/g, '');
      if (!cleanPhone) {
        onComplete(selectedLevel, selectedGoal);
        return;
      }
      
      if (cleanPhone.length === 9 && (cleanPhone.startsWith('82') || cleanPhone.startsWith('83') || cleanPhone.startsWith('84') || cleanPhone.startsWith('85') || cleanPhone.startsWith('86') || cleanPhone.startsWith('87'))) {
        cleanPhone = '+258' + cleanPhone;
      }
      
      if (!/^\+[1-9]\d{1,14}$/.test(cleanPhone)) {
        setWhatsappErr('Número inválido. Insira com o indicativo do país (ex: +258 84 000 0000) ou deixe em branco.');
        return;
      }

      onComplete(selectedLevel, selectedGoal, cleanPhone, whatsappOptIn);
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between max-w-md mx-auto font-sans p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-50 bg-opacity-70 rounded-full blur-3xl animate-pulse" />

        {/* Floating Logout Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogOut}
            type="button"
            className="text-[10px] text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border border-slate-300/50 px-3 py-1.5 rounded-xl cursor-pointer transition-all font-semibold flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Sair da Conta</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-200/50 shadow-inner">
              <MessageCircle className="w-8 h-8 text-emerald-600 animate-bounce block" />
            </div>
            <h2 className="text-xl font-black text-brand-navy-950 tracking-tight leading-snug">
              Ativar Alertas Diários no WhatsApp? 🇲🇿🦉
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Como as notificações do navegador falham frequentemente em Moçambique, o WhatsApp é o canal mais fiável para receber a <strong>Palavra do Dia</strong> e manter o seu streak vivo!
            </p>
          </div>

          <div className="space-y-4">
            {whatsappErr && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 rounded-xl leading-snug">
                ⚠️ {whatsappErr}
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4 shadow-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Número do WhatsApp (Opcional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: +258 84 123 4567"
                    value={whatsappNum}
                    onChange={(e) => {
                      setWhatsappNum(e.target.value);
                      setWhatsappErr(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
                <p className="text-[9.5px] text-slate-450 font-semibold leading-relaxed">
                  Se digitar apenas os 9 dígitos de Moçambique, adicionamos o prefixo (+258) automaticamente.
                </p>
              </div>

              {whatsappNum.trim() && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10.5px] font-bold text-slate-650">
                    Desejo receber os lembretes por WhatsApp
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={whatsappOptIn}
                      onChange={(e) => setWhatsappOptIn(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action triggers */}
        <div className="pt-4 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setStep('goal')}
            className="px-4 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Voltar</span>
          </button>
          
          <button
            onClick={handleFinalize}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center space-x-2.5 cursor-pointer min-h-[48px]"
          >
            <span>{whatsappNum.trim() ? 'Conectar & Entrar' : 'Pular & Finalizar'}</span>
            <ArrowRight className="w-5 h-5 text-white stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
