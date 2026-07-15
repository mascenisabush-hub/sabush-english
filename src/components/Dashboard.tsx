/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { EnglishLevel, Certificate, VocabularyProgress, LeitnerWordProgress } from '../types';
import { LESSONS } from '../data';
import { VocabularyFlashcards } from './VocabularyFlashcards';
import { Leaderboard } from './Leaderboard';
import { CertificateView } from './CertificateView';
import { getVocabularyProgress, saveVocabularyProgress, syncProgress } from '../firebase';
import { 
  Award, 
  Flame, 
  Star, 
  BookOpen, 
  Sparkles, 
  Trophy, 
  CheckCircle, 
  Volume2, 
  Brain, 
  ChevronRight, 
  HelpCircle, 
  GraduationCap, 
  Calendar, 
  X, 
  ArrowRight, 
  Activity,
  AwardIcon
} from 'lucide-react';
import { Mascot } from './Mascot';
import { selectMaleVoice, cleanTextForSpeech } from '../utils/voice';

interface DashboardProps {
  xp: number;
  streak: number;
  completedLessonsCount: number;
  completedLessons: string[];
  currentLevel: EnglishLevel;
  onResetStats: () => void;
  onNavigateToLessons: () => void;
  onEarnXp: (amount: number) => void;
  currentUserId?: string;
  onRegisterBack?: (handler: (() => boolean) | null) => void;
  certificate?: Certificate | null;
  onSimulateCompletion?: () => void;
  guidedConfidenceDay?: number;
  onNavigateToTab?: (tab: string) => void;
  initialReviewActive?: boolean;
  initialFlashcardWords?: any[];
  onClearInitialParams?: () => void;
}

