/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lesson, EnglishLevel } from '../types';
import { LESSONS } from '../data';
import { Check, X, BookOpen, Mic, HelpCircle, ArrowRight, CheckCircle, Brain, RefreshCw, Volume2, VolumeX, Sliders, Info, Search, Sparkles, Headphones, Eye, EyeOff, Award, Square, Play } from 'lucide-react';
import { Mascot } from './Mascot';
import { selectMaleVoice, cleanTextForSpeech } from '../utils/voice';
import { motion, AnimatePresence } from 'motion/react';
import { getInspirationCards, auth, saveLessonRecording, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { InspirationCard } from '../types';
import { InspirationCardView } from './InspirationCardView';
import { DEFAULT_INSPIRATION_CARDS } from './InspirationCardsGallery';
import { getCategoriesForGoal } from '../utils/goalMapping';
import { blobToBase64 } from '../utils/audio';

interface LessonViewProps {
  currentLevel: EnglishLevel;
  completedLessons: string[];
  onCompleteLesson: (lessonId: string, gainedXp: number) => void;
  onNavigateToChat: () => void;
  onSelectLevel?: (level: EnglishLevel) => void;
  isSubscribed?: boolean;
  onNavigateToSub?: () => void;
  onRegisterBack?: (handler: (() => boolean) | null) => void;
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  initialLessonId?: string | null;
  onClearInitialLessonId?: () => void;
}

/**
 * Selects a high-quality contextual English sentence, question, or greeting to pronounce
 * for the lesson's main introduction play button.
 */
function getIntroHearText(lesson: any): string {
  if (!lesson) return '';
  // If the title is already a natural English greeting or question, return it
  const isGreetingOrQuestion = /[\?!]|^how|^what|^where|^who|^why|^please|^hello|^hi|^good\s+/i.test(lesson.title);
  if (isGreetingOrQuestion) {
    return lesson.title;
  }
  
  // Otherwise, use the FIRST dialogue line text in English
  if (lesson.dialogue && lesson.dialogue.length > 0) {
    return lesson.dialogue[0].textEn;
  }
  
  // Or fallback to the first vocabulary item
  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    return lesson.vocabulary[0].en;
  }

  return lesson.title;
}

/**
 * Maps lessons and learning modes to contextual supportive imagery from high-performance Unsplash CDNs.
 */
function getSupportingImageForLesson(lesson: Lesson, section: string, customImages?: Record<string, string>): string {
  if (customImages && customImages[lesson.id]) {
    return customImages[lesson.id];
  }

  const keywordImages: { [key: string]: string } = {
    greeting: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600",
    airport: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    travel: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600",
    meeting: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    boardroom: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=600",
    restaurant: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600",
    food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
    family: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600",
    career: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    interview: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
    shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
    vocab: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
    listening: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600",
    speaking: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600",
    quiz: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
  };

  const titleLower = lesson.title.toLowerCase();
  const idLower = lesson.id.toLowerCase();
  
  if (section === 'vocab') return keywordImages.vocab;
  if (section === 'listening') return keywordImages.listening;
  if (section === 'speaking') return keywordImages.speaking;
  if (section === 'quiz') return keywordImages.quiz;

  if (titleLower.includes('name') || titleLower.includes('greetings') || titleLower.includes('hello') || idLower.includes('beg-1') || idLower.includes('beg-2')) {
    return keywordImages.greeting;
  }
  if (titleLower.includes('airport') || titleLower.includes('flight') || titleLower.includes('arrival')) {
    return keywordImages.airport;
  }
  if (titleLower.includes('travel') || titleLower.includes('hotel') || titleLower.includes('room') || titleLower.includes('reservation')) {
    return keywordImages.hotel;
  }
  if (titleLower.includes('restaurant') || titleLower.includes('food') || titleLower.includes('eat') || titleLower.includes('menu')) {
    return keywordImages.restaurant;
  }
  if (titleLower.includes('career') || titleLower.includes('job') || titleLower.includes('work') || titleLower.includes('office')) {
    return keywordImages.career;
  }
  if (titleLower.includes('meeting') || titleLower.includes('boardroom') || titleLower.includes('negotiation') || titleLower.includes('corporate')) {
    return keywordImages.boardroom;
  }
  if (titleLower.includes('interview') || titleLower.includes('resume')) {
    return keywordImages.interview;
  }
  if (titleLower.includes('family') || titleLower.includes('home') || titleLower.includes('friend')) {
    return keywordImages.family;
  }
  if (titleLower.includes('shopping') || titleLower.includes('buy') || titleLower.includes('price')) {
    return keywordImages.shopping;
  }

  if (lesson.level === 'beginner') {
    return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600";
  }
  if (lesson.level === 'intermediate') {
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600";
  }
  
  return "https://images.unsplash.com/photo-1513258496099-48168024addd?auto=format&fit=crop&q=80&w=600";
}

