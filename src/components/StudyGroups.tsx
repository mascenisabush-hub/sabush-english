/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Plus, 
  ChevronRight, 
  Trash2, 
  Flag, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  MessageCircle, 
  BookOpen, 
  Loader2, 
  Volume2, 
  LogOut, 
  Play, 
  Pause,
  AlertTriangle,
  UserCheck,
  Trophy,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Mascot } from './Mascot';
import { 
  createStudyGroup, 
  joinStudyGroup, 
  leaveStudyGroup, 
  deleteStudyGroup, 
  getStudyGroups, 
  subscribeGroupMembers, 
  subscribeGroupMessages, 
  sendGroupMessage, 
  reportGroupMessage, 
  deleteGroupMessage, 
  uploadVoiceNote,
  auth,
  FirebaseUserProfile,
  subscribeChallengeResponses,
  submitChallengeResponse,
  deleteChallengeResponse,
  toggleChallengeReaction
} from '../firebase';
import { StudyGroup, GroupMember, GroupMessage, GroupChallengeResponse } from '../types';

const getWeeklyPrompt = (level: 'Iniciante' | 'Intermédio' | 'Avançado') => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);

  const beginnerPrompts = [
    {
      title: "My Favorite Things",
      descPt: "Apresenta-te e descreve a tua refeição ou passatempo favorito em inglês. De onde és e o que gostas de fazer?",
      promptEn: "Introduce yourself and describe your favorite meal or hobby in English. Where are you from and what do you like to do?"
    },
    {
      title: "My Daily Routine",
      descPt: "Descreve a tua rotina diária básica em inglês. A que horas acordas, o que comes e o que fazes à tarde?",
      promptEn: "Describe your basic daily routine in English. What time do you wake up, what do you eat, and what do you do in the afternoon?"
    },
    {
      title: "My Family Circle",
      descPt: "Fala um pouco sobre a tua família ou as pessoas especiais com quem vives. Como se chamam e o que fazem?",
      promptEn: "Talk a little about your family or the special people you live with. What are their names and what do they do?"
    },
    {
      title: "My Mozambican Hometown",
      descPt: "Fala sobre a cidade, vila ou bairro em Moçambique onde vives atualmente. Como se chama e qual é o teu local preferido lá?",
      promptEn: "Talk about the city, town, or neighborhood in Mozambique where you currently live. What is it called and what is your favorite place there?"
    }
  ];

  const intermediatePrompts = [
    {
      title: "My Weekend Experience",
      descPt: "Descreve em inglês como foi o teu fim de semana (o que fizeste) e quais são os teus planos para o próximo.",
      promptEn: "Describe in English how your weekend was (what you did) and what your plans are for the next one."
    },
    {
      title: "Cooking Mozambican Food",
      descPt: "Explica em inglês como se prepara um prato típico moçambicano à tua escolha (ex. Matapa, Mucapata, Caril) para um estrangeiro!",
      promptEn: "Explain in English how to prepare a traditional Mozambican dish of your choice (e.g., Matapa, Mucapata, Curry) for a foreign guest!"
    },
    {
      title: "A Life Lesson",
      descPt: "Fala em inglês sobre um conselho ou lição valiosa que aprendeste no passado e que carregas contigo no dia a dia.",
      promptEn: "Talk in English about a valuable advice or lesson you learned in the past and carry with you daily."
    },
    {
      title: "Technology & Local Learning",
      descPt: "Como a tecnologia e a internet mudaram a forma como comunicas e aprendes em Moçambique? Partilha a tua perspetiva em inglês.",
      promptEn: "How has technology and the internet changed the way you communicate and learn in Mozambique? Share your perspective in English."
    }
  ];

  const advancedPrompts = [
    {
      title: "Career & English in Mozambique",
      descPt: "Discute em inglês as tuas metas de carreira, o mercado de trabalho em Moçambique e a relevância do inglês para o teu sucesso.",
      promptEn: "Discuss in English your career goals, the job market in Mozambique, and the relevance of English to your success."
    },
    {
      title: "Climate Resiliency & Communities",
      descPt: "Discorra em inglês sobre como as alterações climáticas e os desastres naturais afetam as comunidades locais e soluções sustentáveis em África.",
      promptEn: "Examine in English how climate change and natural disasters impact local communities and sustainable solutions in Africa."
    },
    {
      title: "Rich Mozambican Culture",
      descPt: "Analise de forma eloquente em inglês como a rica diversidade cultural de Moçambique contribui para a coesão social e a identidade nacional.",
      promptEn: "Eloquently analyze in English how the rich cultural diversity of Mozambique contributes to social cohesion and national identity."
    },
    {
      title: "Innovative Local Entrepreneurship",
      descPt: "Que ideias de negócio inovadoras poderiam prosperar em Moçambique para solucionar um desafio comum? Defenda a sua tese em inglês.",
      promptEn: "What innovative business ideas could thrive in Mozambique to solve a common social or economic challenge? Defend your thesis in English."
    }
  ];

  switch (level) {
    case 'Iniciante': {
      const idx = weekNumber % beginnerPrompts.length;
      return beginnerPrompts[idx];
    }
    case 'Intermédio': {
      const idx = weekNumber % intermediatePrompts.length;
      return intermediatePrompts[idx];
    }
    case 'Avançado': {
      const idx = weekNumber % advancedPrompts.length;
      return advancedPrompts[idx];
    }
    default: {
      const idx = weekNumber % beginnerPrompts.length;
      return beginnerPrompts[idx];
    }
  }
};

interface StudyGroupsProps {
  userProfile: FirebaseUserProfile | null;
  onNavigateHome: () => void;
  onRegisterBack?: (handler: (() => boolean) | null) => void;
}

