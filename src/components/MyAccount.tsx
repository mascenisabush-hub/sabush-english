import React, { useState, useEffect } from 'react';
import { auth, db, saveUserProfile, FirebaseUserProfile, getUserLessonRecordings, saveLessonRecording } from '../firebase';
import { EnglishLevel, LessonRecording } from '../types';
import { LESSONS } from '../data';
import { Mascot } from './Mascot';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  Flame, 
  BookOpen, 
  LogOut, 
  Save, 
  Edit2, 
  CheckCircle2, 
  Globe2, 
  Compass, 
  Briefcase, 
  Plane, 
  GraduationCap, 
  MessageCircle,
  MessageSquare,
  Loader2,
  Mic,
  Play,
  Square,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Check,
  Bell,
  BellOff,
  Volume2
} from 'lucide-react';
import { blobToBase64 } from '../utils/audio';
import { areNotificationsSupported, requestNotificationPermission } from '../utils/notifications';
import { useCleanSpeech } from '../hooks/useCleanSpeech';

function maskWhatsAppNumber(num: string): string {
  if (!num) return '';
  const clean = num.replace(/\s+/g, '');
  if (clean.length < 8) return num;
  
  if (clean.startsWith('+258')) {
    const mainPart = clean.substring(4);
    if (mainPart.length === 9) {
      return `+258 ${mainPart[0]}X XXX XX${mainPart.substring(7)}`;
    }
  }
  
  // general fallback
  if (clean.length > 5) {
    const first = clean.substring(0, clean.length - 4);
    const last = clean.substring(clean.length - 2);
    return `${first.substring(0, 5)}...${last}`;
  }
  return clean;
}

interface MyAccountProps {
  onLogout: () => void;
  userProfile: FirebaseUserProfile | null;
  onProfileUpdate: (updated: FirebaseUserProfile) => void;
  onRegisterBack?: (handler: (() => boolean) | null) => void;
  certificate?: any;
  onViewCertificate?: () => void;
}

