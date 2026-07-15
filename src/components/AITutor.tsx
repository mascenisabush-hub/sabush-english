/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, EnglishLevel } from '../types';
import { Send, Sparkles, MessageSquare, Loader, User, HelpCircle, Mic, MicOff, Volume2, X, RotateCcw, FileText, ChevronRight, Briefcase } from 'lucide-react';
import { Mascot } from './Mascot';
import { selectMaleVoice, cleanTextForSpeech } from '../utils/voice';

interface RoleplayScenario {
  id: string;
  name: string;
  emoji: string;
  description: string;
  initialMessage: string;
  initialMessagePt: string;
  role: string;
  isAdvancedOnly?: boolean;
}

const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'job_interview',
    name: 'Entrevista de Emprego',
    emoji: '💼',
    description: 'Simula uma entrevista de emprego numa grande multinacional de logística ou comércio em Moçambique.',
    initialMessage: "Good day! Welcome to our interview. Thank you for coming today. To start, could you please introduce yourself and tell me why you are interested in this position?",
    initialMessagePt: "Bom dia! Bem-vindo à nossa entrevista. Obrigado por vir hoje. Para começar, poderia se apresentar e contar por que está interessado nesta vaga?",
    role: "Professional Recruiter"
  },
  {
    id: 'customer_service',
    name: 'Atendimento ao Cliente',
    emoji: '📞',
    description: 'Resolva problemas críticos e aprenda a acalmar clientes internacionais exigentes.',
    initialMessage: "Hello, thank you for picking up. My name is Christian and I am having a major issue with our service setup. We purchased it last week and it is completely down! Can you explain what is going on?",
    initialMessagePt: "Olá, obrigado por atender. O meu nome é Christian e estou com um grande problema na configuração do nosso serviço. Comprámos na semana passada e está completamente offline! Pode me explicar o que se passa?",
    role: "Challenging client"
  },
  {
    id: 'street_directions',
    name: 'Pedir Informações na Rua',
    emoji: '📍',
    description: 'Ajude um turista estrangeiro perdido no centro de Maputo a encontrar caminhos importantes.',
    initialMessage: "Excuse me! Sorry to bother you, but I am completely lost. Could you tell me where the nearest bank is, or how I can find a taxi stand around here?",
    initialMessagePt: "Com licença! Desculpe incomodar, mas estou completamente perdido. Poderia me dizer onde fica o banco mais próximo, ou como posso encontrar uma praça de táxis por aqui?",
    role: "Lost tourist"
  },
  {
    id: 'business_meeting',
    name: 'Reunião de Trabalho',
    emoji: '📊',
    description: 'Apresente os resultados e prazos do seu departamento numa reunião de balanço trimestral.',
    initialMessage: "Hello team, thank you for joining our project review meeting today. We have to report department metrics and ensure our milestones for next Friday are secured. Who wants to begin with their brief updates?",
    initialMessagePt: "Olá equipa, obrigado por participarem na nossa reunião de revisão de projeto hoje. Temos de reportar as métricas do departamento e garantir nossos prazos para a próxima sexta-feira. Quem quer começar com as suas atualizações breves?",
    role: "Meeting coordinator"
  },
  {
    id: 'debate',
    name: 'Debate & Persuasão ⚖️',
    emoji: '🔥',
    description: 'Defenda a sua opinião contra um Mocho cético e desafiador. Ideal para treinar conectores avançados e persuasão inteligente.',
    initialMessage: "Welcome to the Debate Lounge. Please select your motion topic to begin.",
    initialMessagePt: "Bem-vindo ao Debate Lounge. Selecione um tema de debate para iniciar.",
    role: "Devil's Advocate",
    isAdvancedOnly: true
  }
];

interface DebateTopic {
  id: string;
  name: string;
  emoji: string;
  descriptionPt: string;
  descriptionEn: string;
  initialMessage: string;
  initialMessagePt: string;
}

const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 'remote_vs_office',
    name: 'Trabalho remoto vs presencial',
    emoji: '🏠',
    descriptionPt: 'As empresas devem obrigar o retorno ao escritório ou abraçar o trabalho remoto?',
    descriptionEn: 'Should companies mandate office returns or fully embrace remote work?',
    initialMessage: "Let us begin. Many corporate leaders argue that remote work is a luxury that harms overall productivity and team cohesion, especially in countries with developing infrastructure. I strongly believe that on-site work is far superior for business outcomes. What is your position on this, and how can you justify remote work's alleged benefits? Change my mind.",
    initialMessagePt: "Muitos líderes corporativos defendem que o teletrabalho prejudica a produtividade e a coesão das equipas. Eu acredito que o trabalho presencial é muito superior. Qual é a sua posição sobre o assunto?"
  },
  {
    id: 'automation_vs_jobs',
    name: 'Automatização vs empregos locais',
    emoji: '🤖',
    descriptionPt: 'A inteligência artificial e a automatização são uma ameaça ou uma oportunidade para os jovens?',
    descriptionEn: 'Will AI and technology help or hurt young workforces in Mozambique?',
    initialMessage: "Welcome to this discussion. In my view, automation and advanced AI systems represent a massive threat to emerging economies. They will destroy local manual and administrative jobs, worsening unemployment. Why should we embrace tech automation when local human livelihoods are on the line? Explain your stance.",
    initialMessagePt: "A automatização ameaça destruir empregos administrativos e manuais locais. Por que devemos adotar tecnologia quando postos de trabalho estão em risco?"
  },
  {
    id: 'foreign_investment',
    name: 'Investimento estrangeiro em Moçambique',
    emoji: '🌍',
    descriptionPt: 'Os grandes investimentos multinacionais em recursos beneficiam mesmo os cidadãos?',
    descriptionEn: 'Are international resource investments naturally beneficial for Mozambican citizens?',
    initialMessage: "Let's debate. Historical patterns show that massive foreign direct investment in natural resources often leads to economic dependency and exploitation, with profits exported while local populations bear environmental and social costs. How can you argue that foreign investments are beneficial when local communities rarely see the wealth? Prove me wrong.",
    initialMessagePt: "Investimentos multinacionais muitas vezes levam à exploração de recursos e fuga de lucros, sobrando poucos benefícios reais locais. Como defende que estes investimentos ajudam as pessoas comuns?"
  }
];

interface GuidedDialogueTurn {
  mochoText: string;
  mochoTextPt: string;
  options: {
    en: string;
    pt: string;
  }[];
}

interface GuidedDialogueScenario {
  id: string;
  name: string;
  emoji: string;
  description: string;
  turns: GuidedDialogueTurn[];
  finalMochoText: string;
  bridgePrompt: string;
}