export function StudyGroups({ userProfile, onNavigateHome, onRegisterBack }: StudyGroupsProps) {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeGroup, setActiveGroup] = useState<StudyGroup | null>(null);
  const [showMembersOnMobile, setShowMembersOnMobile] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
  // Helper to safely parse Firebase timestamp or generic date
  const getResponseDate = (resp: GroupChallengeResponse): Date => {
    if (!resp.createdAt) return new Date();
    if (typeof resp.createdAt.toDate === 'function') {
      return resp.createdAt.toDate();
    }
    if (resp.createdAt.seconds !== undefined) {
      return new Date(resp.createdAt.seconds * 1000);
    }
    return new Date(resp.createdAt);
  };

  // Helper to check if a date is in the current calendar week (matching getWeeklyPrompt cadence)
  const isCurrentWeek = (date: Date): boolean => {
    const now = new Date();
    if (date.getFullYear() !== now.getFullYear()) return false;
    
    const getWeekNum = (d: Date) => {
      const startDate = new Date(d.getFullYear(), 0, 1);
      const days = Math.floor((d.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      return Math.ceil((days + startDate.getDay() + 1) / 7);
    };
    
    return getWeekNum(date) === getWeekNum(now);
  };

  // Calculate Group Rankings client-side based on engagement points
  const getGroupRanking = () => {
    const scoredMembers = members.map(member => {
      // Find all responses submitted by this member in the current week
      const memberResponses = challResponses.filter(resp => {
        if (resp.userId !== member.userId) return false;
        const respDate = getResponseDate(resp);
        return isCurrentWeek(respDate);
      });

      const submissionCount = memberResponses.length;
      let reactionCount = 0;

      memberResponses.forEach(resp => {
        if (resp.reactions) {
          Object.entries(resp.reactions).forEach(([emoji, voters]) => {
            if (Array.isArray(voters)) {
              // Points from other members
              const otherVoters = voters.filter(uid => uid !== member.userId);
              reactionCount += otherVoters.length;
            }
          });
        }
      });

      const score = submissionCount + reactionCount;

      return {
        userId: member.userId,
        name: member.name,
        submissionCount,
        reactionCount,
        score
      };
    });

    // Sort by score (descending), then by name (ascending)
    return [...scoredMembers].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.name.localeCompare(b.name);
    });
  };
  
  // Register back handlers
  useEffect(() => {
    if (showCreateModal && onRegisterBack) {
      onRegisterBack(() => {
        setShowCreateModal(false);
        return true;
      });
    } else if (showMembersOnMobile && onRegisterBack) {
      onRegisterBack(() => {
        setShowMembersOnMobile(false);
        return true;
      });
    } else if (activeGroup && onRegisterBack) {
      onRegisterBack(() => {
        setActiveGroup(null);
        return true;
      });
    } else {
      if (onRegisterBack) onRegisterBack(null);
    }
    return () => {
      if (onRegisterBack) onRegisterBack(null);
    };
  }, [showCreateModal, showMembersOnMobile, activeGroup, onRegisterBack]);

  // Reset mobile members view when active group changes
  useEffect(() => {
    setShowMembersOnMobile(false);
  }, [activeGroup]);
  
  // Create group form state
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupDesc, setNewGroupDesc] = useState<string>('');
  const [newGroupLevel, setNewGroupLevel] = useState<'Iniciante' | 'Intermédio' | 'Avançado'>('Iniciante');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Active Group details (members, messages)
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Voice note states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recSeconds, setRecSeconds] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [recError, setRecError] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const authUser = auth.currentUser;
  const isAdmin = authUser?.email === 'sabushagency@gmail.com';

  // Weekly Speaking Challenge States
  const [challResponses, setChallResponses] = useState<GroupChallengeResponse[]>([]);
  const [challText, setChallText] = useState<string>('');
  const [isChallSubmitting, setIsChallSubmitting] = useState<boolean>(false);
  const [isChallCollapsed, setIsChallCollapsed] = useState<boolean>(true);

  // Challenge recording state
  const [isChallRecording, setIsChallRecording] = useState<boolean>(false);
  const [challRecSeconds, setChallRecSeconds] = useState<number>(0);
  const [challMediaRecorder, setChallMediaRecorder] = useState<MediaRecorder | null>(null);
  const [challAudioBlob, setChallAudioBlob] = useState<Blob | null>(null);
  const [challRecError, setChallRecError] = useState<string>('');

  // Load groups list
  const loadGroupsList = async () => {
    try {
      setLoading(true);
      const data = await getStudyGroups();
      setGroups(data);

      // Auto-restore active group on refresh
      const savedGroupId = localStorage.getItem('sabush_active_group_id');
      if (savedGroupId) {
        const found = data.find(g => g.groupId === savedGroupId);
        if (found) {
          setActiveGroup(found);
        }
      }
    } catch (err) {
      console.error("Error loading groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupsList();
  }, []);

  // Persist currently active group ID to restore on page refresh
  useEffect(() => {
    if (activeGroup) {
      localStorage.setItem('sabush_active_group_id', activeGroup.groupId);
    } else {
      localStorage.removeItem('sabush_active_group_id');
    }
  }, [activeGroup]);

  // Subscribe to members and messages when an active group is selected
  useEffect(() => {
    if (!activeGroup) return;

    // Real-time listener for members
    const unsubscribeMembers = subscribeGroupMembers(activeGroup.groupId, (membersList) => {
      setMembers(membersList);
    });

    // Real-time listener for messages
    const unsubscribeMessages = subscribeGroupMessages(activeGroup.groupId, (messagesList) => {
      setMessages(messagesList);
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeMessages();
    };
  }, [activeGroup]);

  // Subscribe to challenge responses when activeGroup is selected
  useEffect(() => {
    if (!activeGroup) {
      setChallResponses([]);
      return;
    }

    const unsubscribeChallenges = subscribeChallengeResponses(activeGroup.groupId, (responsesList) => {
      setChallResponses(responsesList);
    });

    return () => {
      unsubscribeChallenges();
    };
  }, [activeGroup]);

  // Audio Recording limits timer for weekly challenge
  useEffect(() => {
    let interval: any = null;
    if (isChallRecording) {
      interval = setInterval(() => {
        setChallRecSeconds((prev) => {
          if (prev >= 119) {
            handleStopChallRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setChallRecSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isChallRecording, challMediaRecorder]);

  // Audio Recording limits timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecSeconds((prev) => {
          if (prev >= 119) {
            handleStopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, mediaRecorder]);

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !newGroupName.trim() || !newGroupDesc.trim()) return;

    try {
      setIsCreating(true);
      const creatorName = userProfile?.name || authUser.displayName || 'Estudante Sabush';
      
      const groupId = await createStudyGroup(
        newGroupName.trim(),
        newGroupDesc.trim(),
        newGroupLevel,
        authUser.uid,
        creatorName
      );

      // Reset create modal
      setNewGroupName('');
      setNewGroupDesc('');
      setNewGroupLevel('Iniciante');
      setShowCreateModal(false);
      
      // Reload groups list & transition to created group
      await loadGroupsList();
      
      // Find created group to enter
      const freshGroups = await getStudyGroups();
      const created = freshGroups.find(g => g.groupId === groupId);
      if (created) {
        setActiveGroup(created);
      }
    } catch (err) {
      console.error("Error creating group:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (group: StudyGroup) => {
    if (!authUser) return;
    try {
      const uName = userProfile?.name || authUser.displayName || 'Estudante Sabush';
      await joinStudyGroup(group.groupId, authUser.uid, uName);
      
      // Reload list and set active group
      await loadGroupsList();
      setActiveGroup(group);
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  const handleLeave = async () => {
    if (!activeGroup || !authUser) return;
    if (confirm("Tens a certeza que desejas sair deste grupo de estudo?")) {
      try {
        await leaveStudyGroup(activeGroup.groupId, authUser.uid);
        setActiveGroup(null);
        await loadGroupsList();
      } catch (err) {
        console.error("Error leaving group:", err);
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (!activeGroup) return;
    if (confirm("ATENÇÃO: Tens a certeza absoluta de que desejas apagar definitivamente este grupo de estudo? Esta ação é irreversível.")) {
      try {
        await deleteStudyGroup(activeGroup.groupId);
        setActiveGroup(null);
        await loadGroupsList();
      } catch (err) {
        console.error("Error deleting group:", err);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !authUser) return;
    if (!messageText.trim() && !audioBlob) return;

    try {
      setIsSending(true);
      const senderName = userProfile?.name || authUser.displayName || 'Estudante Sabush';

      if (audioBlob) {
        // Voice message upload flow
        setIsUploading(true);
        const downloadUrl = await uploadVoiceNote(activeGroup.groupId, authUser.uid, audioBlob);
        await sendGroupMessage(
          activeGroup.groupId,
          authUser.uid,
          senderName,
          messageText.trim() || '🎤 Nota de voz enviada',
          {
            url: downloadUrl,
            duration: recSeconds || 1,
            size: audioBlob.size
          }
        );
        setAudioBlob(null);
      } else {
        // Standard text message send
        await sendGroupMessage(
          activeGroup.groupId,
          authUser.uid,
          senderName,
          messageText.trim()
        );
      }

      setMessageText('');
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };

  // Challenge Recording & Submit handlers
  const handleStartChallRecording = async () => {
    setChallRecError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setChallAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setChallMediaRecorder(recorder);
      setChallAudioBlob(null);
      setIsChallRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setChallRecError('Ative as permissões de microfone do seu navegador para gravar notas de voz.');
    }
  };

  const handleStopChallRecording = () => {
    if (challMediaRecorder && challMediaRecorder.state !== 'inactive') {
      challMediaRecorder.stop();
      setIsChallRecording(false);
    }
  };

  const handleCancelChallRecording = () => {
    if (challMediaRecorder && challMediaRecorder.state !== 'inactive') {
      challMediaRecorder.stop();
    }
    setIsChallRecording(false);
    setChallAudioBlob(null);
    setChallRecSeconds(0);
  };

  const handleSubmitChallengeResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !authUser) return;
    if (!challText.trim() && !challAudioBlob) return;

    try {
      setIsChallSubmitting(true);
      const senderName = userProfile?.name || authUser.displayName || 'Estudante Sabush';
      const promptObj = getWeeklyPrompt(activeGroup.levelFocus);

      let audioDetails: { url: string; duration: number; size: number } | undefined = undefined;

      if (challAudioBlob) {
        // Upload voice note
        const downloadUrl = await uploadVoiceNote(activeGroup.groupId, authUser.uid, challAudioBlob);
        audioDetails = {
          url: downloadUrl,
          duration: challRecSeconds || 1,
          size: challAudioBlob.size
        };
      }

      await submitChallengeResponse(
        activeGroup.groupId,
        authUser.uid,
        senderName,
        promptObj.promptEn,
        challText.trim(),
        audioDetails
      );

      // Reset
      setChallText('');
      setChallAudioBlob(null);
    } catch (err) {
      console.error("Error submitting challenge response:", err);
    } finally {
      setIsChallSubmitting(false);
    }
  };

  const handleDeleteChallResponse = async (respId: string) => {
    if (!activeGroup) return;
    if (confirm("Tens a certeza que desejas apagar a tua resposta do desafio?")) {
      try {
        await deleteChallengeResponse(activeGroup.groupId, respId);
      } catch (err) {
        console.error("Error deleting challenge response:", err);
      }
    }
  };

  const handleToggleReaction = async (
    responseId: string,
    emoji: string,
    currentReactions?: { [emoji: string]: string[] }
  ) => {
    if (!activeGroup || !authUser) return;
    try {
      await toggleChallengeReaction(
        activeGroup.groupId,
        responseId,
        authUser.uid,
        emoji,
        currentReactions
      );
    } catch (err) {
      console.error("Error toggling reaction:", err);
    }
  };

  const hasReacted = (reactions: { [emoji: string]: string[] } | undefined, emoji: string) => {
    if (!reactions || !authUser) return false;
    return reactions[emoji]?.includes(authUser.uid) || false;
  };

  const reactionCount = (reactions: { [emoji: string]: string[] } | undefined, emoji: string) => {
    if (!reactions) return 0;
    return reactions[emoji]?.length || 0;
  };

  const isHighlighted = (resp: GroupChallengeResponse) => {
    if (!resp.reactions) return false;
    const creatorId = activeGroup?.creatorId;
    // Highlight if the group creator reacted to it, or if there is a '⭐' reaction by anyone
    const hasCreatorReaction = creatorId && Object.values(resp.reactions).some((voters) => voters.includes(creatorId));
    const hasStarReaction = resp.reactions['⭐'] && resp.reactions['⭐'].length > 0;
    return !!(hasCreatorReaction || hasStarReaction);
  };

  // Recording management
  const handleStartRecording = async () => {
    setRecError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioBlob(null);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setRecError('Ative as permissões de microfone do seu navegador para gravar mensagens de voz.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setAudioBlob(null);
    setRecSeconds(0);
  };

  // Flag moderation / reporter helper
  const handleReportMessage = async (msg: GroupMessage) => {
    if (!activeGroup || !authUser) return;
    if (msg.reports?.includes(authUser.uid)) {
      alert("Já reportaste esta mensagem para os moderadores do Sabush.");
      return;
    }
    if (confirm("Desejas denunciar esta mensagem como inapropriada ou ofensiva para revisão dos moderadores do Club?")) {
      try {
        await reportGroupMessage(activeGroup.groupId, msg.messageId, authUser.uid);
        alert("Denúncia registada. Agradecemos por manter a nossa comunidade segura!");
      } catch (err) {
        console.error("Error reporting message:", err);
      }
    }
  };

  // Trash deletion helper for creators & admins
  const handleDeleteMessage = async (msgId: string) => {
    if (!activeGroup) return;
    if (confirm("Tens a certeza que desejas apagar esta mensagem como moderador do grupo?")) {
      try {
        await deleteGroupMessage(activeGroup.groupId, msgId);
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    }
  };

  const isUserMemberOfActiveGroup = () => {
    if (!authUser || !activeGroup) return false;
    return members.some(m => m.userId === authUser.uid);
  };

  const formatSecs = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sub-component for custom Audio note playing
  function VoicePlayButton({ url, duration, size }: { url: string; duration?: number; size?: number }) {
    const [playing, setPlaying] = useState(false);
    const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      setAudioObj(audio);
      return () => {
        audio.pause();
      };
    }, [url]);

    const togglePlay = () => {
      if (!audioObj) return;
      if (playing) {
        audioObj.pause();
        setPlaying(false);
      } else {
        // Pause other audios
        audioObj.play().catch(e => console.log("Audio play err", e));
        setPlaying(true);
      }
    };

    const sizeStr = size ? `${(size / 1024).toFixed(1)} KB` : '';

    return (
      <div className="flex items-center space-x-2.5 bg-brand-navy-900 border border-brand-navy-950 px-3.5 py-2.5 rounded-2xl select-none max-w-[280px] mt-1 shadow-inner animate-fade-in text-white">
        <button 
          type="button"
          onClick={togglePlay}
          className="p-2 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-full transition-colors cursor-pointer shrink-0 flex items-center justify-center h-8 w-8"
          title={playing ? "Pausar" : "Reproduzir nota de voz"}
        >
          {playing ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
        </button>
        <div className="text-[11px] leading-tight font-semibold">
          <span className="block font-bold">Mensagem de Voz</span>
          <span className="text-slate-400 text-[10px]">{formatSecs(duration || 0)} {sizeStr && `• ${sizeStr}`}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 
         ===========================================================
         A. GROUPS DIRECTORY LIST VIEW
         ===========================================================
      */}
      {!activeGroup ? (
        <div className="space-y-6" id="groups-directory-main">
          {/* Header Banner Section with custom blue gradient & white action button as requested */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-500/10">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-black tracking-tight flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <Users className="w-5 h-5 text-yellow-300" />
                </div>
                <span>Grupos de Estudo</span>
              </h1>
              <p className="text-xs text-slate-200 font-semibold max-w-xl leading-relaxed">
                Pratica o teu inglês conversando com outros membros do Sabush English Club no teu nível, partilha áudios de pronúncia para melhorares a fluência e cresce em conjunto!
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white hover:bg-slate-50 text-[#1e3a8a] font-extrabold text-xs uppercase px-5 py-3 rounded-2xl tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.8] text-[#1e3a8a]" />
              <span>Criar Grupo</span>
            </button>
          </div>

          {/* Group Creation Popup Modal overlay */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-md p-6 border-2 border-brand-navy-900 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <h3 className="text-sm font-black text-brand-navy-900 uppercase tracking-wider flex items-center space-x-2">
                    <Users className="w-5 h-5 text-brand-red-600" />
                    <span>Criar Novo Grupo</span>
                  </h3>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 cursor-pointer min-h-[36px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Nome do Grupo</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Grupo Iniciante - Maputo"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      maxLength={50}
                      className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy-500 bg-slate-50"
                    />
                  </div>

                  {/* Description field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Descrição Breve</label>
                    <textarea 
                      required
                      placeholder="Ex: Espaço para praticar saudações diárias e áudios de vocabulário do nível iniciante..."
                      value={newGroupDesc}
                      onChange={(e) => setNewGroupDesc(e.target.value)}
                      maxLength={180}
                      rows={3}
                      className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy-500 bg-slate-50 resize-none"
                    />
                  </div>

                  {/* Focus level field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Nível de Foco</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Iniciante', 'Intermédio', 'Avançado'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setNewGroupLevel(lvl)}
                          className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                            newGroupLevel === lvl
                              ? 'bg-brand-navy-800 border-brand-navy-950 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-brand-red-650 hover:bg-brand-red-750 text-[#ffffff] font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer min-h-[44px]"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>A criar grupo...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 stroke-[2.2]" />
                        <span>Confirmar e Criar</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Directory listings */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="w-9 h-9 text-brand-red-600 animate-spin" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">A carregar salas de conversa...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-brand-navy-900 text-sm">Nenhum grupo ativo</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Sê o primeiro a lançar um grupo de estudo no Club! Reúne parceiros de prática e inicia diálogos enriquecedores.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-navy-800 text-white hover:bg-brand-navy-900 text-xs font-black uppercase px-5 py-3 rounded-2xl inline-flex items-center space-x-1.5 transition-all cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4 text-brand-gold-400 stroke-[2.5]" />
                <span>Criar Primeiro Grupo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
              {groups.map((group) => {
                const isCreator = authUser?.uid === group.creatorId;
                
                return (
                  <div 
                    key={group.groupId}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-brand-navy-300 shadow-xs flex flex-col justify-between space-y-4.5 transition-all"
                  >
                    {/* Top Row: Tag/Badge & Members */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        group.levelFocus === 'Iniciante' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : group.levelFocus === 'Intermédio'
                            ? 'bg-brand-gold-100 text-brand-navy-950 border border-brand-gold-250'
                            : 'bg-brand-red-50 text-brand-red-700 border border-brand-red-150'
                      }`}>
                        Nível: {group.levelFocus}
                      </span>
                      
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{group.memberCount} M{group.memberCount === 1 ? 'embro' : 'embros'}</span>
                      </span>
                    </div>

                    {/* Middle Details: Name & Description */}
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-brand-navy-950 text-sm leading-tight group-hover:text-brand-red-600 transition-colors">
                        {group.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    {/* Footer Row: Actions */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold truncate max-w-[180px]">
                        Criador: <span className="font-extrabold text-slate-600">{group.creatorName}</span>
                      </div>

                      <button
                        onClick={() => handleJoin(group)}
                        className="bg-brand-navy-100 hover:bg-brand-navy-200 text-brand-navy-900 border border-slate-150 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1 min-h-[38px]"
                      >
                        <span>Aceder</span>
                        <ChevronRight className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Guidelines Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center space-x-3.5 text-xs">
            <div className="p-1 bg-brand-navy-900 rounded-xl">
              <Mascot expression="happy" size="sm" onDark={true} />
            </div>
            <p className="text-slate-600 font-semibold leading-relaxed">
              <strong>Regra de Ouro:</strong> Escreve mensagens cordiais ou grava notas de voz completando os desafios das aulas. Evita publicar conteúdos que não estejam relacionados com o estudo de língua inglesa.
            </p>
          </div>
        </div>
      ) : (
        
        /* 
           ===========================================================
           B. IN-GROUP CHAT ROOM & MODERATION VIEW
           ===========================================================
        */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="groups-active-room">
          
          {/* 1. LEFT SIDEBAR PANEL: Members list & Group metadata */}
          <div className={`${showMembersOnMobile ? 'block' : 'hidden md:block'} md:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between h-auto md:h-[620px] shadow-sm`}>
            
            <div className="space-y-4">
              {/* Back to list button */}
              <button
                onClick={() => setActiveGroup(null)}
                className="w-full text-slate-700 hover:text-brand-red-650 bg-slate-100 hover:bg-slate-200 font-extrabold text-[10px] uppercase tracking-wider border border-slate-200 py-2.5 rounded-xl transition-all cursor-pointer min-h-[40px] flex items-center justify-center space-x-1"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Voltar à Lista</span>
              </button>

              {/* Mobile button to return to chat */}
              <button
                onClick={() => setShowMembersOnMobile(false)}
                className="md:hidden w-full text-white bg-slate-800 hover:bg-slate-900 font-extrabold text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer min-h-[40px] flex items-center justify-center space-x-1"
              >
                <span>Voltar ao Chat</span>
              </button>

              {/* Focus summary badge */}
              <div className="space-y-1.5 p-3.5 bg-brand-navy-50/50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[10px] bg-brand-navy-800 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider block mx-auto w-max">
                  Foco: {activeGroup.levelFocus}
                </span>
                <h2 className="font-extrabold text-brand-navy-900 text-sm leading-tight py-1">{activeGroup.name}</h2>
                <p className="text-[11px] text-slate-500 font-medium leading-normal">{activeGroup.description}</p>
              </div>

              {/* Members List Sub-panel */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block border-b pb-1">
                  Membros online ({members.length})
                </span>
                <div className="space-y-1.5 max-h-[180px] md:max-h-[250px] overflow-y-auto pr-1">
                  {members.map((member) => {
                    const isMemberCreator = member.userId === activeGroup.creatorId;
                    const isSelf = member.userId === authUser?.uid;
                    
                    return (
                      <div 
                        key={member.userId} 
                        className={`px-3 py-2 border rounded-xl text-xs font-bold leading-normal flex items-center justify-between ${
                          isMemberCreator 
                            ? 'bg-brand-red-50/20 border-brand-red-200 text-brand-red-700' 
                            : 'bg-slate-50 border-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="truncate max-w-[120px] flex items-center space-x-1">
                          {isSelf && <span className="text-xs text-brand-gold-500 font-black">● </span>}
                          <span>{member.name} {isSelf && '(Tu)'}</span>
                        </span>
                        
                        {isMemberCreator ? (
                          <span className="text-[9px] bg-brand-red-600 text-white font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-md">
                            Criador
                          </span>
                        ) : (
                          // Allow group Creator / Admin to remove members
                          (activeGroup.creatorId === authUser?.uid || isAdmin) && !isSelf && (
                            <button
                              onClick={async () => {
                                if (confirm(`Desejas remover ${member.name} deste grupo de estudo?`)) {
                                  try {
                                    await leaveStudyGroup(activeGroup.groupId, member.userId);
                                  } catch (err) {
                                    console.error("Error removing member:", err);
                                  }
                                }
                              }}
                              className="text-slate-400 hover:text-brand-red-600 py-1 px-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Remover membro do grupo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Moderation Actions / Safe Exit button */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {/* If creator or admin, can completely delete */}
              {(activeGroup.creatorId === authUser?.uid || isAdmin) ? (
                <button
                  onClick={handleDeleteGroup}
                  className="w-full bg-slate-50 hover:bg-brand-red-50 border border-slate-200 text-brand-red-650 hover:text-brand-red-700 font-black text-[10px] uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.2]" />
                  <span>Apagar Grupo</span>
                </button>
              ) : isUserMemberOfActiveGroup() ? (
                <button
                  onClick={handleLeave}
                  className="w-full bg-slate-50 hover:bg-brand-red-50 border border-slate-200 text-slate-700 hover:text-brand-red-650 font-black text-[10px] uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center space-x-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Grupo</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* 2. RIGHT CHAT WINDOW PANEL */}
          <div className={`${showMembersOnMobile ? 'hidden md:flex' : 'flex'} md:col-span-3 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between h-[520px] md:h-[620px] shadow-sm relative overflow-hidden`}>
            
            {/* Header: Name and join toggle status */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Mobile Back to List Button */}
                <button
                  onClick={() => setActiveGroup(null)}
                  className="md:hidden p-1.5 hover:bg-slate-200/60 active:bg-slate-300/60 rounded-xl text-slate-700 transition-all cursor-pointer mr-1 -ml-1 border border-slate-200"
                  title="Voltar à Lista"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 stroke-[2.5]" />
                </button>
                <Users className="w-4.5 h-4.5 text-brand-red-600" />
                <h3 className="font-extrabold text-brand-navy-950 text-xs sm:text-sm uppercase tracking-wide">
                  Sala de Conversação
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {/* Mobile Toggle Members Button */}
                <button
                  onClick={() => setShowMembersOnMobile(true)}
                  className="md:hidden bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl transition-all cursor-pointer min-h-[38px] flex items-center space-x-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Membros</span>
                </button>

                {!isUserMemberOfActiveGroup() && authUser && (
                  <button
                    onClick={() => handleJoin(activeGroup)}
                    className="bg-brand-red-600 text-white hover:bg-brand-red-750 font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer min-h-[38px] flex items-center space-x-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Aderir ao Grupo</span>
                  </button>
                )}
              </div>
            </div>

            {/* ===========================================================
                C. DESAFIO DA SEMANA (WEEKLY CHALLENGE BANNER & CARD)
               =========================================================== */}
            <div className="bg-slate-50 border-b border-slate-200/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1 px-1.5 bg-yellow-500 text-slate-950 font-black rounded-lg text-[9px] uppercase flex items-center space-x-1 shadow-xs">
                    <Trophy className="w-3 h-3 text-slate-950" />
                    <span>Desafio da Semana</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-800">
                    {getWeeklyPrompt(activeGroup.levelFocus).title}
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {challResponses.length} {challResponses.length === 1 ? 'resposta' : 'respostas'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChallCollapsed(!isChallCollapsed)}
                  className="flex items-center space-x-1 text-[10px] text-brand-navy-800 hover:text-brand-navy-900 font-extrabold uppercase border px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 transition-all cursor-pointer min-h-[32px]"
                >
                  <span>{isChallCollapsed ? "Ver Desafio" : "Ocultar"}</span>
                  {isChallCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* If NOT collapsed, show prompt instruction, submissions feed, and submission box */}
              {!isChallCollapsed && (
                <div className="mt-4 space-y-4 max-h-[420px] overflow-y-auto pr-1 animate-fade-in text-xs border-t pt-3.5 border-slate-200">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Left side (cols 1 & 2): Challenge Prompt details, Submissions feed and Submission Form */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      {/* Prompt Text details */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-150 p-3.5 rounded-2xl space-y-1.5">
                        <p className="font-bold text-slate-600 leading-normal">
                          💡 <strong>Moçambique Speak-Up:</strong> {getWeeklyPrompt(activeGroup.levelFocus).descPt}
                        </p>
                        <p className="font-extrabold text-brand-navy-950 italic leading-relaxed text-[11px] border-t border-amber-200/60 pt-1.5">
                          " {getWeeklyPrompt(activeGroup.levelFocus).promptEn} "
                        </p>
                      </div>

                      {/* Challenge submissions feed */}
                      <div className="space-y-2.5">
                        <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center space-x-1.5">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span>Participações do Grupo</span>
                        </h5>

                        {challResponses.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic bg-white p-3 rounded-2xl border border-dashed border-slate-200 text-center">
                            Nenhum membro do grupo submeteu resposta ainda. Sê o primeiro a praticar e dar o exemplo!
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-2.5">
                            {challResponses.map((resp) => {
                              const isOwnResp = resp.userId === authUser?.uid;
                              const canDelete = isOwnResp || activeGroup.creatorId === authUser?.uid || isAdmin;
                              const highlighted = isHighlighted(resp);

                              return (
                                <div 
                                  key={resp.responseId} 
                                  className={`rounded-2xl p-3.5 shadow-xs space-y-2.5 relative group/item border transition-all ${
                                    highlighted 
                                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-100/30' 
                                      : 'bg-white border-slate-200/80'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-black text-brand-navy-900 uppercase tracking-wide flex flex-wrap items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                                      <span>{resp.userName}</span>
                                      {isOwnResp && <span className="text-slate-400 font-bold">(Tu)</span>}
                                      {highlighted && (
                                        <span className="inline-flex items-center space-x-0.5 bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md select-none shrink-0">
                                          <span>Destaque 🌟</span>
                                        </span>
                                      )}
                                    </div>
                                    
                                    {canDelete && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteChallResponse(resp.responseId)}
                                        className="text-slate-400 hover:text-brand-red-650 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                                        title="Apagar resposta ao desafio"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  {resp.text && (
                                    <p className="text-slate-700 font-semibold leading-relaxed whitespace-pre-wrap select-text">{resp.text}</p>
                                  )}

                                  {resp.audioUrl && (
                                    <div className="pt-1">
                                      <VoicePlayButton 
                                        url={resp.audioUrl} 
                                        duration={resp.audioDuration} 
                                        size={resp.audioSize} 
                                      />
                                    </div>
                                  )}

                                  {/* Emoji Reactions Tray */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/60 mt-1">
                                    {['👍', '👏', '⭐', '🔥', '❤️'].map((emoji) => {
                                      const active = hasReacted(resp.reactions, emoji);
                                      const count = reactionCount(resp.reactions, emoji);
                                      return (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={() => handleToggleReaction(resp.responseId, emoji, resp.reactions)}
                                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10.5px] transition-all border cursor-pointer select-none font-bold ${
                                            active
                                              ? 'bg-amber-100/80 border-amber-300 text-amber-950 scale-105 shadow-xs'
                                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-500 hover:text-slate-700'
                                          }`}
                                          title={`${emoji} Reação`}
                                        >
                                          <span>{emoji}</span>
                                          {count > 0 && <span className="text-[9px] font-black">{count}</span>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Submission form for group members */}
                      {isUserMemberOfActiveGroup() ? (
                        <form onSubmit={handleSubmitChallengeResponse} className="border-t pt-3.5 space-y-3.5 border-dashed border-slate-205">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Grava ou Escreve a Tua Resposta</label>
                            
                            {/* Audio Recording UI for user */}
                            {isChallRecording ? (
                              <div className="bg-brand-red-50 border border-brand-red-100 p-2.5 rounded-xl flex items-center justify-between animate-pulse">
                                <div className="flex items-center space-x-2 text-brand-red-750">
                                  <span className="w-2 h-2 bg-brand-red-600 rounded-full animate-ping" />
                                  <span className="text-[10px] font-black uppercase">A Gravar Desafio...</span>
                                  <span className="text-xs font-mono font-bold">[{formatSecs(challRecSeconds)} / 2:00]</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={handleCancelChallRecording}
                                    className="bg-white text-slate-500 hover:text-slate-800 border px-2.5 py-1 rounded-lg text-[9px] uppercase font-black transition-all cursor-pointer inline-flex items-center"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleStopChallRecording}
                                    className="bg-brand-red-650 text-white font-black px-2.5 py-1 rounded-lg text-[9px] uppercase transition-all cursor-pointer inline-flex items-center"
                                  >
                                    Terminar
                                  </button>
                                </div>
                              </div>
                            ) : challAudioBlob ? (
                              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-emerald-800">
                                  <Mic className="w-4 h-4 text-emerald-600 animate-bounce" />
                                  <span className="text-[10px] font-black uppercase">Pronúncia Gravada!</span>
                                  <span className="text-xs font-mono text-slate-500 font-bold">[{formatSecs(challRecSeconds)}]</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setChallAudioBlob(null)}
                                  className="text-slate-400 hover:text-brand-red-650 font-bold text-[10px] uppercase cursor-pointer"
                                >
                                  Apagar
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleStartChallRecording}
                                className="bg-brand-red-50 hover:bg-brand-red-100 border border-brand-red-150 text-brand-red-600 font-extrabold text-[10px] uppercase tracking-wider py-2 rounded-xl w-full flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Mic className="w-3.5 h-3.5" />
                                <span>Gravar Áudio de Resposta (Falar em inglês!)</span>
                              </button>
                            )}
                            
                            {challRecError && (
                              <p className="text-[10px] text-brand-red-650 font-bold">{challRecError}</p>
                            )}
                          </div>

                          {/* Text response input field */}
                          <div className="space-y-1">
                            <textarea
                              placeholder="Escreve aqui a versão em texto da tua resposta (ou uma legenda para o teu áudio)..."
                              value={challText}
                              onChange={(e) => setChallText(e.target.value)}
                              maxLength={1000}
                              rows={2}
                              className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy-500 bg-slate-50 resize-none font-semibold text-slate-850"
                            />
                          </div>

                          {/* Submit button */}
                          <button
                            type="submit"
                            disabled={isChallSubmitting || (!challText.trim() && !challAudioBlob)}
                            className="w-full bg-brand-navy-800 hover:bg-brand-navy-900 leading-normal text-white font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer min-h-[38px] disabled:opacity-40 disabled:cursor-not-allowed border border-brand-navy-950 shadow-sm"
                          >
                            {isChallSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                <span>A enviar participação...</span>
                              </>
                            ) : (
                              <>
                                <Trophy className="w-3.5 h-3.5 text-brand-gold-400 stroke-[2]" />
                                <span>Submeter Resposta ao Desafio</span>
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="p-3 bg-slate-100 border rounded-xl text-center text-slate-500 font-bold">
                          Adere a este grupo acima para poderes submeter a tua resposta falada ou escrita!
                        </div>
                      )}
                      
                    </div>

                    {/* Right side (col 3): Ranking do Grupo panel */}
                    <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-5 border-slate-200/80 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex items-center space-x-2 border-b pb-2 border-slate-100">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          <span className="font-extrabold text-brand-navy-900 text-[11px] uppercase tracking-wider">
                            Ranking do Grupo
                          </span>
                          <span className="text-[8.5px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ml-auto select-none">
                            Semanal
                          </span>
                        </div>

                        {/* List of members with engagement points */}
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {getGroupRanking().map((user, index) => {
                            const rank = index + 1;
                            const isMe = user.userId === authUser?.uid;
                            
                            // Top 3 medals or rounded rank badges
                            let rankBadgeStyle = "text-slate-500 bg-slate-100 border-slate-200/60";
                            let cardHighlightStyle = "bg-white border-slate-200/80 hover:bg-slate-50/50";
                            let medalIcon = null;

                            if (rank === 1) {
                              rankBadgeStyle = "bg-yellow-400 text-slate-950 font-black shadow-2xs ring-1 ring-yellow-200 border-yellow-300";
                              cardHighlightStyle = "bg-amber-50/15 border-amber-300 hover:bg-amber-50/25";
                              medalIcon = "🥇";
                            } else if (rank === 2) {
                              rankBadgeStyle = "bg-slate-300 text-slate-800 font-black shadow-2xs ring-1 ring-slate-100 border-slate-250";
                              cardHighlightStyle = "bg-slate-50/40 border-slate-250 hover:bg-slate-50/75";
                              medalIcon = "🥈";
                            } else if (rank === 3) {
                              rankBadgeStyle = "bg-[#d97706] text-white font-black shadow-2xs ring-1 ring-amber-100 border-amber-500";
                              cardHighlightStyle = "bg-amber-50/5 border-amber-200 hover:bg-amber-50/15";
                              medalIcon = "🥉";
                            }

                            if (isMe) {
                              cardHighlightStyle = "bg-brand-navy-900 border-brand-red-500 text-white shadow-2xs ring-1 ring-brand-red-150 relative z-10 hover:bg-brand-navy-850";
                            }

                            return (
                              <div 
                                key={user.userId}
                                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${cardHighlightStyle}`}
                              >
                                <div className="flex items-center space-x-2 min-w-0">
                                  
                                  {/* Rank display */}
                                  <div className="flex flex-col items-center justify-center w-6 h-6 shrink-0">
                                    {medalIcon ? (
                                      <span className="text-base leading-none select-none">{medalIcon}</span>
                                    ) : (
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9.5px] font-black border ${
                                        isMe ? 'bg-brand-red-650 text-white border-brand-red-700' : rankBadgeStyle
                                      }`}>
                                        {rank}
                                      </span>
                                    )}
                                  </div>

                                  {/* User Name & Details */}
                                  <div className="min-w-0">
                                    <div className="flex items-center space-x-1">
                                      <span className={`font-extrabold truncate max-w-[100px] ${isMe ? 'text-[#ffffff]' : 'text-slate-800'}`}>
                                        {user.name}
                                      </span>
                                      {isMe && (
                                        <span className="bg-brand-red-650 text-white px-1 py-0.2 rounded text-[7px] font-black uppercase tracking-wider">
                                          Tu
                                        </span>
                                      )}
                                    </div>
                                    <div className={`text-[9px] font-bold ${isMe ? 'text-slate-300' : 'text-slate-500'}`}>
                                      {user.submissionCount} {user.submissionCount === 1 ? 'envio' : 'envios'} • {user.reactionCount} {user.reactionCount === 1 ? 'reação' : 'reações'}
                                    </div>
                                  </div>
                                </div>

                                {/* Score Points display */}
                                <div className="text-right flex-shrink-0 pl-1">
                                  <span className={`font-black text-xs block leading-none ${isMe ? 'text-brand-gold-400' : 'text-brand-navy-900'}`}>
                                    {user.score}
                                  </span>
                                  <span className={`text-[7.5px] block font-bold leading-none mt-1 ${isMe ? 'text-slate-300' : 'text-slate-400'}`}>
                                    Pts
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Score rules help text */}
                      <div className="text-center pt-3 border-t border-slate-100/80 mt-2">
                        <p className="text-[9px] text-slate-400 font-bold italic leading-relaxed">
                          * Pontuação: +1 ponto por resposta enviada e +1 ponto por reação recebida de outros membros esta semana.
                        </p>
                      </div>
                    </div>
                    
                  </div>

                </div>
              )}
            </div>

            {/* Messages box area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                  <MessageCircle className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                  <div className="space-y-1">
                    <p className="text-xs text-brand-navy-900 font-bold">Sem mensagens</p>
                    <p className="text-[11px] text-slate-500 max-w-xs font-semibold leading-relaxed">
                      Sê o primeiro a cumprimentar os parceiros! Escreve ou grava um áudio apresentando-te em inglês.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelfMsg = msg.senderId === authUser?.uid;
                  const isGroupCreatorMsg = msg.senderId === activeGroup.creatorId;
                  const isCreatorOrAdmin = activeGroup.creatorId === authUser?.uid || isAdmin;

                  return (
                    <div 
                      key={msg.messageId}
                      className={`flex flex-col space-y-1 max-w-[85%] ${isSelfMsg ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      {/* Message author line */}
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center space-x-1">
                        <span>{msg.senderName}</span>
                        {isGroupCreatorMsg && (
                          <span className="text-brand-red-600 text-[8px] font-black">[CRIADOR]</span>
                        )}
                      </span>

                      {/* Message bubble card */}
                      <div className={`p-4 rounded-3xl text-xs font-semibold leading-relaxed relative border group/b ${
                        isSelfMsg 
                          ? 'bg-brand-navy-800 text-[#ffffff] border-brand-navy-900 rounded-tr-none' 
                          : msg.isReported 
                            ? 'bg-amber-50 text-amber-900 border-amber-200 rounded-tl-none' 
                            : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
                      }`}>
                        
                        {/* Reported safety notice */}
                        {msg.isReported && (
                          <div className="mb-2 p-1.5 bg-amber-100 rounded-xl flex items-center space-x-1.5 text-[9px] text-amber-800 uppercase font-black tracking-wide">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>Mensagem sob moderação</span>
                          </div>
                        )}

                        {/* Text (only render if there's text contents) */}
                        {msg.text && (
                          <p className="whitespace-pre-wrap break-all select-text">{msg.text}</p>
                        )}

                        {/* Custom Audio voice note player anchor (if file has audio parameters) */}
                        {msg.audioUrl && (
                          <VoicePlayButton 
                            url={msg.audioUrl} 
                            duration={msg.audioDuration} 
                            size={msg.audioSize} 
                          />
                        )}

                        {/* Top corner hover moderation links */}
                        <div className="absolute top-1.5 right-1.5 hidden group-hover/b:flex items-center space-x-1 bg-white/95 rounded-lg border shadow-sm p-0.5">
                          {/* Report button */}
                          {!isSelfMsg && (
                            <button
                              onClick={() => handleReportMessage(msg)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-amber-600 rounded-md transition-colors cursor-pointer"
                              title="Denunciar mensagem inapropriada"
                            >
                              <Flag className="w-3 h-3" />
                            </button>
                          )}
                          
                          {/* Trash Delete button */}
                          {(isSelfMsg || isCreatorOrAdmin) && (
                            <button
                              onClick={() => handleDeleteMessage(msg.messageId)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-brand-red-650 rounded-md transition-colors cursor-pointer"
                              title="Remover esta mensagem"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Keyboard message bar / recording tools */}
            <div className="p-3 bg-white border-t border-slate-200/80">
              
              {recError && (
                <div className="mb-2.5 p-2 bg-brand-red-50 text-brand-red-700 font-bold text-[10px] rounded-xl flex items-start space-x-1.5 border border-brand-red-100 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-brand-red-500 shrink-0 mt-0.5" />
                  <span>{recError}</span>
                </div>
              )}

              {/* ONLY active members can message */}
              {isUserMemberOfActiveGroup() ? (
                <div className="space-y-2">
                  
                  {/* Dynamic interactive recording view panel */}
                  {isRecording ? (
                    <div className="bg-brand-red-50 border border-brand-red-100 p-3 rounded-2xl flex items-center justify-between animate-pulse">
                      <div className="flex items-center space-x-2 text-brand-red-750">
                        <span className="w-2.5 h-2.5 bg-brand-red-600 rounded-full animate-ping" />
                        <span className="text-[11px] font-black uppercase tracking-wider">A Gravar Mensagem...</span>
                        <span className="text-xs font-mono font-bold">[{formatSecs(recSeconds)} / 2:00]</span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={handleCancelRecording}
                          className="bg-white text-slate-500 hover:text-slate-800 border px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer min-h-[34px]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleStopRecording();
                          }}
                          className="bg-brand-red-650 text-white font-black px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer min-h-[34px]"
                        >
                          Finalizar
                        </button>
                      </div>
                    </div>
                  ) : audioBlob ? (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-brand-navy-900">
                        <Mic className="w-4 h-4 text-brand-red-600 animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Áudio Concluído!</span>
                        <span className="text-xs font-mono text-slate-500 font-bold">[{formatSecs(recSeconds)}]</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setAudioBlob(null)}
                          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md text-xs cursor-pointer"
                          title="Apagar gravação"
                        >
                          Apagar
                        </button>
                        <span className="text-[10px] text-slate-400 font-medium">Pronto para enviar</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Keyboard submission row */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    
                    {/* Recording activator trigger */}
                    {!audioBlob && !isRecording && (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="p-3 bg-brand-red-50 hover:bg-brand-red-100 text-brand-red-600 rounded-2xl transition-all cursor-pointer hover:scale-105 shrink-0 min-h-[46px] min-w-[46px] flex items-center justify-center border border-brand-red-150"
                        title="Gravar nota de voz de pronúncia (máx: 2 minutos)"
                      >
                        <Mic className="w-5 h-5 stroke-[2.2]" />
                      </button>
                    )}

                    {/* Chat field input box */}
                    <input 
                      type="text"
                      disabled={isSending || isUploading || isRecording}
                      placeholder={audioBlob ? "Adiciona uma legenda opcional para o teu áudio..." : "Escreve uma mensagem em inglês para o grupo..."}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      maxLength={1000}
                      className="flex-1 text-xs px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-navy-500 bg-slate-50 disabled:bg-slate-100 font-semibold"
                    />

                    {/* Sending Activator trigger */}
                    <button
                      type="submit"
                      disabled={isSending || isUploading || (isRecording && recSeconds === 0) || (!messageText.trim() && !audioBlob)}
                      className="p-3 bg-brand-navy-800 hover:bg-brand-navy-900 text-white rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 shrink-0 min-h-[46px] min-w-[46px] flex items-center justify-center border border-brand-navy-950 shadow-sm cursor-pointer"
                      title="Enviar mensagem"
                    >
                      {isSending || isUploading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Send className="w-4.5 h-4.5 stroke-[2.2] text-brand-gold-400" />
                      )}
                    </button>
                  </form>
                  
                  {/* File status hints */}
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1">
                    <span>Áudio: Máx 2 Minutos • Formato WebM/Ogg</span>
                    <span>Tamanho Máx: 10MB</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-xs font-extrabold text-slate-500 bg-slate-50/50 rounded-2xl p-4 border border-slate-200 border-dashed">
                  Deves aderir a este grupo para poderes interagir, mandar sms ou partilhar áudios. Tap no botão "Aderir ao Grupo" logo acima!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