export function MyAccount({ 
  onLogout, 
  userProfile, 
  onProfileUpdate, 
  onRegisterBack,
  certificate,
  onViewCertificate
}: MyAccountProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EnglishLevel>('beginner');
  const [learningGoal, setLearningGoal] = useState('Conversation');
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Low-Data Mode State & Handler
  const [lowDataMode, setLowDataMode] = useState(() => {
    try {
      return localStorage.getItem('lowDataMode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleLowDataMode = (checked: boolean) => {
    try {
      localStorage.setItem('lowDataMode', checked ? 'true' : 'false');
      setLowDataMode(checked);
      window.dispatchEvent(new Event('lowDataModeChanged'));
    } catch (err) {
      console.warn("Failed to save low data mode:", err);
    }
  };

  // Voice Gender State & Handler for Text-To-Speech
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>(() => {
    try {
      const saved = localStorage.getItem('voiceGender');
      return saved === 'female' ? 'female' : 'male';
    } catch {
      return 'male';
    }
  });

  const { speak: speakPreview } = useCleanSpeech();

  const handleToggleVoiceGender = (gender: 'male' | 'female') => {
    try {
      localStorage.setItem('voiceGender', gender);
      setVoiceGender(gender);
      window.dispatchEvent(new Event('voiceGenderChanged'));
    } catch (err) {
      console.warn("Failed to save voice gender preference:", err);
    }
  };

  const handleTestVoice = () => {
    const sampleText = voiceGender === 'female'
      ? "Hello! This is your female tutor voice. Let's practice English together!"
      : "Hello! This is your male tutor voice. Let's practice English together!";
    speakPreview(sampleText);
  };

  // WhatsApp-specific states
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappNotificationsEnabled, setWhatsappNotificationsEnabled] = useState(false);
  const [isEditingWhatsapp, setIsEditingWhatsapp] = useState(false);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [whatsappSuccess, setWhatsappSuccess] = useState<boolean>(false);

  const handleToggleWhatsappNotifications = async (checked: boolean) => {
    if (!userProfile) return;
    try {
      setWhatsappError(null);
      setWhatsappSuccess(false);
      const updatedProfile: FirebaseUserProfile = {
        ...userProfile,
        whatsappNotificationsEnabled: checked,
        updatedAt: new Date()
      };
      await saveUserProfile(userProfile.userId, updatedProfile);
      onProfileUpdate(updatedProfile);
      setWhatsappNotificationsEnabled(checked);
      setWhatsappSuccess(true);
      setTimeout(() => setWhatsappSuccess(false), 3000);
    } catch (err) {
      console.error("Erro ao alternar notificações do WhatsApp:", err);
      setWhatsappError('Erro ao salvar preferência de WhatsApp.');
    }
  };

  const handleSaveWhatsappNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    
    let cleanPhone = whatsappNumber.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      setWhatsappError('O número de WhatsApp não pode estar vazio.');
      return;
    }
    
    if (cleanPhone.length === 9 && (cleanPhone.startsWith('82') || cleanPhone.startsWith('83') || cleanPhone.startsWith('84') || cleanPhone.startsWith('85') || cleanPhone.startsWith('86') || cleanPhone.startsWith('87'))) {
      cleanPhone = '+258' + cleanPhone;
    }
    
    if (!/^\+[1-9]\d{1,14}$/.test(cleanPhone)) {
      setWhatsappError('Formato inválido. Por favor, utilize o código do país (ex: +258 84 000 0000).');
      return;
    }

    setWhatsappSaving(true);
    setWhatsappError(null);
    setWhatsappSuccess(false);

    try {
      const updatedProfile: FirebaseUserProfile = {
        ...userProfile,
        whatsappNumber: cleanPhone,
        whatsappNotificationsEnabled: true,
        updatedAt: new Date()
      };
      await saveUserProfile(userProfile.userId, updatedProfile);
      onProfileUpdate(updatedProfile);
      setWhatsappNumber(cleanPhone);
      setWhatsappNotificationsEnabled(true);
      setIsEditingWhatsapp(false);
      setWhatsappSuccess(true);
      setTimeout(() => setWhatsappSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar número de WhatsApp:", err);
      setWhatsappError('Não foi possível conectar o WhatsApp. Tente novamente.');
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleDisconnectWhatsapp = async () => {
    if (!userProfile) return;
    if (!window.confirm('Tem a certeza que deseja desconectar o seu número de WhatsApp e desativar os alertas?')) {
      return;
    }
    
    setWhatsappSaving(true);
    setWhatsappError(null);
    setWhatsappSuccess(false);

    try {
      const updatedProfile: FirebaseUserProfile = {
        ...userProfile,
        whatsappNumber: undefined,
        whatsappNotificationsEnabled: false,
        updatedAt: new Date()
      };
      await saveUserProfile(userProfile.userId, updatedProfile);
      onProfileUpdate(updatedProfile);
      setWhatsappNumber('');
      setWhatsappNotificationsEnabled(false);
      setIsEditingWhatsapp(false);
      setWhatsappSuccess(true);
      setTimeout(() => setWhatsappSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao desconectar WhatsApp:", err);
      setWhatsappError('Não foi possível desconectar. Tente novamente.');
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleToggleNotifications = async (checked: boolean) => {
    if (!userProfile) return;
    try {
      setError(null);
      setSuccess(false);
      if (checked) {
        const permission = await requestNotificationPermission();
        if (permission === 'granted') {
          const updatedProfile: FirebaseUserProfile = {
            ...userProfile,
            notificationsEnabled: true,
            updatedAt: new Date()
          };
          await saveUserProfile(userProfile.userId, updatedProfile);
          onProfileUpdate(updatedProfile);
          setNotificationsEnabled(true);
          setSuccess(true);
        } else {
          setError('Para receber notificações, por favor conceda permissão de notificações no seu navegador.');
          setNotificationsEnabled(false);
        }
      } else {
        const updatedProfile: FirebaseUserProfile = {
          ...userProfile,
          notificationsEnabled: false,
          updatedAt: new Date()
        };
        await saveUserProfile(userProfile.userId, updatedProfile);
        onProfileUpdate(updatedProfile);
        setNotificationsEnabled(false);
      }
    } catch (err) {
      console.error("Erro ao alternar notificações:", err);
      setError('Ocorreu um erro ao alternar as notificações.');
    }
  };

  // Voice progress timeline states
  const [recordings, setRecordings] = useState<LessonRecording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  
  // Interactive "Compare & Practice" overlay modal states
  const [selectedRecordingToCompare, setSelectedRecordingToCompare] = useState<LessonRecording | null>(null);
  const [isModalRecording, setIsModalRecording] = useState(false);
  const [modalAudioUrl, setModalAudioUrl] = useState<string | null>(null);
  const [modalBlob, setModalBlob] = useState<Blob | null>(null);
  const [modalDuration, setModalDuration] = useState(0);
  const [modalMediaRecorder, setModalMediaRecorder] = useState<any>(null);
  const [isSavingNewAttempt, setIsSavingNewAttempt] = useState(false);
  const [saveNewSuccess, setSaveNewSuccess] = useState(false);
  const [modalMicError, setModalMicError] = useState<string | null>(null);
  const [modalEvaluationFeedback, setModalEvaluationFeedback] = useState<{
    transcript?: string;
    feedbackPt?: string;
    matchLevel?: 'excelente' | 'bom' | 'pratique_mais';
  } | null>(null);
  const [isModalEvaluating, setIsModalEvaluating] = useState<boolean>(false);

  const fetchRecordings = () => {
    if (userProfile?.userId) {
      setIsLoadingRecordings(true);
      getUserLessonRecordings(userProfile.userId)
        .then((data) => {
          setRecordings(data);
        })
        .catch((err) => {
          console.error("Erro ao carregar gravações:", err);
        })
        .finally(() => {
          setIsLoadingRecordings(false);
        });
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [userProfile?.userId]);

  // Duration timer for comparative modal recording
  useEffect(() => {
    let interval: any = null;
    if (isModalRecording) {
      interval = setInterval(() => {
        setModalDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setModalDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isModalRecording]);

  const completedLessonsList = LESSONS.filter(lesson => 
    userProfile?.completedLessons && userProfile.completedLessons.includes(lesson.id)
  );

  // Register back-button handler for editing mode
  useEffect(() => {
    if (isEditing && onRegisterBack) {
      onRegisterBack(() => {
        setIsEditing(false);
        return true;
      });
    } else {
      if (onRegisterBack) onRegisterBack(null);
    }
    return () => {
      if (onRegisterBack) onRegisterBack(null);
    };
  }, [isEditing, onRegisterBack]);

  // Sync state with userProfile props when it changes or loads
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setLevel(userProfile.level || 'beginner');
      setLearningGoal(userProfile.learningGoal || 'Conversation');
      setNotificationsEnabled(!!userProfile.notificationsEnabled);
      setWhatsappNumber(userProfile.whatsappNumber || '');
      setWhatsappNotificationsEnabled(!!userProfile.whatsappNotificationsEnabled);
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm max-w-md mx-auto">
        <Mascot expression="thinking" size="md" />
        <p className="text-sm text-slate-500 font-bold">Não foi possível carregar as informações do utilizador.</p>
        <button
          onClick={onLogout}
          className="bg-brand-red-650 hover:bg-brand-red-700 text-white text-xs font-bold py-2.5 px-5 rounded-2xl cursor-pointer"
        >
          Tentar Terminar Sessão
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome não pode estar em branco.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedProfile: FirebaseUserProfile = {
        ...userProfile,
        name: name.trim(),
        level,
        learningGoal,
        updatedAt: new Date()
      };

      await saveUserProfile(userProfile.userId, updatedProfile);
      localStorage.setItem('sabush_goal', learningGoal);
      onProfileUpdate(updatedProfile);
      
      setSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError('Lamentamos, ocorreu um erro ao salvar o seu perfil. Tente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    onLogout();
  };

  // Comparative modal voice-rec handlers
  const handleStartModalRecording = async () => {
    setModalMicError(null);
    setModalAudioUrl(null);
    setModalBlob(null);
    setSaveNewSuccess(false);
    
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
        setModalAudioUrl(audioUrl);
        setModalBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track: any) => track.stop());
      };
      
      setModalMediaRecorder(recorder);
      recorder.start();
      setIsModalRecording(true);
    } catch (err: any) {
      console.warn('Modal Microphone error:', err);
      // Fallback for simulation if microphone is blocked or missing
      setModalMicError(err.message || 'Erro ao aceder ao microfone. Verifique as permissões.');
      setIsModalRecording(true);
    }
  };

  const handleStopModalRecording = () => {
    if (modalMediaRecorder && modalMediaRecorder.state !== 'inactive') {
      try {
        modalMediaRecorder.stop();
      } catch (err) {
        console.warn(err);
        setModalAudioUrl('simulated-recording');
      }
    } else {
      setModalAudioUrl('simulated-recording');
    }
    setIsModalRecording(false);
  };

  const handleSaveModalAttempt = async () => {
    if (!selectedRecordingToCompare || !userProfile) return;
    
    setIsSavingNewAttempt(true);
    setIsModalEvaluating(true);
    setModalEvaluationFeedback(null);

    try {
      const payloadFile = modalBlob || 'simulated-recording';
      
      let feedbackData = null;
      try {
        let audioBase64 = '';
        if (modalBlob) {
          audioBase64 = await blobToBase64(modalBlob);
        }

        const evalResponse = await fetch('/api/evaluate-recording', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioBase64: audioBase64 || undefined,
            mimeType: modalBlob?.type || 'audio/webm',
            speakingPrompt: selectedRecordingToCompare.speakingPrompt,
          }),
        });

        if (evalResponse.ok) {
          feedbackData = await evalResponse.json();
          setModalEvaluationFeedback(feedbackData);
        }
      } catch (evalErr) {
        console.error("Erro na avaliação do Gemini no modal:", evalErr);
        // Fail-safe / non-blocking
      } finally {
        setIsModalEvaluating(false);
      }

      await saveLessonRecording(
        userProfile.userId,
        selectedRecordingToCompare.lessonId,
        selectedRecordingToCompare.lessonTitle,
        selectedRecordingToCompare.speakingPrompt,
        payloadFile,
        modalDuration || 3,
        feedbackData?.transcript,
        feedbackData?.feedbackPt,
        feedbackData?.matchLevel
      );
      setSaveNewSuccess(true);
      fetchRecordings(); // refresh the main timeline so this new recording appears on top immediately!
    } catch (err) {
      console.error("Erro ao salvar nova tentativa no modal:", err);
    } finally {
      setIsSavingNewAttempt(false);
      setIsModalEvaluating(false);
    }
  };

  const goalsList = [
    { id: 'work', label: 'Trabalho / Negócios', icon: Briefcase },
    { id: 'travel', label: 'Viagens / Turismo', icon: Plane },
    { id: 'studies', label: 'Estudos / Académico', icon: GraduationCap },
    { id: 'conversation', label: 'Conversação Geral', icon: MessageCircle },
  ];

  const getGoalIcon = (goalId: string) => {
    const found = goalsList.find(g => g.id === goalId.toLowerCase() || g.label === goalId);
    return found ? found.icon : MessageCircle;
  };

  const getGoalLabel = (goalId: string) => {
    if (!goalId) return '';
    const found = goalsList.find(g => g.id === goalId.toLowerCase() || g.label.toLowerCase() === goalId.toLowerCase() || goalId.toLowerCase().includes(g.id));
    return found ? found.label : goalId;
  };

  const getLevelLabel = (lvl: EnglishLevel) => {
    switch (lvl) {
      case 'beginner': return 'Iniciante (Beginner)';
      case 'intermediate': return 'Intermediário (Intermediate)';
      case 'advanced': return 'Avançado (Advanced)';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Account Info Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        {/* Top Flag Banner Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 via-brand-gold-400 to-red-600" />
        
        {error && !isEditing && (
          <div className="mb-4 mt-2 p-3 bg-brand-red-50 border border-brand-red-200 text-xs font-bold text-brand-red-800 rounded-xl leading-snug">
            ⚠️ {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center sm:space-x-5 space-y-4 sm:space-y-0 pb-5 border-b border-slate-150">
          <Mascot expression="happy" size="md" />
          <div className="text-center sm:text-left flex-1 space-y-1">
            <h1 className="text-xl font-black text-brand-navy-900 leading-tight">
              {userProfile.name}
            </h1>
            <p className="text-xs text-slate-500 font-bold flex items-center justify-center sm:justify-start space-x-1.5">
              {userProfile.email ? (
                <>
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{userProfile.email}</span>
                </>
              ) : (
                <>
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+258 {userProfile.phoneNumber}</span>
                </>
              )}
            </p>
            <div className="pt-1.5 flex flex-wrap justify-center sm:justify-start gap-1.5">
              <span className="text-[9px] font-black uppercase bg-brand-gold-100 text-brand-gold-800 border border-brand-gold-300/40 px-2.5 py-1 rounded-full">
                {getLevelLabel(userProfile.level)}
              </span>
              <span className="text-[9px] font-black uppercase bg-brand-navy-50 text-brand-navy-800 border border-brand-navy-100 px-2.5 py-1 rounded-full">
                Objetivo: {getGoalLabel(userProfile.learningGoal)}
              </span>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-brand-navy-850 font-extrabold text-xs rounded-xl cursor-pointer transition-colors border border-slate-200 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Perfil</span>
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="py-5 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-navy-700">Modificar Dados Pessoais</h3>
            
            {error && (
              <div className="p-3 bg-brand-red-50 border border-brand-red-200 text-xs font-bold text-brand-red-800 rounded-xl leading-snug">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Nome do Aluno</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-brand-gold-500 outline-none"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Nível de Inglês</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as EnglishLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-brand-gold-500"
                >
                  <option value="beginner">Iniciante (Beginner)</option>
                  <option value="intermediate">Intermediário (Intermediate)</option>
                  <option value="advanced">Avançado (Advanced)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Objetivo Principal de Aprendizagem</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {goalsList.map((g) => {
                  const GoalIcon = g.icon;
                  const isSelected = learningGoal.toLowerCase().includes(g.id) || learningGoal.toLowerCase() === g.label.toLowerCase();
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setLearningGoal(g.id)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1.5 cursor-pointer ${
                        isSelected
                          ? 'border-brand-gold-500 bg-brand-gold-50/50 text-brand-gold-900 font-extrabold'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <GoalIcon className={`w-4 h-4 ${isSelected ? 'text-brand-gold-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] block font-bold leading-tight truncate w-full">{g.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-1.5 px-5 py-3 bg-brand-red-600 hover:bg-brand-red-700 text-white font-black text-xs rounded-2xl cursor-pointer shadow-md transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Salvar Alterações</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(userProfile.name || '');
                  setLevel(userProfile.level || 'beginner');
                  setLearningGoal(userProfile.learningGoal || 'Conversation');
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl cursor-pointer border border-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="py-5 space-y-5">
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 rounded-xl flex items-center space-x-1.5 leading-none animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Perfil atualizado com sucesso!</span>
              </div>
            )}

            {/* Micro Stats row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Ofensiva</span>
                <div className="flex items-center justify-center space-x-1 font-black text-brand-gold-700 text-sm">
                  <Flame className="w-4 h-4 fill-brand-red-500 stroke-brand-red-600 animate-pulse" />
                  <span>{userProfile.streak} Dias</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Pontuação</span>
                <div className="flex items-center justify-center space-x-1 font-black text-brand-red-700 text-sm">
                  <Award className="w-4 h-4 text-brand-gold-550" />
                  <span>{userProfile.xp} XP</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Aulas feitas</span>
                <div className="flex items-center justify-center space-x-1 font-black text-brand-navy-800 text-sm">
                  <BookOpen className="w-4 h-4 text-brand-navy-650" />
                  <span>{userProfile.completedLessons?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Notification Toggle (Conditional upon browser support) */}
            {areNotificationsSupported() && (
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3 text-left">
                  <div className={`p-2 rounded-xl border shrink-0 ${notificationsEnabled ? 'bg-brand-navy-50 border-brand-navy-150 text-brand-navy-600' : 'bg-slate-100 border-slate-200 text-slate-450'}`}>
                    {notificationsEnabled ? <Bell className="w-4.5 h-4.5" /> : <BellOff className="w-4.5 h-4.5" />}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 leading-none">Notificações Diárias</h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                      Receba lembretes de streak ao fim do dia e a divertida "Palavra do Dia" para manter o seu inglês afiado! 🇲🇿
                    </p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => handleToggleNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-navy-600"></div>
                </label>
              </div>
            )}

            {/* Low-Data Mode Toggle ("Modo Poupança de Dados") */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start space-x-3 text-left">
                <div className={`p-2 rounded-xl border shrink-0 ${lowDataMode ? 'bg-amber-50 border-amber-150 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-450'}`}>
                  <Globe2 className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 leading-none">Modo Poupança de Dados</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    Reduz o consumo de dados móveis ocultando imagens pesadas por padrão e usando recursos locais leves. 🇲🇿
                  </p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={lowDataMode}
                  onChange={(e) => handleToggleLowDataMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Voice Gender Toggle ("Voz do Tutor") */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3 text-left">
                <div className="p-2 rounded-xl border shrink-0 bg-brand-navy-50 border-brand-navy-150 text-brand-navy-600">
                  <Volume2 className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 leading-none">Voz do Tutor</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    Escolha o género da voz do seu tutor de inglês para as leituras das lições e vocabulário.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:self-center">
                <div className="inline-flex rounded-xl p-0.5 bg-slate-150 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleToggleVoiceGender('male')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                      voiceGender === 'male'
                        ? 'bg-brand-navy-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Masculina
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleVoiceGender('female')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                      voiceGender === 'female'
                        ? 'bg-brand-navy-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Feminina
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="bg-slate-200 hover:bg-slate-300 border border-slate-300/50 text-slate-700 p-2 rounded-xl transition-all select-none cursor-pointer flex items-center justify-center shrink-0"
                  title="Testar som da voz"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* WhatsApp Integration Preferences (Highly reliable for Mozambique) */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-4">
              {whatsappError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-800 rounded-xl leading-normal">
                  ⚠️ {whatsappError}
                </div>
              )}
              {whatsappSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 rounded-xl flex items-center space-x-1.5 leading-none">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Definições de WhatsApp atualizadas!</span>
                </div>
              )}

              <div className="flex items-start space-x-3 text-left">
                <div className={`p-2 rounded-xl border shrink-0 ${userProfile.whatsappNumber ? 'bg-emerald-50 border-emerald-150 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-450'}`}>
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 leading-none">Lembretes por WhatsApp</h4>
                    {userProfile.whatsappNumber && !isEditingWhatsapp && (
                      <span className="text-[9px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md leading-none">
                        CONECTADO
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    Receba lembretes diários e a "Palavra do Dia" diretamente no seu WhatsApp! É muito mais fiável que as notificações do navegador. 🇲🇿🔥
                  </p>
                </div>
              </div>

              {/* Connected State Overview */}
              {userProfile.whatsappNumber && !isEditingWhatsapp ? (
                <div className="bg-white border border-slate-150 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">NÚMERO VINCULADO</span>
                    <span className="text-xs font-black text-slate-700 block font-mono">
                      {maskWhatsAppNumber(userProfile.whatsappNumber)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappNumber(userProfile.whatsappNumber || '');
                        setIsEditingWhatsapp(true);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200 cursor-pointer transition-all"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnectWhatsapp}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold border border-rose-150 cursor-pointer transition-all"
                    >
                      Desconectar
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Active Toggle when connected */}
              {userProfile.whatsappNumber && !isEditingWhatsapp && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                  <span className="text-[10px] font-bold text-slate-600">
                    Ativar notificações no WhatsApp
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={whatsappNotificationsEnabled}
                      onChange={(e) => handleToggleWhatsappNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              )}

              {/* Form / Edit Input state */}
              {(!userProfile.whatsappNumber || isEditingWhatsapp) && (
                <form onSubmit={handleSaveWhatsappNumber} className="bg-white border border-slate-150 rounded-xl p-3 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Número do WhatsApp</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ex: +258 84 123 4567"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed text-left">
                      Se introduzir apenas os 9 dígitos (ex: 841234567), iremos assumir o prefixo de Moçambique (+258).
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="submit"
                      disabled={whatsappSaving}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {whatsappSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                      <span>Conectar & Ativar Alertas</span>
                    </button>
                    {userProfile.whatsappNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingWhatsapp(false);
                          setWhatsappNumber(userProfile.whatsappNumber || '');
                        }}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 cursor-pointer transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Certificate Section if earned! */}
            {certificate && onViewCertificate && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-4.5 border border-amber-450 text-white space-y-3 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5.5 h-5.5 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-50 leading-tight">Sabush Diploma de Inglês</h4>
                    <span className="text-sm font-black block text-white leading-tight">Certificado de Conclusão Emitido! 🏆</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-50 leading-relaxed font-semibold">
                  Sendo detentor do código de veracidade <strong>{certificate.uniqueCode}</strong>, completou o currículo completo do club de inglês oficial.
                </p>
                <button
                  type="button"
                  onClick={onViewCertificate}
                  className="w-full bg-white text-amber-900 border border-transparent hover:bg-amber-50 font-black text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all text-center flex items-center justify-center space-x-1 min-h-[40px]"
                >
                  <span>Ver Meu Diploma Autêntico</span>
                </button>
              </div>
            )}

            {/* List of Completed Lessons */}
            <div className="bg-slate-50 border border-slate-150 rounded-3xl p-4.5 space-y-3">
              <h4 className="text-xs font-black text-brand-navy-900 uppercase tracking-wider flex items-center justify-between">
                <span>📚 Lições Concluídas ({completedLessonsList.length})</span>
              </h4>
              
              {completedLessonsList.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {completedLessonsList.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className="bg-white border border-slate-150 p-3 rounded-2xl flex items-center justify-between shadow-xs"
                    >
                      <div className="text-left space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-brand-gold-600">
                          {lesson.level === 'beginner' 
                            ? 'Iniciante' 
                             : lesson.level === 'intermediate' 
                            ? 'Intermédio' 
                            : 'Avançado'}
                        </span>
                        <div className="text-xs font-black text-slate-800 leading-tight">
                          {lesson.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold leading-normal">
                          {lesson.titlePt}
                        </div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-1.5 rounded-lg shrink-0">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 font-bold py-2 text-center">
                  Ainda não completou nenhuma lição. Vá à aba Aulas para começar a aprender! 🚀
                </p>
              )}
            </div>

            {/* O Meu Progresso (Cronologia de Pronúncia) */}
            <div className="bg-slate-50 border border-slate-150 rounded-3xl p-4.5 space-y-3.5 text-left">
              <h4 className="text-xs font-black text-brand-navy-900 uppercase tracking-wider flex items-center justify-between">
                <span>🎤 O Meu Progresso de Pronúncia</span>
                <span className="text-[9px] font-black uppercase bg-brand-navy-100 text-brand-navy-700 px-2 py-0.5 rounded-md">Atividade Recente</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Compare as suas gravações de voz anteriores dos desafios de "Prática Real" e teste-se para ver a sua evolução na dicção, ritmo e fluência em inglês!
              </p>

              {isLoadingRecordings ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <Loader2 className="w-6 h-6 text-brand-red-600 animate-spin" />
                  <p className="text-[10px] text-slate-500 font-bold">A carregar registos de voz...</p>
                </div>
              ) : recordings.length > 0 ? (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {recordings.map((recording) => {
                    const formattedDate = recording.createdAt?.toDate 
                      ? recording.createdAt.toDate().toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) 
                      : recording.createdAt instanceof Date 
                      ? recording.createdAt.toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                      : 'Recentemente';

                    return (
                      <div 
                        key={recording.recordingId} 
                        className="bg-white border border-slate-150 p-3.5 rounded-2xl space-y-2.5 shadow-xs text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5 max-w-[70%]">
                            <span className="text-[9px] font-black uppercase text-brand-red-600">{recording.lessonTitle}</span>
                            <p className="text-xs font-extrabold text-slate-800 leading-snug">"{recording.speakingPrompt}"</p>
                          </div>
                          <span className="text-[9px] text-slate-450 font-extrabold flex items-center space-x-1 uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100 shrink-0">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formattedDate}</span>
                          </span>
                        </div>

                        {recording.transcript && (
                          <div className="bg-slate-50 border border-slate-250/60 rounded-xl p-2.5 text-xs space-y-1.5 leading-relaxed text-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-450">Avaliação do Mocho:</span>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                recording.matchLevel === 'excelente'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : recording.matchLevel === 'bom'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-brand-red-100 text-brand-red-850'
                              }`}>
                                {recording.matchLevel === 'excelente' ? 'Excelente' : recording.matchLevel === 'bom' ? 'Bom' : 'Pratique Mais'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono italic">"{recording.transcript}"</p>
                            <p className="text-[10.5px] font-medium leading-snug">{recording.feedbackPt}</p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-slate-100/60">
                          {recording.audioUrl && (
                            <audio src={recording.audioUrl} controls className="w-full h-8 outline-none shrink-0" />
                          )}
                          <button
                            onClick={() => {
                              setSelectedRecordingToCompare(recording);
                              setModalAudioUrl(null);
                              setModalBlob(null);
                              setSaveNewSuccess(false);
                            }}
                            className="bg-brand-navy-900 hover:bg-brand-navy-955 text-[#ffffff] hover:text-white font-black text-[10px] uppercase py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0 cursor-pointer border border-transparent min-h-[32px] sm:ml-auto"
                          >
                            <Mic className="w-3.5 h-3.5 text-brand-gold-400 fill-brand-gold-400" />
                            <span>Treinar de Novo</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-dashed border-slate-250 bg-white/50 rounded-2xl p-6 text-center space-y-2">
                  <Mascot expression="thinking" size="sm" />
                  <p className="text-xs font-black text-slate-800">Sem gravações sincronizadas!</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    Vá para a aba de Aulas (ex. <strong className="text-brand-red-600">Língua Geral</strong>), conclua o desafio em "Prática Real" de qualquer lição e clique em "Salvar no Meu Progresso"! Seus registos de voz irão acumular-se aqui.
                  </p>
                </div>
              )}
            </div>

            {/* Informational Section */}
            <div className="bg-brand-navy-50/50 border border-brand-navy-100 rounded-3xl p-4 space-y-2">
              <h4 className="text-xs font-black text-brand-navy-800 uppercase tracking-wide">💡 Dica de Estudo Sabush</h4>
              <p className="text-xs text-brand-navy-700 leading-relaxed">
                Manter a sua ofensiva diária ajuda a fixar as palavras no cérebro. Tente realizar pelo menos um quiz com o mocho no chat 
                do AI Tutor ou rever uma lição diariamente para acumular mais XP e manter o seu lugar na tabela!
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-150 flex justify-between items-center">
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
            ID de Membro: <span className="font-mono text-slate-500 text-[8px] uppercase">{userProfile.userId.slice(0, 10)}...</span>
          </p>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center space-x-1 px-4 py-2 bg-brand-red-55 text-brand-red-700 hover:bg-brand-red-100 font-extrabold text-xs rounded-xl cursor-pointer transition-colors border border-brand-red-200/50 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* Comparative / Re-training Overlay Modal */}
      {selectedRecordingToCompare && (
        <div className="fixed inset-0 bg-[#02050e]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-slate-200/50 flex flex-col w-full max-w-md mx-auto space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-[#ffffff] uppercase tracking-widest bg-brand-red-650 tracking-wider bg-brand-red-600 px-3 py-1.5 rounded-full select-none flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold-400 fill-brand-gold-400" />
                  <span>Comparador de Pronúncia</span>
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedRecordingToCompare(null);
                  setModalAudioUrl(null);
                  setModalBlob(null);
                  setSaveNewSuccess(false);
                  setModalEvaluationFeedback(null);
                }}
                className="text-slate-405 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer min-h-[32px]"
              >
                Fechar ✕
              </button>
            </div>

            <div className="text-left space-y-1">
              <span className="text-[9px] font-black uppercase text-brand-red-600">{selectedRecordingToCompare.lessonTitle}</span>
              <p className="text-xs font-black text-slate-850 leading-relaxed">Desafio Proposto:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs italic text-slate-700 font-extrabold leading-relaxed">
                "{selectedRecordingToCompare.speakingPrompt}"
              </div>
            </div>

            {/* Side-by-Side Comparison Panels */}
            <div className="space-y-3.5 text-left">
              {/* OLD / PREVIOUS RECORDING */}
              <div className="bg-slate-100/80 border border-slate-200/70 p-3 rounded-2xl space-y-1.5">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                  <span>1. A Sua Gravação Anterior</span>
                </p>
                <audio src={selectedRecordingToCompare.audioUrl} controls className="w-full h-8 outline-none" />
              </div>

              {/* NEW ATTEMPT RECORDER */}
              <div className="bg-emerald-50/20 border border-emerald-150 p-3.5 rounded-2xl space-y-3">
                <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  <span>2. Fazer Nova Tentativa de Voz</span>
                </p>

                {!isModalRecording && !modalAudioUrl ? (
                  <button
                    onClick={handleStartModalRecording}
                    className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-[#ffffff] font-extrabold py-3 px-4 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm min-h-[44px]"
                  >
                    <Mic className="w-4 h-4 text-brand-gold-400 stroke-[2.2]" />
                    <span>Gravar Nova Pronúncia</span>
                  </button>
                ) : isModalRecording ? (
                  <div className="space-y-2 flex flex-col items-center bg-red-50/40 p-3 rounded-xl border border-red-150">
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                      </span>
                      <span className="text-[10px] font-black text-red-700 uppercase animate-pulse">A gravar...</span>
                      <span className="text-[10px] font-mono text-slate-800 font-extrabold bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {modalDuration}s
                      </span>
                    </div>
                    <button
                      onClick={handleStopModalRecording}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-[#ffffff] text-[10px] font-black rounded-lg flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider shadow-sm min-h-[36px]"
                    >
                      <Square className="w-3 h-3 text-white fill-white" />
                      <span>Parar Gravador</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {modalAudioUrl && modalAudioUrl !== 'simulated-recording' ? (
                      <audio src={modalAudioUrl} controls className="w-full h-8 outline-none" />
                    ) : (
                      <div className="bg-white border border-slate-200 p-3 text-center rounded-xl shadow-inner">
                        <p className="text-[10.5px] font-black text-slate-800">🔊 Nova Gravação de Teste Gerada!</p>
                        <p className="text-[10px] text-slate-500 font-medium">Bypass de permissões do navegador em iFrame ativo.</p>
                      </div>
                    )}

                    {!saveNewSuccess ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveModalAttempt}
                          disabled={isSavingNewAttempt || isModalEvaluating}
                          className="flex-1 bg-slate-900 hover:bg-slate-950 text-[#ffffff] font-black py-2.5 px-3 rounded-xl text-[10.5px] uppercase transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm min-h-[38px]"
                        >
                          <Check className="w-3.5 h-3.5 text-brand-gold-400 stroke-[3]" />
                          <span>{isSavingNewAttempt ? 'A gravar...' : 'Sincronizar Nova Tentativa'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setModalAudioUrl(null);
                            setModalBlob(null);
                            setSaveNewSuccess(false);
                            setModalEvaluationFeedback(null);
                          }}
                          className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-3.5 rounded-xl text-[10.5px] transition-all cursor-pointer min-h-[38px] border border-slate-200"
                        >
                          Refazer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-[11px] font-extrabold flex items-center space-x-2 animate-fadeIn">
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                          <span>Nova tentativa adicionada à sua cronologia com sucesso! 🙌</span>
                        </div>
                      </div>
                    )}

                    {/* Evaluating Loader */}
                    {isModalEvaluating && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 text-center animate-pulse w-full">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center justify-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 text-brand-navy-600 animate-spin" />
                            <span>A Avaliar Pronúncia...</span>
                          </p>
                          <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                            O Mocho AI está a analisar o sotaque e a fluência da sua voz com o inglês nativo...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Comparative AI Feedback Card */}
                    {!isModalEvaluating && modalEvaluationFeedback && (
                      <div className={`p-4 rounded-2xl border space-y-3 text-left transition-all duration-300 w-full ${
                        modalEvaluationFeedback.matchLevel === 'excelente' 
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-950' 
                          : modalEvaluationFeedback.matchLevel === 'bom'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-brand-red-50/50 border-brand-red-200 text-brand-navy-950'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-xl border shrink-0 ${
                            modalEvaluationFeedback.matchLevel === 'excelente'
                              ? 'bg-emerald-100 border-emerald-200'
                              : modalEvaluationFeedback.matchLevel === 'bom'
                              ? 'bg-amber-100 border-amber-200'
                              : 'bg-brand-red-100 border-brand-red-200'
                          }`}>
                            <Mascot 
                              expression={
                                modalEvaluationFeedback.matchLevel === 'excelente' 
                                  ? 'happy' 
                                  : modalEvaluationFeedback.matchLevel === 'bom' 
                                  ? 'talking' 
                                  : 'thinking'
                              } 
                              size="sm" 
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className={`font-black text-[9px] uppercase tracking-widest block ${
                              modalEvaluationFeedback.matchLevel === 'excelente'
                                ? 'text-emerald-800'
                                : modalEvaluationFeedback.matchLevel === 'bom'
                                ? 'text-amber-800'
                                : 'text-brand-red-800'
                            }`}>
                              {modalEvaluationFeedback.matchLevel === 'excelente' 
                                ? '🌟 Pronúncia Excelente!' 
                                : modalEvaluationFeedback.matchLevel === 'bom'
                                ? '👍 Bom Trabalho!'
                                : '💪 Vamos Praticar Mais!'}
                            </span>
                            <span className="text-[10.5px] font-semibold block leading-tight text-slate-700">
                              {modalEvaluationFeedback.feedbackPt}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1.5 border-t border-dashed border-slate-200">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">O que você disse (Transcrição):</span>
                          <div className="bg-white/85 border border-slate-150 rounded-xl px-2.5 py-1.5">
                            <p className="text-[10.5px] font-mono font-bold italic text-slate-800">
                              "{modalEvaluationFeedback.transcript || 'Sem áudio detectado'}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center italic font-semibold pt-1">
              "Treine diariamente para ajustar as cordas vocais aos sons do inglês!"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