const GUIDED_SCENARIOS: GuidedDialogueScenario[] = [
  {
    id: 'greetings',
    name: 'Saudações e Apresentações',
    emoji: '👋',
    description: 'Aprenda a dizer o seu nome, cumprimentar o Mocho e demonstrar entusiasmo por aprender inglês.',
    turns: [
      {
        mochoText: "Hi there! I am Mocho. What is your name?",
        mochoTextPt: "Olá! Eu sou o Mocho. Como te chamas?",
        options: [
          {
            en: "Hello! My name is Ana. Nice to meet you.",
            pt: "Olá! O meu nome é Ana. Prazer em conhecer-te."
          },
          {
            en: "Hi! I am Marcos. How are you doing?",
            pt: "Oi! Eu sou o Marcos. Como estás?"
          }
        ]
      },
      {
        mochoText: "It is wonderful to meet you! How are you doing today?",
        mochoTextPt: "É fantástico conhecer-te! Como estás hoje?",
        options: [
          {
            en: "I am doing great, thank you! And you?",
            pt: "Estou ótimo, obrigado! E tu?"
          },
          {
            en: "I am a bit tired, but happy to practice English today.",
            pt: "Estou um bocado cansado, mas feliz por praticar inglês hoje."
          }
        ]
      },
      {
        mochoText: "Teaching you is my pleasure. Let's make this day amazing. Are you ready to learn English with me?",
        mochoTextPt: "Ensinar-te é um prazer. Vamos tornar este dia incrível. Estás pronto para aprender inglês comigo?",
        options: [
          {
            en: "Yes, I am totally ready! Let's do it.",
            pt: "Sim, estou totalmente pronto! Vamos a isso."
          },
          {
            en: "Yes! Can we start with some simple words?",
            pt: "Sim! Podemos começar com algumas palavras simples?"
          }
        ]
      }
    ],
    finalMochoText: "Fantastic! You did an amazing job completing this guided talk. Erros são sementes do teu crescimento linguístico. Let's continue together!",
    bridgePrompt: "Hello Mocho! I just completed the greetings guided dialogue. Now, I want to practice introducing myself freely without help. Please say hello and ask me some simple intro questions!"
  },
  {
    id: 'ordering_food',
    name: 'Pedir Comida no Sabush Cafe',
    emoji: '🍔',
    description: 'Aprenda frases essenciais para fazer um pedido, escolher bebida e forma de pagamento.',
    turns: [
      {
        mochoText: "Hello! Welcome to Sabush Cafe. What can I get for you today?",
        mochoTextPt: "Olá! Bem-vindo ao Café Sabush. O que posso trazer para si hoje?",
        options: [
          {
            en: "Hi! I would like to order a chicken burger, please.",
            pt: "Olá! Gostaria de pedir um hambúrguer de frango, por favor."
          },
          {
            en: "Hello! Can I have a cup of black coffee and a slice of cake?",
            pt: "Olá! Pode dar-me uma chávena de café preto e uma fatia de bolo?"
          }
        ]
      },
      {
        mochoText: "Sure thing! Would you like anything else to drink or any dessert with that?",
        mochoTextPt: "Claro que sim! Gostaria de mais alguma coisa para beber ou alguma sobremesa a acompanhar?",
        options: [
          {
            en: "Just some cold water, please.",
            pt: "Apenas um pouco de água fria, por favor."
          },
          {
            en: "No, thank you. That is all for now.",
            pt: "Não, obrigado. É tudo por agora."
          }
        ]
      },
      {
        mochoText: "Excellent choice! That will be five dollars. How would you like to pay?",
        mochoTextPt: "Excelente escolha! Fica por cinco dólares. Como gostaria de pagar?",
        options: [
          {
            en: "I will pay with cash.",
            pt: "Vou pagar com dinheiro vivo."
          },
          {
            en: "I will pay by card, please.",
            pt: "Vou pagar com cartão, por favor."
          }
        ]
      }
    ],
    finalMochoText: "Perfect! Your order is being prepared. Real food, real progress. You crushed this guided ordering dialogue!",
    bridgePrompt: "Hi Mocho! I just finished ordering food in the guided dialogue. Now I want to practice cafe interactions, but this time without help. Please act as a waiter, and I will try to order something else!"
  },
  {
    id: 'asking_directions',
    name: 'Pedir Direções na Cidade',
    emoji: '📍',
    description: 'Saiba como pedir caminhos para pontos importantes da cidade a pé.',
    turns: [
      {
        mochoText: "Excuse me, you look a bit lost. Can I help you find something?",
        mochoTextPt: "Com licença, parece um bocado perdido. Posso ajudá-lo a encontrar algo?",
        options: [
          {
            en: "Yes, please! Where is the nearest supermarket?",
            pt: "Sim, por favor! Onde fica o supermercado mais próximo?"
          },
          {
            en: "Yes, I am lost. How do I get to the Maputo Central Station?",
            pt: "Sim, estou perdido. Como chego à Estação Central de Maputo?"
          }
        ]
      },
      {
        mochoText: "Ah, yes! It is just two blocks down this street, on your right hand side.",
        mochoTextPt: "Ah, sim! Fica a apenas dois blocos descendo esta rua, do seu lado direito.",
        options: [
          {
            en: "Thank you so much! Is it far from here?",
            pt: "Muito obrigado! É longe daqui?"
          },
          {
            en: "Perfect, I got it. Is it safe to walk there?",
            pt: "Perfeito, percebi. É seguro caminhar até lá?"
          }
        ]
      },
      {
        mochoText: "It is very close, only a three-minute walk, and yes, it is beautifully safe during the daytime.",
        mochoTextPt: "É muito perto, são apenas três minutos a pé, e sim, é bastante seguro durante o dia.",
        options: [
          {
            en: "Great! Have a wonderful day!",
            pt: "Ótimo! Tenha um dia maravilhoso!"
          },
          {
            en: "Excellent! Thanks for your kind help.",
            pt: "Excelente! Obrigado pela sua ajuda gentil."
          }
        ]
      }
    ],
    finalMochoText: "Success! You found your way. Pedir direções em inglês já não é um mistério para si. You completed this dialogue successfully!",
    bridgePrompt: "Hello Mocho! I just completed the street directions guided dialogue. Now, let's practice asking directions freely without any help. You can pretend to be a passerby in Maputo city centre and I will ask you for help!"
  }
];

const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    if (line.startsWith('### ')) {
      return (
        <h4 key={lineIdx} className="text-[#fbbf24] font-extrabold text-sm sm:text-base mt-4 mb-2 first:mt-1 border-b border-white/10 pb-1.5">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('#### ')) {
      return (
        <h5 key={lineIdx} className="text-[#a7f3d0] font-bold text-xs sm:text-sm mt-3.5 mb-1.5">
          {line.replace('#### ', '')}
        </h5>
      );
    }
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const cleanLine = trimmed.replace(/^[*+-]\s+/, '');
      return (
        <div key={lineIdx} className="flex items-start pl-2 my-1">
          <span className="text-[#fbbf24] mr-2 shrink-0 select-none text-[11px] mt-1.5">•</span>
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-semibold">
            {parseInlineStyles(cleanLine)}
          </p>
        </div>
      );
    }
    if (!trimmed) {
      return <div key={lineIdx} className="h-2" />;
    }
    return (
      <p key={lineIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed my-1.5 min-h-[1px]">
        {parseInlineStyles(line)}
      </p>
    );
  });
};

const parseInlineStyles = (fragment: string) => {
  const parts = fragment.split('**');
  return parts.map((chunk, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-[#fbbf24] font-black bg-yellow-500/5 px-1 rounded">{chunk}</strong>;
    }
    return chunk;
  });
};

interface AITutorProps {
  currentLevel: EnglishLevel;
  onEarnXp?: (amount: number) => void;
  initialTutorMode?: 'tutor' | 'roleplay' | 'guided' | null;
  initialScenarioId?: string | null;
  onClearInitialParams?: () => void;
}

