import { LESSONS } from '../data';
import { FirebaseUserProfile } from '../firebase';
import { EnglishLevel } from '../types';

export interface VocabWord {
  en: string;
  pt: string;
  pronunciation: string;
}

/**
 * Checks if the browser supports notifications and is not restricted.
 */
export function areNotificationsSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Registers the Service Worker for notifications.
 */
export async function registerNotificationServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!areNotificationsSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (error) {
    console.warn('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Requests browser notification permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!areNotificationsSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerNotificationServiceWorker();
    }
    return permission;
  } catch (error) {
    console.warn('Failed to request notification permission:', error);
    return 'denied';
  }
}

/**
 * Filters and compiles a clean, deduplicated list of vocabulary words for a specific English level.
 */
export function filterVocabularyByLevel(level: EnglishLevel): VocabWord[] {
  const levelVocabMap = new Map<string, VocabWord>();

  LESSONS.forEach(lesson => {
    if (lesson.level === level) {
      if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
        lesson.vocabulary.forEach(v => {
          if (v.en && v.pt) {
            const normalizedKey = v.en.trim().toLowerCase();
            if (!levelVocabMap.has(normalizedKey)) {
              levelVocabMap.set(normalizedKey, {
                en: v.en.trim(),
                pt: v.pt.trim(),
                pronunciation: (v.pronunciation || '').trim()
              });
            }
          }
        });
      }
    }
  });

  return Array.from(levelVocabMap.values());
}

/**
 * Dynamically picks a word of the day from the level-specific filtered vocabulary list.
 * Utilizes a rolling daily date hash to ensure the selection is dynamic (updates every day)
 * but remains consistent if evaluated multiple times on the same calendar day.
 */
export function getDynamicWordForLevel(level: EnglishLevel): VocabWord {
  const filteredVocab = filterVocabularyByLevel(level);

  if (filteredVocab.length === 0) {
    // Elegant fallback if no words are found for this specific level
    return {
      en: "Consistence",
      pt: "Consistência",
      pronunciation: "/kənˈsɪstəns/"
    };
  }

  const today = new Date();
  // Rolling daily date hash (YYYYMMDD) to dynamically shift word selection each day
  const dateHash = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = Math.abs(dateHash) % filteredVocab.length;
  return filteredVocab[index];
}

/**
 * Pick a word of the day based on the current date, ensuring consistency for all users on a given day at that level.
 * Falls back to other levels if no vocabulary is available for the given level.
 */
export function getWordOfTheDay(level?: EnglishLevel): VocabWord {
  return getDynamicWordForLevel(level || 'beginner');
}

/**
 * Sends a browser notification safely using the Service Worker if active, or falling back to the standard Notification constructor.
 */
export async function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if (!areNotificationsSupported()) return;
  if (Notification.permission !== 'granted') return;

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, {
        icon: '/logo.jpg', // Fallback or placeholder
        badge: '/logo.jpg',
        ...options
      });
    } else {
      new Notification(title, options);
    }
  } catch (error) {
    console.warn('Failed to display browser notification:', error);
    // Silent fail-safe to guarantee perfect app stability
  }
}

// Session-level memory lock to track the last notified date during the active tab lifecycle
let sessionLastNotifiedDate: string | null = null;
// Active evaluation lock to prevent any race conditions or duplicate checks
let isEvaluatingNudge = false;

/**
 * Analyzes the user's progress and active streak and triggers/schedules local notifications if eligible.
 * Keeps track of whether they've been notified today using lastNotifiedDate.
 */
