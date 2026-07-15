import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Flame, 
  Bell, 
  BellRing, 
  Check, 
  AlertCircle,
  Play,
  RotateCw
} from 'lucide-react';
import { 
  getWordOfTheDay, 
  areNotificationsSupported, 
  requestNotificationPermission,
  registerNotificationServiceWorker
} from '../utils/notifications';
import { FirebaseUserProfile } from '../firebase';

interface WordOfTheDayWidgetProps {
  userProfile: FirebaseUserProfile | null;
  onProfileUpdate: (updates: Partial<FirebaseUserProfile>) => void;
  streak: number;
}

export function WordOfTheDayWidget({ 
  userProfile, 
  onProfileUpdate, 
  streak 
}: WordOfTheDayWidgetProps) {
  const [word, setWord] = useState(() => getWordOfTheDay(userProfile?.level));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? (Notification?.permission || 'default') : 'default'
  );
  const [supportChecked, setSupportChecked] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermissionStatus(Notification?.permission || 'default');
      setSupportChecked(true);
    }
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    setWord(getWordOfTheDay(userProfile?.level));
  }, [userProfile?.level]);

  const playPronunciation = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setFeedback({
        message: 'A reprodução de voz não é suportada neste navegador.',
        type: 'error'
      });
      return;
    }

    setIsPlaying(true);
    // Cancel any ongoing speech synthesis first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word.en);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower for clear learning
    
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleOptIn = async () => {
    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);

    if (permission === 'granted') {
      onProfileUpdate({ notificationsEnabled: true });
      // Register service worker if not already
      await registerNotificationServiceWorker();
      setFeedback({
        message: 'Notificações ativadas com sucesso! 🎉',
        type: 'success'
      });
    } else {
      setFeedback({
        message: 'Por favor, autorize as notificações nas definições do seu navegador para receber alertas.',
        type: 'info'
      });
    }
  };

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked) {
      if (permissionStatus !== 'granted') {
        await handleOptIn();
      } else {
        onProfileUpdate({ notificationsEnabled: true });
        setFeedback({
          message: 'Lembretes de streak ativados! 🔥',
          type: 'success'
        });
      }
    } else {
      onProfileUpdate({ notificationsEnabled: false });
      setFeedback({
        message: 'Notificações desativadas.',
        type: 'info'
      });
    }
  };

  const sendTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      setFeedback({
        message: 'Precisa de conceder permissão de notificações primeiro!',
        type: 'error'
      });
      return;
    }

    setIsTesting(true);
    try {
      // Register SW just in case
      const reg = await registerNotificationServiceWorker();
      
      // Let's send a postMessage to our Active Service Worker first
      if (reg && reg.active) {
        reg.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: {
            title: `Palavra do Dia: "${word.en}" 🌟`,
            body: `Significa "${word.pt}" em Português. Pronúncia: ${word.pronunciation}. Mantenha o seu streak de ${streak} ${streak === 1 ? 'dia' : 'dias'} ativo! 🔥`,
            tag: 'word-of-the-day-test',
            icon: '/logo.jpg',
            badge: '/logo.jpg'
          }
        });
      } else if (reg && 'showNotification' in reg) {
        // Fallback directly to Service Worker registration notification
        await reg.showNotification(`Palavra do Dia: "${word.en}" 🌟`, {
          body: `Significa "${word.pt}" em Português. Pronúncia: ${word.pronunciation}. Mantenha o seu streak de ${streak} ${streak === 1 ? 'dia' : 'dias'} ativo! 🔥`,
          tag: 'word-of-the-day-test',
          icon: '/logo.jpg',
          badge: '/logo.jpg',
          requireInteraction: true
        });
      } else {
        // Ultimate client-side fallback
        new Notification(`Palavra do Dia: "${word.en}" 🌟`, {
          body: `Significa "${word.pt}" em Português. Pronúncia: ${word.pronunciation}. Mantenha o seu streak vivo! 🔥`,
          tag: 'word-of-the-day-test'
        });
      }
    } catch (error) {
      console.error('Failed to trigger test notification:', error);
    } finally {
      setTimeout(() => setIsTesting(false), 800);
    }
  };

  const isNotificationsEnabled = !!userProfile?.notificationsEnabled && permissionStatus === 'granted';

  if (!areNotificationsSupported()) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-5" id="word-of-the-day-widget">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-100 text-amber-700 p-1.5 rounded-xl">
            <Sparkles className="w-4 h-4 fill-amber-300 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-brand-navy-900 tracking-tight">
              Desafio Diário Sabush
            </h3>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              Palavra do Dia &amp; Reengajamento
            </p>
          </div>
        </div>
        
        {/* Streak Indicator */}
        <div className="flex items-center space-x-1 bg-amber-50 border border-amber-100 text-amber-800 px-3 py-1 rounded-2xl">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
          <span className="text-[11px] font-black">{streak} {streak === 1 ? 'Dia' : 'Dias'}</span>
        </div>
      </div>

      {/* Inline Feedback Banner */}
      {feedback && (
        <div className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-semibold border ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
            feedback.type === 'success' 
              ? 'text-emerald-600' 
              : feedback.type === 'error'
                ? 'text-rose-600'
                : 'text-blue-600'
          }`} />
          <div className="flex-1">
            {feedback.message}
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm font-bold line-height-none px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Grid Layout: Word of the Day & Notification Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Side: Word Card */}
        <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/60 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl" />
          
          <div className="space-y-1.5 z-10">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] bg-amber-100/70 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-md font-black uppercase tracking-wider inline-block">
                Palavra do Dia
              </span>
              {userProfile?.level && (
                <span className={`text-[9px] border px-2 py-0.5 rounded-md font-black uppercase tracking-wider inline-block ${
                  userProfile.level === 'beginner' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : userProfile.level === 'intermediate'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-purple-50 text-purple-700 border-purple-100'
                }`}>
                  {userProfile.level === 'beginner' ? 'Iniciante' : userProfile.level === 'intermediate' ? 'Intermédio' : 'Avançado'}
                </span>
              )}
            </div>
            <h4 className="text-2xl font-black text-brand-navy-950 tracking-tight leading-none pt-1">
              {word.en}
            </h4>
            <p className="text-xs font-mono text-slate-500 font-bold select-all">
              {word.pronunciation}
            </p>
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold">Significa:</span>
              <span className="text-xs text-slate-700 font-extrabold bg-white px-2 py-0.5 rounded-lg border border-slate-150">
                {word.pt}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <button
              onClick={playPronunciation}
              disabled={isPlaying}
              className={`w-full py-2 px-3 rounded-xl font-extrabold text-[10.5px] uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all border ${
                isPlaying
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <Volume2 className={`w-4 h-4 shrink-0 ${isPlaying ? 'animate-bounce' : ''}`} />
              <span>{isPlaying ? 'A Ouvir...' : 'Ouvir Pronúncia'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Notifications & Streak protection info */}
        <div className="flex flex-col justify-between space-y-4">
          
          {/* Status text */}
          <div className="space-y-2">
            <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
              Prevenção de Streak Ativo 🔥
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Não deixe o seu streak quebrar! Com as notificações ativas, o Sabush envia-lhe a <strong>Palavra do Dia</strong> de manhã e um lembrete personalizado ao fim do dia caso ainda não tenha praticado hoje.
            </p>
          </div>

          {/* Action Box */}
          <div className="bg-slate-50/50 rounded-2xl p-3.5 border border-slate-150 space-y-3">
            
            {/* Opt-in Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isNotificationsEnabled ? (
                  <BellRing className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Bell className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">
                    Lembretes no Navegador
                  </span>
                  <span className={`text-[9px] font-bold block ${isNotificationsEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isNotificationsEnabled ? 'Ativados via Service Worker' : 'Desativados (Sem opt-in)'}
                  </span>
                </div>
              </div>
              
              {/* iOS style toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isNotificationsEnabled} 
                  onChange={(e) => handleToggleNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Test notification CTA */}
            {isNotificationsEnabled ? (
              <button
                onClick={sendTestNotification}
                disabled={isTesting}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 font-black py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider border border-slate-250 shadow-3xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[34px] disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                    <span>A enviar teste...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    <span>Enviar Lembrete de Teste</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleOptIn}
                className="w-full bg-brand-navy-800 hover:bg-brand-navy-900 text-white font-black py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[34px] shadow-sm border border-brand-navy-950"
              >
                <Bell className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                <span>Ativar Notificações</span>
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