export function AITutor({ 
  currentLevel, 
  onEarnXp,
  initialTutorMode,
  initialScenarioId,
  onClearInitialParams
}: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Olá! Sou o **Sabush AI Tutor**, o teu professor de inglês pessoal liderado pelo Mocho! 🎓🦉\n\nEstou aqui para te ajudar de várias formas:\n• **Praticar conversação** bilingue sobre tópicos do dia-a-dia e mercado de trabalho em Moçambique\n• **Explicar regras gramaticais** de forma super descomplicada\n• **Corrigir as tuas frases** para melhorares a tua escrita e expressão\n• **Treinar pronúncia** com tecnologia de voz avançada\n\nEstou configurado para o teu nível atual: **${
        currentLevel === 'beginner' 
          ? 'Iniciante (Do Zero)' 
          : currentLevel === 'intermediate' 
          ? 'Intermediário (Trabalho)' 
          : 'Avançado (Profissional)'
      }**.\n\nQual é o teu objetivo hoje? Estamos juntos!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userGoal, setUserGoal] = useState<string>('');
  const [xpToast, setXpToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Roleplay States
  const [tutorMode, setTutorMode] = useState<'tutor' | 'roleplay' | 'guided'>('tutor');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedDebateTopic, setSelectedDebateTopic] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [roleplayMessages, setRoleplayMessages] = useState<ChatMessage[]>([]);

  // Guided Dialogue States
  const [selectedGuidedScenario, setSelectedGuidedScenario] = useState<string | null>(null);
  const [guidedTurnIndex, setGuidedTurnIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [guidedHistory, setGuidedHistory] = useState<{ mocho: string; mPt: string; user?: string; uPt?: string }[]>([]);
  const [guidedScore, setGuidedScore] = useState<number | null>(null);
  const [guidedTranscriptResult, setGuidedTranscriptResult] = useState<string>('');

  // Voice Practice States
  const [extractedPhrases, setExtractedPhrases] = useState<string[]>([]);
  const [selectedPhrase, setSelectedPhrase] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedTranscript, setRecordedTranscript] = useState<string>('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState<boolean>(false);

  // Reference to recognition
  const recognitionRef = useRef<any>(null);

  // Helper distances
  const getLevenshteinDistance = (a: string, b: string): number => {
    const tmp = [];
    for (let i = 0; i <= a.length; i++) {
      tmp[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
      tmp[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1,
          tmp[i][j - 1] + 1,
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return tmp[a.length][b.length];
  };

  const calculateSimilarity = (model: string, spoken: string): number => {
    const cleanStr = (str: string) => 
      str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const mWords = cleanStr(model).split(" ").filter(w => w.length > 0);
    const sWords = cleanStr(spoken).split(" ").filter(w => w.length > 0);

    if (mWords.length === 0) return 0;

    let matches = 0;
    const spokenSet = new Set(sWords);
    
    mWords.forEach(word => {
      if (spokenSet.has(word)) {
        matches++;
      } else {
        const hasNearMatch = sWords.some(sWord => {
          const dist = getLevenshteinDistance(word, sWord);
          return dist <= 1 && word.length > 3;
        });
        if (hasNearMatch) matches += 0.7;
      }
    });

    const percentage = Math.round((matches / mWords.length) * 100);
    return Math.min(100, Math.max(0, percentage));
  };

  // Extract phrases from a model message
  const extractModelSentences = (text: string): string[] => {
    const list: string[] = [];
    const asteriskRegex = /\*\*([^*]+)\*\*/g;
    let match;
    while ((match = asteriskRegex.exec(text)) !== null) {
      const phrase = match[1].trim();
      if (phrase.length > 3 && phrase.length < 80 && /^[a-zA-Z\s.,'’"?!-]+$/.test(phrase)) {
        list.push(phrase);
      }
    }

    const quoteRegex = /"([^"]+)"/g;
    while ((match = quoteRegex.exec(text)) !== null) {
      const phrase = match[1].trim();
      if (phrase.length > 3 && phrase.length < 80 && /^[a-zA-Z\s.,'’"?!-]+$/.test(phrase) && !list.includes(phrase)) {
        list.push(phrase);
      }
    }

    if (list.length === 0) {
      const clean = text.replace(/[*#_\-\(\)]/g, ' ');
      const sentences = clean.split(/[.!?\n]/);
      for (let s of sentences) {
        const cleaned = s.trim();
        if (cleaned.length > 8 && cleaned.length < 75 && /^[a-zA-Z\s.,'’"?!-]+$/.test(cleaned)) {
          list.push(cleaned);
        }
      }
    }

    if (list.length === 0) {
      if (currentLevel === 'beginner') {
        list.push("I want to learn English.", "How are you doing today?", "Thank you very much.");
      } else if (currentLevel === 'intermediate') {
        list.push("I am looking for a job in Maputo.", "Let's schedule a virtual meeting.");
      } else {
        list.push("Mozambique represents a vital hub for international trade.");
      }
    }

    return Array.from(new Set(list)).slice(0, 5);
  };

  const handleStartVoicePractice = (msgText: string) => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      setIsSpeechSupported(false);
    }

    const phrases = extractModelSentences(msgText);
    setExtractedPhrases(phrases);
    if (phrases.length > 0) {
      setSelectedPhrase(phrases[0]);
    } else {
      setSelectedPhrase("How are you doing today?");
    }
    setRecordedTranscript('');
    setPronunciationScore(null);
    setSpeechError(null);
  };

  const playModelAudio = (phraseText: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    
    // Clean text to avoid codes/metadata being read out
    const cleaned = cleanTextForSpeech(phraseText);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // natural, slightly slowed pace for learners

    const maleVoice = selectMaleVoice(window.speechSynthesis);
    if (maleVoice) {
      utterance.voice = maleVoice;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }

    utterance.onstart = () => {
      setIsPlayingModelAudio(true);
    };
    utterance.onend = () => {
      setIsPlayingModelAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingModelAudio(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      setSpeechError("O seu navegador não possui suporte total para gravação de voz.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const rec = new SpeechAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
        setRecordedTranscript('');
        setPronunciationScore(null);
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setSpeechError("Acesso ao microfone recusado. Por favor, ative a permissão.");
        } else if (event.error === 'no-speech') {
          setSpeechError("Não detetámos fala. Aproxime-se do microfone e fale pausadamente.");
        } else {
          setSpeechError(`Erro: ${event.error}`);
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecordedTranscript(transcript);

        const score = calculateSimilarity(selectedPhrase, transcript);
        setPronunciationScore(score);

        if (score >= 70) {
          const xp = score >= 90 ? 10 : 5;
          onEarnXp?.(xp);
          showToast(`🏆 Excelente Pronúncia! Acertou ${score}% (+${xp} XP)`);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      setSpeechError(`Erro ao iniciar: ${err.message || err}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const startGuidedRecording = (phrase: string) => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      setSpeechError("O seu navegador não possui suporte total para gravação de voz.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const rec = new SpeechAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
        setGuidedTranscriptResult('');
        setGuidedScore(null);
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setSpeechError("Acesso ao microfone recusado. Ative a permissão.");
        } else if (event.error === 'no-speech') {
          setSpeechError("Não detetámos fala. Aproxime-se e fale pausadamente.");
        } else {
          setSpeechError(`Erro: ${event.error}`);
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setGuidedTranscriptResult(transcript);

        const score = calculateSimilarity(phrase, transcript);
        setGuidedScore(score);

        if (score >= 70) {
          const xp = score >= 90 ? 10 : 5;
          onEarnXp?.(xp);
          showToast(`🏆 Excelente Pronúncia! Acertou ${score}% (+${xp} XP)`);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      setSpeechError(`Erro ao iniciar: ${err.message || err}`);
      setIsRecording(false);
    }
  };

  const getWordStatus = (word: string): 'correct' | 'near' | 'incorrect' => {
    if (!recordedTranscript) return 'incorrect';
    
    const clean = (w: string) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const target = clean(word);
    if (!target) return 'incorrect';

    const cleanTranscript = recordedTranscript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    const transcriptWords = cleanTranscript.split(/\s+/);

    if (transcriptWords.includes(target)) {
      return 'correct';
    }

    const hasNearMatch = transcriptWords.some(tw => {
      const dist = getLevenshteinDistance(target, tw);
      return dist <= 1 && target.length > 2;
    });

    return hasNearMatch ? 'near' : 'incorrect';
  };

  // Show dynamic toast when earning XP
  const showToast = (msg: string) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 4000);
  };

  // Load preset and user goal on mount
  useEffect(() => {
    try {
      const preset = localStorage.getItem('sabush_chat_preset');
      if (preset) {
        setInputText(preset);
        localStorage.removeItem('sabush_chat_preset');
      }
      const goal = localStorage.getItem('sabush_goal');
      if (goal) {
        setUserGoal(goal);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Consumes deep-linking params for specific roleplay scenarios
  useEffect(() => {
    if (initialTutorMode) {
      setTutorMode(initialTutorMode);
    }
    if (initialScenarioId) {
      setSelectedScenario(initialScenarioId);
    }
    if (initialTutorMode || initialScenarioId) {
      onClearInitialParams?.();
    }
  }, [initialTutorMode, initialScenarioId, onClearInitialParams]);

  // Dynamic message lists depending on Mode
  const activeMessages = tutorMode === 'roleplay' ? roleplayMessages : messages;
  const setActiveMessages = tutorMode === 'roleplay' ? setRoleplayMessages : setMessages;

  // Suggested questions to jumpstart conversations
  const suggestions = tutorMode === 'roleplay'
    ? [
        'Could you repeat that, please?',
        'I would like to think about it.',
        'Sorry, I do not understand.',
        'How should I say that in English?',
      ]
    : [
        'Pratica uma conversa de entrevista de emprego',
        'Corrige esta frase',
        'Explica o uso do passado simples',
        'Diferença entre Do vs Does',
      ];

  // Auto scroll to latest text
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Track conversation completion & award XP
    try {
      const isFirstConv = localStorage.getItem('sabush_first_conversation_done') !== 'true';
      if (isFirstConv) {
        localStorage.setItem('sabush_first_conversation_done', 'true');
        onEarnXp?.(15);
        showToast('🏆 Medalha Ganhada: Primeira Conversa! (+15 XP)');
      } else {
        onEarnXp?.(5);
        showToast('✨ Conversa Praticada! (+5 XP)');
      }
    } catch (e) {
      console.warn(e);
    }

    // User Message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Map history correctly for Gemini API consumption on Express side
      const historyPayload = activeMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          level: currentLevel,
          goal: userGoal,
          roleplayScenario: tutorMode === 'roleplay' ? selectedScenario : undefined,
          debateTopic: (tutorMode === 'roleplay' && selectedScenario === 'debate') ? selectedDebateTopic : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha na ligação com o servidor do Tutor.');
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: data.text || 'Lamento, não consegui obter uma resposta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setActiveMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      
      // Fallback offline response so user always gets assistance
      let replyText = `Olá! De momento estou no modo offline local do seu telemóvel para economizar os seus dados móveis. 📶\n\nPodemos praticar as seguintes expressões úteis em inglês:\n• **"Como está?"** é *"How are you?"* (/háu ár iú/)\n• **"Telemóvel"** é *"Mobile phone"* (/móbail fóun/)\n• **"Emprego"** é *"Job"* (/djób/)\n\nEscreve "obrigado" ou "do vs does" para eu te explicar como funciona! Força!`;
      
      if (tutorMode === 'roleplay') {
        if (selectedScenario === 'job_interview') {
          replyText = `Indeed! Thank you for sharing that about yourself. That is a solid introduction. Now, can you describe a major professional challenge you faced at work, and how you managed to resolve it successfully?`;
        } else if (selectedScenario === 'customer_service') {
          replyText = `Alright, but this is a critical delay for my operations! I understand you are trying to help, but can you guarantee this will be completely fixed by the end of today? What is the estimated recovery time?`;
        } else if (selectedScenario === 'street_directions') {
          replyText = `Oh, that is amazing! So if I turn right at the corner by the public square, I will see the big station on my left hand? Is there any famous building nearby that I can look for?`;
        } else {
          replyText = `That makes a lot of sense. Thank you for these department details. What are our key steps for this week to make sure we don't hit any blockers with the project deadline?`;
        }
      }

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setActiveMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScenario = (scenarioId: string) => {
    const sc = ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId);
    if (!sc) return;

    setSelectedScenario(scenarioId);
    setFeedbackText(null);
    if (scenarioId === 'debate') {
      setSelectedDebateTopic(null);
      setRoleplayMessages([]);
    } else {
      setRoleplayMessages([
        {
          id: 'rp-initial',
          role: 'model',
          text: `🎭 **[MODO ROLEPLAY INICIADO: ${sc.name}]**\n\n*Mocho está a interpretar: ${sc.role}*\n\n"${sc.initialMessage}"\n\n*(Tradução de apoio: "${sc.initialMessagePt}")*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  const handleStartDebate = (topicId: string) => {
    const topic = DEBATE_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    setSelectedDebateTopic(topicId);
    setFeedbackText(null);
    setRoleplayMessages([
      {
        id: 'rp-initial',
        role: 'model',
        text: `⚖️ **[MODO DEBATE & PERSUASÃO: ${topic.name}]**\n\n*Mocho está a interpretar: Advogado do Diabo (Devil's Advocate cético)*\n\n"${topic.initialMessage}"\n\n*(Tradução de apoio: "${topic.initialMessagePt}")*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleRequestFeedback = async () => {
    if (!selectedScenario || isLoading) return;

    setIsLoading(true);
    setFeedbackText(null);

    try {
      const historyPayload = roleplayMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Gostaria de encerrar a nossa conversa de simulação de roleplay agora e receber o seu feedback detalhado sobre o meu inglês neste cenário.",
          history: historyPayload,
          level: currentLevel,
          goal: userGoal,
          roleplayScenario: selectedScenario,
          debateTopic: selectedScenario === 'debate' ? selectedDebateTopic : undefined,
          isFeedbackRequest: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao obter feedback do servidor.');
      }

      const data = await res.json();
      setFeedbackText(data.text);
      if (onEarnXp) {
        onEarnXp(20);
        showToast('🏆 Simulação Concluída! Feedback Gerado! (+20 XP)');
      }
    } catch (err: any) {
      console.error(err);
      setFeedbackText(`### 🦉 Relatório do Mocho: Como correu o teu Roleplay? 🎭

Que belíssimo esforço! Completaste o cenário de **${selectedScenario === 'job_interview' ? 'Entrevista de Emprego' : selectedScenario === 'customer_service' ? 'Atendimento ao Cliente' : selectedScenario === 'street_directions' ? 'Pedir Informações' : selectedScenario === 'debate' ? 'Debate & Persuasão' : 'Reunião de Trabalho'}** com grande determinação. Aqui está uma avaliação detalhada do teu inglês:

${selectedScenario === 'debate' ? `#### ⚖️ Persuasão, Conectores & Resiliência
* **Persuasão & Retórica**: Apresentou argumentos concisos e bem posicionados. Conseguiu responder com segurança e defender a sua tese com clareza!
* **Conectores Avançados & Registo**: Para debates formais de alto nível, use conectores como:
  * **"Furthermore"** (/fãr-der-mór/) - Além disso.
  * **"On the other hand"** (/on di á-der hánd/) - Por outro lado.
  * **"Consequently"** (/con-se-cuent-li/) - Consequentemente/Portanto.
* **Resiliência sob Pressão (Pushback)**: Mostrou-se firme perante os desafios do Advogado do Diabo, não cedendo facilmente e respondendo a todas as perguntas difíceis!` : `#### 1. 📝 Análise de Gramática & Escrita
* **Pontos Fortes**: Conseguiste estruturar respostas de forma compreensível e demonstraste excelente reação imediata!
* **Dicas de Aperfeiçoamento**:
  * É comum os alunos usarem o verbo 'have' para idade. Lembra-te: diz-se sempre **"I am... years old"** em vez de "I have..."
  * Atenção ao uso de preposições comuns. Por exemplo: dizemos **"at work"** (no trabalho) ou **"on Monday"** (na segunda-feira).

#### 2. 🗣️ Vocabulário & Novas Expressões
Para brilhares ainda mais no futuro neste mesmo cenário, aprende e pratica estas expressões:
* **"Background"** (/bég-graund/) — Significa *experiência/histórico profissional*. É perfeito para usar em entrevistas (Ex.: *My background is in logistics*).
* **"To follow up"** (/tú fólou-áp/) — Significa *acompanhar/dar seguimento*. Muito útil para reuniões e clientes.
* **"Could you repeat, please?"** (/kúd iú ripít plíz/) — Uma forma super polida de pedir para repetirem quando não compreenderes bem.`}

#### 3. 📉 Comunicação & Fluência
Continuas a progredir lindamente no nível **${currentLevel || 'beginner'}**! O mais importante é o teu desprendimento em falar sem gaguejar. Estás no caminho certo!

---
**🦉 Mocho Coach:** "Erros são as sementes do teu crescimento linguístico. Excelente prática! Força, estamos juntos no Sabush English Club! 🇲🇿✨"`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12.5rem)] max-h-[640px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative">
      {/* AI Header Info bar (Smooth blue gradient as requested) */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center relative border border-white/20 shadow-sm">
            <Mascot expression="talking" size="sm" onDark={true} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#ffffff] text-sm tracking-tight leading-3">Sabush IA Tutor</h3>
            <span className="text-[10px] text-slate-100 font-extrabold flex items-center space-x-1 uppercase mt-0.5 tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
              <span>Mocho Conselheiro ({currentLevel === 'beginner' ? 'Iniciante' : currentLevel === 'intermediate' ? 'Intermediário' : 'Avançado'})</span>
            </span>
          </div>
        </div>
        
        {/* Connection status pills */}
        <span className="text-[10px] bg-emerald-500 text-[#ffffff] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
          Activo
        </span>
      </div>

      {/* Dynamic Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 flex-nowrap overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setTutorMode('tutor');
            setFeedbackText(null);
          }}
          className={`flex-1 min-w-[100px] py-3 text-center text-[11px] sm:text-xs font-black transition-all border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
            tutorMode === 'tutor'
              ? 'border-blue-600 text-blue-750 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-650" />
          <span>Aulas & Dúvidas 🦉</span>
        </button>
        {currentLevel === 'beginner' && (
          <button
            type="button"
            onClick={() => {
              setTutorMode('guided');
              setSelectedGuidedScenario(null);
              setGuidedTurnIndex(0);
              setSelectedOptionIndex(null);
              setGuidedHistory([]);
              setGuidedScore(null);
              setGuidedTranscriptResult('');
            }}
            className={`flex-1 min-w-[115px] py-3 text-center text-[11px] sm:text-xs font-black transition-all border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
              tutorMode === 'guided'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diálogo Guiado 💬</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setTutorMode('roleplay');
          }}
          className={`flex-1 min-w-[95px] py-3 text-center text-[11px] sm:text-xs font-black transition-all border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
            tutorMode === 'roleplay'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Modo Roleplay 🎭</span>
        </button>
      </div>

      {/* Roleplay Active Banner */}
      {tutorMode === 'roleplay' && selectedScenario && !feedbackText && (
        <div className="bg-indigo-50 px-4 py-2.5 border-b border-indigo-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-left mr-2">
            <span className="text-sm">🎭</span>
            <div>
              <span className="text-[11px] text-indigo-900 font-extrabold block leading-tight">
                Cenário: {ROLEPLAY_SCENARIOS.find(s => s.id === selectedScenario)?.name}
              </span>
              <span className="text-[9px] text-indigo-700 uppercase font-black tracking-wider leading-none mt-0.5">
                O Mocho interpretará sem julgar • No fim peça feedback
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleRequestFeedback}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl cursor-pointer shadow-sm flex items-center space-x-1 shrink-0 disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Ver Feedback</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedScenario(null);
                setSelectedDebateTopic(null);
                setFeedbackText(null);
              }}
              className="text-slate-500 hover:text-slate-800 text-[9.5px] bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl font-bold cursor-pointer hover:bg-slate-50"
            >
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Frame */}
      <div className="flex-1 overflow-y-auto p-4.5 space-y-4 bg-slate-50/40 scrollbar-thin">
        {tutorMode === 'guided' ? (
          /* Guided Scenario Selector or active Scenario session */
          !selectedGuidedScenario ? (
            <div className="space-y-4 py-2 animate-fade-in text-left">
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-slate-800">
                <span className="font-extrabold text-xs sm:text-sm text-emerald-900 block flex items-center space-x-1.5 mb-1">
                  <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Diálogos Guiados para Iniciantes (Do Zero) 💬</span>
                </span>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  Não sabe o que falar? Sem problemas! Treine o seu inglês com conversas prontas guiadas pelo Mocho. Escolha uma resposta útil, ouça a pronúncia nativa e grave a sua própria voz para treinar falar desde o primeiro dia!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {GUIDED_SCENARIOS.map((sc) => (
                  <div
                    key={sc.id}
                    className="bg-white border border-slate-200 hover:border-emerald-450 hover:shadow-md p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-emerald-100 bg-emerald-50 font-semibold text-lg shrink-0">
                          {sc.emoji}
                        </div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-800 tracking-tight leading-tight">{sc.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mb-4 font-semibold">{sc.description}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGuidedScenario(sc.id);
                        setGuidedTurnIndex(0);
                        setSelectedOptionIndex(null);
                        setGuidedHistory([]);
                        setGuidedScore(null);
                        setGuidedTranscriptResult('');
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-black tracking-wide text-center cursor-pointer transition-all min-h-[38px] flex items-center justify-center space-x-1"
                    >
                      <span>Começar Diálogo</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Active Guided dialogue section */
            (() => {
              const scenario = GUIDED_SCENARIOS.find(s => s.id === selectedGuidedScenario);
              if (!scenario) return null;

              const isCompleted = guidedTurnIndex >= scenario.turns.length;

              return (
                <div className="space-y-4 py-2 animate-fade-in text-left">
                  {/* Scenario progress bar & header */}
                  <div className="bg-emerald-50/50 border border-emerald-150 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 block">Sessão Ativa: {scenario.name}</span>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Siga as instruções e responda às perguntas do Mocho.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-950 bg-white px-2.5 py-1.5 border border-emerald-150 rounded-xl">
                        {isCompleted ? 'Concluído 🎉' : `Turno ${guidedTurnIndex + 1} de ${scenario.turns.length}`}
                      </span>
                    </div>
                  </div>

                  {/* Conversation History */}
                  <div className="space-y-4 bg-white/70 border border-slate-150 rounded-2xl p-4 min-h-[140px]">
                    {/* Render past turns */}
                    {guidedHistory.map((h, hIdx) => (
                      <React.Fragment key={hIdx}>
                        {/* Mocho */}
                        <div className="flex items-start">
                          <div className="h-7 w-7 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mr-2 shrink-0 border border-emerald-150">
                            <Mascot expression="standard" size="sm" />
                          </div>
                          <div className="bg-emerald-50 text-emerald-950 text-xs sm:text-sm p-3 rounded-2xl rounded-tl-none border border-emerald-100 max-w-[85%]">
                            <p className="font-bold">{h.mocho}</p>
                            <p className="text-[10px] text-emerald-700/85 mt-1 italic">({h.mPt})</p>
                          </div>
                        </div>

                        {/* User reply */}
                        {h.user && (
                          <div className="flex items-start justify-end">
                            <div className="bg-zinc-800 text-white text-xs sm:text-sm p-3 rounded-2xl rounded-tr-none max-w-[85%] text-left">
                              <p className="font-bold">{h.user}</p>
                              {h.uPt && <p className="text-[10px] text-zinc-300 mt-1 italic">({h.uPt})</p>}
                            </div>
                            <div className="h-7 w-7 bg-zinc-200 text-zinc-850 rounded-lg flex items-center justify-center ml-2 shrink-0 border border-zinc-350">
                              <User className="w-3.5 h-3.5 text-zinc-650" />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Active turn or completion summary */}
                    {!isCompleted ? (
                      <div className="flex items-start animate-fade-in">
                        <div className="h-7 w-7 bg-emerald-55 text-emerald-800 rounded-lg flex items-center justify-center mr-2 shrink-0 border border-emerald-150">
                          <Mascot expression="talking" size="sm" />
                        </div>
                        <div className="bg-emerald-50 text-emerald-950 text-xs sm:text-sm p-3 rounded-2xl rounded-tl-none border border-emerald-100 max-w-[85%]">
                          <p className="font-bold">{scenario.turns[guidedTurnIndex].mochoText}</p>
                          <p className="text-[10px] text-emerald-700/85 mt-1 italic">({scenario.turns[guidedTurnIndex].mochoTextPt})</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start animate-bounce">
                        <div className="h-7 w-7 bg-emerald-55 text-emerald-800 rounded-lg flex items-center justify-center mr-2 shrink-0 border border-emerald-150">
                          <Mascot expression="happy" size="sm" />
                        </div>
                        <div className="bg-emerald-50 text-emerald-950 text-xs sm:text-sm p-4 rounded-2xl rounded-tl-none border border-emerald-100 max-w-[85%] space-y-2">
                          <p className="font-extrabold text-emerald-950">🎉 Parabéns! Diálogo Terminado!</p>
                          <p className="font-bold leading-normal text-xs">{scenario.finalMochoText}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Selection / Interactive responses panel */}
                  {!isCompleted ? (
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 animate-fade-in">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Selecione uma resposta recomendada:</span>
                      
                      <div className="grid grid-cols-1 gap-2.5">
                        {scenario.turns[guidedTurnIndex].options.map((opt, oIdx) => {
                          const isSel = selectedOptionIndex === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setSelectedOptionIndex(oIdx);
                                setGuidedScore(null);
                                setGuidedTranscriptResult('');
                                setSpeechError(null);
                              }}
                              className={`p-3 rounded-xl border text-left text-xs transition-all relative flex flex-col justify-between cursor-pointer ${
                                isSel
                                  ? 'bg-white border-2 border-emerald-500 shadow-sm animate-fade-in'
                                  : 'bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-bold text-slate-900 pr-4 leading-normal">{opt.en}</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSel ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                                }`}>
                                  {isSel && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold italic mt-1">{opt.pt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Control buttons when an option is selected */}
                      {selectedOptionIndex !== null && (
                        <div className="mt-3.5 bg-white border border-slate-150 p-3.5 rounded-xl space-y-3">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            {/* Listen Guidance */}
                            <button
                              type="button"
                              onClick={() => playModelAudio(scenario.turns[guidedTurnIndex].options[selectedOptionIndex].en)}
                              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black rounded-lg cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Ouvir de Viva Voz</span>
                            </button>

                            {/* Standard Speak aloud */}
                            {isRecording ? (
                              <button
                                type="button"
                                onClick={stopRecording}
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-brand-red-600 text-white text-[11px] font-black rounded-lg cursor-pointer animate-pulse"
                              >
                                <MicOff className="w-3.5 h-3.5 shrink-0" />
                                <span>Parar Gravação...</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startGuidedRecording(scenario.turns[guidedTurnIndex].options[selectedOptionIndex].en)}
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black rounded-lg cursor-pointer"
                              >
                                <Mic className="w-3.5 h-3.5 shrink-0" />
                                <span>Dizer de viva voz 🎙️</span>
                              </button>
                            )}

                            {/* Direct tap to send */}
                            <button
                              type="button"
                              onClick={() => {
                                const opt = scenario.turns[guidedTurnIndex].options[selectedOptionIndex];
                                const currentTurn = scenario.turns[guidedTurnIndex];
                                
                                // Record the turn completed
                                setGuidedHistory(prev => [
                                  ...prev,
                                  {
                                    mocho: currentTurn.mochoText,
                                    mPt: currentTurn.mochoTextPt,
                                    user: opt.en,
                                    uPt: opt.pt
                                  }
                                ]);

                                // Advanced indices
                                setGuidedTurnIndex(prev => prev + 1);
                                setSelectedOptionIndex(null);
                                setGuidedScore(null);
                                setGuidedTranscriptResult('');
                                onEarnXp?.(5);
                                showToast('✨ Resposta Enviada! (+5 XP)');
                              }}
                              className="w-full sm:w-auto ml-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg cursor-pointer shadow-sm"
                            >
                              <span>Confirmar & Enviar</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Speech feedback inside active menu */}
                          {guidedTranscriptResult && (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-1 mt-2 animate-fade-in">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-slate-500 font-mono">O que falaste:</span>
                                {guidedScore !== null && (
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                    guidedScore >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {guidedScore}% Compatibilidade
                                  </span>
                                )}
                              </div>
                              <p className="text-xs italic text-slate-800 font-bold">"{guidedTranscriptResult}"</p>
                              {guidedScore !== null && (
                                <p className="text-[10px] text-slate-500 font-semibold">
                                  {guidedScore >= 70 
                                    ? '✅ Fantástico! A sua pronúncia foi validada com sucesso! Clique em Confirmar para prosseguir com bónus!' 
                                    : '💡 Quase lá! Deu para perceber, mas tente falar um bocado mais devagar após clicar Ouvir.'}
                                </p>
                              )}
                            </div>
                          )}

                          {speechError && (
                            <p className="text-[10px] text-brand-red-700 font-black p-2 bg-red-50 rounded-lg leading-tight mt-1">
                              {speechError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Dialogue finished - Bridge options */
                    <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-4 text-center space-y-4 shadow-sm animate-fade-in">
                      <div>
                        <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-widest block">🎉 Diálogo Guiado Concluído!</span>
                        <p className="text-xs text-emerald-800 font-semibold mt-1">Acaba de completar com pleno sucesso esta situação simulada!</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGuidedScenario(null);
                            setGuidedTurnIndex(0);
                            setSelectedOptionIndex(null);
                            setGuidedHistory([]);
                            setGuidedScore(null);
                            setGuidedTranscriptResult('');
                          }}
                          className="w-full sm:w-auto px-4.5 py-3 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-black text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
                        >
                          <RotateCcw className="w-4 h-4 animate-spin-slow" />
                          <span>Repetir Diálogo</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            // Bridge option: Switch to Aulas & Dúvidas (Tutor mode) and seed input
                            setTutorMode('tutor');
                            setFeedbackText(null);
                            setSelectedScenario(null);
                            
                            // Seed text and fire
                            setInputText(scenario.bridgePrompt);
                            // We can let the user click submit or we can trigger it immediately to be amazing:
                            setTimeout(() => {
                              handleSendMessage(scenario.bridgePrompt);
                            }, 100);
                          }}
                          className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-[#ffffff] font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                          <span>Tentar sem Ajuda 🚀</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )
        ) : tutorMode === 'roleplay' && selectedScenario === 'debate' && !selectedDebateTopic ? (
          <div className="space-y-4 py-2 animate-fade-in text-left">
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-slate-800">
              <span className="font-extrabold text-xs sm:text-sm text-indigo-900 block flex items-center space-x-1.5 mb-1">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                <span>Selecione o Tema do Debate ⚖️</span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-semibold">
                Você escolheu o cenário de **Debate & Persuasão**. O Mocho assumirá uma posição cética e desafiadora (Advogado do Diabo) para o forçar a usar argumentos persuasivos, conectores complexos e defender a sua posição sob pressão. Escolha um dos temas abaixo para iniciar:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {DEBATE_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md p-4 rounded-2xl shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{topic.emoji}</span>
                      <h4 className="font-black text-xs sm:text-sm text-slate-800">{topic.name}</h4>
                    </div>
                    <p className="text-[11px] text-indigo-900/90 font-extrabold mt-0.5">{topic.descriptionEn}</p>
                    <p className="text-[11px] text-slate-500 font-semibold italic">({topic.descriptionPt})</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartDebate(topic.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-black tracking-wide text-center cursor-pointer transition-all self-start sm:self-center shrink-0 min-h-[38px] flex items-center justify-center space-x-1"
                  >
                    <span>Começar Debate</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : tutorMode === 'roleplay' && !selectedScenario ? (
          <div className="space-y-4 py-2 animate-fade-in text-left">
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-slate-800">
              <span className="font-extrabold text-xs sm:text-sm text-indigo-900 block flex items-center space-x-1.5 mb-1">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                <span>Simulador de Cenários Reais 🎭</span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Pratica o teu inglês em situações reais profissionais e sociais. O Mocho stays in character e responde inteiramente como a personagem, sem te interromper para correções intermédias. Ao encerrares a conversa, pede o teu relatório gramatical estruturado em português!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {ROLEPLAY_SCENARIOS.filter((sc) => !sc.isAdvancedOnly || currentLevel === 'advanced').map((sc) => {
                let iconColor = 'bg-blue-50 text-blue-600 border-blue-100';
                if (sc.id === 'job_interview') iconColor = 'bg-amber-50 text-amber-600 border-amber-100';
                if (sc.id === 'customer_service') iconColor = 'bg-rose-50 text-rose-600 border-rose-100';
                if (sc.id === 'street_directions') iconColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                if (sc.id === 'business_meeting') iconColor = 'bg-purple-50 text-purple-600 border-purple-100';
                if (sc.id === 'debate') iconColor = 'bg-red-50 text-red-650 border-red-100';

                return (
                  <div
                    key={sc.id}
                    className="bg-white border border-slate-200 hover:border-indigo-450 hover:shadow-md p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border font-semibold text-lg ${iconColor}`}>
                          {sc.emoji}
                        </div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-800 tracking-tight">{sc.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mb-4 font-semibold">{sc.description}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleStartScenario(sc.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-xl text-xs font-black tracking-wide text-center cursor-pointer transition-all min-h-[38px] flex items-center justify-center space-x-1"
                    >
                      <span>Entrar no Cenário</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : tutorMode === 'roleplay' && feedbackText ? (
          <div className="space-y-4 py-2 animate-fade-in text-left">
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-950 shadow-md relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-15">
                <Mascot expression="happy" size="lg" onDark={true} />
              </div>
              <div className="flex items-center space-x-2.5 mb-3.5">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white">Relatório de Avaliação do Mocho</h4>
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">Feedback Gramatical em Português</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-slate-100">
                {renderMarkdown(feedbackText)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackText(null);
                  if (selectedScenario) {
                    handleStartScenario(selectedScenario);
                  }
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-[#ffffff] font-extrabold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Refazer Conversação</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedScenario(null);
                  setSelectedDebateTopic(null);
                  setFeedbackText(null);
                }}
                className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm min-h-[44px]"
              >
                <span>Escolher Outro Cenário</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Reassuring Safe Space note */}
            <div className="p-4 bg-blue-50/30 border-2 border-dashed border-blue-200 rounded-2xl text-slate-800 flex items-start space-x-3 shadow-sm animate-fade-in">
              <div className="text-xl leading-none shrink-0">✨</div>
              <div>
                <span className="font-extrabold block text-slate-800 text-xs sm:text-sm">
                  {tutorMode === 'roleplay' ? 'Modo de Imersão Ativo 🎭' : 'Sabush Safe Zone Practice Room 🌍'}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-1">
                  {tutorMode === 'roleplay'
                    ? 'A conversar com a personagem em inglês. O Mocho não fará correções até pedir o relatório clicando em Ver Feedback.'
                    : 'Este é o seu espaço seguro de treino livre em inglês! Escreva ou fale sem receio de errar. Estou aqui como o seu tutor de IA dedicado, paciente e pronto para acompanhar o seu progresso passo a passo.'}
                </p>
              </div>
            </div>

            {activeMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {!isUser && (
                    <div className="h-8 w-8 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center mr-2 shrink-0 border border-slate-200 mt-0.5">
                      <Mascot expression="standard" size="sm" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#1e3a8a] text-white rounded-tr-none border border-blue-700/30'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Format and highlight bold segments easily */}
                    <div className="space-y-1.5 whitespace-pre-line text-sm leading-relaxed">
                      {msg.text.split('**').map((chunk, i) => {
                        return i % 2 === 1 
                          ? <strong key={i} className={isUser ? "text-slate-100 font-extrabold underline decoration-blue-300" : "text-[#1e3a8a] font-extrabold bg-blue-50 px-1 rounded"}>{chunk}</strong> 
                          : chunk;
                      })}
                    </div>
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleStartVoicePractice(msg.text)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition-colors"
                          title="Praticar pronúncia de frases em inglês deste texto"
                        >
                          <Mic className="w-3 h-3 text-blue-650 shrink-0" />
                          <span>Treinar Pronúncia</span>
                        </button>
                        <span className="text-[9px] text-slate-400">Escute & fale</span>
                      </div>
                    )}
                    <span className={`block text-[9px] text-right mt-2 ${isUser ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center ml-2 shrink-0 border border-slate-200 mt-0.5">
                      <User className="w-4 h-4 text-slate-600 stroke-[2.2]" />
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start justify-start animate-pulse">
            <div className="h-8 w-8 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center mr-2 shrink-0 border border-slate-200">
              <Mascot expression="thinking" size="sm" />
            </div>
            <div className="bg-white border border-slate-200 rounded-tl-none rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2 shadow-sm">
              <Loader className="w-4 h-4 animate-spin text-brand-red-500" />
              <span className="font-bold">O Sabush está a responder...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedPhrase ? (
        <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-3.5 shrink-0" id="pronunciation_practice_drawer">
          {/* Practice Header with info level indicator */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brand-red-700 bg-brand-red-50 border border-brand-red-200 font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm">
              <Mic className="w-3.5 h-3.5 text-brand-red-600 animate-pulse" />
              <span>Pronúncia ({extractedPhrases.indexOf(selectedPhrase) + 1} de {extractedPhrases.length})</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedPhrase('');
                setRecordedTranscript('');
                setPronunciationScore(null);
                setSpeechError(null);
              }}
              className="p-1 px-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all cursor-pointer flex items-center space-x-1 border border-slate-200 bg-white shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              <span>Voltar ao Chat</span>
            </button>
          </div>

          {/* If multiple phrases exist, offer them as clickable pills */}
          {extractedPhrases.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {extractedPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhrase(phrase);
                    setRecordedTranscript('');
                    setPronunciationScore(null);
                    setSpeechError(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wide transition-all shrink-0 cursor-pointer ${
                    selectedPhrase === phrase
                      ? 'bg-brand-navy-900 border-2 border-brand-red-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Frase {idx + 1}
                </button>
              ))}
            </div>
          )}

          {/* Interactive feedback card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-3.5 shadow-sm relative overflow-hidden">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Estude a frase & repita:</span>
            
            {/* Display letters in matching colored highlight if user already transcripted */}
            <div className="text-sm sm:text-base font-black tracking-tight text-slate-800 leading-relaxed px-1">
              {selectedPhrase.split(/\s+/).map((word, idx) => {
                if (!recordedTranscript) {
                  return <span key={idx} className="inline-block mr-1 text-slate-900">{word}</span>;
                }
                const status = getWordStatus(word);
                const colorClass = status === 'correct' 
                  ? 'text-emerald-600 font-black decoration-emerald-400 decoration-2 underline' 
                  : status === 'near' 
                  ? 'text-brand-red-600 font-bold decoration-brand-red-300 decoration-1 underline' 
                  : 'text-slate-400 font-medium';
                return (
                  <span key={idx} className={`inline-block mr-1 transition-colors ${colorClass}`}>
                    {word}
                  </span>
                );
              })}
            </div>

            {isPlayingModelAudio && (
              <p className="text-[10px] text-zinc-600 font-black tracking-normal animate-pulse">Reproduzindo guia de voz...</p>
            )}

            {/* Transcription comparison result panel */}
            {recordedTranscript && (
              <div className="pt-3 border-t border-slate-100 text-left space-y-1.5 bg-slate-50/50 p-3 rounded-2xl">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-slate-500 uppercase tracking-wider">O que disseres:</span>
                  {pronunciationScore !== null && (
                    <span className={`font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                      pronunciationScore >= 90 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : pronunciationScore >= 70 
                        ? 'bg-brand-red-100 text-brand-red-800 border border-brand-red-200' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {pronunciationScore}% Compatível
                    </span>
                  )}
                </div>
                <p className="text-xs italic text-slate-700 font-black">"{recordedTranscript}"</p>
                
                {pronunciationScore !== null && (
                  <p className="text-[11px] font-bold text-slate-600 mt-1">
                    {pronunciationScore >= 90 
                      ? "🌟 Magnífico! Fantástica pronúncia inglesa!" 
                      : pronunciationScore >= 70 
                      ? "👍 Muito bom! Tem uma boa dicção, continue assim!" 
                      : "💡 Sugestão: Clique em 'Ouvir' para escutar o mocho, depois tente repetir devagar."}
                  </p>
                )}
              </div>
            )}

            {/* Display record / permission errors */}
            {speechError && (
              <p className="text-[10px] text-brand-red-700 font-black p-2.5 bg-red-50/80 rounded-xl border border-red-200 leading-tight">
                {speechError}
              </p>
            )}

            {/* Speaking buttons layout */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => playModelAudio(selectedPhrase)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border font-extrabold text-xs cursor-pointer transition-all ${
                  isPlayingModelAudio 
                    ? 'bg-zinc-900 border-transparent text-white shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm'
                }`}
              >
                {isPlayingModelAudio ? (
                  <div className="flex items-end space-x-[1.5px] h-4 w-4 pb-[1.5px] justify-center mr-0.5 shrink-0">
                    <div className="w-[2px] bg-yellow-350 bg-amber-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                    <div className="w-[2px] bg-yellow-350 bg-amber-400 rounded-full animate-bounce h-4" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                    <div className="w-[2px] bg-yellow-350 bg-amber-400 rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                  </div>
                ) : (
                  <Volume2 className="w-4 h-4 text-zinc-650 shrink-0" />
                )}
                <span>Ouvir Guia</span>
              </button>

              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-brand-red-600 animate-pulse text-[#ffffff] font-extrabold text-xs rounded-xl shadow-md cursor-pointer hover:bg-brand-red-700 transition-all border border-transparent"
                >
                  <MicOff className="w-4 h-4 text-white shrink-0" />
                  <span>Parar Gravação</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-brand-red-600 text-[#ffffff] font-extrabold text-xs rounded-xl shadow-md cursor-pointer hover:bg-brand-red-700 border border-transparent transition-all"
                >
                  <Mic className="w-4 h-4 text-white shrink-0" />
                  <span>Gravar Voz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Only render inputs and buttons if NOT in Scenario Choosing layout or Feedback view and NOT in guided mode */
        tutorMode !== 'guided' && !(tutorMode === 'roleplay' && (!selectedScenario || (selectedScenario === 'debate' && !selectedDebateTopic) || feedbackText)) && (
          <div className="shrink-0">
            {/* Suggested Fast Prompts Drawer with stylish golden boundaries */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-white">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1.5">Toque para responder ou perguntar:</span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(sug)}
                    className="px-3.5 py-2 rounded-full bg-slate-50 hover:bg-brand-red-50 hover:text-brand-red-800 hover:border-brand-red-400 text-slate-700 text-xs font-bold border border-slate-200 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Send Input form (Large tap actions for phone screens) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center space-x-2.5"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={tutorMode === 'roleplay' ? "Pratique a sua resposta em inglês..." : "Escreva a sua dúvida de inglês..."}
                disabled={isLoading}
                className="flex-1 bg-white border border-slate-300 px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-brand-red-500/20 focus:border-brand-red-500 outline-none transition-all disabled:opacity-50 min-h-[44px] shadow-inner font-medium text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`p-3.5 rounded-xl text-white transition-all cursor-pointer flex items-center justify-center ${
                  inputText.trim() && !isLoading
                    ? 'bg-brand-red-600 hover:bg-brand-red-700 border border-transparent text-white shadow-md'
                    : 'bg-slate-200 text-slate-400 border border-slate-200/50 cursor-not-allowed'
                }`}
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )
      )}

      {/* Floating XP Toast feedback */}
      {xpToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-brand-red-500/30 text-white font-black px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-2 text-xs animate-bounce z-50">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{xpToast}</span>
        </div>
      )}
    </div>
  );
}
