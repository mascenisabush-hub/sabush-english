/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Flame, 
  Lock, 
  MapPin, 
  Mic, 
  Play, 
  Plus, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Star, 
  Trophy, 
  Volume2, 
  X, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BEGINNER_LESSONS } from '../lessons/beginner';
import { syncProgress, createAndSaveCertificate, auth } from '../firebase';
import confetti from 'canvas-confetti';

interface ConfidencePathProps {
  currentDay: number;
  completedDays: number[];
  onCompleteDay: (day: number, earnedXp: number) => void;
  onGoBack: () => void;
  onEarnXp: (amount: number) => void;
  userProfile: any;
  refetchProfile: () => void;
  setActiveTab: (tab: string) => void;
}

export type DayActivityType = 'vocab' | 'grammar' | 'shadowing' | 'roleplay' | 'leitner';

export interface PathModule {
  id: number;
  name: string;
  days: number[]; // e.g. [1, 2, 3, 4, 5]
  lessonIds: string[]; // beginner lesson ids
  grammarFocus: string;
  vocabFocus: string;
  pronunciationGym?: string;
  milestones: string[];
}

const PATH_MODULES: PathModule[] = [
  {
    id: 1,
    name: "Greetings & Personal Introductions",
    days: [1, 2, 3, 4, 5],
    lessonIds: ["beg-1", "beg-2"],
    grammarFocus: "Introdução à conjugação do Verb To Be em perguntas pessoais simples.",
    vocabFocus: "Cumprimentos do dia-a-dia, perguntas de bem-estar e saudações comuns.",
    pronunciationGym: "Liaison (Ligação de Palavras): No inglês falado nativo, consoantes no fim de palavras ligam-se às vogais da palavra seguinte. Por exemplo, em 'My name is...' o som final /m/ junta-se ao /i/ resultando em /namiz/.",
    milestones: [
      "Apresentar o meu nome e responder a saudações",
      "Perguntar 'How are you?' e responder de forma natural",
      "Pronunciar 'Nice to meet you' com facilidade"
    ]
  },
  {
    id: 2,
    name: "Jobs & Nationalities",
    days: [6, 7, 8, 9, 10],
    lessonIds: ["beg-3", "beg-24"],
    grammarFocus: "Conexões básicas com 'from' e o uso de artigos indefinidos ('a' / 'an') para cargos.",
    vocabFocus: "Países, nacionalidades e profissões comuns do escritório (manager, driver, programmer).",
    milestones: [
      "Responder 'I am from...' e perguntar 'Where are you from?'",
      "Descrever o meu cargo profissional ('I am a manager')",
      "Diferenciar o uso de 'a' e 'an' antes de cargos de trabalho"
    ]
  },
  {
    id: 3,
    name: "Daily Circle & Cortesia",
    days: [11, 12, 13, 14, 15],
    lessonIds: ["beg-4", "beg-5"],
    grammarFocus: "Uso correto de imperativos educados e termos de transição social.",
    vocabFocus: "Expressões de cortesia: 'please', 'thank you', 'excuse me' e 'good morning/afternoon'.",
    milestones: [
      "Usar 'please' e 'thank you' de forma automática",
      "Cumprimentar pessoas dependendo do período do dia",
      "Pedir licença usando 'excuse me' com polidez"
    ]
  },
  {
    id: 4,
    name: "Spelling & Alfabeto",
    days: [16, 17, 18, 19, 20],
    lessonIds: ["beg-6", "beg-9"],
    grammarFocus: "Diferenciação fonética de consoantes e vogais chaves em inglês.",
    vocabFocus: "Alfabeto inglês, soletração de nomes, e-mails, símbolos '@' (at) e '.' (dot).",
    milestones: [
      "Soletrar o meu próprio nome e apelido sem hesitar",
      "Ditar um e-mail profissional de forma fluida",
      "Reconhecer letras confusas como G/J e Y ao telefone"
    ]
  },
  {
    id: 5,
    name: "Schedules & Numbers",
    days: [21, 22, 23, 24, 25],
    lessonIds: ["beg-7", "beg-8"],
    grammarFocus: "Distinção de acentuação entre dezenas (-ty) e numeração adolescente (-teen).",
    vocabFocus: "Números de 1 a 100, numeração de contacto, quantidades de trabalho e valores básicos.",
    milestones: [
      "Diferenciar perfeitamente 'thirty' de 'thirteen' na fala e audição",
      "Ditar números de telefone e dados numéricos rápidos",
      "Expressar preços e valores básicos com facilidade"
    ]
  },
  {
    id: 6,
    name: "Plurals & Counting Items",
    days: [26, 27, 28, 29, 30],
    lessonIds: ["beg-10"],
    grammarFocus: "Sufixos regulares e irregulares de plural, diferenciação de quantidades.",
    vocabFocus: "Nomes de objetos comuns de escritório e contagem física de inventário.",
    milestones: [
      "Formar plurais de itens comuns de escritório",
      "Contar quantidades de inventário com segurança",
      "Diferenciar singular e plural em diálogos reais"
    ]
  },
  {
    id: 7,
    name: "Preferences & Identificações",
    days: [31, 32, 33, 34, 35],
    lessonIds: ["beg-12"],
    grammarFocus: "Frases de preferência e estados com To Be na forma negativa e interrogativa.",
    vocabFocus: "Adjetivos de estado, preferências de reuniões e identificação de equipa.",
    milestones: [
      "Formular negações fluidas usando 'is not/are not'",
      "Perguntar states e preferências de outros ('Are you busy?')",
      "Usar contrações como 'he's' e 'they're' na fala do dia-a-dia"
    ]
  },
  {
    id: 8,
    name: "Weather & Comunicação Essencial",
    days: [36, 37, 38, 39, 40],
    lessonIds: ["beg-11"],
    grammarFocus: "Conjugação primária do verbo To Be no singular e pronomes pessoais centrais.",
    vocabFocus: "Estruturas meteorológicas simples ('It is hot/cold') e descrição de ambientes.",
    milestones: [
      "Dominar o uso de 'am/is/are' na primeira e terceira pessoa",
      "Descrever o estado de clima no escritório em Maputo",
      "Formular frases básicas de identificação estrutural"
    ]
  },
  {
    id: 9,
    name: "The Verb 'To Have' & Possessão",
    days: [41, 42, 43, 44, 45],
    lessonIds: ["beg-13"],
    grammarFocus: "Uso com 'have/has' e negações corretas com 'don't have'.",
    vocabFocus: "Objetos pessoais, ativos tecnológicos e ferramentas de uso quotidiano.",
    milestones: [
      "Descrever o equipamento que uso ('I have a laptop')",
      "Negar posses usando 'don't have' de forma polida",
      "Utilizar 'has' correctamente para terceira pessoa do singular"
    ]
  },
  {
    id: 10,
    name: "Office Work & Regular Verbs",
    days: [46, 47, 48, 49, 50],
    lessonIds: ["beg-14"],
    grammarFocus: "Construção de frases afirmativas regulares com verbos do dia-a-dia.",
    vocabFocus: "Ações de escritório comuns como 'send', 'write', 'call', 'work', e 'meet'.",
    milestones: [
      "Descrever as minhas tarefas diárias em inglês",
      "Conjugar verbos comuns na primeira pessoa",
      "Formar estruturas ativas sobre o trabalho com fluidez"
    ]
  },
  {
    id: 11,
    name: "Workspace & Interações Sociais",
    days: [51, 52, 53, 54, 55],
    lessonIds: ["beg-15", "beg-16"],
    grammarFocus: "Sintaxe de perguntas com auxiliares 'Do' e 'Does' e imperativos de navegação.",
    vocabFocus: "Perguntas de rotina profissional, termos de orientação de direções físicas.",
    milestones: [
      "Perguntar se alguém fala inglês ('Do you speak English?')",
      "Formular pedidos de ajuda direta ('Can you help me?') ou 'Where is...?'",
      "Compreender instruções para chegar a um destino público"
    ]
  },
  {
    id: 12,
    name: "Navigation & Transações Comerciais",
    days: [56, 57, 58, 59, 60],
    lessonIds: ["beg-17"],
    grammarFocus: "Uso de quantificadores chaves 'much' e 'many' e números monetários.",
    vocabFocus: "Ingredientes locais, preços, trocos, negociações e compras em mercados.",
    milestones: [
      "Perguntar preços de produtos usando 'How much is it?'",
      "Compreender nomes de alimentos e ingredientes comuns",
      "Simular uma negociação monetária simples com troco"
    ]
  },
  {
    id: 13,
    name: "Café & Pedidos Práticos",
    days: [61, 62, 63, 64, 65],
    lessonIds: ["beg-18"],
    grammarFocus: "Modais de solicitação polida ('I would like', 'Can I have').",
    vocabFocus: "Bebidas (tea, coffee, juice, water), comidas rápidas e termos de restaurante.",
    milestones: [
      "Fazer um pedido num café de forma exemplar",
      "Evitar o exigente 'I want' e priorizar 'I would like'",
      "Pedir a conta no final ('Can I have the bill, please?')"
    ]
  },
  {
    id: 14,
    name: "Days of the Week & Schedules",
    days: [66, 67, 68, 69, 70],
    lessonIds: ["beg-19"],
    grammarFocus: "Preposições de tempo correto 'on' antes dos dias semanais e prazos limite.",
    vocabFocus: "Dias da semana (Monday a Sunday), expressão de prazos e planeamento informal.",
    milestones: [
      "Listar e pronunciar com fluência os sete dias da semana",
      "Formular frases com preposições temporais ('on Friday')",
      "Agendar ou remarcar uma data simples de entrega"
    ]
  },
  {
    id: 15,
    name: "Telling Time & Hours",
    days: [71, 72, 73, 74, 75],
    lessonIds: ["beg-20"],
    grammarFocus: "Expressão horária básica e o uso de preposição 'at' para marcar horas.",
    vocabFocus: "Leitura de relógio, horários AM/PM, e termos de agendamento de reuniões.",
    milestones: [
      "Perguntar 'What time is it?' e expressar as horas exatas",
      "Agendar um compromisso especificando a hora ('at 3 PM')",
      "Saber diferenciar AM e PM em reuniões internacionais"
    ]
  },
  {
    id: 16,
    name: "Family & Relationships",
    days: [76, 77, 78, 79, 80],
    lessonIds: ["beg-21"],
    grammarFocus: "Pronomes possessivos determinantes (my, your, his, her, our, their).",
    vocabFocus: "Membros do círculo familiar próximo e conversas de aproximação interpessoal.",
    milestones: [
      "Falar sobre os membros do meu agregado de forma organizada",
      "Usar corretamente os pronomes possessivos 'his' e 'her'",
      "Entender diálogos sobre relações interpessoais e de convivência"
    ]
  },
  {
    id: 17,
    name: "Daily Routines & Free Time",
    days: [81, 82, 83, 84, 85],
    lessonIds: ["beg-22", "beg-23"],
    grammarFocus: "Presente Simples completo, advérbios de frequência (always, usually, never) e gerúndios de hobby.",
    vocabFocus: "Ações de rotina quotidiana, atividades de lazer, desportos e hobbies ao fim-de-semana.",
    milestones: [
      "Narrar a minha rotina habitual de trabalho de ponta a ponta",
      "Usar advérbios de frequência de maneira natural na frase",
      "Explicar de forma envolvente as minhas atividades favoritas de lazer"
    ]
  },
  {
    id: 18,
    name: "Conversational Mastery & Graduation",
    days: [86, 87, 88, 89, 90],
    lessonIds: ["beg-25"],
    grammarFocus: "Sintetização de todos os tempos estudados e interligações para conversas integradas.",
    vocabFocus: "Diálogos completos de negócios, revisão integrada e feedback conversacional.",
    milestones: [
      "Manter um diálogo em inglês de forma contínua por 5 minutos",
      "Integrar saudações, números, rotinas e direções em uma única conversa",
      "Graduar-se com orgulho no Caminho da Confiança! 🎓"
    ]
  }
];