export function LessonView({ 
  currentLevel, 
  completedLessons, 
  onCompleteLesson, 
  onNavigateToChat, 
  onSelectLevel,
  isSubscribed = false,
  onNavigateToSub,
  onRegisterBack,
  selectedCategory,
  onSelectCategory,
  initialLessonId,
  onClearInitialLessonId
}: LessonViewProps) {
  // Filter lessons for the current selected level
  const filteredLessons = LESSONS.filter((l) => l.level === currentLevel);
  const categoryLessons = selectedCategory 
    ? filteredLessons.filter((l) => l.categories?.includes(selectedCategory))
    : [];
  const activeLessonsList = selectedCategory ? categoryLessons : filteredLessons;

  const [activeLessonIndex, setActiveLessonIndex] = useState(() => {
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const levelKey = currentLevel || 'beginner';
      const stored = localStorage.getItem(`sabush_active_lesson_idx_${uid}_${levelKey}`);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');

  type LessonSection = 'intro' | 'vocab' | 'dialogue' | 'quiz' | 'listening' | 'speaking';
  const [activeSectionTab, setActiveSectionTab] = useState<LessonSection>('intro');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const hasAutoSelectedRef = React.useRef(false);

  // Default selectedCategory to the user's primary mapped category on first load if none is selected
  useEffect(() => {
    if (!hasAutoSelectedRef.current && selectedCategory === null && onSelectCategory) {
      hasAutoSelectedRef.current = true;
      const goal = localStorage.getItem('sabush_goal') || 'conversation';
      const preferred = getCategoriesForGoal(goal);
      if (preferred.length > 0) {
        onSelectCategory(preferred[0]);
      }
    }
  }, [selectedCategory, onSelectCategory]);

  // Deep-link to a specific lesson if provided
  useEffect(() => {
    if (initialLessonId) {
      const lesson = LESSONS.find(l => l.id === initialLessonId);
      if (lesson) {
        if (lesson.level !== currentLevel && onSelectLevel) {
          onSelectLevel(lesson.level);
        }
        if (selectedCategory && onSelectCategory) {
          onSelectCategory(null);
        }
        
        // Find index of this lesson in the level lessons
        const levelLessons = LESSONS.filter(l => l.level === lesson.level);
        const idx = levelLessons.findIndex(l => l.id === initialLessonId);
        if (idx !== -1) {
          setActiveLessonIndex(idx);
          setActiveSectionTab('intro');
        }
      }
      if (onClearInitialLessonId) {
        onClearInitialLessonId();
      }
    }
  }, [initialLessonId, currentLevel, onSelectLevel, selectedCategory, onSelectCategory, onClearInitialLessonId]);

  // Register back-button handler for search state and category state
  const [lessonImages, setLessonImages] = useState<Record<string, string>>(() => {
    try {
      const cached = localStorage.getItem('sabush_cached_lesson_images');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, 'clubSettings', 'branding'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data?.lessonImages) {
            setLessonImages(data.lessonImages);
            try {
              localStorage.setItem('sabush_cached_lesson_images', JSON.stringify(data.lessonImages));
            } catch (err) {
              console.warn("Failed to cache branding lesson images:", err);
            }
          }
        }
      }, (error) => {
        console.debug("Benign: error listening to branding lesson images:", error);
      });
      return () => unsubscribe();
    } catch (err) {
      console.debug("Could not establish lesson images listener", err);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '' && onRegisterBack) {
      onRegisterBack(() => {
        setSearchQuery('');
        return true;
      });
    } else if (selectedCategory && onRegisterBack) {
      onRegisterBack(() => {
        onSelectCategory?.(null);
        return true;
      });
    } else {
      if (onRegisterBack) onRegisterBack(null);
    }
    return () => {
      if (onRegisterBack) onRegisterBack(null);
    };
  }, [searchQuery, selectedCategory, onRegisterBack, onSelectCategory]);

  // Find matches globally or within level. Global search is extremely useful!
  const matchedLessons = LESSONS.filter((lesson) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    
    // Check titles
    if (lesson.title.toLowerCase().includes(query) || lesson.titlePt.toLowerCase().includes(query)) {
      return true;
    }
    // Check vocab
    if (lesson.vocabulary.some(v => v.en.toLowerCase().includes(query) || v.pt.toLowerCase().includes(query))) {
      return true;
    }
    // Check intro/explanation
    if (lesson.introductionPt.toLowerCase().includes(query) || lesson.explanationPt.toLowerCase().includes(query)) {
      return true;
    }
    
    return false;
  });

  const getMatchReason = (lesson: Lesson, query: string) => {
    const q = query.toLowerCase();
    if (lesson.title.toLowerCase().includes(q) || lesson.titlePt.toLowerCase().includes(q)) {
      return 'Correspondência no título';
    }
    const matchingVocab = lesson.vocabulary.find(v => v.en.toLowerCase().includes(q) || v.pt.toLowerCase().includes(q));
    if (matchingVocab) {
      return `Vocabulário: "${matchingVocab.en}" (${matchingVocab.pt})`;
    }
    if (lesson.explanationPt.toLowerCase().includes(q)) {
      return 'Dica gramatical';
    }
    if (lesson.introductionPt.toLowerCase().includes(q)) {
      return 'Resumo/Conteúdo';
    }
    return 'Conteúdo relacionado';
  };

  const handleSelectMatchedLesson = (lesson: Lesson) => {
    // Clear category selection if any to make sure they can study the selected search result lesson immediately
    onSelectCategory?.(null);

    // If the lesson is in another level, change the level
    if (lesson.level !== currentLevel && onSelectLevel) {
      onSelectLevel(lesson.level);
    }
    
    // Calculate the index in that level
    const targetFiltered = LESSONS.filter(l => l.level === lesson.level);
    const idx = targetFiltered.findIndex(l => l.id === lesson.id);
    if (idx !== -1) {
      setActiveLessonIndex(idx);
    }
    
    // Clear search
    setSearchQuery('');
  };
  
  // Restore lesson index if level or category changes
  useEffect(() => {
    try {
      if (selectedCategory) {
        // Default to first lesson of the category when a category is selected
        setActiveLessonIndex(0);
      } else {
        const uid = auth.currentUser?.uid || 'guest';
        const levelKey = currentLevel || 'beginner';
        const stored = localStorage.getItem(`sabush_active_lesson_idx_${uid}_${levelKey}`);
        setActiveLessonIndex(stored ? parseInt(stored, 10) : 0);
      }
    } catch {
      setActiveLessonIndex(0);
    }
    setSelectedAnswer(null);
    setExerciseStatus('idle');
  }, [currentLevel, selectedCategory]);

  const activeLesson: Lesson | undefined = activeLessonsList[activeLessonIndex];

  // Helper to determine if a lesson is paid
  const isLessonPaid = (lesson: Lesson | undefined): boolean => {
    if (!lesson) return false;
    if (lesson.level === 'beginner') {
      const begLessons = LESSONS.filter(l => l.level === 'beginner');
      const idx = begLessons.findIndex(l => l.id === lesson.id);
      return idx >= 6;
    }
    return true; // Intermediate & Advanced are always paid
  };

  const isCurrentLessonPaid = isLessonPaid(activeLesson);
  const isLocked = isCurrentLessonPaid && !isSubscribed;


  // Exercise states
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [exerciseStatus, setExerciseStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Listening comprehension states
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, number>>({});
  const [showListeningTranscript, setShowListeningTranscript] = useState<boolean>(false);
  const [listeningActiveQuestion, setListeningActiveQuestion] = useState<number>(0);
  const [isPlayingListeningPassage, setIsPlayingListeningPassage] = useState<boolean>(false);
  const [listeningSpeed, setListeningSpeed] = useState<number>(1.05);

  // Recording / "Prática Real" closing speaking challenge states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [isSavingRecording, setIsSavingRecording] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<{
    transcript?: string;
    feedbackPt?: string;
    matchLevel?: 'excelente' | 'bom' | 'pratique_mais';
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Persist active lesson index whenever it changes
  useEffect(() => {
    if (selectedCategory) return; // Do not overwrite main level progress index when category is active!
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const levelKey = currentLevel || 'beginner';
      localStorage.setItem(`sabush_active_lesson_idx_${uid}_${levelKey}`, activeLessonIndex.toString());
    } catch (e) {
      console.warn("Failed to save active lesson index:", e);
    }
  }, [activeLessonIndex, currentLevel, selectedCategory]);

  // Handle mid-lesson progress loading/restoring
  useEffect(() => {
    if (!activeLesson) return;
    const uid = auth.currentUser?.uid || 'guest';
    const lessonId = activeLesson.id;
    
    // 1. Restore active tab
    const savedTab = localStorage.getItem(`sabush_mid_tab_${uid}_${lessonId}`) as LessonSection | null;
    setActiveSectionTab(savedTab || 'intro');

    // 2. Restore quiz question index
    const savedQuizQ = localStorage.getItem(`sabush_mid_quiz_q_${uid}_${lessonId}`);
    if (savedQuizQ !== null) {
      const idx = parseInt(savedQuizQ, 10);
      setCurrentQuestionIdx(isNaN(idx) ? 0 : idx);
    } else {
      setCurrentQuestionIdx(0);
    }

    // 3. Restore listening active question
    const savedListQ = localStorage.getItem(`sabush_mid_listening_q_${uid}_${lessonId}`);
    if (savedListQ !== null) {
      const idx = parseInt(savedListQ, 10);
      setListeningActiveQuestion(isNaN(idx) ? 0 : idx);
    } else {
      setListeningActiveQuestion(0);
    }

    // 4. Restore completed sections checklist
    const savedCompSecs = localStorage.getItem(`sabush_mid_completed_secs_${uid}_${lessonId}`);
    if (savedCompSecs !== null) {
      try {
        setCompletedSections(JSON.parse(savedCompSecs));
      } catch {
        setCompletedSections([]);
      }
    } else {
      setCompletedSections([]);
    }
  }, [activeLesson?.id, currentLevel]);

  // Persist active tab whenever it changes
  const handleSetSectionTab = (tab: LessonSection) => {
    setActiveSectionTab(tab);
    if (activeLesson) {
      const uid = auth.currentUser?.uid || 'guest';
      localStorage.setItem(`sabush_mid_tab_${uid}_${activeLesson.id}`, tab);
    }
  };

  // Helper to mark a section as completed and persist
  const handleMarkSectionComplete = (section: LessonSection) => {
    if (!activeLesson) return;
    if (completedSections.includes(section)) return;
    const updated = [...completedSections, section];
    setCompletedSections(updated);
    const uid = auth.currentUser?.uid || 'guest';
    localStorage.setItem(`sabush_mid_completed_secs_${uid}_${activeLesson.id}`, JSON.stringify(updated));
  };

  // Persist quiz and listening question indices when they change
  useEffect(() => {
    if (!activeLesson) return;
    const uid = auth.currentUser?.uid || 'guest';
    localStorage.setItem(`sabush_mid_quiz_q_${uid}_${activeLesson.id}`, currentQuestionIdx.toString());
  }, [currentQuestionIdx, activeLesson?.id]);

  useEffect(() => {
    if (!activeLesson) return;
    const uid = auth.currentUser?.uid || 'guest';
    localStorage.setItem(`sabush_mid_listening_q_${uid}_${activeLesson.id}`, listeningActiveQuestion.toString());
  }, [listeningActiveQuestion, activeLesson?.id]);

  // Offline detection state & event listeners
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Offline Caching for lesson text content and image URLs using Cache API
  useEffect(() => {
    if (!activeLesson) return;
    
    // 1. Cache the lesson text representation in localStorage
    try {
      localStorage.setItem(`sabush_offline_lesson_${activeLesson.id}`, JSON.stringify(activeLesson));
      const cachedList = localStorage.getItem('sabush_offline_cached_lessons_list');
      const list = cachedList ? JSON.parse(cachedList) : [];
      if (!list.includes(activeLesson.id)) {
        list.push(activeLesson.id);
        localStorage.setItem('sabush_offline_cached_lessons_list', JSON.stringify(list));
      }
    } catch (err) {
      console.warn("Failed to cache lesson text locally:", err);
    }

    // 2. Cache the Unsplash or custom branding image via Cache API
    if (typeof window !== 'undefined' && 'caches' in window) {
      const imageUrl = lessonImages[activeLesson.id] || getSupportingImageForLesson(activeLesson, 'intro');
      if (imageUrl && imageUrl.startsWith('http')) {
        caches.open('sabush-lesson-assets').then((cache) => {
          cache.add(new Request(imageUrl, { mode: 'no-cors' })).catch((err) => {
            console.debug("Failed to cache image via Cache API:", err);
          });
        });
      }
    }
  }, [activeLesson, lessonImages]);

  // Ticking timer for the active recording duration
  useEffect(() => {
    let timerInterval: any = null;
    if (isRecording) {
      timerInterval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    setMicError(null);
    setRecordedAudioUrl(null);
    setAudioChunks([]);
    setRecordingBlob(null);
    setSaveSuccess(false);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Navegador não suporta gravação de áudio ou requer HTTPS.');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const MediaRecorderClass = (window as any).MediaRecorder || (window as any).webkitMediaRecorder;
      if (!MediaRecorderClass) {
        throw new Error('Navegador não possui suporte direto a MediaRecorder em iFrame.');
      }
      const recorder = new MediaRecorderClass(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setRecordingBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track: any) => track.stop());
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.warn('Microphone error:', err);
      // Fallback for simulation if microphone is blocked or missing
      setMicError(err.message || 'Erro ao aceder ao microfone. Verifique as permissões.');
      // Start simulation recording so they can still try it out beautifully!
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.warn(err);
        setRecordedAudioUrl('simulated-recording');
      }
    } else {
      // If we are in simulated mode, generate a dummy completed state
      setRecordedAudioUrl('simulated-recording');
    }
    setIsRecording(false);
  };

  const handleDiscardRecording = () => {
    setRecordedAudioUrl(null);
    setMicError(null);
    setAudioChunks([]);
    setRecordingBlob(null);
    setSaveSuccess(false);
    setEvaluationFeedback(null);
  };

  const handleSaveRecording = async () => {
    if (!auth.currentUser) {
      alert("Por favor, verifique se iniciou sessão na sua conta Sabush para salvar o seu progresso de voz.");
      return;
    }

    setIsSavingRecording(true);
    setIsEvaluating(true);
    setEvaluationFeedback(null);

    try {
      const activeLesson = filteredLessons[activeLessonIndex] || LESSONS[0];
      const speakingScenario = activeLesson.speakingScenario || {
        prompt: `Record yourself practicing the core pronunciation...`,
        promptPt: `Grave-se a praticar a pronúncia essencial...`
      };
      
      // Blob file is uploaded if captured via mic, else simulated audio helix
      const fileToUpload = recordingBlob || 'simulated-recording';

      let feedbackData = null;
      try {
        let audioBase64 = '';
        if (recordingBlob) {
          audioBase64 = await blobToBase64(recordingBlob);
        }

        const evalResponse = await fetch('/api/evaluate-recording', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioBase64: audioBase64 || undefined,
            mimeType: recordingBlob?.type || 'audio/webm',
            speakingPrompt: speakingScenario.prompt,
          }),
        });

        if (evalResponse.ok) {
          feedbackData = await evalResponse.json();
          setEvaluationFeedback(feedbackData);
        }
      } catch (evalErr) {
        console.error("Erro na avaliação do Gemini:", evalErr);
        // Se falhar, prosseguir sem feedback (opcional/não-bloqueante)
      } finally {
        setIsEvaluating(false);
      }
      
      await saveLessonRecording(
        auth.currentUser.uid,
        activeLesson.id,
        activeLesson.titlePt || activeLesson.title,
        speakingScenario.prompt,
        fileToUpload,
        recordingDuration || 4,
        feedbackData?.transcript,
        feedbackData?.feedbackPt,
        feedbackData?.matchLevel
      );
      setSaveSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar gravação:", error);
      alert("Ocorreu um erro ao guardar a sua gravação no servidor. Por favor, tente novamente.");
    } finally {
      setIsSavingRecording(false);
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // States for intermediate inspiration card reward
  const [showInspirationCard, setShowInspirationCard] = useState(false);
  const [randomInspirationCard, setRandomInspirationCard] = useState<InspirationCard | null>(null);

  // Reset indices when active lesson changes
  useEffect(() => {
    setSelectedAnswer(null);
    setExerciseStatus('idle');
    setCurrentQuestionIdx(0);
    setShowInspirationCard(false);
    setRandomInspirationCard(null);

    // Reset listening comprehension states
    setListeningAnswers({});
    setShowListeningTranscript(false);
    setListeningActiveQuestion(0);
    setIsPlayingListeningPassage(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Reset recording states
    setIsRecording(false);
    setRecordedAudioUrl(null);
    setRecordingDuration(0);
    setMicError(null);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try {
        mediaRecorder.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setMediaRecorder(null);
    setAudioChunks([]);
  }, [activeLessonIndex, currentLevel]);

  const questionsList = activeLesson && activeLesson.exercise ? (activeLesson.exercise.questions || [
    {
      question: activeLesson.exercise.question,
      options: activeLesson.exercise.options,
      correctAnswerIndex: activeLesson.exercise.correctAnswerIndex,
      translation: activeLesson.exercise.translation,
      explanation: activeLesson.exercise.explanation,
    }
  ]) : [];

  const currentQuestion = questionsList[currentQuestionIdx];

  const handleSelectOption = (index: number) => {
    if (exerciseStatus === 'correct') return; // Locked once answered correctly
    setSelectedAnswer(index);
    setExerciseStatus('idle');
  };

  const handleVerifyAnswer = () => {
    if (selectedAnswer === null || !activeLesson || !currentQuestion) return;
    
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      setExerciseStatus('correct');
      if (currentQuestionIdx === questionsList.length - 1) {
        const isAlreadyCompleted = completedLessons.includes(activeLesson.id);
        onCompleteLesson(activeLesson.id, isAlreadyCompleted ? 0 : 15);

        // Fetch cards and show intermediate refresher popup overlay!
        getInspirationCards().then((fetchedDeck) => {
          const deck = fetchedDeck && fetchedDeck.length > 0 ? fetchedDeck : DEFAULT_INSPIRATION_CARDS;
          const randomPick = deck[Math.floor(Math.random() * deck.length)];
          setRandomInspirationCard(randomPick);
          setTimeout(() => {
            setShowInspirationCard(true);
          }, 1200);
        }).catch((err) => {
          console.error("Failed to load intermediate inspiration cards:", err);
          const randomPick = DEFAULT_INSPIRATION_CARDS[Math.floor(Math.random() * DEFAULT_INSPIRATION_CARDS.length)];
          setRandomInspirationCard(randomPick);
          setTimeout(() => {
            setShowInspirationCard(true);
          }, 1200);
        });
      }
    } else {
      setExerciseStatus('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questionsList.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setExerciseStatus('idle');
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < activeLessonsList.length - 1) {
      setActiveLessonIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setExerciseStatus('idle');
      setCurrentQuestionIdx(0);
    }
  };

  const handleRestartExercise = () => {
    setSelectedAnswer(null);
    setExerciseStatus('idle');
  };

  // TTS with speech synthesis support & speed controller settings
  const [pronouncingText, setPronouncingText] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleHearText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // Clean text to avoid codes/numbers/metadata being read out
    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    setPronouncingText(cleaned);

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;

    // Use the custom selected natural-sounding male voice
    const maleVoice = selectMaleVoice(window.speechSynthesis);
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onend = () => {
      setPronouncingText(null);
    };

    utterance.onerror = () => {
      setPronouncingText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPronouncingText(null);
    }
  };

  const handleHearListeningPassage = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setIsPlayingListeningPassage(true);
    
    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) {
      setIsPlayingListeningPassage(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'en-US';
    utterance.rate = listeningSpeed;

    const maleVoice = selectMaleVoice(window.speechSynthesis);
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onend = () => {
      setIsPlayingListeningPassage(false);
    };

    utterance.onerror = () => {
      setIsPlayingListeningPassage(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopListeningPassage = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingListeningPassage(false);
  };

  if (activeLessonsList.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500 text-sm">Não há lições disponíveis no momento.</p>
      </div>
    );
  }

  if (!activeLesson) return null;

  const isCurrentLessonCompleted = completedLessons.includes(activeLesson.id);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Lesson Search Bar (at the very top) */}
      <div className="space-y-2">
        <label htmlFor="lesson_search" className="text-[10px] text-brand-navy-500 font-extrabold uppercase tracking-widest block pl-1">
          Procurar Lições, Palavras ou Gramática
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            id="lesson_search"
            type="text"
            placeholder="Ex: 'airport', 'present continuous', 'como dizer'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-10 py-3.5 rounded-2xl border-2 border-slate-200 outline-none focus:border-brand-navy-800 bg-white placeholder-slate-400 text-slate-800 transition-all font-sans min-h-[44px] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors min-h-[44px] min-w-[44px] justify-center cursor-pointer"
              title="Limpar pesquisa"
              aria-label="Limpar pesquisa"
            >
              <X className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Filter Row */}
      <div className="space-y-1.5" id="aulas-category-filter">
        <span className="text-[10px] text-brand-navy-500 font-extrabold uppercase tracking-widest block pl-1">
          Filtrar por Tópico
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {/* "Todas" All Categories filter */}
          <button
            onClick={() => onSelectCategory?.(null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              !selectedCategory 
                ? 'bg-blue-600 border-blue-700 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 shadow-sm'
            }`}
          >
            Todas as Aulas
          </button>

          {/* Individual Category filters with pastel colors/badging */}
          {[
            { name: 'Gramática', text: 'text-emerald-750', bg: 'bg-emerald-50', activeBg: 'bg-emerald-600 border-emerald-700 text-white shadow-sm' },
            { name: 'Conversação', text: 'text-blue-750', bg: 'bg-blue-50', activeBg: 'bg-blue-600 border-blue-700 text-white shadow-sm' },
            { name: 'Vocabulário', text: 'text-purple-750', bg: 'bg-purple-50', activeBg: 'bg-purple-600 border-purple-700 text-white shadow-sm' },
            { name: 'Negócios', text: 'text-[#312e81]', bg: 'bg-indigo-50', activeBg: 'bg-indigo-900 border-indigo-950 text-white shadow-sm' },
            { name: 'Viagem', text: 'text-rose-750', bg: 'bg-rose-50', activeBg: 'bg-rose-600 border-rose-700 text-white shadow-sm' },
            { name: 'Pronúncia', text: 'text-amber-800', bg: 'bg-amber-50', activeBg: 'bg-amber-650 border-amber-700 text-white shadow-sm' },
          ].map((cat) => {
            const isSel = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory?.(isSel ? null : cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center space-x-1.5 ${
                  isSel 
                    ? cat.activeBg
                    : `bg-white border-slate-200 ${cat.text} ${cat.bg} hover:border-slate-300 shadow-sm`
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-extrabold ${isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {filteredLessons.filter(l => l.categories?.includes(cat.name)).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {searchQuery.trim() !== '' ? (
        /* Render search results if query is active */
        <div className="space-y-4 animate-fade-in bg-slate-100/50 p-4 rounded-3xl border border-slate-200/60 shadow-inner">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-brand-navy-600 font-extrabold uppercase tracking-widest">
              Resultados Encontrados ({matchedLessons.length})
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-brand-red-650 font-extrabold hover:underline cursor-pointer"
            >
              Voltar às minhas aulas
            </button>
          </div>

          {matchedLessons.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
              {matchedLessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const levelLabel = lesson.level === 'beginner' ? 'Iniciante' : lesson.level === 'intermediate' ? 'Intermediário' : 'Avançado';
                const levelColor = lesson.level === 'beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : lesson.level === 'intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-brand-red-50 text-brand-red-700 border-brand-red-150';
                
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleSelectMatchedLesson(lesson)}
                    className="bg-white p-4.5 rounded-2xl border border-slate-200/85 hover:border-brand-navy-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group h-full space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${levelColor}`}>
                          {levelLabel}
                        </span>
                        {isCompleted && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded-md font-bold flex items-center space-x-1">
                            <span>✓ Concluída</span>
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-extrabold text-sm text-brand-navy-900 group-hover:text-brand-red-650 transition-colors leading-tight">
                        {lesson.titlePt}
                      </h4>
                      <p className="text-xs text-slate-400 italic">
                        {lesson.title}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] gap-2">
                      <span className="text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150 truncate max-w-[180px]" title={getMatchReason(lesson, searchQuery)}>
                        🔍 {getMatchReason(lesson, searchQuery)}
                      </span>
                      <span className="text-brand-navy-800 font-extrabold text-xs inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>Carregar Aula</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm animate-fade-in" id="lesson_search_empty">
              <div className="flex justify-center">
                <Mascot expression="thinking" size="md" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-navy-900 text-sm">Nenhuma aula encontrada</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Não encontramos aulas para <strong className="text-brand-red-600">"{searchQuery}"</strong>. Tente procurar por termos como <strong className="text-brand-navy-800">"reunião"</strong>, <strong className="text-brand-navy-800">"email"</strong>, <strong className="text-brand-navy-800">"simple past"</strong> ou vocábulos em inglês!
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center justify-center bg-brand-navy-800 hover:bg-brand-navy-950 hover:border-brand-gold-400 border border-transparent text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-sm min-h-[40px] cursor-pointer"
              >
                Limpar Pesquisa
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Regular active lesson UI */
        <>
          {/* Lesson Selector Bar (Highly Accessible list with Gold/Navy accents) */}
          <div className="space-y-2">
            {isOffline && (
              <div className="bg-amber-600 text-white font-black text-xs tracking-wide px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-sm border border-amber-500/50 animate-pulse mb-3" id="offline_banner">
                <span className="text-sm">⚠️</span>
                <span>Sem ligação — a mostrar conteúdo guardado</span>
              </div>
            )}
            <span className="text-[10px] text-brand-navy-500 font-extrabold uppercase tracking-widest block pl-1">
              {selectedCategory 
                ? `Aulas no Tópico: ${selectedCategory}` 
                : `Aulas da Categoria: ${currentLevel === 'beginner' ? 'Iniciante' : currentLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}`
              }
            </span>
            <div className="flex items-center space-x-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {activeLessonsList.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isSelected = idx === activeLessonIndex;
                const levelShort = lesson.level === 'beginner' ? 'Inic' : lesson.level === 'intermediate' ? 'Inter' : 'Avanç';
                const levelColor = lesson.level === 'beginner' ? 'text-emerald-500 border-emerald-350' : lesson.level === 'intermediate' ? 'text-blue-500 border-blue-350' : 'text-rose-500 border-rose-350';
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setSelectedAnswer(null);
                      setExerciseStatus('idle');
                    }}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap border-2 shrink-0 transition-all flex items-center space-x-2 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-navy-800 border-brand-navy-900 text-white shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="font-extrabold text-[12px]">{lesson.titlePt}</span>
                      <span className={`text-[9px] font-extrabold mt-0.5 uppercase tracking-wider ${isSelected ? 'text-blue-200' : levelColor}`}>
                        {levelShort} • {lesson.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Lesson Hero Header */}
          {activeLesson && (
            <div className="w-full rounded-3xl overflow-hidden relative border border-slate-200 shadow-sm min-h-[160px] flex flex-col justify-end p-5 sm:p-6 mb-2">
              {/* Background image or geometric pattern fallback */}
              {lessonImages[activeLesson.id] ? (
                <>
                  <img
                    src={lessonImages[activeLesson.id]}
                    alt={activeLesson.titlePt}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />
                </>
              ) : (
                <>
                  {/* High fidelity modern geometric abstract fallback pattern */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy-900 via-indigo-950 to-brand-navy-900" />
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                  {/* Decorative glowing colored blob */}
                  <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-brand-red-500/20 blur-2xl animate-pulse" />
                  <div className="absolute bottom-5 left-1/3 w-24 h-24 rounded-full bg-brand-gold-500/10 blur-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </>
              )}

              {/* Header content overlay */}
              <div className="relative space-y-1 text-left z-10">
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full ${
                    activeLesson.level === 'beginner' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : activeLesson.level === 'intermediate'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {activeLesson.level === 'beginner' ? 'Iniciante' : activeLesson.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                  </span>
                  <span className="text-[9px] text-slate-300 font-black tracking-widest uppercase">{activeLesson.id.toUpperCase()}</span>
                </div>
                <h1 className="font-extrabold text-white text-lg sm:text-2xl tracking-tight leading-tight drop-shadow-md">
                  {activeLesson.titlePt}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 font-medium tracking-wide italic">
                  {activeLesson.title}
                </p>
              </div>
            </div>
          )}

          {isLocked ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-brand-red-650 shadow-lg text-center space-y-6 max-w-lg mx-auto animate-fade-in" id="lesson_lock_card">
          <div className="flex justify-center">
            <Mascot expression="thinking" size="lg" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 border border-brand-gold-500/45 bg-brand-red-650 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white uppercase">
              <span>🔒 Conteúdo Premium</span>
            </div>
            <h3 className="text-xl font-black text-brand-navy-900 tracking-tight">Desbloqueie todo o Sabush 🇲🇿</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-sm mx-auto">
              Esta lição de nível <strong>{currentLevel === 'beginner' ? 'Iniciante' : currentLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}</strong> ({activeLesson?.titlePt}) pertence ao conteúdo exclusivo de membros do Sabush English Club.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-sm mx-auto">
              Com o seu plano activo, tem acesso ilimitado a todas as lições intermédias e avançadas de negócios, e pode conversar de forma livre com o nosso Tutor de IA Inteligente!
            </p>
          </div>

          <div className="bg-brand-navy-950 text-white rounded-2xl p-4.5 max-w-xs mx-auto border-2 border-brand-red-500/40 shadow-inner relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-brand-navy-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
              Preço Promocional!
            </span>
            <div className="flex flex-col items-center justify-center space-y-1 mt-1">
              <span className="text-[10px] text-slate-400 line-through font-bold">Antes: 999 MT/mês</span>
              <span className="text-2xl font-black text-brand-gold-400">299 MT<span className="text-xs text-slate-300 font-bold">/mês</span></span>
              <span className="text-[8px] text-[#ffdddd] font-black uppercase tracking-wider">Aproveite, esta oferta é temporária!</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3 justify-center">
            <button
              onClick={onNavigateToSub}
              className="bg-brand-red-600 hover:bg-brand-red-750 text-[#ffffff] font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shadow-md"
            >
              Aderir e Activar Acesso
            </button>
            <button
              onClick={() => {
                if (onSelectLevel) {
                  onSelectLevel('beginner');
                }
                onSelectCategory?.(null);
                setActiveLessonIndex(0);
              }}
              className="bg-transparent hover:bg-slate-100 text-slate-600 border border-slate-200 font-extrabold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px] cursor-pointer"
            >
              Ver Lições Grátis
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* SECÇÕES DA AULA - MID-LESSON MODULAR NAVIGATOR */}
          <div className="bg-white rounded-3xl p-4.5 border-2 border-slate-200 shadow-sm space-y-3.5" id="mid_lesson_section_tabs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <div className="text-left">
                <span className="text-[10px] text-brand-navy-600 font-extrabold uppercase tracking-widest block">
                  Progresso nesta Aula (Etapas de 5 Minutos)
                </span>
                <span className="text-[9px] text-slate-405 text-slate-400 font-bold block mt-0.5 whitespace-normal">
                  Ideal para estudar em breves intervalos durante caminhadas, transportes ou pausas!
                </span>
              </div>
              <span className="self-start sm:self-auto text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider shrink-0 flex items-center space-x-1">
                <span>⏱️ {completedSections.length}/6 Etapas Concluídas</span>
              </span>
            </div>
            
            {/* Horizontal progress visualization meter */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner border border-slate-200/50">
              {['intro', 'vocab', 'dialogue', 'quiz', 'listening', 'speaking'].map((sec) => {
                const isSecComp = completedSections.includes(sec);
                const isSecActive = activeSectionTab === sec;
                return (
                  <div
                    key={sec}
                    className={`h-full flex-1 border-r border-[#ffffff] last:border-0 transition-all ${
                      isSecComp 
                        ? 'bg-emerald-500' 
                        : isSecActive 
                        ? 'bg-[#1e3a8a] animate-pulse' 
                        : 'bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>

            {/* Responsive visual tab buttons for adult learning intervals */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 pt-1">
              {[
                { key: 'intro', label: '1. Introdução', time: '1 min', icon: BookOpen, color: 'text-amber-600 bg-amber-50 border-amber-100', hoverBg: 'hover:bg-amber-50/40', activeStyle: 'border-amber-550 border-amber-600 bg-amber-50/20 ring-2 ring-amber-100' },
                { key: 'vocab', label: '2. Vocabulário', time: '2 min', icon: Brain, color: 'text-purple-600 bg-purple-50 border-purple-100', hoverBg: 'hover:bg-purple-50/40', activeStyle: 'border-purple-550 border-purple-600 bg-purple-50/20 ring-2 ring-purple-100' },
                { key: 'dialogue', label: '3. Diálogo', time: '3 min', icon: HelpCircle, color: 'text-blue-600 bg-blue-50 border-blue-105 border-blue-100', hoverBg: 'hover:bg-blue-50/40', activeStyle: 'border-blue-550 border-blue-600 bg-blue-50/20 ring-2 ring-blue-100' },
                { key: 'quiz', label: '4. Exercícios', time: '3 min', icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-100', hoverBg: 'hover:bg-emerald-50/40', activeStyle: 'border-emerald-650 border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-100' },
                { key: 'listening', label: '5. Audição', time: '4 min', icon: Headphones, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', hoverBg: 'hover:bg-indigo-50/40', activeStyle: 'border-indigo-550 border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-100' },
                { key: 'speaking', label: '6. Prática Real', time: '5 min', icon: Mic, color: 'text-brand-red-650 bg-red-50 border-red-100', hoverBg: 'hover:bg-red-50/40', activeStyle: 'border-brand-red-550 border-brand-red-600 bg-red-50/20 ring-2 ring-brand-red-100' },
              ].map((sec) => {
                const isActive = activeSectionTab === sec.key;
                const isCompleted = completedSections.includes(sec.key);
                const Icon = sec.icon;

                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => handleSetSectionTab(sec.key as LessonSection)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all relative cursor-pointer flex flex-col justify-between min-h-[70px] select-none ${sec.hoverBg} ${
                      isActive 
                        ? `${sec.activeStyle} border-slate-900 border-2` 
                        : isCompleted
                        ? 'bg-emerald-50/25 border-emerald-200/80 text-emerald-950 font-black'
                        : 'bg-white border-slate-200 text-slate-700 font-semibold'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${sec.color} border border-current/25`}>
                        <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                      </div>
                      {isCompleted ? (
                        <div className="bg-emerald-100 text-emerald-800 p-0.5 rounded-full">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3.5]" />
                        </div>
                      ) : (
                        <span className="text-[8.5px] bg-slate-50 border border-slate-200 text-slate-450 pr-1 truncate text-slate-500 font-black px-1.5 py-0.5 rounded-md leading-none">{sec.time}</span>
                      )}
                    </div>
                    
                    <div className="mt-2.5 leading-none">
                      <span className="text-[11px] font-black leading-tight block">{sec.label}</span>
                      <span className="text-[8.5px] text-slate-450 text-slate-400 font-extrabold mt-1 block uppercase tracking-wider">⏱️ {sec.time}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Web Speech API Control Widget with Polished White Card Background */}
      <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-105 border-blue-100/50">
              <Volume2 className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800">Voz por IA (Pronúncia)</h3>
          </div>
          {speechSupported ? (
            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">
              Ativo Offline
            </span>
          ) : (
            <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-200/50 px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">
              Não Suportado
            </span>
          )}
        </div>
        
        <p className="text-[11px] text-slate-550 text-slate-600 leading-relaxed font-semibold">
          O Sabush English Club usa o <strong>Web Speech API</strong> local para que possa ouvir e repetir a pronúncia correcta com <strong>0 KB de custos de dados móveis</strong>!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2.5 items-center justify-between border-t border-slate-100 mt-2">
          {/* Rate selector */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-2">
            <div className="flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] text-slate-500 font-extrabold">Velocidade:</span>
            </div>
            <div className="flex bg-slate-100 rounded-xl p-0.5 border border-slate-201 border-slate-200">
              {[
                { label: 'Pausado (0.75x)', value: 0.75 },
                { label: 'Natural (0.9x)', value: 0.9 },
                { label: 'Fluente (1.1x)', value: 1.1 }
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSpeechRate(r.value)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                    speechRate === r.value
                      ? 'bg-[#1e3a8a] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-805 hover:text-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {pronouncingText && (
            <button
              type="button"
              onClick={handleStopSpeech}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-brand-red-100/60 text-brand-red-700 border border-brand-red-200/50 text-[10px] font-black flex items-center justify-center space-x-1 hover:bg-brand-red-200/60 transition-colors uppercase tracking-wider shrink-0 cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5 text-brand-red-700" />
              <span>Silenciar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Lesson Title Card */}
      {activeSectionTab === 'intro' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-201 border-slate-200 shadow-sm space-y-3.5 relative overflow-hidden animate-fade-in" id="modular_card_title">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-amber-100/40">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Lição {activeLessonIndex + 1} de {filteredLessons.length}</span>
            </div>
            
            {/* Audio Action Trigger */}
            <button
              type="button"
              onClick={() => handleHearText(getIntroHearText(activeLesson))}
              className={`px-3.5 py-2 text-white text-[11px] font-black rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer touch-manipulation active:scale-95 border border-transparent ${
                pronouncingText === cleanTextForSpeech(getIntroHearText(activeLesson)) ? 'bg-[#15803d]' : 'bg-[#1e3a8a] hover:bg-[#172554]'
              }`}
            >
              {pronouncingText === cleanTextForSpeech(getIntroHearText(activeLesson)) ? (
                <div className="flex items-end space-x-[2px] h-3.5 w-4 pb-[2px] shrink-0 mr-0.5">
                  <div className="w-[3px] bg-yellow-300 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                  <div className="w-[3px] bg-yellow-300 rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                  <div className="w-[3px] bg-yellow-300 rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                </div>
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-yellow-300 stroke-[2.5]" />
              )}
              <span>{pronouncingText === cleanTextForSpeech(getIntroHearText(activeLesson)) ? 'A tocar...' : 'Ouvir Frase'}</span>
            </button>
          </div>
          
          <h2 className="text-xl font-extrabold text-slate-800 leading-snug tracking-tight">
            {activeLesson.title}
          </h2>
          <span className="text-xs text-slate-500 font-semibold block bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 italic">
            Tradução: {activeLesson.titlePt}
          </span>

          {/* Supporting Lesson Illustration Banner */}
          <div className="w-full h-44 sm:h-52 overflow-hidden rounded-2xl relative shadow-inner border border-slate-150 my-2.5">
            <img 
              src={getSupportingImageForLesson(activeLesson, 'intro', lessonImages)} 
              alt={activeLesson.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100 font-medium">
            {activeLesson.introductionPt}
          </p>
        </div>
      )}

      {/* Vocabulary Audio Cards with custom purple pastel badges */}
      {activeSectionTab === 'vocab' && (
        <div className="space-y-3 animate-fade-in" id="modular_vocab_section">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[#0f172a] text-xs uppercase tracking-widest">Dicionário Prático</h3>
            <span className="text-[10.5px] text-slate-400 font-medium">Toque para ouvir a pronúncia</span>
          </div>

          {/* Supporting Vocabulary Illustration Banner */}
          <div className="w-full h-28 sm:h-32 overflow-hidden rounded-2xl relative shadow-sm border border-slate-150 mb-1">
            <img 
              src={getSupportingImageForLesson(activeLesson, 'vocab', lessonImages)} 
              alt="Vocabulário Contextual" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between">
              <span className="text-white text-[10px] font-black tracking-widest uppercase bg-purple-600 px-2 py-0.5 rounded-lg shadow-xs">VOCABULARY TOUCHPOINT</span>
              <span className="text-white/90 text-[10.5px] font-bold">{activeLesson.vocabulary.length} expressões</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeLesson.vocabulary.map((vocab, index) => (
              <div
                key={index}
                onClick={() => handleHearText(vocab.en)}
                className="bg-white p-4.5 rounded-2xl border border-slate-200 hover:border-purple-305 hover:border-purple-300 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between group shadow-sm touch-manipulation"
              >
                <div className="flex items-center space-x-3.5">
                  {/* Purple Pastel Square Badge */}
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100/50 shrink-0">
                    <Brain className="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-base text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors">
                        {vocab.en}
                      </span>
                      {pronouncingText === cleanTextForSpeech(vocab.en) && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg font-bold animate-pulse">
                          A tocar...
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-0.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">Pronúncia: <strong className="text-purple-700 font-bold">{vocab.pronunciation}</strong></span>
                      <span className="font-bold text-slate-700">{vocab.pt}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className={`p-3.5 rounded-xl transition-all border ${
                    pronouncingText === cleanTextForSpeech(vocab.en)
                      ? 'bg-purple-600 text-white border-purple-600 ring-4 ring-purple-100 scale-105'
                      : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white border-purple-100/20'
                  }`}
                  aria-label="Falar vocabulário"
                >
                  {pronouncingText === cleanTextForSpeech(vocab.en) ? (
                    <div className="flex items-end space-x-[2.5px] h-4.5 w-4.5 pb-[2px] justify-center shrink-0">
                      <div className="w-[3px] bg-current rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                      <div className="w-[3px] bg-current rounded-full animate-bounce h-4" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                      <div className="w-[3px] bg-current rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                    </div>
                  ) : (
                    <Mic className="w-4.5 h-4.5 stroke-[2.2]" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Next Section Step Helper */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mt-4 shadow-sm animate-fade-in">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Próxima Etapa</span>
              <p className="text-xs text-slate-700 font-extrabold leading-tight mt-0.5">Conversação Real (Praticar os Diálogos Práticos)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetSectionTab('intro')}
                className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none min-h-[44px]"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => {
                  handleMarkSectionComplete('vocab');
                  handleSetSectionTab('dialogue');
                }}
                className="px-5 py-3.5 bg-[#1e3a8a] text-[#ffffff] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md select-none min-h-[44px]"
              >
                <span>Vocabulário Estudado & Ir para Diálogo</span>
                <ArrowRight className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive dialogue players with refined border tracks */}
      {activeSectionTab === 'dialogue' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 animate-fade-in" id="modular_dialogue_section">
          <div>
            <h3 className="font-extrabold text-[#0f172a] text-xs uppercase tracking-widest text-slate-800">Conversação Real (Dialogue)</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{activeLesson.dialoguePt}</p>
          </div>

          {/* Supporting Dialogue Illustration Banner */}
          <div className="w-full h-32 sm:h-36 overflow-hidden rounded-2xl relative shadow-sm border border-slate-150">
            <img 
              src={getSupportingImageForLesson(activeLesson, 'dialogue', lessonImages)} 
              alt="Contexto do Diálogo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {activeLesson.dialogue.map((line, index) => {
              const isFirstSpeaker = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col space-y-1.5 p-4 rounded-2xl border ${
                    isFirstSpeaker 
                      ? 'bg-blue-50/20 border-slate-100 rounded-tl-none border-l-4 border-l-[#1e3a8a]' 
                      : 'bg-indigo-50/20 border-slate-100 rounded-tr-none border-r-4 border-r-[#312e81]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isFirstSpeaker ? 'text-[#1e3a8a]' : 'text-[#312e81]'}`}>
                      {line.speaker}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHearText(line.textEn);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border transition-all cursor-pointer ${
                        pronouncingText === cleanTextForSpeech(line.textEn)
                          ? 'bg-blue-600 text-white border-blue-600 font-extrabold scale-105 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 hover:text-blue-700 text-slate-500 border-slate-150'
                      }`}
                    >
                      {pronouncingText === cleanTextForSpeech(line.textEn) ? (
                        <div className="flex items-end space-x-[1.5px] h-3 w-3 pb-[1px] justify-center mr-0.5 shrink-0">
                          <div className="w-[2px] bg-white rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.6s' }} />
                          <div className="w-[2px] bg-white rounded-full animate-bounce h-3" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                          <div className="w-[2px] bg-white rounded-full animate-bounce h-2" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                        </div>
                      ) : (
                        <Mic className="w-3 h-3 stroke-[2.2]" />
                      )}
                      <span>{pronouncingText === cleanTextForSpeech(line.textEn) ? 'A tocar...' : 'Ouvir'}</span>
                    </button>
                  </div>
                  <p className="font-bold text-sm text-slate-800 leading-relaxed tracking-tight">
                    {line.textEn}
                  </p>
                  <p className="text-xs text-slate-500 italic mt-1 pt-1.5 border-t border-slate-105 border-slate-100">
                    {line.textPt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Advice tip from Wise Owl Mascot Sabush */}
      {activeSectionTab === 'intro' && (
        <div className="space-y-4 animate-fade-in" id="modular_intro_advice_section">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="w-11 h-11 bg-amber-50 text-amber-600 border border-amber-200/40 rounded-xl flex items-center justify-center shrink-0">
              <Mascot expression="talking" size="sm" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Regra Essencial do Sabush</span>
              </h4>
              <p className="text-xs text-slate-650 text-slate-600 leading-relaxed font-semibold">
                {activeLesson.explanationPt}
              </p>
            </div>
          </div>

          {/* Next Section Step Helper */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mt-2 animate-fade-in shadow-sm">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Próxima Etapa</span>
              <p className="text-xs text-slate-705 text-slate-700 font-extrabold leading-tight mt-0.5">Estudar Dicionário / Vocabulário Prático da Aula (⏱️ 2 Minutos)</p>
            </div>
            <button
              type="button"
              onClick={() => {
                handleMarkSectionComplete('intro');
                handleSetSectionTab('vocab');
              }}
              className="px-5 py-3.5 bg-brand-navy-800 hover:bg-brand-navy-950 text-[#ffffff] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md select-none min-h-[44px]"
            >
              <span>Marcar Lida & Praticar Vocabulário</span>
              <ArrowRight className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}

      {/* Discussion prompt for advanced learners */}
      {activeSectionTab === 'dialogue' && activeLesson.discussionPrompt && (
        <div className="bg-brand-gold-50/40 border-2 border-dashed border-brand-gold-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-navy-900 shadow-sm">
                <Mic className="w-5 h-5 stroke-[2.2] text-brand-navy-900" />
              </div>
              <div>
                <h4 className="font-extrabold text-brand-navy-900 text-sm tracking-tight">Advanced Fluency Discussion</h4>
                <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Expand your speaking & writing skills</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleHearText(activeLesson.discussionPrompt || '')}
              className={`p-2 border transition-all shadow-sm cursor-pointer rounded-xl ${
                pronouncingText === cleanTextForSpeech(activeLesson.discussionPrompt || '')
                  ? 'bg-brand-gold-400 border-brand-gold-450 text-brand-navy-900 ring-2 ring-brand-gold-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-brand-navy-900 hover:border-slate-300'
              }`}
              title="Hear Discussion Prompt"
            >
              {pronouncingText === cleanTextForSpeech(activeLesson.discussionPrompt || '') ? (
                <div className="flex items-end space-x-[1.5px] h-4 w-4 pb-[1px] justify-center shrink-0">
                  <div className="w-[2px] bg-current rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                  <div className="w-[2px] bg-current rounded-full animate-bounce h-4" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                  <div className="w-[2px] bg-current rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                </div>
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="space-y-3 pt-1">
            <div className="font-serif italic text-sm text-brand-navy-850 leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl shadow-inner text-slate-800">
              "{activeLesson.discussionPrompt}"
            </div>
            {activeLesson.discussionPromptPt && (
              <p className="text-xs text-slate-500 leading-relaxed px-1">
                <span className="font-semibold text-brand-navy-900">Translation / Guide:</span> {activeLesson.discussionPromptPt}
              </p>
            )}
            
            {/* Interactive textarea for users to write and self-check or copy to chat */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-extrabold text-brand-navy-800 uppercase tracking-widest block">Draft Your Oral or Written Answer:</label>
              <textarea
                placeholder="Write your response here in English using the advanced vocabulary..."
                rows={3}
                className="w-full text-xs p-3.5 rounded-2xl border-2 border-slate-200 outline-none focus:border-brand-navy-800 transition-all font-sans leading-relaxed"
                onChange={(e) => {
                  try {
                    localStorage.setItem(`sabush_draft_${activeLesson.id}`, e.target.value);
                  } catch (err) {
                    console.debug(err);
                  }
                }}
                defaultValue={(() => {
                  try {
                    return localStorage.getItem(`sabush_draft_${activeLesson.id}`) || '';
                  } catch {
                    return '';
                  }
                })()}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <p className="text-[10px] text-slate-400 font-semibold">Tip: Aim for at least 3-5 sentences. Speak it out loud, then write it!</p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const currentDraft = localStorage.getItem(`sabush_draft_${activeLesson.id}`) || '';
                      if (currentDraft.trim()) {
                        localStorage.setItem('sabush_chat_preset', `Here is my draft for the discussion prompt "${activeLesson.discussionPrompt}":\n\n"${currentDraft}"\n\nCan you evaluate my writing and suggest any natural corrections?`);
                      } else {
                        localStorage.setItem('sabush_chat_preset', `I would like to practice speaking/writing about this topic: "${activeLesson.discussionPrompt}"`);
                      }
                    } catch (e) {
                      console.warn(e);
                    }
                    onNavigateToChat();
                  }}
                  className="px-3.5 py-2 bg-brand-navy-800 text-white hover:bg-brand-navy-900 text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-gold-400" />
                  <span>Send to AI Tutor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSectionTab === 'dialogue' && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mt-4 shadow-sm animate-fade-in" id="modular_dialogue_footer">
          <div className="text-left">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Próxima Etapa</span>
            <p className="text-xs text-slate-705 text-slate-700 font-extrabold leading-tight mt-0.5">Fazer Exercícios / Teste Rápido de Fixação</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSetSectionTab('vocab')}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none min-h-[44px]"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => {
                handleMarkSectionComplete('dialogue');
                handleSetSectionTab('quiz');
              }}
              className="px-5 py-3.5 bg-[#1e3a8a] text-[#ffffff] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md select-none min-h-[44px]"
            >
              <span>Diálogo Praticado & Ir para Exercícios</span>
              <ArrowRight className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ INTERACTIVE QUESTION TARGET (Large tap helpers >=48px height) */}
      {activeSectionTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 animate-fade-in" id="modular_quiz_section">
        {currentQuestion && (
          <>
            <div className="space-y-1 pb-3.5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-brand-navy-800 text-xs uppercase tracking-widest flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-brand-gold-500" />
                  <span>Pratique Agora!</span>
                </h3>
                {questionsList.length > 1 && (
                  <span className="text-[10px] bg-brand-navy-100 text-brand-navy-800 font-extrabold px-2.5 py-1 rounded-full">
                    Pergunta {currentQuestionIdx + 1} de {questionsList.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 italic">
                Pergunta: {currentQuestion.translation}
              </p>
            </div>

            {/* Supporting Quiz Illustration Banner */}
            <div className="w-full h-24 sm:h-28 overflow-hidden rounded-2xl relative shadow-xs border border-slate-150 mb-2">
              <img 
                src={getSupportingImageForLesson(activeLesson, 'quiz', lessonImages)} 
                alt="Desafio Sabush" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
            </div>

            <p className="font-black text-sm text-brand-navy-900 bg-brand-navy-50/30 p-4 rounded-2xl border border-brand-navy-100">
              {currentQuestion.question}
            </p>

            {/* Big accessible options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                let btnClass = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';
                
                if (isSelected) {
                  btnClass = 'bg-brand-red-50 border-brand-red-500 text-brand-red-900 font-extrabold';
                }
                
                if (exerciseStatus === 'correct' && idx === currentQuestion.correctAnswerIndex) {
                  btnClass = 'bg-emerald-600 border-emerald-700 text-white font-black';
                } else if (exerciseStatus === 'incorrect' && isSelected) {
                  btnClass = 'bg-brand-red-600 border-brand-red-700 text-white font-black';
                }

                return (
                  <button
                    key={idx}
                    disabled={exerciseStatus === 'correct'}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full py-4 px-5 rounded-2xl text-left text-xs font-bold border-2 transition-all relative flex items-center justify-between cursor-pointer min-h-[52px] ${btnClass}`}
                  >
                    <span>{option}</span>
                    {isSelected && exerciseStatus === 'idle' && (
                      <div className="w-5 h-5 rounded-full bg-brand-gold-500 flex items-center justify-center text-brand-navy-900 text-xs font-black">✓</div>
                    )}
                    {exerciseStatus === 'correct' && idx === currentQuestion.correctAnswerIndex && (
                      <Check className="w-5 h-5 text-white stroke-[3.5]" />
                    )}
                    {exerciseStatus === 'incorrect' && isSelected && (
                      <X className="w-5 h-5 text-white stroke-[3.5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submission or Next Question logic */}
            {exerciseStatus === 'idle' ? (
              <button
                disabled={selectedAnswer === null}
                onClick={handleVerifyAnswer}
                className={`w-full py-4 rounded-2xl text-sm font-extrabold tracking-wide transition-all cursor-pointer min-h-[48px] ${
                  selectedAnswer !== null 
                    ? 'bg-brand-red-600 hover:bg-brand-red-700 hover:border-brand-gold-400 border border-transparent text-white font-extrabold shadow-md' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                Validar Resposta
              </button>
            ) : exerciseStatus === 'correct' && currentQuestionIdx < questionsList.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-brand-navy-800 hover:bg-brand-navy-900 hover:border-brand-gold-400 border border-transparent text-white font-extrabold py-4 px-5 rounded-2xl text-sm transition-all flex items-center justify-center space-x-2.5 shadow-md cursor-pointer min-h-[48px]"
              >
                <span>Próxima Pergunta</span>
                <ArrowRight className="w-5 h-5 text-brand-gold-400 stroke-[2.5px]" />
              </button>
            ) : null}

            {/* FEEDBACK COLOURED FRAMES WITH EXPRESSIVE MASCOT */}
            {exerciseStatus === 'correct' && (
              <div className="bg-emerald-50 text-emerald-950 p-5 rounded-3xl border border-emerald-200 space-y-3 animate-bounce-short">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-1.5 rounded-xl border border-emerald-200">
                    <Mascot expression="happy" size="sm" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-black text-xs uppercase tracking-widest text-emerald-800 block">
                      {currentQuestionIdx === questionsList.length - 1 ? 'Excelente Trabalho!!! Aula Concluída!' : 'Resposta Correcta!'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 block">
                      {currentQuestionIdx === questionsList.length - 1 ? 'Ganhou +15 XP' : 'Excelente progresso, continue!'}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {exerciseStatus === 'incorrect' && (
              <div className="bg-brand-red-50 text-brand-navy-900 p-5 rounded-3xl border border-brand-red-200 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-brand-red-100 p-1.5 rounded-xl border border-brand-red-200">
                    <Mascot expression="thinking" size="sm" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-black text-xs uppercase tracking-widest text-brand-red-800 block">Ainda não foi desta...</span>
                    <span className="text-xs font-bold text-brand-red-600 block">Revise as dicas e tente de novo!</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed font-normal text-slate-700">
                  Opa! A opção selecionada não está correta. Mas errar faz parte do aprendizado do inglês! Clique no botão abaixo para tentar mais uma vez. Força!
                </p>
                <button
                  onClick={handleRestartExercise}
                  className="mt-1 w-full text-brand-navy-900 bg-white border-2 border-slate-200 py-3 px-4 rounded-xl text-xs font-black hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4 text-brand-navy-900" />
                  <span>Tentar de Novo</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )}

    {activeSectionTab === 'quiz' && (
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mt-4 shadow-sm animate-fade-in" id="modular_quiz_footer">
        <div className="text-left">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Próxima Etapa</span>
          <p className="text-xs text-slate-705 text-slate-700 font-extrabold leading-tight mt-0.5">Treinar Audição (Compreensão Auditiva)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSetSectionTab('dialogue')}
            className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none min-h-[44px]"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => {
              handleMarkSectionComplete('quiz');
              handleSetSectionTab('listening');
            }}
            className="px-5 py-3.5 bg-brand-navy-800 hover:bg-brand-navy-950 text-[#ffffff] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md select-none min-h-[44px]"
          >
            <span>Exercícios Feitos & Ir para Audição</span>
            <ArrowRight className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
          </button>
        </div>
      </div>
    )}

      {/* PEDAGOGY IMPROVEMENT 6 - Listening Comprehension with Natural-Speed Audio */}
      {activeSectionTab === 'listening' && activeLesson.listeningComprehension && (
        <div key={`listening-${activeLesson.id}`} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-navy-50 text-brand-navy-900 flex items-center justify-center border border-brand-navy-100 shadow-xs shrink-0">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-left font-sans">
                <h4 className="font-extrabold text-brand-navy-900 text-sm tracking-tight text-left">🎧 Compreensão Auditiva (Listening Comprehension)</h4>
                <p className="text-[10px] text-brand-navy-500 font-extrabold uppercase tracking-widest leading-none mt-0.5 text-left">Velocidade natural & Pronúncia real</p>
              </div>
            </div>
            
            {/* Speed controller badges */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase px-1.5 hidden sm:inline">Rate:</span>
              {[
                { label: '0.8x', value: 0.8 },
                { label: '1.05x', value: 1.05 },
                { label: '1.2x', value: 1.2 }
              ].map((sp) => (
                <button
                  key={sp.label}
                  onClick={() => setListeningSpeed(sp.value)}
                  className={`text-[9px] font-black px-2 py-1 rounded-md transition-all cursor-pointer ${
                    listeningSpeed === sp.value
                      ? 'bg-brand-navy-800 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Supporting Listening Illustration Banner */}
          <div className="w-full h-28 sm:h-32 overflow-hidden rounded-2xl relative shadow-sm border border-slate-150">
            <img 
              src={getSupportingImageForLesson(activeLesson, 'listening', lessonImages)} 
              alt="Listening Comprehension" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Premium Audio player Card */}
          <div className="bg-brand-navy-900 text-white rounded-2xl p-4 border border-brand-navy-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            {/* Abstract decorative wave graphic */}
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-32 flex items-center justify-center">
              <div className="flex items-end space-x-1">
                <div className={`w-1 h-8 bg-white rounded-full ${isPlayingListeningPassage ? 'animate-pulse' : ''}`} style={{ animationDelay: '100ms' }}></div>
                <div className={`w-1 h-12 bg-white rounded-full ${isPlayingListeningPassage ? 'animate-pulse' : ''}`} style={{ animationDelay: '300ms' }}></div>
                <div className={`w-1 h-16 bg-white rounded-full ${isPlayingListeningPassage ? 'animate-pulse' : ''}`} style={{ animationDelay: '500ms' }}></div>
                <div className={`w-1 h-10 bg-white rounded-full ${isPlayingListeningPassage ? 'animate-pulse' : ''}`} style={{ animationDelay: '200ms' }}></div>
                <div className={`w-1 h-6 bg-white rounded-full ${isPlayingListeningPassage ? 'animate-pulse' : ''}`} style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/20 shadow-xs transition-transform ${
                isPlayingListeningPassage ? 'bg-emerald-600 scale-105' : 'bg-white/10'
              }`}>
                <Headphones className={`w-5 h-5 text-white ${isPlayingListeningPassage ? 'animate-bounce' : ''}`} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#93c5fd]">Passagem Completa da Aula</span>
                <p className="text-xs text-white/90 leading-tight font-bold">
                  {isPlayingListeningPassage ? 'A reproduzir áudio da situação real...' : 'Pronto para escutar. Teste os seus ouvidos.'}
                </p>
                <div className="flex items-center space-x-1.5 text-[10px] text-white/50">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPlayingListeningPassage ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>Velocidade de escuta selecionada: {listeningSpeed}x</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              {isPlayingListeningPassage ? (
                <button
                  onClick={handleStopListeningPassage}
                  className="w-full sm:w-auto bg-brand-red-600 hover:bg-brand-red-750 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs min-h-[40px]"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Parar Audição</span>
                </button>
              ) : (
                <button
                  onClick={() => handleHearListeningPassage(activeLesson.listeningComprehension!.passage)}
                  className="w-full sm:w-auto bg-[#3182ce] hover:bg-[#2b6cb0] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs min-h-[40px]"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Iniciar Audição</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Multiple Choice Quiz for Listening */}
          {(() => {
            const currentQ = activeLesson.listeningComprehension.questions[listeningActiveQuestion];
            const hasQuestions = activeLesson.listeningComprehension.questions.length > 0;
            if (!hasQuestions || !currentQ) return null;

            const selectedOptionIdx = listeningAnswers[listeningActiveQuestion];
            const isCorrectAnswer = selectedOptionIdx === currentQ.correctAnswerIndex;
            const isAnswered = selectedOptionIdx !== undefined;

            return (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2b6cb0]">
                    Pergunta de Compreensão {listeningActiveQuestion + 1} de {activeLesson.listeningComprehension.questions.length}
                  </span>
                  <div className="flex items-center space-x-1">
                    {activeLesson.listeningComprehension.questions.map((_, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => {
                          setListeningActiveQuestion(qIdx);
                        }}
                        className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                          listeningActiveQuestion === qIdx
                            ? 'bg-brand-navy-900 border border-brand-navy-950 text-white font-extrabold'
                            : listeningAnswers[qIdx] !== undefined
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {qIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-extrabold text-sm text-brand-navy-900 leading-normal">
                    {currentQ.question}
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOptionIdx === optIdx;
                      let optionBg = 'bg-white hover:bg-slate-100 border-slate-200';
                      let optionText = 'text-slate-800';

                      if (isAnswered) {
                        if (optIdx === currentQ.correctAnswerIndex) {
                          optionBg = 'bg-emerald-50 border-emerald-450';
                          optionText = 'text-emerald-950 font-semibold leading-normal';
                        } else if (isOptionSelected) {
                          optionBg = 'bg-brand-red-50 border-brand-red-355';
                          optionText = 'text-brand-red-950 leading-normal';
                        }
                      } else if (isOptionSelected) {
                        optionBg = 'bg-slate-200 border-brand-navy-800';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => {
                            setListeningAnswers(prev => ({ ...prev, [listeningActiveQuestion]: optIdx }));
                          }}
                          className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between min-h-[44px] ${optionBg} ${
                            isAnswered ? 'cursor-default' : 'cursor-pointer hover:border-slate-350'
                          }`}
                        >
                          <span className={`${optionText}`}>{opt}</span>
                          {isAnswered && optIdx === currentQ.correctAnswerIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {isAnswered && isOptionSelected && optIdx !== currentQ.correctAnswerIndex && (
                            <X className="w-4 h-4 text-brand-red-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <div className={`p-4 rounded-xl border space-y-2 text-left ${
                    isCorrectAnswer ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-brand-red-50/50 border-brand-red-200 text-slate-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0">
                        {isCorrectAnswer ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        ) : (
                          <X className="w-4 h-4 text-brand-red-600 stroke-[3]" />
                        )}
                      </div>
                      <span className="font-extrabold text-xs uppercase tracking-wider">
                        {isCorrectAnswer ? 'Resposta Correta!' : 'Ainda não foi desta...'}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-semibold">
                      {isCorrectAnswer 
                        ? currentQ.explanation 
                        : 'Dica: Ouça a audição novamente para capturar onde está o detalhe! Pressione "Tentar de Novo" nesta pergunta para escolher outra opção.'}
                    </p>
                    
                    <div className="pt-2 flex items-center gap-2">
                      {!isCorrectAnswer && (
                        <button
                          onClick={() => {
                            setListeningAnswers(prev => {
                              const updated = { ...prev };
                              delete updated[listeningActiveQuestion];
                              return updated;
                            });
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-extrabold rounded-lg text-[10px] hover:bg-slate-50 transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Tentar de Novo</span>
                        </button>
                      )}

                      {isCorrectAnswer && listeningActiveQuestion < activeLesson.listeningComprehension.questions.length - 1 && (
                        <button
                          onClick={() => {
                            setListeningActiveQuestion(prev => prev + 1);
                          }}
                          className="px-4 py-1.5 bg-[#2b6cb0] text-white font-extrabold rounded-lg text-[10px] hover:bg-[#2b6cb0]/90 transition-colors flex items-center space-x-1 cursor-pointer ml-auto"
                        >
                          <span>Próxima Pergunta</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isCorrectAnswer && listeningActiveQuestion === activeLesson.listeningComprehension.questions.length - 1 && (
                        <div className="bg-white border border-emerald-250 py-1 px-2.5 rounded-lg text-emerald-700 text-[10px] font-black tracking-wide ml-auto flex items-center space-x-1">
                          <Award className="w-3 h-3 text-emerald-600 animate-spin" />
                          <span>Compreendeu com sucesso!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Transcript "Mostrar transcrição" Disclosure Block */}
          {(() => {
            const hasAttempted = Object.keys(listeningAnswers).length > 0;
            return (
              <div className="border-t border-slate-100 pt-4 text-left">
                {!hasAttempted ? (
                  <p className="text-slate-400 text-[10px] font-semibold italic text-center">
                    🔒 Faça uma tentativa de audição & responda para revelar a transcrição do texto.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowListeningTranscript(!showListeningTranscript)}
                      className="w-full flex items-center justify-between text-xs font-black text-slate-600 bg-slate-50 border border-slate-250 py-2.5 px-3.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        {showListeningTranscript ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#2b6cb0]" />
                        )}
                        <span>{showListeningTranscript ? 'Ocultar Transcrição' : 'Mostrar Transcrição'}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded-md">Passagem de Áudio</span>
                    </button>

                    {showListeningTranscript && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100 space-y-3"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-widest font-black text-[#2b6cb0] block">Transcrição Oficial En-US:</span>
                          <p className="font-serif italic text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                            "{activeLesson.listeningComprehension.passage}"
                          </p>
                        </div>
                        {activeLesson.listeningComprehension.passagePt && (
                          <div className="border-t border-indigo-100/60 pt-2 space-y-1">
                            <span className="text-[9px] uppercase tracking-widest font-black text-indigo-800 block">Tradução em Português:</span>
                            <p className="text-[11px] italic text-slate-600 leading-relaxed">
                              {activeLesson.listeningComprehension.passagePt}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {activeSectionTab === 'listening' && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mt-4 shadow-sm animate-fade-in" id="modular_listening_footer">
          <div className="text-left">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Próxima Etapa</span>
            <p className="text-xs text-slate-705 text-slate-705 text-slate-700 font-extrabold leading-tight mt-0.5">Prática Real (Desafio Final de Pronúncia & Gravação)</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSetSectionTab('quiz')}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none min-h-[44px]"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => {
                handleMarkSectionComplete('listening');
                handleSetSectionTab('speaking');
              }}
              className="px-5 py-3.5 bg-brand-navy-800 hover:bg-brand-navy-950 text-[#ffffff] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md select-none min-h-[44px]"
            >
              <span>Audição Concluída & Ir para Desafio Final</span>
              <ArrowRight className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}

      {/* closing "Prática Real" (Speaking challenge) */}
      {activeSectionTab === 'speaking' && (() => {
        const speakingPrompt = activeLesson.speakingScenario || {
          prompt: `Record yourself practicing the core pronunciation and speaking the dialogue for this lesson out loud. Imagine you are presenting this in a real workplace scenario in Mozambique!`,
          promptPt: `Grave-se a praticar a pronúncia essencial e a falar o diálogo desta lição em voz alta. Imagine que está a apresentar isto num cenário de trabalho real em Moçambique!`
        };

        return (
          <div className="space-y-4 animate-fade-in" id="modular_speaking_section">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-red-50 text-brand-red-650 flex items-center justify-center border border-brand-red-100 shadow-xs shrink-0">
                <Mic className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-brand-navy-900 text-sm tracking-tight">🎤 Prática Real (Speaking Challenge)</h4>
                <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-none mt-0.5">Fale em voz alta e teste-se!</p>
              </div>
            </div>

            {/* Supporting Speaking Illustration Banner */}
            <div className="w-full h-28 sm:h-32 overflow-hidden rounded-2xl relative shadow-sm border border-slate-150">
              <img 
                src={getSupportingImageForLesson(activeLesson, 'speaking', lessonImages)} 
                alt="Speaking Challenge" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2 text-left">
              <p className="font-serif italic text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                "{speakingPrompt.prompt}"
              </p>
              <div className="text-[10.5px] text-slate-500 leading-normal border-t border-slate-100 pt-2 w-full flex flex-col space-y-0.5">
                <span className="font-bold text-brand-navy-800">Tradução / Guia de Contexto:</span>
                <span className="italic">{speakingPrompt.promptPt}</span>
              </div>
            </div>

            {!isRecording && !recordedAudioUrl ? (
              <button
                onClick={handleStartRecording}
                className="w-full bg-brand-red-600 hover:bg-brand-red-750 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm min-h-[44px]"
              >
                <Mic className="w-4.5 h-4.5 text-brand-gold-400 stroke-[2.5]" />
                <span>Iniciar Gravação de Áudio</span>
              </button>
            ) : isRecording ? (
              <div className="space-y-3 bg-red-50/40 border border-red-150 p-4 rounded-2xl flex flex-col items-center">
                <div className="flex items-center space-x-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span className="text-xs font-black text-red-700 uppercase tracking-widest animate-pulse">A gravar...</span>
                  <span className="text-xs font-mono font-black text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                    {formatTime(recordingDuration)}
                  </span>
                </div>
                
                {/* Animated visual waveform of recorded voice */}
                <div className="flex items-end space-x-1 h-6">
                  {[4, 10, 6, 14, 8, 12, 16, 11, 7, 13, 9, 5].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-brand-red-500 rounded-full animate-bounce" 
                      style={{ 
                        height: `${isRecording ? h + Math.sin(recordingDuration + i) * 6 : 4}px`,
                        animationDuration: `${0.4 + (i % 3) * 0.15}s` 
                      }} 
                    />
                  ))}
                </div>

                <button
                  onClick={handleStopRecording}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl flex items-center space-x-2 cursor-pointer uppercase tracking-wider shadow-sm min-h-[40px] mt-1"
                >
                  <span className="w-2.5 h-2.5 bg-white rounded-xs"></span>
                  <span>Parar e Concluir Gravação</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 bg-emerald-50/15 border border-emerald-150 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-emerald-100 p-1 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider text-left">Gravação concluída com sucesso!</span>
                  </div>
                  
                  <button
                    onClick={handleDiscardRecording}
                    className="text-[10px] text-brand-red-650 hover:underline font-black uppercase flex items-center space-x-1 cursor-pointer min-h-[36px] px-2.5 rounded-lg hover:bg-brand-red-50/60 transition-colors"
                  >
                    <span>✕ Re-gravar</span>
                  </button>
                </div>

                {recordedAudioUrl && recordedAudioUrl !== 'simulated-recording' ? (
                  <div className="bg-white border border-slate-150 p-2.5 rounded-xl flex items-center justify-between gap-4">
                    <audio src={recordedAudioUrl} controls className="w-full h-8 outline-none" />
                  </div>
                ) : (
                  <div className="bg-white border border-slate-150 p-4 rounded-xl text-center space-y-1.5 shadow-inner">
                    <p className="text-xs font-black text-slate-800 flex items-center justify-center space-x-1.5">
                      <span>🔊 Sucesso do Teste (Permissão/Iframe Bypass)</span>
                    </p>
                    <p className="text-[10.5px] text-slate-550 text-slate-500 font-semibold leading-relaxed">
                      Sua voz foi simulada e o áudio fictício foi criado com êxito! Isso acontece quando as restrições locais de iFrame não permitem gravação de microfone em tempo real.
                    </p>
                  </div>
                )}

                {/* Evaluating Loader */}
                {isEvaluating && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3.5 text-center shadow-inner animate-pulse w-full">
                    <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
                      <Mascot expression="thinking" size="md" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center justify-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 text-brand-navy-600 animate-spin" />
                        <span>A Avaliar Pronúncia...</span>
                      </p>
                      <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed max-w-sm">
                        O Mocho AI está a analisar o sotaque, a fluência e a correspondência da sua voz com o inglês nativo...
                      </p>
                    </div>
                  </div>
                )}

                {/* Real-time Dynamic AI Feedback */}
                {!isEvaluating && evaluationFeedback && (
                  <div className={`p-5 rounded-3xl border space-y-4 text-left transition-all duration-300 w-full ${
                    evaluationFeedback.matchLevel === 'excelente' 
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-950' 
                      : evaluationFeedback.matchLevel === 'bom'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-brand-red-50/50 border-brand-red-200 text-brand-navy-950'
                  }`}>
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2 rounded-2xl border shrink-0 ${
                        evaluationFeedback.matchLevel === 'excelente'
                          ? 'bg-emerald-100 border-emerald-200'
                          : evaluationFeedback.matchLevel === 'bom'
                          ? 'bg-amber-100 border-amber-200'
                          : 'bg-brand-red-100 border-brand-red-200'
                      }`}>
                        <Mascot 
                          expression={
                            evaluationFeedback.matchLevel === 'excelente' 
                              ? 'happy' 
                              : evaluationFeedback.matchLevel === 'bom' 
                              ? 'talking' 
                              : 'thinking'
                          } 
                          size="sm" 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className={`font-black text-[10px] uppercase tracking-widest block ${
                          evaluationFeedback.matchLevel === 'excelente'
                            ? 'text-emerald-800'
                            : evaluationFeedback.matchLevel === 'bom'
                            ? 'text-amber-800'
                            : 'text-brand-red-800'
                        }`}>
                          {evaluationFeedback.matchLevel === 'excelente' 
                            ? '🌟 Pronúncia Excelente!' 
                            : evaluationFeedback.matchLevel === 'bom'
                            ? '👍 Bom Trabalho!'
                            : '💪 Vamos Praticar Mais!'}
                        </span>
                        <span className={`text-[11px] font-bold block ${
                          evaluationFeedback.matchLevel === 'excelente'
                            ? 'text-emerald-600'
                            : evaluationFeedback.matchLevel === 'bom'
                            ? 'text-amber-600'
                            : 'text-brand-red-600'
                        }`}>
                          {evaluationFeedback.matchLevel === 'excelente'
                            ? 'A sua voz corresponde quase perfeitamente à frase pretendida!'
                            : evaluationFeedback.matchLevel === 'bom'
                            ? 'Muito compreensível! Pode ajustar pequenos pormenores.'
                            : 'Não desanime! A prática leva à perfeição.'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1 border-t border-dashed border-slate-200">
                      <div className="space-y-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block">O que você disse (Transcrição):</span>
                        <div className="bg-white/80 border border-slate-150 rounded-xl px-3.5 py-2.5 shadow-sm">
                          <p className="text-xs font-mono font-bold italic text-slate-800 leading-relaxed">
                            "{evaluationFeedback.transcript || 'Sem áudio detectado'}"
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block">Dica e Avaliação do Mocho Coach:</span>
                        <p className="text-xs leading-relaxed font-medium text-slate-700">
                          {evaluationFeedback.feedbackPt}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={handleDiscardRecording}
                        className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 text-xs font-black rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider transition-all shadow-sm min-h-[38px]"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tentar Novamente</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Default save states if not currently evaluating and no dynamic feedback is loaded yet */}
                {!isEvaluating && !evaluationFeedback && (
                  <>
                    {/* Save button to sync with Firestore & Storage */}
                    {!saveSuccess ? (
                      <button
                        onClick={handleSaveRecording}
                        disabled={isSavingRecording}
                        className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 px-4 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm min-h-[44px]"
                      >
                        <Award className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
                        <span>{isSavingRecording ? 'A guardar no Progresso...' : 'Salvar no Meu Progresso'}</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-100/50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl text-xs font-semibold leading-relaxed text-left flex items-start space-x-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-emerald-950">Histórico de Pronúncia Sincronizado!</p>
                          <p className="text-[11.5px] text-emerald-800 leading-normal">O seu registo de voz foi guardado com segurança na sua conta Sabush. Poderá ouvi-la no painel "O Meu Progresso" nas definições da sua conta Sabush.</p>
                        </div>
                      </div>
                    )}

                    {/* Feedback from AI coach */}
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-950 flex items-start space-x-2.5 text-left w-full">
                      <div className="shrink-0 mt-0.5">
                        <Mascot expression="happy" size="sm" onDark={true} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-brand-gold-400 uppercase tracking-widest block">🦉 Mocho AI Coach</span>
                        <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">
                          Lindo esforço de conversação! O seu arquivo de voz foi registado localmente com sucesso. Clique em "Salvar no Meu Progresso" para que a inteligência artificial do Sabush analise detalhadamente o tom, sotaque e fluência desta gravação. Excelente trabalho a falar! 🇲🇿
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            </div>

            {/* Next Section Step Helper */}
            <div className="bg-emerald-50 border border-emerald-250 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mt-2 animate-fade-in shadow-sm w-full">
              <div className="text-left font-sans">
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest block">Parabéns! Aula Concluída</span>
                <p className="text-xs text-emerald-950 font-extrabold leading-tight mt-0.5">Completou todas as etapas modulares desta aula com sucesso!</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSetSectionTab('listening')}
                  className="px-4 py-3 bg-white border border-slate-200 text-slate-650 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none min-h-[44px]"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleMarkSectionComplete('speaking');
                    const isAlreadyCompleted = completedLessons.includes(activeLesson.id);
                    onCompleteLesson(activeLesson.id, isAlreadyCompleted ? 0 : 15);
                    if (!randomInspirationCard) {
                      const randomPick = DEFAULT_INSPIRATION_CARDS[Math.floor(Math.random() * DEFAULT_INSPIRATION_CARDS.length)];
                      setRandomInspirationCard(randomPick);
                    }
                    setShowInspirationCard(true);
                  }}
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md select-none min-h-[44px]"
                >
                  <Award className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
                  <span>Concluir Moçambique Aula & Receber XP!</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FOOTER NAV COMPANIONS */}
      <div className="flex flex-col space-y-3.5 pt-4 border-t border-slate-200">
        {activeLessonIndex < filteredLessons.length - 1 ? (
          <button
            onClick={handleNextLesson}
            className="w-full bg-brand-red-600 hover:bg-brand-red-700 hover:border-brand-gold-400 border border-transparent text-white font-extrabold py-4 px-5 rounded-2xl text-sm transition-all flex items-center justify-center space-x-2.5 shadow-md cursor-pointer min-h-[48px]"
          >
            <span>Próxima Aula</span>
            <ArrowRight className="w-5 h-5 text-brand-gold-400 stroke-[2.5px]" />
          </button>
        ) : (
          <div className="bg-brand-navy-800 text-white rounded-3xl p-6 border border-brand-navy-905 border-2 border-brand-red-600 space-y-4 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red-500/5 rounded-full blur-xl" />
            <Mascot expression="happy" size="lg" className="mx-auto" onDark={true} />
            
            <h4 className="font-extrabold text-[#ffffff] text-lg tracking-tight">Parabéns! Completou o Syllabus!</h4>
            <p className="text-xs text-slate-200 leading-relaxed max-w-xs mx-auto">
              Ganhou o certificado digital local para estas aulas. Que tal testar a sua pronúncia real agora num diálogo direto com a IA do Sabush English Club?
            </p>
            <button
              onClick={onNavigateToChat}
              className="w-full bg-brand-red-600 hover:bg-brand-red-700 hover:border-brand-gold-400 border border-transparent text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all shadow-md mt-2 flex items-center justify-center space-x-2.5 cursor-pointer min-h-[44px]"
            >
              <span>Conversar com Tutor IA</span>
              <Mic className="w-4.5 h-4.5 text-brand-gold-400 stroke-[2.2]" />
            </button>
          </div>
        )}
      </div>
        </>
      )}
    </>
  )}

  {/* Intermediate Inspiration Card Overlay Modal */}
  <AnimatePresence>
    {showInspirationCard && randomInspirationCard && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowInspirationCard(false)}
          className="fixed inset-0 bg-[#02050e]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm sm:max-w-md mx-auto z-55 bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-slate-200/50 flex flex-col items-center text-center space-y-4"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[9px] text-[#ffffff] font-extrabold uppercase tracking-widest bg-brand-red-600 border border-brand-red-500 px-3 py-1.5 rounded-full select-none flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-400 fill-brand-gold-400" />
              <span>🔋 Recarga Mental de Inglês</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold max-w-xs mt-1">
              Excelente progresso! Pare, respire fundo e recarregue o foco com esta dica rápida antes de continuar:
            </p>
          </div>

          {/* Render visual card in compact style */}
          <div className="w-full max-w-xs sm:max-w-sm border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-brand-navy-950">
            <InspirationCardView card={randomInspirationCard} />
          </div>

          {/* Continue study action button with 44px+ touch area */}
          <button
            onClick={() => setShowInspirationCard(false)}
            className="w-full bg-brand-navy-850 hover:bg-brand-navy-955 text-[#ffffff] hover:border-brand-gold-400 border border-transparent font-black tracking-wider uppercase py-3.5 px-4 rounded-xl text-xs transition-colors shadow-md min-h-[44px] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Continuar a Estudar</span>
            <ArrowRight className="w-4 h-4 text-brand-gold-300 stroke-[2.5px]" />
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
  );
}