export async function checkAndTriggerNudges(
  profile: FirebaseUserProfile | null,
  onProfileUpdate: (updates: Partial<FirebaseUserProfile>) => void
) {
  if (!profile || !profile.notificationsEnabled) return;
  if (!areNotificationsSupported() || Notification.permission !== 'granted') return;

  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Skip if we already sent a notification today (verifying backend profile, local storage, and session memory lock)
  let localLastNotified: string | null = null;
  try {
    localLastNotified = localStorage.getItem('sabush_last_notified_date');
  } catch (e) {
    console.debug('localStorage not available', e);
  }

  if (
    profile.lastNotifiedDate === todayStr || 
    localLastNotified === todayStr ||
    sessionLastNotifiedDate === todayStr
  ) {
    // Rigidly block scheduling or triggering duplicate alerts today
    return;
  }

  // Prevent parallel evaluation race conditions
  if (isEvaluatingNudge) {
    return;
  }
  isEvaluatingNudge = true;

  try {
    const currentHour = new Date().getHours();
    const isEvening = currentHour >= 18; // 6:00 PM local evening time

    // 1. Streak Reminder Nudge (Streak > 0, not active today, and it's evening)
    const isNotActiveToday = profile.lastActiveDate !== todayStr;
    
    if (profile.streak > 0 && isNotActiveToday && isEvening) {
      let title = 'Mantenha o seu streak vivo! 🔥';
      let body = `Olá, ${profile.name || 'Estudante'}! O seu streak de ${profile.streak} ${profile.streak === 1 ? 'dia' : 'dias'} no Sabush está em risco. Dedique 5 minutinhos hoje para continuar a aprender! 🦉🇲🇿`;

      const userLevel = (profile.level || 'beginner').toLowerCase();
      const streakDaysWord = profile.streak === 1 ? 'dia' : 'dias';

      if (userLevel === 'beginner') {
        title = 'Não perca o seu streak! 🚀 Sabush Starter';
        body = `Olá, ${profile.name || 'Estudante'}! Sabia que já conquistou ${profile.streak} ${streakDaysWord} de streak? Parabéns pelo progresso! Não deixe este hábito inicial arrefecer hoje. Dedique apenas 5 minutinhos para fixar as bases! 🦉🇲🇿`;
      } else if (userLevel === 'intermediate') {
        title = 'Mantenha o ritmo rumo à fluência! 📈 Sabush Intermediate';
        body = `Impressionante, ${profile.name || 'Estudante'}! Já são ${profile.streak} ${streakDaysWord} de streak acumulados. No nível Intermédio, a consistência é a chave. Vamos praticar um pouco hoje para consolidar os seus passos? 🦉🇲🇿`;
      } else if (userLevel === 'advanced') {
        title = `Desafio de mestre: Streak de ${profile.streak} ${streakDaysWord}! 🎯`;
        body = `Saudações, ${profile.name || 'Estudante'}! O seu streak avançado de ${profile.streak} ${streakDaysWord} é um exemplo de dedicação. A excelência requer treino diário de alto nível. Que tal um desafio de fluência rápido hoje para blindar o seu progresso? 🦉🇲🇿`;
      }
      
      await sendBrowserNotification(title, {
        body,
        tag: 'streak-reminder',
        requireInteraction: true
      });

      try {
        localStorage.setItem('sabush_last_notified_date', todayStr);
      } catch (e) {
        console.debug('Failed to write to localStorage', e);
      }

      sessionLastNotifiedDate = todayStr;

      onProfileUpdate({
        lastNotifiedDate: todayStr
      });
      return;
    }

    // 2. Word of the Day Touchpoint (If not notified today and did not trigger a streak reminder)
    // To avoid spamming, we only send one of the two notifications. If they are active or it's earlier in the day,
    // we trigger the Word of the Day as a lovely low-effort educational nudge.
    const userLevel = (profile?.level || 'beginner');
    const word = getDynamicWordForLevel(userLevel);
    let title = `Palavra do Dia: "${word.en}" 🌟`;
    let body = `Significa "${word.pt}" em Português. Pronúncia: ${word.pronunciation || ''}. Pratique agora no Sabush English Club! 🦉`;

    const userLevelLower = userLevel.toLowerCase();
    const streakDaysWord = profile.streak === 1 ? 'dia' : 'dias';

    if (userLevelLower === 'beginner') {
      if (profile.streak > 0) {
        title = `Parabéns pelos seus ${profile.streak} ${streakDaysWord} de streak! 🌟`;
        body = `Parabéns pelos seus ${profile.streak} ${streakDaysWord} de streak! Vamos aprender uma nova palavra hoje? A palavra do dia é "${word.en}" ("${word.pt}"). Pratique já! 🦉🇲🇿`;
      } else {
        title = `Palavra do Dia (Iniciante): "${word.en}" 🌟`;
        body = `Significa "${word.pt}" em Português (${word.pronunciation || ''}). Um termo essencial e de fácil memorização para construir a sua base hoje no Sabush! 🦉🇲🇿`;
      }
    } else if (userLevelLower === 'intermediate') {
      if (profile.streak > 0) {
        title = `Siga firme! Streak de ${profile.streak} ${streakDaysWord} no Sabush 📘`;
        body = `O seu streak de ${profile.streak} ${streakDaysWord} mostra o seu compromisso! Expanda o seu vocabulário com: "${word.en}" ("${word.pt}"). Que tal formar uma frase com ela hoje? 🦉🇲🇿`;
      } else {
        title = `Vocabulário do Dia (Intermédio): "${word.en}" 📘`;
        body = `Significa "${word.pt}" em Português (${word.pronunciation || ''}). Perfeito para expandir o seu repertório e falar mais naturalmente hoje! 🦉🇲🇿`;
      }
    } else if (userLevelLower === 'advanced') {
      if (profile.streak > 0) {
        title = `Domínio Avançado: Streak de ${profile.streak} ${streakDaysWord}! 🎓`;
        body = `Fabuloso! Manter um streak de ${profile.streak} ${streakDaysWord} no nível Avançado exige foco. Desafie o seu cérebro hoje com a palavra "${word.en}" ("${word.pt}"). Consegue encaixá-la na sua próxima conversa? 🦉🇲🇿`;
      } else {
        title = `Expressão Avançada: "${word.en}" 🎓`;
        body = `Significa "${word.pt}" em Português (${word.pronunciation || ''}). Adicione este termo ao seu vocabulário avançado, refine a sua oratória e soe ainda mais natural hoje! 🦉🇲🇿`;
      }
    }

    await sendBrowserNotification(title, {
      body,
      tag: 'word-of-the-day'
    });

    try {
      localStorage.setItem('sabush_last_notified_date', todayStr);
    } catch (e) {
      console.debug('Failed to write to localStorage', e);
    }

    sessionLastNotifiedDate = todayStr;

    onProfileUpdate({
      lastNotifiedDate: todayStr
    });
  } finally {
    isEvaluatingNudge = false;
  }
}