export function ConfidencePath({ 
  currentDay, 
  completedDays, 
  onCompleteDay, 
  onGoBack, 
  onEarnXp, 
  userProfile, 
  refetchProfile,
  setActiveTab
}: ConfidencePathProps) {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [isStudyModeActive, setIsStudyModeActive] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Day study step tracker
  const [activeDayStep, setActiveDayStep] = useState<DayActivityType>('vocab');
  
  // "Recuperar Dia" catcher popup state
  const [showCatchupModal, setShowCatchupModal] = useState<boolean>(false);
  const [catchupTargetDay, setCatchupTargetDay] = useState<number | null>(null);

  // Lesson data hook loaders
  const [activeLesson, setActiveLesson] = useState<any>(null);

  // Quiz interactive elements
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [checkedAns, setCheckedAns] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Shadowing elements
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);
  const [shadowSuccess, setShadowSuccess] = useState<boolean>(false);

  // Mocho chat elements (Day 4)
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [roleplayState, setRoleplayState] = useState<'intro' | 'chatting' | 'feedback'>('intro');
  const [isMochoTyping, setIsMochoTyping] = useState<boolean>(false);

  // Leitner checklist items
  const [checklistTicked, setChecklistTicked] = useState<{ [id: string]: boolean }>({});
  const [leitnerFlashAnswers, setLeitnerFlashAnswers] = useState<{ [wordEn: string]: 'correct' | 'wrong' }>({});
  const [currentLeitnerIndex, setCurrentLeitnerIndex] = useState<number>(0);
  const [flippedFlashcard, setFlippedFlashcard] = useState<boolean>(false);

  // Speak word TTS helper
  const handleSpeakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85; // slightly slower for better comprehensibility
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech Synthesis error:", e);
    }
  };

  // Find which module contains target day
  const getModuleForDay = (day: number) => {
    return PATH_MODULES.find(m => m.days.includes(day)) || PATH_MODULES[0];
  };

  const currentModule = getModuleForDay(currentDay);

  // Pre-load lesson details when studying a day
  useEffect(() => {
    if (selectedDay) {
      const module = getModuleForDay(selectedDay);
      // Determine lessonId based on day index in module. If there are 2 lessons, use the second one for days 3, 4, 5
      const dayIndexInModule = ((selectedDay - 1) % 5) + 1;
      let targetLessonId = module.lessonIds[0];
      if (module.lessonIds.length > 1 && dayIndexInModule > 2) {
        targetLessonId = module.lessonIds[1];
      }
      const foundLesson = BEGINNER_LESSONS.find(l => l.id === targetLessonId) || BEGINNER_LESSONS[0];
      setActiveLesson(foundLesson);
      
      // determine day activity type based on day index in the module (1 to 5)
      let initialStep: DayActivityType = 'vocab';
      if (dayIndexInModule === 1) initialStep = 'vocab';
      else if (dayIndexInModule === 2) initialStep = 'grammar';
      else if (dayIndexInModule === 3) initialStep = 'shadowing';
      else if (dayIndexInModule === 4) initialStep = 'roleplay';
      else if (dayIndexInModule === 5) initialStep = 'leitner';
      
      setActiveDayStep(initialStep);
      
      // Reset study sub-components state
      setCurrentQuizIndex(0);
      setSelectedAns(null);
      setCheckedAns(false);
      setQuizScore(0);
      setQuizFinished(false);
      setIsRecording(false);
      setHasRecorded(false);
      setShadowSuccess(false);
      setChatMessages([]);
      setRoleplayState('intro');
      setChecklistTicked({});
      setLeitnerFlashAnswers({});
      setCurrentLeitnerIndex(0);
      setFlippedFlashcard(false);
    }
  }, [selectedDay]);

  // Set the default expanded active module accordion on load
  useEffect(() => {
    setActiveModuleId(currentModule.id);
  }, [currentDay]);

  // Handle confirming "Recuperar Dia Perdido"
  const handleConfirmCatchup = () => {
    if (catchupTargetDay) {
      // In a friendly, forgiving way, directly set this as currentDay and unlock it!
      const syncObj: any = { currentConfidenceDay: catchupTargetDay };
      if (auth.currentUser) {
        syncProgress(auth.currentUser.uid, syncObj);
      }
      localStorage.setItem('sabush_guided_day', String(catchupTargetDay));
      refetchProfile();
      setSelectedDay(catchupTargetDay);
      setIsStudyModeActive(true);
      setShowCatchupModal(false);
    }
  };

  // Launch a day simulation or direct click
  const handleDaySelect = (day: number) => {
    // Check if the day is completed, active or locked
    const isActive = day === currentDay;
    const isCompleted = completedDays.includes(day);
    // TEMP: all days unlocked for free testing, so just open the day directly.
    // Restore the line below to re-enable the catch-up flow for locked days.
    // const isLocked = day > currentDay && !isCompleted;
    const isLocked = false;

    if (isCompleted || isActive || !isLocked) {
      setSelectedDay(day);
      setIsStudyModeActive(true);
    } else if (isLocked) {
      // Show informative catch-up helper
      setCatchupTargetDay(day);
      setShowCatchupModal(true);
    }
  };

  // Submit absolute day completion
  const handleDayCompletedSubmit = async () => {
    if (!selectedDay) return;
    
    // Calculate XP
    const dayIndexInModule = ((selectedDay - 1) % 5) + 1;
    let earnedXp = 20;
    if (dayIndexInModule === 2) earnedXp = 25;
    else if (dayIndexInModule === 3) earnedXp = 30;
    else if (dayIndexInModule === 4) earnedXp = 35;
    else if (dayIndexInModule === 5) earnedXp = 50;

    // Trigger local completion handler
    onCompleteDay(selectedDay, earnedXp);

    // If Day 90 is completed, trigger direct graduation!
    if (selectedDay === 90) {
      triggerConfettiShow();
    }

    setIsStudyModeActive(false);
    setSelectedDay(null);
  };

  const triggerConfettiShow = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Chat conversation scenarios for Mocho in Day 4
  const startMochoChat = () => {
    setRoleplayState('chatting');
    const introMsg = activeLesson?.speakingScenario?.promptPt || "Olá! Eu sou o Mocho. Pronto para praticar?";
    setChatMessages([
      {
        id: 'mocho-1',
        role: 'model',
        text: `🦉 **[ATIVIDADE DA CONFIANÇA - MODO ROLEPLAY]**\n\n*Mocho está a interpretar o teu interlocutor no diálogo do Aeroporto/Escritório.*\n\n"${activeLesson?.dialogue[0]?.textEn || "Hello! It is great to see you. Tell me, what is your name?"}"\n\n*(Tradução rápida de apoio: "${activeLesson?.dialogue[0]?.textPt || ""}")*`
      }
    ]);
  };

  const handleSendChatMessage = () => {
    if (!userInput.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userInput
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsMochoTyping(true);

    // Simulate supportive adaptive response after 1 second
    setTimeout(() => {
      let replyText = "";
      // Construct customized feedback replies based on lesson content
      if (selectedDay && selectedDay <= 5) {
        replyText = "Nice to meet you! Where are you traveling from today? (Grave ou escreva a sua resposta!)";
      } else if (selectedDay && selectedDay <= 10) {
        replyText = "Great spelling! Got it. Can you confirm your phone number too, please?";
      } else {
        replyText = "Fascinating response! That sounds brilliant. Let's practice a bit more. Tell me, do you have any other question about this dialogue?";
      }

      const mochoReply = {
        id: `mocho-${Date.now()}`,
        role: 'model',
        text: `🦉 **Mocho:** "${replyText}"`
      };

      setChatMessages(prev => [...prev, mochoReply]);
      setIsMochoTyping(false);

      // If they had 3 turns, offer to complete
      if (chatMessages.length >= 4) {
        // Automatically proceed to assessment report
        setTimeout(() => {
          setRoleplayState('feedback');
          onEarnXp(15);
        }, 800);
      }
    }, 1200);
  };

  // Spaced repetition flip vocabulary terms
  const activeVocabItem = activeLesson?.vocabulary[currentLeitnerIndex] || { en: 'Welcome', pt: 'Bem-vindo', pronunciation: 'Uélcam' };

  const handleLeitnerAnswer = (correct: boolean) => {
    setLeitnerFlashAnswers(prev => ({
      ...prev,
      [activeVocabItem.en]: correct ? 'correct' : 'wrong'
    }));
    
    // Toggle flip off
    setFlippedFlashcard(false);

    // Move next or finalize
    if (activeLesson && currentLeitnerIndex < activeLesson.vocabulary.length - 1) {
      setCurrentLeitnerIndex(prev => prev + 1);
    } else {
      // Finished all vocabulary reviews in flashcard format
    }
  };

  // Checklist handler
  const handleMilestoneCheck = (idx: number) => {
    setChecklistTicked(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const isChecklistFullyChecked = () => {
    const module = getModuleForDay(selectedDay || currentDay);
    return module.milestones.every((_, idx) => !!checklistTicked[idx]);
  };

  // Determine lesson count completed inside the guided track
  const percentGuidedComplete = Math.min(100, Math.round((completedDays.length / 90) * 100));

  // Simulating speaker feedback record
  const simulateShadowingRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      setShadowSuccess(true);
      onEarnXp(10);
    }, 2500);
  };

  // Setup simulated diploma generation at Day 90 completion
  const handleCertificateCreation = async () => {
    const certCode = `SABUSH-CONF-90-${Math.floor(1000 + Math.random() * 9000)}`;
    const guestUser = auth.currentUser ? auth.currentUser.displayName || "Estudante Sabush" : "Estudante da Confiança";
    try {
      if (auth.currentUser) {
        await createAndSaveCertificate(auth.currentUser.uid, guestUser);
      } else {
        const dummyCert = {
          certificateId: `cert_${Date.now()}`,
          userId: 'guest_user_123',
          userName: guestUser,
          uniqueCode: certCode,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem('sabush_guest_certificate', JSON.stringify(dummyCert));
      }
      triggerConfettiShow();
      setActiveTab('progress'); // direct view certificate badge
    } catch (e) {
      console.warn("Cert gen err", e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* 
         =========================================
         CATCH-UP CONFIDENCE MODAL (Forgiving & Gentle "Recuperar Dia")
         =========================================
      */}
      <AnimatePresence>
        {showCatchupModal && (
          <div className="fixed inset-0 bg-[#0c1322]/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-blue-600">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Recuperar Dia Perdido?</h3>
              
              <div className="bg-blue-50/70 py-3.5 px-4 rounded-2xl border border-blue-100 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl">🦉</span>
                  <p className="text-xs text-blue-900 leading-relaxed font-semibold">
                    "Olá! No Sabush, a consistência é o mais importante, mas sabemos que a vida no dia e dia em Moçambique é atarefada. Não se preocupe!"
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-bold">
                  Queres saltar/atualizar o seu calendário de estudos para o **Dia {catchupTargetDay}** e continuar os treinos já?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmCatchup}
                  className="flex-1 py-3 bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-xl text-xs font-black cursor-pointer shadow-sm transition-colors min-h-[44px]"
                >
                  ⚡ Confirmar & Avançar
                </button>
                <button
                  onClick={() => setShowCatchupModal(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-colors min-h-[44px]"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
         =========================================
         WORKSPACE/STUDY SCENARIOS (Focus Screen)
         =========================================
      */}
      {isStudyModeActive && selectedDay && activeLesson && (
        <div className="bg-slate-50 min-h-screen inset-y-0 fixed z-[100] max-w-md md:max-w-4xl w-full bg-white md:bg-slate-50 border-x border-slate-200 shadow-2xl p-4 sm:p-6 overflow-y-auto overflow-x-hidden left-1/2 -translate-x-1/2">
          
          {/* Workspace Sticky Header */}
          <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-4">
            <button 
              onClick={() => setIsStudyModeActive(false)}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-extrabold cursor-pointer py-1.5 px-2 bg-slate-100/80 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.3]" />
              <span>Sair do Treino</span>
            </button>
            <div className="text-center">
              <span className="text-[9.5px] font-black uppercase tracking-widest text-[#1e3a8a] bg-blue-50 px-2.5 py-0.5 rounded-full block border border-blue-100">
                Dia {selectedDay} de 90 • {currentModule.name}
              </span>
            </div>
            <div className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-brand-red-500 stroke-brand-red-650" />
              <span>Dia {((selectedDay - 1) % 5) + 1}/5</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-semibold mb-5 -mt-2 leading-relaxed text-center">
            Módulo focado em: <strong>{activeLesson.title}</strong> ({activeLesson.titlePt})
          </p>

          {/* RHYTHMIC DAY 1 WORKSPACE: Vocabulary + Dialogue */}
          {activeDayStep === 'vocab' && (
            <div className="space-y-6">
              <div className="bg-blue-600 text-white rounded-2xl p-5 border border-blue-500/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <h3 className="font-black text-base flex items-center gap-1.5 mb-1 text-white">
                  <Volume2 className="w-5 h-5 stroke-[2.3]" />
                  <span>Passo 1: Vocabulário Interativo do Quotidiano</span>
                </h3>
                <p className="text-xs text-slate-100 leading-relaxed font-semibold">
                  Familiarize-se com os termos de alta frequência deste módulo. Toque em qualquer cartão para ouvir a pronúncia correta em voz alta e treine a repetição sozinho(a).
                </p>
              </div>

              {/* Vocabulary Grid with dynamic phonetic rendering */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeLesson.vocabulary.map((vocab: any, idx: number) => (
                  <div 
                    key={idx}
                    className="bg-white p-4.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 cursor-pointer shadow-sm flex items-center justify-between group transition-all"
                  >
                    <div className="space-y-1 flex-1 pr-2">
                      <span className="text-xs text-indigo-600 font-black uppercase tracking-widest block">Inglês</span>
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {vocab.en}
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="text-[10px] text-slate-400 font-mono font-medium">/{vocab.pronunciation}/</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-800 font-extrabold px-1.5 rounded uppercase tracking-wider">
                          {vocab.pt}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSpeakText(vocab.en)}
                      className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-105 hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-inner"
                      title="Ouvir"
                    >
                      <Volume2 className="w-4.5 h-4.5 stroke-[2.2]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Readable Dialogue section */}
              <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Diálogo Prático Situacional</span>
                  </h4>
                  <span className="text-[10px] bg-slate-200/85 text-slate-600 font-black px-2.5 py-0.5 rounded-full block uppercase">
                    Interativo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold italic -mt-1">
                  {activeLesson.dialoguePt} (Toque em qualquer caixa de texto em inglês para escutar!)
                </p>

                <div className="space-y-3.5">
                  {activeLesson.dialogue.map((line: any, idx: number) => (
                    <div 
                      key={idx}
                      onClick={() => handleSpeakText(line.textEn)}
                      className="bg-white p-4 rounded-2xl border border-slate-200/60 hover:border-indigo-400 cursor-pointer shadow-xs transition-transform hover:-translate-y-0.5 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-2 border-b border-dashed border-slate-100 pb-1 mb-1.5">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mb-0.5">
                          {line.speaker}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] font-extrabold text-slate-900 leading-snug flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 text-blue-500 shrink-0 inline-block" />
                          <span>{line.textEn}</span>
                        </p>
                        <p className="text-xs text-slate-500 font-semibold italic leading-snug">
                          {line.textPt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded Mocho's Pronunciation Gym Tip */}
              {currentModule.pronunciationGym && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-150 relative overflow-hidden flex gap-3">
                  <div className="text-2xl mt-1 select-none">🏋️‍♂️</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1">
                      <span>Ginásio de Pronúncia do Mocho</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    </h4>
                    <p className="text-xs text-indigo-900 leading-relaxed font-semibold">
                      {currentModule.pronunciationGym}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Day 1 */}
              <div className="pt-4 text-center">
                <button
                  onClick={handleDayCompletedSubmit}
                  className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-[#ffffff] font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm text-center transition-transform active:scale-95 cursor-pointer shadow-md min-h-[48px]"
                >
                  Concluir Dia 1 & Ganhar +20 XP 🎉
                </button>
              </div>
            </div>
          )}

          {/* RHYTHMIC DAY 2 WORKSPACE: Grammar + Quiz */}
          {activeDayStep === 'grammar' && (
            <div className="space-y-6">
              
              {/* Grammar Lesson Card */}
              <div className="bg-purple-600 text-white rounded-2xl p-5 border border-purple-500/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <h3 className="font-black text-base flex items-center gap-1.5 mb-1 text-white">
                  <BookOpen className="w-5 h-5 stroke-[2.3]" />
                  <span>Passo 2: Explanação Gramatical de Base</span>
                </h3>
                <p className="text-xs text-purple-100 leading-relaxed font-semibold">
                  Compreenda a lógica estrutural da língua sem jargão difícil. Domine a gramática através de analogias fáceis e quadros emparelhados.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">
                  Foco Gramatical: {currentModule.grammarFocus}
                </h4>
                <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-semibold">
                  <p>
                    {activeLesson.explanationPt.split('Dica do Sabush:').join('Explicação Prática Sabush:')}
                  </p>
                </div>

                {/* Simulated sample expressions block */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h5 className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-widest mb-2">Exemplos Rápidos de Estudo:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                      <span className="font-extrabold text-[#1e3a8a] block">I am Mozambican.</span>
                      <span className="text-slate-500 font-medium italic">Eu sou Moçambicano.</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                      <span className="font-extrabold text-[#1e3a8a] block">Are you a manager?</span>
                      <span className="text-slate-500 font-medium italic">Você é gerente?</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Question Quiz Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <span>Micro-Quiz da Confiança (Questão {currentQuizIndex + 1} de 5)</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded block uppercase">
                    Pontuação: {quizScore}/5
                  </span>
                </div>

                {!quizFinished ? (
                  <div className="space-y-4">
                    {/* Render target question */}
                    {activeLesson.exercise.questions && activeLesson.exercise.questions[currentQuizIndex] ? (
                      (() => {
                        const q = activeLesson.exercise.questions[currentQuizIndex];
                        return (
                          <div className="space-y-3">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                              <p className="text-sm font-black text-slate-900 leading-relaxed">
                                {q.question}
                              </p>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pt-1 block">
                                {q.translation}
                              </span>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isSelected = selectedAns === optIdx;
                                const isCorrect = optIdx === q.correctAnswerIndex;
                                return (
                                  <button
                                    key={optIdx}
                                    disabled={checkedAns}
                                    onClick={() => setSelectedAns(optIdx)}
                                    className={`w-full text-left p-3.5 rounded-xl text-xs font-black transition-all cursor-pointer border min-h-[44px] ${
                                      checkedAns
                                        ? isCorrect
                                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                          : isSelected
                                            ? 'bg-rose-50 border-rose-500 text-rose-900'
                                            : 'bg-white border-slate-200 text-slate-500'
                                        : isSelected
                                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                                          : 'bg-white border-slate-200/80 hover:border-slate-350 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{opt}</span>
                                      {checkedAns && isCorrect && <CheckCircle className="w-4.5 h-4.5 text-emerald-600 fill-emerald-100" />}
                                      {checkedAns && isSelected && !isCorrect && <X className="w-4.5 h-4.5 text-rose-600" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Checked explanations feedback */}
                            {checkedAns && (
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-semibold leading-relaxed space-y-1.5 text-slate-600">
                                <span className={`text-[10px] font-black uppercase tracking-wider block ${selectedAns === q.correctAnswerIndex ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {selectedAns === q.correctAnswerIndex ? '🎉 Excelente! Resposta Certa!' : '❌ Ops! Resposta Errada!'}
                                </span>
                                <p>{q.explanation}</p>
                                <button
                                  onClick={() => {
                                    // Move next
                                    if (currentQuizIndex < 4) {
                                      setCurrentQuizIndex(prev => prev + 1);
                                      setSelectedAns(null);
                                      setCheckedAns(false);
                                    } else {
                                      setQuizFinished(true);
                                    }
                                  }}
                                  className="mt-3 inline-flex items-center gap-1.5 bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded-lg text-[11px] font-black cursor-pointer"
                                >
                                  <span>Continuar para a Próxima</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            {/* Check button */}
                            {!checkedAns && selectedAns !== null && (
                              <button
                                onClick={() => {
                                  setCheckedAns(true);
                                  if (selectedAns === q.correctAnswerIndex) {
                                    setQuizScore(prev => prev + 1);
                                  }
                                }}
                                className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl text-xs font-black cursor-pointer shadow-xs min-h-[44px]"
                              >
                                Verificar Resposta ✔️
                              </button>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-4 bg-slate-50 rounded-2xl">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-bold">Micro-quiz indisponível para esta lição.</p>
                        <button onClick={() => setQuizFinished(true)} className="mt-3 bg-slate-800 text-xs text-white px-4 py-2 rounded-xl font-bold">Avançar</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800">Quiz Completo!</h4>
                      <p className="text-xs text-slate-500 font-bold">Obteve uma pontuação de **{quizScore} de 5** corretas.</p>
                    </div>

                    <button
                      onClick={handleDayCompletedSubmit}
                      className="w-full max-w-xs bg-[#1e3a8a] hover:bg-[#172554] text-[#ffffff] font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm text-center transition-transform active:scale-95 cursor-pointer shadow-md min-h-[48px]"
                    >
                      Concluir Dia 2 & Ganhar +25 XP 🎉
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RHYTHMIC DAY 3 WORKSPACE: Listening + Shadowing (Including Gym Tips) */}
          {activeDayStep === 'shadowing' && (
            <div className="space-y-6">
              <div className="bg-orange-600 text-white rounded-2xl p-5 border border-orange-500/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <h3 className="font-black text-base flex items-center gap-1.5 mb-1 text-white">
                  <Mic className="w-5 h-5 stroke-[2.3]" />
                  <span>Passo 3: Treino Auditivo & Shadowing Falado</span>
                </h3>
                <p className="text-xs text-orange-100 leading-relaxed font-semibold">
                  Melhore a sua audição ativa e a articulação bocal de forma simultânea. Treine repetir frases chave do quotidiano para quebrar a timidez da pronúncia.
                </p>
              </div>

              {/* Comprehension Passage Section */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">
                    Ouvir Cenário de Compreensão Auditiva
                  </h4>
                  <button
                    onClick={() => handleSpeakText(activeLesson.listeningComprehension?.passage || activeLesson.dialogue.map((d: any) => d.textEn).join(". "))}
                    className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ouvir Áudio Modelo 📢</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-semibold leading-relaxed text-slate-700 font-medium">
                  {activeLesson.listeningComprehension?.passage ? (
                    <p>{activeLesson.listeningComprehension.passage}</p>
                  ) : (
                    <p>Listen directly to the key structures used in the daily introductions of today's conversation and practice your speaking cadence.</p>
                  )}
                </div>
              </div>

              {/* Shadowing Phrase Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">
                  Frase de Shadowing (Sombra Falada):
                </h4>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-4">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Repita após ouvir o modelo:</span>
                  <p className="text-base font-black text-[#1e3a8a] select-all">
                    "{activeLesson.dialogue[1]?.textEn || "Hi! My name is Helena. Nice to meet you"}"
                  </p>
                  <p className="text-xs text-slate-500 font-semibold italic -mt-2">
                    "{activeLesson.dialogue[1]?.textPt || "Oi! O meu nome é Helena. Muito prazer em conhecer-te"}"
                  </p>

                  <div className="flex items-center justify-center space-x-4 pt-2">
                    <button
                      onClick={() => handleSpeakText(activeLesson.dialogue[1]?.textEn || "Hi! My name is Helena. Nice to meet you")}
                      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer min-h-[44px]"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Ouvir Modelo</span>
                    </button>

                    <button
                      onClick={simulateShadowingRecord}
                      className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer min-h-[44px] transition-all ${
                        isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isRecording ? 'Gravando (Simulado)...' : 'Gravar-me a Falar'}</span>
                    </button>
                  </div>

                  {/* Audio animation bars while recording */}
                  {isRecording && (
                    <div className="flex items-center justify-center space-x-1 pt-2 animate-pulse">
                      <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-6 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}

                  {hasRecorded && shadowSuccess && (
                    <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-3 text-xs text-center font-semibold leading-relaxed flex items-start gap-2.5">
                      <span className="text-xl">🦉</span>
                      <p className="text-left flex-1 text-[11px] text-emerald-950">
                        <strong>Mocho diz:</strong> "Excelente esforço de Shadowing! Notei boa pronúncia na articulação do Liaison. A sua entonação está correta."
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gym section */}
              {currentModule.pronunciationGym && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-150 flex gap-3">
                  <div className="text-2xl mt-1 select-none">🏋️‍♂️</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                      Ginásio de Pronúncia do Mocho - Dica do Dia:
                    </h4>
                    <p className="text-xs text-indigo-900 leading-relaxed font-semibold">
                      {currentModule.pronunciationGym}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <button
                  onClick={handleDayCompletedSubmit}
                  className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-[#ffffff] font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm text-center transition-transform active:scale-95 cursor-pointer shadow-md min-h-[48px]"
                >
                  Concluir Dia 3 & Ganhar +30 XP 🎉
                </button>
              </div>
            </div>
          )}

          {/* RHYTHMIC DAY 4 WORKSPACE: Chat Roleplay with Mocho + Performance Review */}
          {activeDayStep === 'roleplay' && (
            <div className="space-y-6">
              <div className="bg-teal-600 text-white rounded-2xl p-5 border border-teal-500/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <h3 className="font-black text-base flex items-center gap-1.5 mb-1 text-white">
                  <Sparkles className="w-5 h-5 stroke-[2.3]" />
                  <span>Passo 4: Simulação de Diálogo Ativo com o Mocho</span>
                </h3>
                <p className="text-xs text-teal-100 leading-relaxed font-semibold">
                  Chegou o momento de testar seus conhecimentos em conversação simulada. Converse livremente com o Mocho sobre o tema proposto e obtenha seu bilhete de avaliação.
                </p>
              </div>

              {roleplayState === 'intro' ? (
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-teal-105 bg-teal-50 flex items-center justify-center mx-auto text-teal-600">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Modo Diálogo Ativo Estágio:</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      O Mocho vai interpretar um parceiro fictício no cenário da lição: 
                      <strong> "{activeLesson.speakingScenario?.prompt || ''}"</strong>. 
                      Pronto(a) para responder?
                    </p>
                  </div>
                  <button
                    onClick={startMochoChat}
                    className="w-full max-w-xs bg-teal-650 bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-2xl text-xs font-black cursor-pointer shadow-sm min-h-[44px]"
                  >
                    Começar Conversação com o Mocho 💬
                  </button>
                </div>
              ) : roleplayState === 'chatting' ? (
                <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-4 flex flex-col h-[400px]">
                  
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                    {chatMessages.map((msg, idx) => {
                      const isModel = msg.role === 'model';
                      return (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 max-w-[85%] ${isModel ? 'mr-auto text-left' : 'ml-auto text-right flex-row-reverse'}`}
                        >
                          <div className={`rounded-2xl p-3.5 leading-relaxed font-semibold ${isModel ? 'bg-indigo-50 border border-indigo-100 text-slate-800' : 'bg-teal-600 text-white'}`}>
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                    {isMochoTyping && (
                      <div className="mr-auto text-left max-w-[80%] flex items-center space-x-2 bg-slate-100 p-3 rounded-2xl border border-slate-200 w-24">
                        <span className="text-[10px] text-slate-500 font-bold">Mocho digita</span>
                        <div className="flex space-x-1 animate-pulse">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <div className="w-1.5 h-1.5 bg-slate-450 bg-slate-400 rounded-full" />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="border-t border-slate-200 pt-3.5 flex items-center justify-between gap-2 no-print">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendChatMessage();
                      }}
                      placeholder="Responda em inglês..."
                      className="flex-1 text-xs px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none font-semibold min-h-[44px]"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4.5 py-3 rounded-xl text-xs cursor-pointer min-h-[44px]"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              ) : (
                // Performance review feedback panel
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] text-teal-600 bg-teal-50 border border-teal-200 px-2 rounded-full font-black uppercase tracking-widest">Avaliação do Mocho</span>
                    <h4 className="text-sm font-black text-slate-800">Boletim de Desempenho Falado 📜</h4>
                  </div>

                  {/* Star ratings */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 grid grid-cols-2 gap-3 group">
                    {[
                      { key: 'Vocabulário', stars: 5 },
                      { key: 'Pronúncia Fónica', stars: 5 },
                      { key: 'Estruturação Gramatical', stars: 4 },
                      { key: 'Métrica de Confiança', stars: 5 }
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-between shadow-xs">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase mb-1">{metric.key}</span>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star 
                              key={sIdx} 
                              className={`w-3.5 h-3.5 ${sIdx < metric.stars ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-teal-50 text-teal-950 border border-teal-200 rounded-xl p-4 text-xs font-semibold leading-relaxed space-y-2">
                    <p className="font-extrabold text-teal-900 border-b border-teal-150 pb-1 flex items-center gap-1">
                      <span>Feedback Personalizado do Mocho:</span>
                    </p>
                    <p>
                      "Fizeste um esforço fantástico nesta atividade! Usas o vocabulário base de greetings e apresentações com muito boa segurança."
                    </p>
                    <p className="italic text-[10.5px]">
                      <strong>Dica de melhoria:</strong> Use pequenos ligadores de frases como 'also' (também) ou 'then' (então) para expandir as suas respostas curtas sem hesitar.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleDayCompletedSubmit}
                      className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-[#ffffff] font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm text-center transition-transform active:scale-95 cursor-pointer shadow-md min-h-[48px]"
                    >
                      Concluir Dia 4 & Ganhar +35 XP 🎉
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RHYTHMIC DAY 5 WORKSPACE: Spaced Repetition + Weekly Confidence Checklist */}
          {activeDayStep === 'leitner' && (
            <div className="space-y-6">
              <div className="bg-indigo-650 bg-indigo-600 text-white rounded-2xl p-5 border border-indigo-500/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <h3 className="font-black text-base flex items-center gap-1.5 mb-1 text-white">
                  <Award className="w-5 h-5 stroke-[2.3]" />
                  <span>Passo 5: Fecho de Módulo & Padrão Leitner</span>
                </h3>
                <p className="text-xs text-indigo-150 text-indigo-100 leading-relaxed font-semibold">
                  Consolide os conteúdos da semana através de cartões de auto-avaliação Leitner (Revisão Espaçada de Vocabulário) e assinale o seu boletim de metas de fluência profissionais.
                </p>
              </div>

              {/* Spaced repetition flashcards interface */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span>Revisão Espaçada Leitner</span>
                    <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 px-2 rounded">
                      Termo {currentLeitnerIndex + 1} de {activeLesson.vocabulary.length}
                    </span>
                  </h4>
                </div>

                {/* Flip Card Design */}
                <div 
                  onClick={() => setFlippedFlashcard(!flippedFlashcard)}
                  className="bg-gradient-to-br from-[#1e3a8a] to-[#122252] rounded-2xl p-10 text-white border border-slate-700/10 text-center min-h-[160px] flex flex-col items-center justify-center cursor-pointer relative shadow-md transition-all hover:shadow-lg"
                >
                  <span className="absolute top-3 right-4 text-[9px] text-slate-300 font-extrabold uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded">
                    {flippedFlashcard ? 'VERSO (TRADUÇÃO/PRONÚNCIA)' : 'FRENTE (INGLÊS)'}
                  </span>
                  
                  {!flippedFlashcard ? (
                    <div className="space-y-1">
                      <p className="text-xl font-black text-white">{activeVocabItem.en}</p>
                      <p className="text-[10px] text-blue-300 font-extrabold tracking-widest uppercase">Toque para revelar a resposta</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-black text-white">{activeVocabItem.pt}</p>
                      <p className="text-xs text-amber-300 font-mono italic">Pronúncia: /{activeVocabItem.pronunciation}/</p>
                    </div>
                  )}
                </div>

                {/* Confirming score */}
                {flippedFlashcard && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleLeitnerAnswer(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs font-black cursor-pointer shadow-xs min-h-[44px]"
                    >
                      ✔️ Acertei de Primeira!
                    </button>
                    <button
                      onClick={() => handleLeitnerAnswer(false)}
                      className="bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded-xl text-xs font-black cursor-pointer shadow-xs min-h-[44px]"
                    >
                      ❌ Errei, preciso rever!
                    </button>
                  </div>
                )}
              </div>

              {/* Weekly Checklist Self-assessment items */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">
                  Lista de Confiança da Semana Checklist:
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold -mt-2">
                  Assinale os marcos de expressão falada pessoal e corporativa que garante dominar com satisfação neste módulo:
                </p>

                <div className="space-y-2.5">
                  {currentModule.milestones.map((milestone, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleMilestoneCheck(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        checklistTicked[idx] 
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-relaxed flex-1 pr-2">
                        {milestone}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        checklistTicked[idx] 
                        ? 'bg-emerald-500 border-transparent text-white' 
                        : 'border-slate-350 border-slate-300 bg-white'
                      }`}>
                        {checklistTicked[idx] && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Day 5 & Module */}
              <div className="pt-2 text-center text-xs">
                {isChecklistFullyChecked() ? (
                  <button
                    onClick={handleDayCompletedSubmit}
                    className="w-full bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl text-xs sm:text-sm text-center transition-transform active:scale-95 cursor-pointer shadow-md min-h-[48px]"
                  >
                    🎉 Dar por Concluído o Módulo & Ganhar +50 XP!
                  </button>
                ) : (
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-3 text-[10.5px] font-bold text-center">
                    ⚠️ Por favor, confirme se cumpriu todos os 3 marcos de checklist para fechar o módulo e avançar!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* graduation flow for Day 90 */}
          {selectedDay === 90 && (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6 text-center mt-6">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white mx-auto animate-bounce border-4 border-white shadow-md">
                <Award className="w-10 h-10 stroke-[1.8]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800">Parabéns Completo! Graduation Day 🎓</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Concluiu com êxito os 90 Dias do **Caminho da Confiança (Fase 1 - Iniciante)** do Sabush Club de Inglês. Mostrou empenho exemplar em todas as avaliações fónicas, gramaticais e interativas.
                </p>
              </div>

              <div className="bg-[#1e3a8a] text-white rounded-2xl p-5 border border-blue-500/10 shadow-sm relative overflow-hidden text-left space-y-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" />
                <h4 className="font-extrabold text-[#ffffff] text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <span>Mensagem Próxima de Transição Rumo à Fase 2:</span>
                </h4>
                <p className="text-xs text-slate-100 leading-relaxed font-semibold">
                  "Agora que quebrou totalmente a barreira fonética e domina o vocabulário básico de apresentações, reuniões, viagens e compras com Liaison de base, sente-se pronto para avançar para discussões corporativas! Prepare-se para a Fase 2 (Nível Intermediário Coesivo)."
                </p>
              </div>

              <button
                onClick={handleCertificateCreation}
                className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-black py-4.5 rounded-2xl text-xs sm:text-sm shadow-md cursor-pointer transition-transform active:scale-95 min-h-[48px]"
              >
                🎓 Gerar Meu Diploma de Mestre da Confiança
              </button>
            </div>
          )}

        </div>
      )}

      {/* 
         =========================================
         GUIDED TRACK INTERACTIVE DASHBOARD/LOBBY (Main Landing)
         =========================================
      */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-blue-600/20" id="guided_path_hero">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <button 
            onClick={onGoBack}
            className="flex items-center gap-1 text-xs text-white bg-white/15 hover:bg-white/20 font-black py-1 px-2.5 rounded-xl transition-all cursor-pointer no-print"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.3]" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center space-x-1">
            <Trophy className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-[10px] uppercase font-black tracking-wider bg-white/15 px-2 bg-brand-navy-900 border border-white/20 py-0.5 rounded-full">
              Fase 1: Iniciante de Elite
            </span>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400 text-slate-950 font-black px-3 py-1 rounded-full text-[10px] tracking-widest uppercase border border-yellow-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
            <span>Caminho da Confiança • 90 Dias</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black leading-tight text-white tracking-normal mt-1">
            O Seu Roteiro Diário de 20 Minutos 🦉
          </h2>
          <p className="text-xs text-slate-100/90 leading-relaxed font-semibold">
            Uma formação sequencial focada no desenvolvimento fónico, gramatical e conversacional sob medida para o quotidiano em Moçambique.
          </p>
        </div>

        {/* Unified progress meter */}
        <div className="mt-6 bg-[#0f172a]/40 rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Progresso Geral:</span>
            <span className="text-white font-black">{percentGuidedComplete}% do Caminho</span>
          </div>
          {/* visual progress bar */}
          <div className="w-full bg-[#1e293b]/50 rounded-full h-3 overflow-hidden border border-white/5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentGuidedComplete}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-slate-300 font-bold uppercase">
            <span>{completedDays.length} dias feitos</span>
            <span className="text-green-300">Faltam {90 - completedDays.length} dias</span>
          </div>
        </div>

        {/* Big Action CTA to Continue Current Active Day */}
        <div className="mt-5 no-print">
          <button
            onClick={() => handleDaySelect(currentDay)}
            className="w-full bg-white hover:bg-slate-50 text-[#1e3a8a] active:scale-95 py-3.5 px-5 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2.5 cursor-pointer min-h-[48px]"
          >
            <span>Estudar Dia {currentDay} Agora (+20-50 XP)</span>
            <Play className="w-4 h-4 text-[#1e3a8a] fill-current" />
          </button>
        </div>
      </div>

      {/* 
         =========================================
         90-DAY DYNAMIC ACCORDION CALENDAR MAP
         =========================================
      */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <span>Roteiro Completo de Módulos (Days 1-90)</span>
          </h3>
          <span className="text-[10px] text-[#2563eb] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest leading-none">
            18 Módulos
          </span>
        </div>

        <div className="space-y-2.5">
          {PATH_MODULES.map((mod) => {
            const isExpanded = activeModuleId === mod.id;
            const isCompleted = mod.days.every(d => completedDays.includes(d));
            const isActive = mod.days.includes(currentDay);
            // TEMP: all modules unlocked for free testing. Restore the line below to re-enable progression locking.
            // const isLocked = !isActive && !isCompleted && mod.id > getModuleForDay(currentDay).id;
            const isLocked = false;

            return (
              <div 
                key={mod.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:border-blue-200/80 ${
                  isActive 
                    ? 'border-indigo-400 ring-2 ring-indigo-400/10' 
                    : isCompleted 
                      ? 'border-slate-200 bg-slate-50/50' 
                      : 'border-slate-200'
                }`}
              >
                {/* Module Summary Header */}
                <div 
                  onClick={() => {
                    setActiveModuleId(isExpanded ? 0 : mod.id);
                  }}
                  className="p-4.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 flex-1 pr-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                        : isActive 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold animate-pulse' 
                          : 'bg-slate-50 border-slate-250 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-black">{mod.id}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Módulo {mod.id}</span>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 rounded-lg px-1.5 uppercase tracking-wider block">
                          Dias {mod.days[0]}–{mod.days[4]}
                        </span>
                        {isActive && (
                          <span className="text-[8px] bg-indigo-105 border border-indigo-200 bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded font-black uppercase tracking-wider">
                            Ativo
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                        {mod.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-slate-350" />
                    ) : (
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    )}
                  </div>
                </div>

                {/* Days list sub-accordion list rendering if expanded */}
                {isExpanded && !isLocked && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4.5 py-3.5 space-y-2">
                    {/* Inner metadata details */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-150 text-[10.5px] leading-relaxed text-slate-600 font-semibold space-y-1 mt-0.5 mb-2 shadow-xs">
                      <p>🗣️ **Foco de Expressão:** {mod.vocabFocus}</p>
                      <p>📝 **Estrutura Gramatical:** {mod.grammarFocus}</p>
                      {mod.pronunciationGym && (
                        <p className="text-indigo-900 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 mt-1">
                          🏋️‍♂️ **Liaison/Gym:** {mod.pronunciationGym.slice(0, 95)}...
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {mod.days.map((day) => {
                        const dayIndex = ((day - 1) % 5) + 1;
                        const isDayComplete = completedDays.includes(day);
                        const isDayActive = day === currentDay;
                        // TEMP: all days unlocked for free testing. Restore the line below to re-enable progression locking.
                        // const isDayLocked = day > currentDay && !isDayComplete;
                        const isDayLocked = false;

                        // Rhythmic cycle label in Portuguese
                        const dayLabels: { [key: number]: string } = {
                          1: "Vocabulário & Introdução Diálogo (Dia 1)",
                          2: "Estruturação Gramatical & Quiz (Dia 2)",
                          3: "Compreensão Auditiva & Shadowing Fónico (Dia 3)",
                          4: "Simulação de Diálogo Ativo com Mocho (Dia 4)",
                          5: "Auto-Avaliação Leitner & Metas de Confiança (Dia 5)",
                        };

                        return (
                          <div 
                            key={day}
                            onClick={() => handleDaySelect(day)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                              isDayComplete 
                                ? 'bg-white border-slate-205 border-slate-200 text-slate-600 hover:bg-slate-100/50' 
                                : isDayActive 
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-400 ring-2 ring-indigo-400/10 hover:shadow-xs group' 
                                  : 'bg-white border-slate-150 hover:bg-slate-100/20 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3 text-left">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                                isDayComplete 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : isDayActive 
                                    ? 'bg-[#1e3a8a] text-[#ffffff] scale-105' 
                                    : 'bg-slate-100 text-slate-400'
                              }`}>
                                {day}
                              </div>
                              <div className="space-y-0.5">
                                <span className={`text-[10.5px] font-extrabold block leading-none ${isDayActive ? 'text-[#1e3a8a]' : isDayComplete ? 'text-slate-800' : 'text-slate-400'}`}>
                                  {dayLabels[dayIndex]}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase block">
                                  {dayIndex === 5 ? 'Módulo checkpoint • +50 XP' : `Dia ${dayIndex} de 5 • +${15 + dayIndex * 5} XP`}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 leading-none">
                              {isDayComplete ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                              ) : isDayActive ? (
                                <span className="text-[9.5px] text-[#1e3a8a] border border-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors uppercase font-black px-2 py-0.5 rounded-lg">
                                  Estudar
                                </span>
                              ) : (
                                <Lock className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