export function Dashboard({ 
  xp, 
  streak, 
  completedLessonsCount, 
  completedLessons, 
  currentLevel, 
  onResetStats, 
  onNavigateToLessons,
  onEarnXp,
  currentUserId,
  onRegisterBack,
  certificate,
  onSimulateCompletion,
  guidedConfidenceDay,
  onNavigateToTab,
  initialReviewActive,
  initialFlashcardWords,
  onClearInitialParams
}: DashboardProps) {
  
  // Track Spaced Repetition quiz state
  const [reviewActive, setReviewActive] = useState<boolean>(false);
  const [showCertificateMode, setShowCertificateMode] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState<boolean>(false);
  const [gainedXpFromReview, setGainedXpFromReview] = useState<number>(0);
  const [concludedQuiz, setConcludedQuiz] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(false);
  const [vocabTab, setVocabTab] = useState<'flashcards' | 'quiz'>('flashcards');
  const [pronouncingWord, setPronouncingWord] = useState<string | null>(null);

  // Spaced Repetition state & constants
  const [leitnerProgress, setLeitnerProgress] = useState<VocabularyProgress | null>(null);
  const [isLoadingLeitner, setIsLoadingLeitner] = useState<boolean>(false);
  const [quizWordResults, setQuizWordResults] = useState<{ [word: string]: boolean }>({});

  const BOX_INTERVAL_DAYS: { [key: number]: number } = {
    1: 1,
    2: 3,
    3: 7,
    4: 14,
    5: 30
  };

  useEffect(() => {
    if (currentUserId) {
      setIsLoadingLeitner(true);
      getVocabularyProgress(currentUserId).then((prog) => {
        if (prog) {
          setLeitnerProgress(prog);
        } else {
          setLeitnerProgress({
            userId: currentUserId,
            words: {},
            updatedAt: new Date().toISOString()
          });
        }
        setIsLoadingLeitner(false);
      }).catch(err => {
        console.warn("Failed to fetch Leitner progress:", err);
        setIsLoadingLeitner(false);
      });
    }
  }, [currentUserId]);

  const getWordLeitnerState = (wordEn: string) => {
    if (leitnerProgress && leitnerProgress.words && leitnerProgress.words[wordEn]) {
      return leitnerProgress.words[wordEn];
    }
    return {
      en: wordEn,
      box: 1,
      nextReviewDate: new Date(0).toISOString(),
      lastReviewedAt: new Date(0).toISOString(),
    };
  };

  // Consumes deep-linking params for flashcard review
  useEffect(() => {
    if (initialReviewActive) {
      setReviewActive(true);
    }
    if (initialReviewActive || initialFlashcardWords) {
      onClearInitialParams?.();
    }
  }, [initialReviewActive, initialFlashcardWords, onClearInitialParams]);

  // Register back-button handler for vocabulary review quiz
  useEffect(() => {
    if (reviewActive && onRegisterBack) {
      onRegisterBack(() => {
        // Quietly exit without blocking confirm in iframe
        setReviewActive(false);
        setConcludedQuiz(false);
        return true;
      });
    } else {
      if (onRegisterBack) onRegisterBack(null);
    }
    return () => {
      if (onRegisterBack) onRegisterBack(null);
    };
  }, [reviewActive, onRegisterBack]);
  
  // Starter words as fallback if no lessons are completed yet
  const starterWords = [
    { en: "Welcome", pt: "Bem-vindo", pronunciation: "/uélcam/" },
    { en: "Thank you", pt: "Obrigado", pronunciation: "/ténk iú/" },
    { en: "Job", pt: "Emprego / Trabalho", pronunciation: "/djób/" },
    { en: "Business", pt: "Negócios / Comércio", pronunciation: "/bíznis/" },
    { en: "Friend", pt: "Amigo", pronunciation: "/frénd/" },
  ];

  // Dynamically compute unique vocabulary words from completed lessons
  const learnedWords: { en: string; pt: string; pronunciation: string; lessonId?: string; lessonTitle?: string }[] = [];
  LESSONS.forEach(lesson => {
    if (completedLessons.includes(lesson.id)) {
      lesson.vocabulary.forEach(vocab => {
        if (!learnedWords.some(w => w.en.toLowerCase() === vocab.en.toLowerCase())) {
          learnedWords.push({
            ...vocab,
            lessonId: lesson.id,
            lessonTitle: lesson.titlePt
          });
        }
      });
    }
  });

  const totalVocabularyCount = learnedWords.length;

  // Leitner-prioritized words list
  const getPrioritizedWords = () => {
    const baseWords = totalVocabularyCount > 0 ? learnedWords : starterWords;
    
    // Find words that are due today or earlier
    const due = baseWords.filter(w => {
      const state = getWordLeitnerState(w.en);
      return new Date(state.nextReviewDate).getTime() <= Date.now();
    });
    
    if (due.length > 0) {
      return due;
    }
    
    // Fallback: sort by lastReviewedAt ascending (least recently reviewed words)
    return [...baseWords].sort((a, b) => {
      const stateA = getWordLeitnerState(a.en);
      const stateB = getWordLeitnerState(b.en);
      return new Date(stateA.lastReviewedAt).getTime() - new Date(stateB.lastReviewedAt).getTime();
    });
  };

  const wordsToReview = initialFlashcardWords && initialFlashcardWords.length > 0 ? initialFlashcardWords : getPrioritizedWords();

  // Track if first conversation chat badge is unlocked via localStorage
  const [firstConversationDone, setFirstConversationDone] = useState<boolean>(false);
  useEffect(() => {
    try {
      const chatDone = localStorage.getItem('sabush_first_conversation_done') === 'true';
      setFirstConversationDone(chatDone);
    } catch (e) {
      console.warn(e);
    }
  }, [reviewActive]);

  // Determine learner Level milestone progress targets
  let levelTitle = '';
  let nextLevelName = '';
  let xpForCurrentLevelFloor = 0;
  let xpForNextLevelGoal = 100;

  if (currentLevel === 'beginner') {
    levelTitle = 'Iniciante (Do Zero)';
    nextLevelName = 'Intermediário (Trabalho)';
    xpForCurrentLevelFloor = 0;
    xpForNextLevelGoal = 100;
  } else if (currentLevel === 'intermediate') {
    levelTitle = 'Intermediário (Trabalho)';
    nextLevelName = 'Avançado (Profissional)';
    xpForCurrentLevelFloor = 100;
    xpForNextLevelGoal = 250;
  } else {
    levelTitle = 'Avançado (Fluência Total)';
    nextLevelName = 'Mestria Sabush';
    xpForCurrentLevelFloor = 250;
    xpForNextLevelGoal = 500;
  }

  // Calculate percentage progress towards next English level
  const levelXpRange = xpForNextLevelGoal - xpForCurrentLevelFloor;
  const relativeXpInLevel = Math.max(0, xp - xpForCurrentLevelFloor);
  const levelProgressPercent = Math.min(100, Math.floor((relativeXpInLevel / levelXpRange) * 100));

  // Determine Learner Rank title based on total XP
  let rankTitle = 'Recruta do Club';
  let rankDesc = 'A iniciar no caminho da fluência.';
  
  if (xp >= 300) {
    rankTitle = 'Embaixador Fluente';
    rankDesc = 'Excelente orador e comunicador global!';
  } else if (xp >= 150) {
    rankTitle = 'Inovador Profissional';
    rankDesc = 'Já domina termos de negócios e apresentações.';
  } else if (xp >= 50) {
    rankTitle = 'Cabo de Mar (Estudioso)';
    rankDesc = 'Consegue se apresentar e falar da rotina com facilidade.';
  } else if (xp >= 20) {
    rankTitle = 'Pioneiro do Inglês';
    rankDesc = 'Primeiros passos firmes garantidos!';
  }

  // Set up the dynamic badges/achievements roster
  const achievementsList = [
    {
      id: 'first_lesson',
      title: 'Primeiro Kanimambo',
      desc: 'Completou a primeira lição interactiva com sucesso.',
      unlocked: completedLessonsCount >= 1,
      requirement: 'Completar 1 lição activa',
    },
    {
      id: 'conversation',
      title: 'Língua Afiada',
      desc: 'Completou a sua primeira conversa ou pergunta ao nosso Tutor de IA.',
      unlocked: firstConversationDone,
      requirement: 'Enviar mensagem no Chat',
    },
    {
      id: 'rising_star',
      title: 'Pequeno Mocho',
      desc: 'Mais de 50 pontos de experiência (XP) acumulados.',
      unlocked: xp >= 50,
      requirement: 'Acumular 50 XP',
    },
    {
      id: 'vocabulary_master',
      title: 'Baú de Vocábulos',
      desc: 'Desbloqueou e apreendeu mais de 15 palavras no dicionário.',
      unlocked: totalVocabularyCount >= 15,
      requirement: 'Dominar 15 palavras (completando lições)',
    },
    {
      id: 'streak_master',
      title: 'Constância de Ferro',
      desc: 'Garantiu 7 ou mais dias de estudo diário consecutivo.',
      unlocked: streak >= 7,
      requirement: 'Atingir sequência de 7 dias',
    },
  ];

  // Helper function to synthesize text-to-speech
  const playWordAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stifle any ongoing speech
        
        const cleaned = cleanTextForSpeech(word);
        if (!cleaned) return;

        const utterance = new SpeechSynthesisUtterance(cleaned);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // perfect, natural slow speed for phonetic capture

        // Select the best male voice available
        const maleVoice = selectMaleVoice(window.speechSynthesis);
        if (maleVoice) {
          utterance.voice = maleVoice;
        }

        utterance.onstart = () => {
          setPronouncingWord(cleaned);
        };
        utterance.onend = () => {
          setPronouncingWord(null);
        };
        utterance.onerror = () => {
          setPronouncingWord(null);
        };

        window.speechSynthesis.speak(utterance);
        setAudioFeedback(true);
        setTimeout(() => setAudioFeedback(false), 800);
      } catch (err) {
        console.warn('Speech synthesis unsupported or restricted:', err);
        setPronouncingWord(null);
      }
    }
  };

  // Generate spaced repetition vocabulary review quiz questions
  const startReviewQuiz = () => {
    // Pick 3 words to construct quiz. If words are few, reuse them. Shuffling:
    const shuffledWords = [...wordsToReview].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, 3);

    // Create quiz questions list
    const questionsList = selectedWords.map(word => {
      // Gather incorrect options from all available vocabulary translations
      const allPossibleTranslations = Array.from(
        new Set([
          ...starterWords.map(w => w.pt),
          ...LESSONS.flatMap(l => l.vocabulary.map(v => v.pt))
        ])
      );

      // Filter out correct option
      const wrongPool = allPossibleTranslations.filter(pt => pt.toLowerCase() !== word.pt.toLowerCase());
      // Select 3 random incorrect translations
      const incorrectPt = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      // Shuffle correct and incorrect translations
      const options = [word.pt, ...incorrectPt].sort(() => 0.5 - Math.random());
      const correctAnswerIndex = options.indexOf(word.pt);

      return {
        word: word.en,
        pronunciation: word.pronunciation,
        options,
        correctAnswerIndex,
      };
    });

    setQuizQuestions(questionsList);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setCheckedAnswer(false);
    setGainedXpFromReview(0);
    setConcludedQuiz(false);
    setReviewActive(true);
  };

  // Answer handling
  const handleSelectAnswer = (optionIdx: number) => {
    if (checkedAnswer) return;
    setSelectedAnswerIndex(optionIdx);
  };

  const handleVerifyAnswer = () => {
    if (selectedAnswerIndex === null || checkedAnswer) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setGainedXpFromReview(prev => prev + 5); // +5 XP for each correct review word answer!
    }

    // Buffer output of current word answers for committing on save
    setQuizWordResults(prev => ({
      ...prev,
      [currentQuestion.word]: isCorrect
    }));

    setCheckedAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setCheckedAnswer(false);
    } else {
      setConcludedQuiz(true);
    }
  };

  const handleSaveReviewProgress = async () => {
    // Commit the review XP to global state
    const xpBonus = gainedXpFromReview;
    if (xpBonus > 0) {
      onEarnXp(xpBonus);
    }
    
    // Save review timestamp to local storage
    try {
      localStorage.setItem('sabush_vocab_reviewed_at', new Date().toLocaleString());
    } catch (e) {
      console.warn(e);
    }

    // Save Spaced Repetition vocabulary progress updates to Firestore
    if (currentUserId && leitnerProgress) {
      const updatedWords = { ...leitnerProgress.words };
      
      Object.entries(quizWordResults).forEach(([wordEn, isCorrect]) => {
        const currentWordState = { ...getWordLeitnerState(wordEn) };
        let newBox = 1;
        if (isCorrect) {
          newBox = Math.min(5, currentWordState.box + 1);
        } else {
          newBox = 1;
        }

        const nextDate = new Date(Date.now() + BOX_INTERVAL_DAYS[newBox] * 24 * 60 * 60 * 1000).toISOString();
        
        updatedWords[wordEn] = {
          en: wordEn,
          box: newBox,
          nextReviewDate: nextDate,
          lastReviewedAt: new Date().toISOString()
        };
      });

      const masteredWordsList = (Object.values(updatedWords) as LeitnerWordProgress[])
        .filter(w => w.box === 5)
        .map(w => w.en);

      const updatedProgress: VocabularyProgress = {
        ...leitnerProgress,
        words: updatedWords,
        updatedAt: new Date().toISOString()
      };

      try {
        await saveVocabularyProgress(updatedProgress);
        setLeitnerProgress(updatedProgress);
        
        // Sync masteredWords string array into core student profile metadata
        await syncProgress(currentUserId, {
          masteredWords: masteredWordsList
        });
      } catch (err) {
        console.warn("Failed to save Spaced Repetition progress to Firestore:", err);
      }
    }

    // Tear down quiz state
    setReviewActive(false);
    setConcludedQuiz(false);
    setQuizWordResults({});
  };

  const handleUpdateLeitner = async (wordEn: string, correct: boolean) => {
    if (!currentUserId || !leitnerProgress) return;

    const currentWordState = { ...getWordLeitnerState(wordEn) };
    let newBox = 1;
    if (correct) {
      newBox = Math.min(5, currentWordState.box + 1);
    } else {
      newBox = 1;
    }

    const nextDate = new Date(Date.now() + BOX_INTERVAL_DAYS[newBox] * 24 * 60 * 60 * 1000).toISOString();
    
    const updatedWords = {
      ...leitnerProgress.words,
      [wordEn]: {
        en: wordEn,
        box: newBox,
        nextReviewDate: nextDate,
        lastReviewedAt: new Date().toISOString()
      }
    };

    const masteredWordsList = (Object.values(updatedWords) as LeitnerWordProgress[])
      .filter(w => w.box === 5)
      .map(w => w.en);

    const updatedProgress: VocabularyProgress = {
      ...leitnerProgress,
      words: updatedWords,
      updatedAt: new Date().toISOString()
    };

    setLeitnerProgress(updatedProgress);

    try {
      await saveVocabularyProgress(updatedProgress);
      await syncProgress(currentUserId, {
        masteredWords: masteredWordsList
      });
    } catch (err) {
      console.warn("Failed to update Leitner status in Firestore:", err);
    }
  };

  // Gentle Daily Reminder Check based on study date
  let hasPraticadoHoje = false;
  try {
    const todayStr = new Date().toDateString();
    const lastActive = localStorage.getItem('sabush_last_active_date');
    hasPraticadoHoje = lastActive === todayStr;
  } catch (e) {
    console.warn(e);
  }

  // Obtain previously reviewed date string
  let lastReviewStr = 'Ainda não realizado';
  try {
    const savedDate = localStorage.getItem('sabush_vocab_reviewed_at');
    if (savedDate) lastReviewStr = savedDate;
  } catch (e) {
    console.warn(e);
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* GUIDED PATH CAMINHO DA CONFIANÇA BOARD BANNER */}
      {guidedConfidenceDay !== undefined && onNavigateToTab && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 text-white border border-blue-600/20 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          <div className="space-y-1.5 flex-1">
            <span className="inline-flex items-center space-x-1 bg-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[9px] tracking-wider uppercase">
              <Sparkles className="w-3 h-3 fill-slate-950 stroke-slate-950 text-slate-950" />
              <span>Caminho da Confiança • Fase 1</span>
            </span>
            <h4 className="text-sm font-black text-white">Caminho da Confiança: Dia {guidedConfidenceDay} de 90</h4>
            <div className="w-full bg-[#0f172a]/30 h-2 rounded-full overflow-hidden border border-white/5 max-w-sm">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(105, Math.round((guidedConfidenceDay / 90) * 100))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-200 font-bold uppercase">
              Rápido • 20 Minutos Diários • Mocho's Pronunciation Gym
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('confidence_path')}
            className="bg-white text-indigo-900 border border-transparent font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:bg-slate-50 shrink-0 self-start sm:self-center min-h-[44px]"
          >
            Continuar Roteiro 🦉
          </button>
        </div>
      )}

      {/* 1. Spaced Repetition VOCAB QUIZ OVERLAY FRAME */}
      {reviewActive ? (
        <div className="bg-white rounded-3xl p-6 border-2 border-brand-red-600 shadow-xl space-y-6 animate-fade-in">
          
          {/* Quiz Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-brand-red-500 animate-pulse" />
              <div>
                <h3 className="font-extrabold text-brand-navy-900 text-sm uppercase tracking-wider">Treino Rápido de Retenção</h3>
                <span className="text-[10px] text-slate-400 font-bold block">Revisão Espaçada de Vocabulário</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setReviewActive(false);
                setConcludedQuiz(false);
              }}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!concludedQuiz ? (
            <div className="space-y-5">
              {/* Question progress and current xp indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Pergunta {currentQuestionIndex + 1} de {quizQuestions.length}</span>
                <span className="text-emerald-600">XP Acumulado: +{gainedXpFromReview} XP</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-red-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Active word visual target card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-inner relative">
                <span className="text-[10px] text-brand-navy-500 font-black uppercase tracking-widest block">Traduza esta palavra:</span>
                <h4 className="text-3xl font-black text-brand-navy-900 tracking-tight">{quizQuestions[currentQuestionIndex]?.word}</h4>
                
                {/* Pronunciation guide and speaker button */}
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs text-slate-500 font-mono italic">{quizQuestions[currentQuestionIndex]?.pronunciation}</span>
                  <button 
                    onClick={() => playWordAudio(quizQuestions[currentQuestionIndex]?.word)}
                    className="p-1.5 bg-brand-navy-100 text-brand-navy-800 rounded-full hover:bg-brand-gold-100 hover:text-brand-gold-800 transition-colors cursor-pointer"
                    title="Ouvir Pronúncia"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${audioFeedback ? 'animate-bounce' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Multiple Choice Answers Grid */}
              <div className="space-y-2.5">
                {quizQuestions[currentQuestionIndex]?.options.map((option: string, idx: number) => {
                  const isSelected = selectedAnswerIndex === idx;
                  const isCorrectAnswer = idx === quizQuestions[currentQuestionIndex].correctAnswerIndex;
                  
                  let optionStyle = "border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 bg-white";
                  if (isSelected) {
                    optionStyle = "border-brand-navy-800 bg-brand-navy-50 text-brand-navy-900 font-bold";
                  }
                  
                  if (checkedAnswer) {
                    if (isCorrectAnswer) {
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold scale-[1.01] shadow-sm";
                    } else if (isSelected) {
                      optionStyle = "border-rose-500 bg-rose-50 text-rose-900";
                    } else {
                      optionStyle = "border-slate-100 bg-white text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={checkedAnswer}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {checkedAnswer && isCorrectAnswer && (
                        <span className="text-emerald-600 font-black text-xs">Correct!</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="pt-3">
                {!checkedAnswer ? (
                  <button
                    disabled={selectedAnswerIndex === null}
                    onClick={handleVerifyAnswer}
                    className="w-full bg-brand-navy-800 text-white hover:bg-brand-navy-900 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold py-3.5 rounded-xl text-xs sm:text-sm text-center transition-all cursor-pointer shadow-md min-h-[44px]"
                  >
                    Verificar Resposta
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-brand-red-600 text-white hover:bg-brand-red-750 font-black py-4 rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md min-h-[48px] border border-transparent hover:border-brand-gold-400"
                  >
                    <span>{currentQuestionIndex + 1 === quizQuestions.length ? 'Finalizar Revisão' : 'Próxima Palavra'}</span>
                    <ArrowRight className="w-4 h-4 text-brand-gold-400" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Quiz Results screen with mascot encouragement
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="flex justify-center">
                <Mascot expression="happy" size="lg" />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-brand-red-600 font-black tracking-widest uppercase block">Excelente Retenção!</span>
                <h4 className="text-2xl font-black text-brand-navy-900 tracking-tight">Vocabulário Revisto! 🧠</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Moçambicano persistente vale por dois! Completou o seu treino espaçado diário de repetição e impediu o esquecimento de termos fundamentais.
                </p>
              </div>

              {/* XP Box */}
              <div className="bg-brand-red-50/40 border-2 border-dashed border-brand-red-500/30 rounded-2xl p-4 max-w-xs mx-auto text-center space-y-0.5 shadow-inner">
                <span className="text-[10px] text-brand-navy-400 uppercase font-black tracking-wider font-extrabold">Recompensa Obtida:</span>
                <span className="text-3xl font-black text-brand-navy-900 block">+{gainedXpFromReview} XP</span>
                <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Estudo Diário Gravado!</span>
              </div>

              <div>
                <button
                  onClick={handleSaveReviewProgress}
                  className="bg-brand-red-600 hover:bg-brand-red-700 hover:border-brand-gold-400 border border-transparent text-white font-extrabold py-3.5 px-8 rounded-2xl text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Guardar Progresso e Concluir
                </button>
              </div>
            </div>
          )}

        </div>
      ) : showCertificateMode && certificate ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print mb-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-black text-brand-navy-900 uppercase">Seu Certificado Oficial</span>
            <button
              onClick={() => setShowCertificateMode(false)}
              className="text-xs font-black text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3.5 rounded-xl cursor-pointer"
            >
              Voltar ao Progresso
            </button>
          </div>
          <CertificateView certificate={certificate} onClose={() => setShowCertificateMode(false)} />
        </div>
      ) : (
        // Standard View of the dashboard
        <>
          {/* S. CERTIFICATE OF COMPLETION HERO (If earned!) */}
          {certificate && (
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-5 border border-amber-500 shadow-sm space-y-3.5 relative overflow-hidden animate-fade-in no-print">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex flex-col items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white uppercase">Diploma de Fluência Alcançado! 📜</h3>
                  <p className="text-xs text-amber-50 leading-relaxed font-semibold">Parabéns! Completaste de forma irrepreensível todas as fases do Sabush English Club.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-amber-400/30">
                <button
                  onClick={() => setShowCertificateMode(true)}
                  className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-800 font-extrabold text-xs rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1.5 min-h-[40px]"
                >
                  <Award className="w-4.5 h-4.5 text-amber-600" />
                  <span>Visualizar Certificado Oficial</span>
                </button>
                <div className="text-[10.5px] font-mono font-bold tracking-wider text-amber-100 uppercase bg-amber-800/40 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                  CÓDIGO: {certificate.uniqueCode}
                </div>
              </div>
            </div>
          )}

          {/* A. FRIENDLY MASCOT DAILY REMINDER NOTICE (In Portuguese, gentle tone, not pushy) */}
          <div className={`rounded-3xl p-5 border-2 flex items-start space-x-4 transition-all ${
            hasPraticadoHoje 
              ? 'bg-emerald-50/20 border-emerald-250 shadow-sm' 
              : 'bg-brand-red-50/20 border-brand-red-500/40 border-dashed shadow-md animate-pulse'
          }`}>
            <Mascot expression={hasPraticadoHoje ? "happy" : "talking"} size="md" className="mt-1" />
            <div className="space-y-1.5 flex-1">
              <h4 className={`font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 ${
                hasPraticadoHoje ? 'text-emerald-700' : 'text-brand-red-650'
              }`}>
                <span>{hasPraticadoHoje ? '✅ Missão Diária Satisfeita!' : '🔔 Mensagem do Tutor Sabush'}</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {hasPraticadoHoje ? (
                  <>
                    **Força, campeão!** Já teve a sua dose de inglês diário hoje, garantindo que a sua mente permaneça afiada. Continua assim e em breve a falarás com toda a naturalidade! Até amanhã! 🌍
                  </>
                ) : (
                  <>
                    Olá! O mocho Sabush reparou que ainda **não praticou inglês hoje**. Sabia que apenas 5 minutos de leitura ou um bate-papo rápido com o Tutor são suficientes para fixar as expressões? Vamos treinar agora! 💪
                  </>
                )}
              </p>
            </div>
          </div>

          {/* B. LEVEL MILESTONE GAUGE SECTION with a smooth blue gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden border border-blue-500/10" id="dashboard_milestone_card">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl animate-pulse" />
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-blue-105 text-slate-100 uppercase font-black tracking-widest block">Classificação Club:</span>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[#ffffff] truncate">{rankTitle}</h3>
                <p className="text-xs text-slate-100 mt-0.5 leading-relaxed font-semibold">{rankDesc}</p>
              </div>
            </div>

            {/* English Level Roadmap Progress Bar */}
            <div className="mt-6 pt-4 border-t border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black text-yellow-300">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-4 h-4 text-yellow-300" />
                  <span>Rumo ao nível {nextLevelName}</span>
                </span>
                <span>{levelProgressPercent}%</span>
              </div>
              
              {/* Progress track */}
              <div className="w-full h-3 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-950/20 shadow-inner">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-700 rounded-full" 
                  style={{ width: `${levelProgressPercent}%` }} 
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-200 font-extrabold mt-1">
                <span>Nível Atual: {levelTitle}</span>
                <span>Objetivo: {xp} / {xpForNextLevelGoal} XP</span>
              </div>
            </div>
          </div>

          {/* C. STATS CARDS AT THE TOP (Consistent 3-Column Layout with Pastel badging) */}
          <div className="grid grid-cols-3 gap-3" id="dashboard_stats_grid">
            
            {/* 1. Streak Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[95px]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Sequência</span>
                <div className="w-7 h-7 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center border border-orange-100/50">
                  <Flame className={`w-3.5 h-3.5 stroke-[2.2] ${hasPraticadoHoje ? 'text-orange-605 fill-orange-200 animate-bounce' : 'text-slate-400 fill-none'}`} />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-1">
                  {streak} <span className="text-[10px] font-bold text-slate-400">{streak === 1 ? 'dia' : 'dias'}</span>
                </h4>
                <p className="text-[8.5px] text-slate-400 mt-1 leading-tight font-semibold">Estudo Activo</p>
              </div>
            </div>

            {/* 2. Total XP Breakdown Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[95px]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Experiência</span>
                <div className="w-7 h-7 bg-yellow-55 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center border border-yellow-105 border-yellow-100/50">
                  <Star className="w-3.5 h-3.5 text-yellow-600 stroke-[2.2] fill-yellow-105 fill-yellow-100" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-1">
                  {xp} <span className="text-[10px] font-bold text-slate-400">XP</span>
                </h4>
                <p className="text-[8.5px] text-slate-400 mt-1 leading-tight font-semibold">Total Ganho</p>
              </div>
            </div>

            {/* 3. Completed Lessons Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[95px]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Lições</span>
                <div className="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border border-rose-100/50">
                  <BookOpen className="w-3.5 h-3.5 text-rose-600 stroke-[2.2]" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-1">
                  {completedLessonsCount}
                </h4>
                <p className="text-[8.5px] text-slate-400 mt-1 leading-tight font-semibold">Dominadas</p>
              </div>
            </div>

          </div>

          {/* D. CLUB LEADERBOARD (Líderes) SECTION */}
          <Leaderboard currentUserId={currentUserId} />

          {/* E. PROMINENT DICTIONARY CARD (Redesigned with White Background and Purple/Saturated Badge) */}
          <div className="bg-white rounded-3xl p-5.5 border border-slate-200 shadow-sm relative overflow-hidden" id="dashboard_dictionary_premium_card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-purple-50 text-purple-600 border border-purple-200/30 rounded-xl flex items-center justify-center shrink-0">
                  <Brain className="w-5.5 h-5.5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0f172a] text-xs sm:text-sm uppercase tracking-wider">Dicionário de Vocábulos</h3>
                  <p className="text-[10.5px] text-slate-505 text-slate-500 mt-0.5 font-semibold">Seu vocabulário acumulado</p>
                </div>
              </div>
              <div className="bg-purple-50 text-purple-750 text-purple-705 text-purple-700 px-3.5 py-1.5 rounded-xl text-xs font-black border border-purple-200/50 shadow-none">
                {totalVocabularyCount} termos
              </div>
            </div>
            
            <p className="text-xs text-slate-650 text-slate-600 mt-4 leading-relaxed font-semibold">
              Cada lição interativa concluída insere de forma automática os novos termos práticos no seu reportório. Pratique-os na secção de repetição espaçada diária abaixo para impedir que caiam no esquecimento!
            </p>
          </div>

          {/* E. INTERACTIVE SPACED REPETITION VOCABULARY REVIEW TOOL */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4" id="dashboard_spaced_repetition_card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-brand-navy-850 text-xs sm:text-sm uppercase tracking-widest flex items-center space-x-1.5">
                  <Activity className="w-4.5 h-4.5 text-brand-red-500 animate-pulse" />
                  <span>Treino & Consolação de Vocabulário</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed bg-amber-50/50 p-1.5 rounded-lg border border-amber-100/30">
                  <strong>Método Leitner:</strong> Pratique diariamente. Palavras que acertar avançam de caixa (Caixa 1 a 5), palavras que errar regressam à Caixa 1.
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1 shrink-0 ml-2">
                <span className="text-[9px] bg-brand-red-650 text-white font-black uppercase px-2 py-0.5 rounded-lg whitespace-nowrap">
                  Spaced Repetition
                </span>
                {(() => {
                  const baseWordsSet = totalVocabularyCount > 0 ? learnedWords : starterWords;
                  const dueWordsCount = baseWordsSet.filter(w => {
                    const state = getWordLeitnerState(w.en);
                    return new Date(state.nextReviewDate).getTime() <= Date.now();
                  }).length;
                  
                  return dueWordsCount > 0 ? (
                    <span className="text-[9px] bg-amber-50 text-amber-800 border-2 border-amber-400 font-extrabold px-2 py-0.5 rounded-xl whitespace-nowrap uppercase tracking-wider animate-pulse">
                      ⚡ {dueWordsCount} pendentes
                    </span>
                  ) : (
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-250 font-black px-2 py-0.5 rounded-xl whitespace-nowrap uppercase">
                      ★ Em dia
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Segmented Control Selector Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setVocabTab('flashcards')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  vocabTab === 'flashcards'
                    ? 'bg-white text-brand-navy-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${vocabTab === 'flashcards' ? 'text-brand-red-500 fill-brand-red-200' : 'text-slate-400'}`} />
                <span>Cartões de Estudo</span>
              </button>
              <button
                onClick={() => setVocabTab('quiz')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  vocabTab === 'quiz'
                    ? 'bg-white text-brand-navy-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Brain className={`w-3.5 h-3.5 ${vocabTab === 'quiz' ? 'text-brand-red-500' : 'text-slate-400'}`} />
                <span>Exercício Rápido (Quiz)</span>
              </button>
            </div>

            {vocabTab === 'flashcards' ? (
              /* New Flashcards Feature Block */
              <VocabularyFlashcards 
                words={wordsToReview} 
                onPlayAudio={playWordAudio} 
                completedLessonsCount={completedLessonsCount} 
                getWordLeitnerState={getWordLeitnerState}
                onUpdateLeitner={handleUpdateLeitner}
              />
            ) : (
              /* Original Spaced Repetition Quiz Block */
              <div className="space-y-4 animate-fade-in">
                {/* Brief review history info */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Última Revisão:</span>
                    <span className="text-slate-700 font-semibold">{lastReviewStr}</span>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Palavras Prontas:</span>
                    <span className="text-brand-navy-800 font-extrabold block">{wordsToReview.length} termos</span>
                  </div>
                </div>

                {/* Words list drawer preview */}
                <div className="space-y-2">
                  <span className="text-[9.5px] text-slate-400 uppercase font-black tracking-widest block">Seu Vocabulário Recente:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {wordsToReview.slice(0, 10).map((vocab, i) => (
                      <div 
                        key={i} 
                        onClick={() => playWordAudio(vocab.en)}
                        className={`px-2.5 py-1.5 border rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                          pronouncingWord === cleanTextForSpeech(vocab.en)
                            ? 'bg-brand-red-100 hover:bg-brand-red-150 border-brand-red-500 text-brand-red-650 scale-105 shadow-sm'
                            : 'bg-brand-red-50/20 border-slate-100 hover:border-brand-red-500 hover:text-brand-red-650 hover:bg-white text-slate-800'
                        }`}
                        title="Ouvir som"
                      >
                        <span>{vocab.en}</span>
                        <span className="text-[10px] text-slate-400 font-normal">| {vocab.pt}</span>
                        {pronouncingWord === cleanTextForSpeech(vocab.en) ? (
                          <div className="flex items-end space-x-[1px] h-3 w-3 pb-[1.5px] justify-center shrink-0">
                            <div className="w-[1.5px] bg-brand-red-500 rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.6s' }} />
                            <div className="w-[1.5px] bg-brand-red-500 rounded-full animate-bounce h-3" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                            <div className="w-[1.5px] bg-brand-red-500 rounded-full animate-bounce h-2" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                          </div>
                        ) : (
                          <Volume2 className="w-3 h-3 text-brand-red-500" />
                        )}
                      </div>
                    ))}
                    {wordsToReview.length > 10 && (
                      <div className="px-2 py-1 bg-slate-100 rounded-xl text-[10px] text-slate-500 font-semibold flex items-center">
                        +{wordsToReview.length - 10} mais
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={startReviewQuiz}
                  className="w-full bg-brand-red-600 text-[#ffffff] hover:bg-brand-red-750 hover:border-brand-gold-400 border border-transparent font-extrabold py-3.5 px-4 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2 shadow-sm min-h-[44px]"
                >
                  <Activity className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
                  <span>Iniciar Exercício de Retenção (+5 XP/palavra)</span>
                </button>
              </div>
            )}
          </div>

          {/* E. DYNAMIC BADGE & MILESTONES SYSTEM */}
          <div className="bg-white rounded-3xl p-5 border border-slate-205 border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-[#0f172a] text-xs sm:text-sm uppercase tracking-widest flex items-center space-x-1.5">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Minhas Medalhas de Conquista</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Estude lições activas, converse com a IA e mantenha as suas sequências activas no Club para ganhar prestígio!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {achievementsList.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-start space-x-3.5 p-4 rounded-2xl border transition-all ${
                    ach.unlocked 
                      ? 'bg-emerald-50/20 border-emerald-500/20 shadow-none' 
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${ach.unlocked ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-400'}`}>
                    <Star className={`w-5 h-5 ${ach.unlocked ? 'fill-yellow-400 stroke-emerald-600' : 'stroke-[2]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-black text-xs sm:text-sm truncate ${ach.unlocked ? 'text-slate-800' : 'text-slate-600'}`}>{ach.title}</h4>
                      {ach.unlocked ? (
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-200/40 px-2 py-0.5 rounded-lg font-black whitespace-nowrap uppercase">🎖️ Desbloqueada</span>
                      ) : (
                        <span className="text-[8.5px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg font-bold whitespace-nowrap uppercase">{ach.requirement}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* F. FRIENDLY OFFLINE EDUCATION REASSURANCE with White Card & Green Pastel Badge */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-605 text-emerald-600 border border-emerald-200/25 rounded-xl flex items-center justify-center shrink-0">
              <Mascot expression="happy" size="sm" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Pratique Inglês Sem Custos</h4>
              <p className="text-xs text-slate-605 text-slate-600 leading-relaxed font-semibold font-medium">
                Quaisquer pontos de XP, medalhas ganhas e sequências de revisão diária espacial de vocabulário são processados no seu próprio navegador de forma offline. Excelente para economizar pacotes de saldo e Internet!
              </p>
            </div>
          </div>

          {/* SIMULATOR ACCORDION CARD (no-print) */}
          {!certificate && onSimulateCompletion && (
            <div className="bg-slate-100 hover:bg-slate-200/50 rounded-3xl p-5 border border-slate-200/85 text-center space-y-3 no-print transition-colors mt-4">
              <div className="flex items-center justify-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600 animate-bounce" />
                <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest block mt-0.5">Testar Emissão de Diploma</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Quer testar as animações de comemoração, confetti e o Certificado oficial Sabush? Use o simulador abaixo para obter aprovação total instantânea.
              </p>
              <button
                onClick={onSimulateCompletion}
                className="bg-[#1e3a8a] text-white hover:bg-[#172554] px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm inline-flex items-center gap-1.5 min-h-[44px]"
              >
                <span>⚡ Simular Conclusão do Programa</span>
              </button>
            </div>
          )}

          {/* Large accessible command buttons for mobile targets */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              onClick={onNavigateToLessons}
              className="w-full bg-[#1e3a8a] hover:bg-[#172554] border border-transparent text-[#ffffff] font-extrabold py-4 px-4 rounded-2xl text-xs sm:text-sm text-center transition-all shadow-md active:scale-95 cursor-pointer min-h-[48px]"
            >
              Continuar a Estudar as Lições
            </button>
            <button
              onClick={onResetStats}
              className="w-full bg-transparent hover:bg-rose-50/50 text-rose-600 border border-slate-200/85 font-black py-3.5 px-4 rounded-2xl text-[10px] text-center transition-all cursor-pointer min-h-[44px]"
            >
              Reiniciar Todo o Meu Progresso
            </button>
          </div>
        </>
      )}
    </div>
  );
}
