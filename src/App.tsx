/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './components/Home';
import { LevelSelection } from './components/LevelSelection';
import { LessonView } from './components/LessonView';
import { AITutor } from './components/AITutor';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { AboutView } from './components/AboutView';
import { AuthPage } from './components/AuthPage';
import { MyAccount } from './components/MyAccount';
import { TorneSeMembro } from './components/TorneSeMembro';
import { AdminPanel } from './components/AdminPanel';
import { StudyGroups } from './components/StudyGroups';
import { InspirationCardsGallery } from './components/InspirationCardsGallery';
import { EnglishLevel, Certificate, PhrasePack } from './types';
import { LESSONS } from './data';
import { auth, getUserProfile, saveUserProfile, FirebaseUserProfile, syncProgress, getCertificateByUserId, createAndSaveCertificate } from './firebase';
import { CertificateVerification } from './components/CertificateVerification';
import { CertificateView } from './components/CertificateView';
import { SkeletonLayout } from './components/SkeletonLayout';
import { ConfidencePath } from './components/ConfidencePath';
import { PhrasePackModal } from './components/PhrasePackModal';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Loader2, Award, Sparkles, CheckCircle2, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { areNotificationsSupported, requestNotificationPermission, checkAndTriggerNudges, registerNotificationServiceWorker } from './utils/notifications';

export default function App() {
  // Navigation State & Navigation History
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);
  const [customBackHandler, setCustomBackHandler] = useState<(() => boolean) | null>(null);

  // Custom tab changer that tracks history
  const setActiveTab = (newTab: string) => {
    setActiveTabState((prevTab) => {
      if (prevTab === newTab) return prevTab;
      
      // Update history stack
      setTabHistory((prevHistory) => {
        // Prevent infinite loops or continuous identical states and clean history
        const cleanedHistory = prevHistory.filter(t => t !== newTab);
        return [...cleanedHistory, newTab];
      });
      
      return newTab;
    });
  };

  // Back navigation function
  const handleGoBack = () => {
    if (customBackHandler) {
      const handled = customBackHandler();
      if (handled) return;
    }
    
    if (tabHistory.length <= 1) {
      setActiveTabState('home');
      return;
    }
    
    setTabHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      updatedHistory.pop(); // Remove the current active tab
      const previousTab = updatedHistory[updatedHistory.length - 1] || 'home';
      setActiveTabState(previousTab);
      return updatedHistory;
    });
  };

  const canGoBack = activeTab !== 'home' || !!customBackHandler;

  // Auth & Profile states
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Completion Certificate states
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [showNotificationOptInPrompt, setShowNotificationOptInPrompt] = useState<boolean>(false);
  const [notificationPromptError, setNotificationPromptError] = useState<string | null>(null);
  const [publicVerifyCode, setPublicVerifyCode] = useState<string | null>(null);
  const [showGuestVerifyAll, setShowGuestVerifyAll] = useState<boolean>(false);

  // Onboarding completed indicator
  const [onboarded, setOnboarded] = useState<boolean>(false);

  // User Profile Statistics (Loaded dynamically from user profile or localStorage)
  const [level, setLevel] = useState<EnglishLevel>('beginner');
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedPacks, setCompletedPacks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // PhrasePack Deep-linking / Details states
  const [selectedPhrasePackForDetail, setSelectedPhrasePackForDetail] = useState<PhrasePack | null>(null);
  const [initialLessonIdForView, setInitialLessonIdForView] = useState<string | null>(null);
  const [initialTutorModeForView, setInitialTutorModeForView] = useState<'tutor' | 'roleplay' | 'guided' | null>(null);
  const [initialScenarioIdForView, setInitialScenarioIdForView] = useState<string | null>(null);
  const [initialFlashcardWordsForView, setInitialFlashcardWordsForView] = useState<any[] | null>(null);
  const [initialReviewActiveForView, setInitialReviewActiveForView] = useState<boolean>(false);

  // Caminho da Confiança Stats
  const [currentConfidenceDay, setCurrentConfidenceDay] = useState<number>(() => {
    const val = localStorage.getItem('sabush_confidence_day');
    return val ? parseInt(val, 10) : 1;
  });

  const [completedConfidenceDays, setCompletedConfidenceDays] = useState<number[]>(() => {
    try {
      const val = localStorage.getItem('sabush_completed_confidence_days');
      if (val) return JSON.parse(val);
    } catch (e) {}
    return [];
  });

  // Subscription helpers
  const refetchUserProfile = async () => {
    if (currentUser) {
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
          setLevel(profile.level);
          setXp(profile.xp);
          setStreak(profile.streak);
          setCompletedLessons(profile.completedLessons || []);
          setCompletedPacks(profile.completedPacks || []);
          
          const profileGuidedDay = (profile as any).guidedConfidenceDay || 1;
          const profileCompletedDays = (profile as any).completedConfidenceDays || [];
          setCurrentConfidenceDay(profileGuidedDay);
          setCompletedConfidenceDays(profileCompletedDays);
          
          localStorage.setItem('sabush_confidence_day', profileGuidedDay.toString());
          localStorage.setItem('sabush_completed_confidence_days', JSON.stringify(profileCompletedDays));
        }
      } catch (err) {
        console.error("Error refreshing profile:", err);
      }
    }
  };

  const isAdmin = currentUser?.email === 'sabushagency@gmail.com';
  const isSubscribed = userProfile?.subscriptionStatus === 'Activo' || isAdmin;

  // 1. Listen for deep-linked public verify query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('verify') || urlParams.get('certificateId');
    if (code) {
      setPublicVerifyCode(code);
    }
  }, []);

  // 2. Watch completed lessons and automatically generate the certificate if ALL are done!
  useEffect(() => {
    if (!currentUser) return;
    if (completedLessons.length === 0) return;
    
    // Check if they completed all lessons
    const isCompleted = LESSONS.every(lesson => completedLessons.includes(lesson.id));
    if (isCompleted && !certificate) {
      const awardCertificate = async () => {
        try {
          if (currentUser.uid === 'guest_user_123') {
            const guestCert = {
              certificateId: 'cert_guest_user_123',
              userId: 'guest_user_123',
              userName: userProfile?.name || 'Visitante Sabush',
              uniqueCode: 'SABUSH-DEMO-2026',
              completedAt: { toDate: () => new Date() }
            } as any;
            localStorage.setItem('sabush_guest_certificate', JSON.stringify(guestCert));
            setCertificate(guestCert);
            setShowUnlockModal(true);
            triggerConfettiCelebration();
          } else {
            const newCert = await createAndSaveCertificate(
              currentUser.uid,
              userProfile?.name || currentUser.displayName || 'Aprendiz Club'
            );
            setCertificate(newCert);
            setShowUnlockModal(true);
            triggerConfettiCelebration();
          }
        } catch (err) {
          console.error("Error generating completion certificate:", err);
        }
      };
      
      awardCertificate();
    }
  }, [completedLessons, currentUser, certificate, userProfile]);

  // Dynamic celebration confetti helper
  const triggerConfettiCelebration = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };


  // Monitor Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const isGuestMode = localStorage.getItem('sabush_guest_active') === 'true';

      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        
        // Optimistic setup: load from local storage so the visual layout paints instantly
        const localLevel = (localStorage.getItem('sabush_level') as EnglishLevel) || 'beginner';
        const localXp = parseInt(localStorage.getItem('sabush_xp') || '0', 10);
        const localStreak = parseInt(localStorage.getItem('sabush_streak') || '1', 10);
        const localOnboarded = localStorage.getItem('sabush_onboarded') === 'true';
        let localCompleted: string[] = [];
        try {
          const savedCompleted = localStorage.getItem('sabush_completed');
          if (savedCompleted) localCompleted = JSON.parse(savedCompleted);
        } catch (e) {}

        setLevel(localLevel);
        setXp(localXp);
        setStreak(localStreak);
        setCompletedLessons(localCompleted);
        setOnboarded(localOnboarded);

        // Instantly unblock the loading screen if the user is already onboarded. This removes the wait time!
        if (localOnboarded) {
          setAuthLoading(false);
        }

        // Elegant safety escape hatch: if Firestore fetching takes more than 5 seconds (e.g. offline/network issue), unblock the screen anyway!
        const forceUnblockTimeout = !localOnboarded ? setTimeout(() => {
          console.warn("Firestore profile fetch took more than 5s - Force-unblocking the loading skeleton screen for offline usability.");
          setAuthLoading(false);
        }, 5000) : null;

        try {
          // Parallelize profile and certificate fetches to double networking throughput!
          const [profile, cert] = await Promise.all([
            getUserProfile(firebaseUser.uid),
            getCertificateByUserId(firebaseUser.uid)
          ]);

          if (forceUnblockTimeout) {
            clearTimeout(forceUnblockTimeout);
          }

          if (profile) {
            setUserProfile(profile);
            setLevel(profile.level);
            setXp(profile.xp);
            setStreak(profile.streak);
            setCompletedLessons(profile.completedLessons || []);
            setCompletedPacks(profile.completedPacks || []);
            setOnboarded(true);

            const profileGuidedDay = (profile as any).guidedConfidenceDay || 1;
            const profileCompletedDays = (profile as any).completedConfidenceDays || [];
            setCurrentConfidenceDay(profileGuidedDay);
            setCompletedConfidenceDays(profileCompletedDays);

            // Sync with local storage for offline resiliency
            localStorage.setItem('sabush_level', profile.level);
            localStorage.setItem('sabush_xp', profile.xp.toString());
            localStorage.setItem('sabush_streak', profile.streak.toString());
            localStorage.setItem('sabush_completed', JSON.stringify(profile.completedLessons));
            localStorage.setItem('sabush_completed_packs', JSON.stringify(profile.completedPacks || []));
            localStorage.setItem('sabush_goal', profile.learningGoal);
            localStorage.setItem('sabush_onboarded', 'true');
            localStorage.setItem('sabush_confidence_day', profileGuidedDay.toString());
            localStorage.setItem('sabush_completed_confidence_days', JSON.stringify(profileCompletedDays));
          } else {
            // No profile found. Let's build a new profile matching previous local storage progress so we migrate seamlessly
            const localGoal = localStorage.getItem('sabush_goal') || 'Conversation';
            let localPacks: string[] = [];
            try {
              const savedPacks = localStorage.getItem('sabush_completed_packs');
              if (savedPacks) localPacks = JSON.parse(savedPacks);
            } catch (e) {}

            const newProfile: FirebaseUserProfile = {
              userId: firebaseUser.uid,
              name: firebaseUser.displayName || 'Aprendiz Club',
              email: firebaseUser.email || undefined,
              phoneNumber: firebaseUser.phoneNumber || undefined,
              level: localLevel,
              learningGoal: localGoal,
              xp: localXp,
              streak: localStreak,
              completedLessons: localCompleted,
              completedPacks: localPacks,
              lastActiveDate: new Date().toDateString(),
              createdAt: null,
              updatedAt: null,
            };

            await saveUserProfile(firebaseUser.uid, newProfile);
            setUserProfile(newProfile);
            setLevel(localLevel);
            setXp(localXp);
            setStreak(localStreak);
            setCompletedLessons(localCompleted);
            setCompletedPacks(localPacks);
            setOnboarded(localOnboarded);
          }

          if (cert) {
            setCertificate(cert);
          }
        } catch (error) {
          console.error("Error fetching/setting user profile:", error);
        } finally {
          clearTimeout(forceUnblockTimeout);
          setAuthLoading(false);
        }
      } else if (isGuestMode) {
        const guestPhone = localStorage.getItem('sabush_simulated_phone') || '+258840000000';
        const guestName = localStorage.getItem('sabush_simulated_name') || 'Visitante Sabush';
        const guestEmail = localStorage.getItem('sabush_simulated_email') || 'sabushagency@gmail.com';
        const guestUser = {
          uid: 'guest_user_123',
          email: guestEmail,
          displayName: guestName,
          phoneNumber: guestPhone,
          emailVerified: true,
        } as any;
        setCurrentUser(guestUser);

        const localLevel = (localStorage.getItem('sabush_level') as EnglishLevel) || 'beginner';
        const localGoal = localStorage.getItem('sabush_goal') || 'Conversation';
        const localXp = parseInt(localStorage.getItem('sabush_xp') || '450', 10);
        const localStreak = parseInt(localStorage.getItem('sabush_streak') || '3', 10);
        let localCompleted: string[] = [];
        try {
          const savedCompleted = localStorage.getItem('sabush_completed');
          if (savedCompleted) localCompleted = JSON.parse(savedCompleted);
        } catch (e) {}

        let localPacks: string[] = [];
        try {
          const savedPacks = localStorage.getItem('sabush_completed_packs');
          if (savedPacks) localPacks = JSON.parse(savedPacks);
        } catch (e) {}

        const guestProfile: FirebaseUserProfile = {
          userId: 'guest_user_123',
          name: guestName,
          email: 'sabushagency@gmail.com',
          phoneNumber: guestPhone,
          level: localLevel,
          learningGoal: localGoal,
          xp: localXp,
          streak: localStreak,
          completedLessons: localCompleted,
          completedPacks: localPacks,
          lastActiveDate: new Date().toDateString(),
          createdAt: null,
          updatedAt: null,
          subscriptionStatus: 'Activo'
        };

        setUserProfile(guestProfile);
        setLevel(localLevel);
        setXp(localXp);
        setStreak(localStreak);
        setCompletedLessons(localCompleted);
        setCompletedPacks(localPacks);
        setOnboarded(true);

        // Guest mode certificate fetching/mock
        const certStr = localStorage.getItem('sabush_guest_certificate');
        if (certStr) {
          setCertificate(JSON.parse(certStr));
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLevel('beginner');
        setXp(0);
        setStreak(1);
        setCompletedLessons([]);
        setOnboarded(false);
        setCertificate(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Periodic Engagement Nudge Checker
  useEffect(() => {
    if (!userProfile || !userProfile.notificationsEnabled) return;

    const runNudgeCheck = async () => {
      try {
        await checkAndTriggerNudges(userProfile, async (updates) => {
          // Keep state and Firestore sync'd
          const updatedProfile = {
            ...userProfile,
            ...updates
          };
          setUserProfile(updatedProfile);
          
          if (currentUser && currentUser.uid !== 'guest_user_123') {
            await syncProgress(currentUser.uid, updates);
          }
        });
      } catch (err) {
        console.error("Error executing background nudge evaluation:", err);
      }
    };

    // Run immediately on load or when profile is ready
    runNudgeCheck();

    // Recheck periodically every 5 minutes
    const interval = setInterval(runNudgeCheck, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userProfile, currentUser]);

  // Auto-register service worker if notifications are already active
  useEffect(() => {
    if (userProfile?.notificationsEnabled && Notification.permission === 'granted') {
      registerNotificationServiceWorker();
    }
  }, [userProfile?.notificationsEnabled]);

  // Centralized, consistent, reusable logout function
  const handleGlobalLogout = async (confirmFirst = false) => {
    if (!confirmFirst || window.confirm('Tem a certeza de que deseja terminar a sua sessão?')) {
      try {
        setAuthLoading(true);
        // Clear all localized session parameters
        localStorage.removeItem('sabush_guest_active');
        localStorage.removeItem('sabush_level');
        localStorage.removeItem('sabush_xp');
        localStorage.removeItem('sabush_streak');
        localStorage.removeItem('sabush_completed');
        localStorage.removeItem('sabush_goal');
        localStorage.removeItem('sabush_onboarded');
        localStorage.removeItem('sabush_last_active_date');
        localStorage.removeItem('sabush_first_conversation_done');
        localStorage.removeItem('sabush_vocab_reviewed_at');
        localStorage.removeItem('sabush_guest_certificate');
        localStorage.removeItem('sabush_active_group_id');

        await auth.signOut();
      } catch (err) {
        console.error('Error during global sign out:', err);
      } finally {
        // Deep reset all user session and level states on explicit logout (vital for guest mode & active session cleanups)
        setCurrentUser(null);
        setUserProfile(null);
        setLevel('beginner');
        setXp(0);
        setStreak(1);
        setCompletedLessons([]);
        setOnboarded(false);
        setCertificate(null);
        setActiveTab('home');
        setAuthLoading(false);
      }
    }
  };

  // Complete onboarding wizard and persist choices
  const handleCompleteOnboarding = async (
    selectedLevel: EnglishLevel, 
    goal: string, 
    whatsappNumber?: string, 
    whatsappNotificationsEnabled?: boolean
  ) => {
    setLevel(selectedLevel);
    localStorage.setItem('sabush_level', selectedLevel);
    localStorage.setItem('sabush_goal', goal);
    localStorage.setItem('sabush_onboarded', 'true');
    setOnboarded(true);

    if (currentUser && currentUser.uid !== 'guest_user_123') {
      try {
        const updates: Partial<FirebaseUserProfile> = {
          level: selectedLevel,
          learningGoal: goal,
        };
        if (whatsappNumber) {
          updates.whatsappNumber = whatsappNumber;
          updates.whatsappNotificationsEnabled = !!whatsappNotificationsEnabled;
        }
        await syncProgress(currentUser.uid, updates);
        
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            ...updates
          });
        }
      } catch (err) {
        console.error("Error updating onboarding choices:", err);
      }
    }
    setActiveTab('lessons'); // Guide directly into suggested level's lessons
  };

  // Update learner level and switch to lesson tab for quick study flow
  const handleSelectLevel = async (newLevel: EnglishLevel) => {
    setLevel(newLevel);
    localStorage.setItem('sabush_level', newLevel);

    if (currentUser && currentUser.uid !== 'guest_user_123') {
      try {
        await syncProgress(currentUser.uid, { level: newLevel });
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            level: newLevel,
          });
        }
      } catch (err) {
        console.error("Error updating level:", err);
      }
    }
    setActiveTab('lessons'); // Help them transition instantly to active studying
  };

  // Grant XP upon correct lesson solutions and flag as complete
  const handleCompleteLesson = async (lessonId: string, gainedXp: number) => {
    let NewCompleted = [...completedLessons];
    const isFirstCompleted = completedLessons.length === 0;

    if (!completedLessons.includes(lessonId)) {
      NewCompleted = [...completedLessons, lessonId];
      setCompletedLessons(NewCompleted);
      localStorage.setItem('sabush_completed', JSON.stringify(NewCompleted));
    }

    let NewXp = xp;
    if (gainedXp > 0) {
      NewXp = xp + gainedXp;
      setXp(NewXp);
      localStorage.setItem('sabush_xp', NewXp.toString());
    }

    if (currentUser && currentUser.uid !== 'guest_user_123') {
      try {
        const updates: Partial<FirebaseUserProfile> = {
          completedLessons: NewCompleted,
          xp: NewXp,
        };
        await syncProgress(currentUser.uid, updates);
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            ...updates
          });
        }
      } catch (err) {
        console.error("Error completed lesson persistence:", err);
      }
    }

    // Trigger explicit opt-in notification prompt dialog ONLY after completing their first lesson, not on first load!
    if (isFirstCompleted && areNotificationsSupported() && (!userProfile || userProfile.notificationsEnabled === undefined)) {
      // Delay slightly for natural completion flow/inspiration card overlay
      setTimeout(() => {
        setShowNotificationOptInPrompt(true);
      }, 2500);
    }
  };

  const handleCompleteConfidenceDay = async (day: number, earnedXp: number) => {
    // 1. Add XP
    const nextXp = xp + earnedXp;
    setXp(nextXp);
    localStorage.setItem('sabush_xp', String(nextXp));

    // 2. Add to completed confidence days
    const nextCompleted = completedConfidenceDays.includes(day)
      ? completedConfidenceDays
      : [...completedConfidenceDays, day];
    
    setCompletedConfidenceDays(nextCompleted);
    localStorage.setItem('sabush_completed_confidence_days', JSON.stringify(nextCompleted));

    // 3. Auto-increment current guided study day sequentially
    let nextDay = currentConfidenceDay;
    if (day === currentConfidenceDay && currentConfidenceDay < 90) {
      nextDay = currentConfidenceDay + 1;
      setCurrentConfidenceDay(nextDay);
      localStorage.setItem('sabush_confidence_day', String(nextDay));
    }

    // 4. Update core backend and local sync
    if (currentUser) {
      try {
        const updates: any = {
          xp: nextXp,
          guidedConfidenceDay: nextDay,
          completedConfidenceDays: nextCompleted,
          updatedAt: new Date().toISOString()
        };
        if (currentUser.uid !== 'guest_user_123') {
          await syncProgress(currentUser.uid, updates);
        }
        
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            xp: nextXp,
            guidedConfidenceDay: nextDay,
            completedConfidenceDays: nextCompleted
          } as any);
        }
      } catch (err) {
        console.error("Error updating confidence day progress:", err);
      }
    }
  };

  // Grant general XP (e.g., chat sessions, word reviews) & update streak if first activity today
  const handleEarnXp = async (gainedXp: number) => {
    if (gainedXp <= 0) return;
    const updatedXp = xp + gainedXp;
    setXp(updatedXp);
    localStorage.setItem('sabush_xp', updatedXp.toString());

    // Simple streak increment helper (simulating daily interaction)
    const lastActive = localStorage.getItem('sabush_last_active_date');
    const today = new Date().toDateString();
    let updatedStreak = streak;

    if (lastActive !== today) {
      updatedStreak = streak + 1;
      setStreak(updatedStreak);
      localStorage.setItem('sabush_streak', updatedStreak.toString());
      localStorage.setItem('sabush_last_active_date', today);
    }

    if (currentUser && currentUser.uid !== 'guest_user_123') {
      try {
        const updates: Partial<FirebaseUserProfile> = {
          xp: updatedXp,
          streak: updatedStreak,
          lastActiveDate: today,
        };
        await syncProgress(currentUser.uid, updates);
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            ...updates
          });
        }
      } catch (err) {
        console.error("Error earning XP persistence:", err);
      }
    }
  };

  const handleCompletePhrasePack = async (packId: string) => {
    if (completedPacks.includes(packId)) return;
    const updatedPacks = [...completedPacks, packId];
    setCompletedPacks(updatedPacks);
    localStorage.setItem('sabush_completed_packs', JSON.stringify(updatedPacks));

    // Award 100 XP!
    const updatedXp = xp + 100;
    setXp(updatedXp);
    localStorage.setItem('sabush_xp', updatedXp.toString());

    // Trigger confetti!
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('sabush_last_active_date');
    let updatedStreak = streak;
    if (lastActive !== today) {
      updatedStreak = streak + 1;
      setStreak(updatedStreak);
      localStorage.setItem('sabush_streak', updatedStreak.toString());
      localStorage.setItem('sabush_last_active_date', today);
    }

    if (currentUser && currentUser.uid !== 'guest_user_123') {
      try {
        const updates: Partial<FirebaseUserProfile> = {
          completedPacks: updatedPacks,
          xp: updatedXp,
          streak: updatedStreak,
          lastActiveDate: today,
        };
        await syncProgress(currentUser.uid, updates);
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            ...updates
          });
        }
      } catch (err) {
        console.error("Error completing phrase pack persistence:", err);
      }
    } else {
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          completedPacks: updatedPacks,
          xp: updatedXp,
          streak: updatedStreak,
          lastActiveDate: today,
        });
      }
    }
  };

  // Revert all profile statistics
  const handleResetProgress = async () => {
    if (window.confirm('Tem a certeza de que deseja reiniciar o seu progresso? Isto apagará a sua experiência (XP), medalhas ganhas, certificados de conclusão e o colocará de volta ao teste inicial.')) {
      setLevel('beginner');
      setXp(0);
      setStreak(1);
      setCompletedLessons([]);
      setCompletedPacks([]);
      setOnboarded(false);
      setCertificate(null);
      
      localStorage.removeItem('sabush_level');
      localStorage.removeItem('sabush_xp');
      localStorage.removeItem('sabush_streak');
      localStorage.removeItem('sabush_completed');
      localStorage.removeItem('sabush_completed_packs');
      localStorage.removeItem('sabush_onboarded');
      localStorage.removeItem('sabush_goal');
      localStorage.removeItem('sabush_last_active_date');
      localStorage.removeItem('sabush_guest_certificate');

      if (currentUser && currentUser.uid !== 'guest_user_123') {
        try {
          const resetProfile: Partial<FirebaseUserProfile> = {
            level: 'beginner',
            xp: 0,
            streak: 1,
            completedLessons: [],
            completedPacks: [],
            lastActiveDate: null
          };
          await saveUserProfile(currentUser.uid, resetProfile);
          if (userProfile) {
            setUserProfile({
              ...userProfile,
              ...resetProfile
            });
          }
        } catch (err) {
          console.error("Error resetting Firestore progress:", err);
        }
      } else {
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            level: 'beginner',
            xp: 0,
            streak: 1,
            completedLessons: [],
            completedPacks: [],
            lastActiveDate: null
          });
        }
      }
    }
  };

  // Simulate completion of all lessons to test Certificate workflow
  const handleSimulateCompletion = async () => {
    const allLessonIds = LESSONS.map(l => l.id);
    setCompletedLessons(allLessonIds);
    localStorage.setItem('sabush_completed', JSON.stringify(allLessonIds));
    
    // Bumps up XP so they are classified as Ambassador
    const simulatedXp = Math.max(xp, 600);
    setXp(simulatedXp);
    localStorage.setItem('sabush_xp', simulatedXp.toString());
    
    if (currentUser && currentUser.uid !== 'guest_user_123') {
      try {
        const updates: Partial<FirebaseUserProfile> = {
          completedLessons: allLessonIds,
          xp: simulatedXp
        };
        await syncProgress(currentUser.uid, updates);
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            ...updates
          });
        }
      } catch (err) {
        console.error("Error persisting simulated progress:", err);
      }
    } else if (currentUser && currentUser.uid === 'guest_user_123') {
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          completedLessons: allLessonIds,
          xp: simulatedXp
        });
      }
    }
  };

  const handleAuthSuccess = async (userId: string, isNewUser: boolean) => {
    try {
      if (userId === 'guest_user_123') {
        setAuthLoading(true);
        const guestPhone = localStorage.getItem('sabush_simulated_phone') || '+258840000000';
        const guestName = localStorage.getItem('sabush_simulated_name') || 'Visitante Sabush';
        const guestEmail = localStorage.getItem('sabush_simulated_email') || 'sabushagency@gmail.com';
        const localLevel = (localStorage.getItem('sabush_level') as EnglishLevel) || 'beginner';
        const localGoal = localStorage.getItem('sabush_goal') || 'Conversation';
        const localXp = parseInt(localStorage.getItem('sabush_xp') || '450', 10);
        const localStreak = parseInt(localStorage.getItem('sabush_streak') || '3', 10);
        let localCompleted: string[] = [];
        try {
          const savedCompleted = localStorage.getItem('sabush_completed');
          if (savedCompleted) localCompleted = JSON.parse(savedCompleted);
        } catch (e) {}

        const guestProfile: FirebaseUserProfile = {
          userId: 'guest_user_123',
          name: guestName,
          email: guestEmail,
          phoneNumber: guestPhone,
          level: localLevel,
          learningGoal: localGoal,
          xp: localXp,
          streak: localStreak,
          completedLessons: localCompleted,
          lastActiveDate: new Date().toDateString(),
          createdAt: null,
          updatedAt: null,
          subscriptionStatus: 'Activo'
        };

        setUserProfile(guestProfile);
        setLevel(localLevel);
        setXp(localXp);
        setStreak(localStreak);
        setCompletedLessons(localCompleted);
        setOnboarded(true);
        setCurrentUser({
          uid: 'guest_user_123',
          email: guestEmail,
          displayName: guestName,
          phoneNumber: guestPhone,
          emailVerified: true,
        } as any);
        setAuthLoading(false);
      } else {
        // For real registered users, do NOT trigger duplicate profile fetches here because the master
        // onAuthStateChanged listener handles the transition completely, securely, and seamlessly.
        // We optimistically populate local cached variables to accelerate rendering.
        const localLevel = (localStorage.getItem('sabush_level') as EnglishLevel) || 'beginner';
        const localXp = parseInt(localStorage.getItem('sabush_xp') || '0', 10);
        const localStreak = parseInt(localStorage.getItem('sabush_streak') || '1', 10);
        const localOnboarded = localStorage.getItem('sabush_onboarded') === 'true';
        let localCompleted: string[] = [];
        try {
          const savedCompleted = localStorage.getItem('sabush_completed');
          if (savedCompleted) localCompleted = JSON.parse(savedCompleted);
        } catch (e) {}

        setLevel(localLevel);
        setXp(localXp);
        setStreak(localStreak);
        setCompletedLessons(localCompleted);
        setOnboarded(localOnboarded);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Render the currently selected section
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            onStartLearning={() => setActiveTab('levels')}
            onNavigateToAbout={() => setActiveTab('about')}
            onNavigateToTab={setActiveTab}
            userLevel={level}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setActiveTab('lessons');
            }}
            learningGoal={userProfile?.learningGoal || localStorage.getItem('sabush_goal') || 'conversation'}
            completedPacks={completedPacks}
            onSelectPhrasePack={setSelectedPhrasePackForDetail}
            userProfile={userProfile}
            onProfileUpdate={async (updates) => {
              if (!userProfile) return;
              const updatedProfile = { ...userProfile, ...updates } as any;
              setUserProfile(updatedProfile);
              if (currentUser && currentUser.uid !== 'guest_user_123') {
                await syncProgress(currentUser.uid, updates);
              }
            }}
            streak={streak}
          />
        );
      case 'levels':
        return (
          <LevelSelection
            currentLevel={level}
            onSelectLevel={handleSelectLevel}
          />
        );
      case 'lessons':
        return (
          <LessonView
            currentLevel={level}
            completedLessons={completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onNavigateToChat={() => setActiveTab('chat')}
            onSelectLevel={handleSelectLevel}
            isSubscribed={isSubscribed}
            onNavigateToSub={() => setActiveTab('membro')}
            onRegisterBack={setCustomBackHandler}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            initialLessonId={initialLessonIdForView}
            onClearInitialLessonId={() => setInitialLessonIdForView(null)}
          />
        );
      case 'chat':
        if (!isSubscribed) {
          return (
            <TorneSeMembro 
              userProfile={userProfile} 
              onStatusUpdate={refetchUserProfile} 
              onNavigateHome={() => setActiveTab('home')} 
            />
          );
        }
        return (
          <AITutor 
            currentLevel={level} 
            onEarnXp={handleEarnXp} 
            initialTutorMode={initialTutorModeForView}
            initialScenarioId={initialScenarioIdForView}
            onClearInitialParams={() => {
              setInitialTutorModeForView(null);
              setInitialScenarioIdForView(null);
            }}
          />
        );
      case 'groups':
        return (
          <StudyGroups 
            userProfile={userProfile} 
            onNavigateHome={() => setActiveTab('home')}
            onRegisterBack={setCustomBackHandler}
          />
        );
      case 'membro':
        return (
          <TorneSeMembro 
            userProfile={userProfile} 
            onStatusUpdate={refetchUserProfile} 
            onNavigateHome={() => setActiveTab('home')} 
          />
        );
      case 'admin':
        if (!isAdmin) {
          return (
            <HomeView
              onStartLearning={() => setActiveTab('levels')}
              onNavigateToAbout={() => setActiveTab('about')}
              userLevel={level}
              learningGoal={userProfile?.learningGoal || localStorage.getItem('sabush_goal') || 'conversation'}
              userProfile={userProfile}
              onProfileUpdate={async (updates) => {
                if (!userProfile) return;
                const updatedProfile = { ...userProfile, ...updates } as any;
                setUserProfile(updatedProfile);
                if (currentUser && currentUser.uid !== 'guest_user_123') {
                  await syncProgress(currentUser.uid, updates);
                }
              }}
              streak={streak}
            />
          );
        }
        return <AdminPanel />;
      case 'gallery':
        return (
          <InspirationCardsGallery
            onGoBack={handleGoBack}
            onNavigateHome={() => setActiveTab('home')}
            onRegisterBack={setCustomBackHandler}
          />
        );
      case 'progress':
        return (
          <Dashboard
            xp={xp}
            streak={streak}
            completedLessonsCount={completedLessons.length}
            completedLessons={completedLessons}
            currentLevel={level}
            onResetStats={handleResetProgress}
            onNavigateToLessons={() => setActiveTab('lessons')}
            onEarnXp={handleEarnXp}
            currentUserId={userProfile?.userId || currentUser?.uid}
            onRegisterBack={setCustomBackHandler}
            certificate={certificate}
            onSimulateCompletion={handleSimulateCompletion}
            guidedConfidenceDay={currentConfidenceDay}
            onNavigateToTab={setActiveTab}
            initialReviewActive={initialReviewActiveForView}
            initialFlashcardWords={initialFlashcardWordsForView}
            onClearInitialParams={() => {
              setInitialReviewActiveForView(false);
              setInitialFlashcardWordsForView(null);
            }}
          />
        );
      case 'confidence_path':
        return (
          <ConfidencePath
            currentDay={currentConfidenceDay}
            completedDays={completedConfidenceDays}
            onCompleteDay={handleCompleteConfidenceDay}
            onGoBack={handleGoBack}
            onEarnXp={handleEarnXp}
            userProfile={userProfile}
            refetchProfile={refetchUserProfile}
            setActiveTab={setActiveTab}
          />
        );
      case 'about':
        return (
          <AboutView
            onGoBack={handleGoBack}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'account':
        return (
          <MyAccount
            userProfile={userProfile}
            onProfileUpdate={(updated) => {
              setUserProfile(updated);
              setLevel(updated.level);
            }}
            onRegisterBack={setCustomBackHandler}
            certificate={certificate}
            onViewCertificate={() => setActiveTab('progress')}
            onLogout={() => handleGlobalLogout()}
          />
        );
      default:
        return (
          <HomeView
            onStartLearning={() => setActiveTab('levels')}
            onNavigateToAbout={() => setActiveTab('about')}
            userLevel={level}
            learningGoal={userProfile?.learningGoal || localStorage.getItem('sabush_goal') || 'conversation'}
            userProfile={userProfile}
            onProfileUpdate={async (updates) => {
              if (!userProfile) return;
              const updatedProfile = { ...userProfile, ...updates } as any;
              setUserProfile(updatedProfile);
              if (currentUser && currentUser.uid !== 'guest_user_123') {
                await syncProgress(currentUser.uid, updates);
              }
            }}
            streak={streak}
          />
        );
    }
  };

  // 1. If public validation is active (deep-linked via verify=CODE), bypass authentication and display verify view
  if (publicVerifyCode !== null) {
    return (
      <CertificateVerification 
        initialCode={publicVerifyCode} 
        onGoBack={() => setPublicVerifyCode(null)} 
      />
    );
  }

  // 2. Render premium layout skeleton screen whilst checking initial Auth status / downloading profile
  if (authLoading) {
    return <SkeletonLayout />;
  }

  // 3. Redirect logged-out users strictly to the unified Sign Up / Log In form
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onNavigateToVerify={() => setPublicVerifyCode('')} />;
  }

  // 4. User is logged in but hasn't completed their learning goals onboarding
  if (!onboarded) {
    return <Onboarding onComplete={handleCompleteOnboarding} onLogout={() => handleGlobalLogout()} />;
  }

  // 5. Render primary authenticated layout and lesson experience
  return (
    <>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        xp={xp}
        streak={streak}
        onGoBack={handleGoBack}
        canGoBack={canGoBack}
        userProfile={userProfile}
      >
        {renderContent()}
      </Layout>

      {/* 6. Congratulatory unlock modal */}
      {showUnlockModal && certificate && (
        <div className="fixed inset-0 bg-[#0f172a]/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 max-w-lg w-full text-center relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e3a8a]/5 rounded-full blur-2xl" />
            
            <div className="w-20 h-20 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto border-4 border-white shadow-md animate-bounce">
              <Award className="w-10 h-10 text-yellow-105 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-[10.5px] font-black rounded-full uppercase tracking-wider">
                Mestre do Inglês • Fluency Achieved
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy-950 tracking-tight">Parabéns, {certificate.userName}! 🎉</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Completaste todas as etapas do currículo completo do <strong>Sabush English Club</strong>. Mostraste uma determinação exemplar durante toda a jornada (Beginner → Intermediate → Advanced).
              </p>
            </div>

            {/* Simulated certificate plate overview */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4.5 border border-slate-150 flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="text-[9px] text-[#1e3a8a] font-bold uppercase tracking-widest block">CERTIFICADO SUPREMO</span>
                <span className="text-xs font-black text-brand-navy-900 truncate">SABUSH DIPLOMA OF FLUENCY</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">CÓDIGO</span>
                <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-widest">{certificate.uniqueCode}</span>
              </div>
            </div>

            {/* Prompt actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  setShowUnlockModal(false);
                  setActiveTab('progress'); // Go to Dashboard/Certificate view tab
                }}
                className="w-full sm:flex-1 py-3.5 bg-[#1e3a8a] hover:bg-[#172554] text-white font-black text-sm rounded-2xl cursor-pointer shadow-sm transition-all text-center flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Award className="w-5 h-5 text-yellow-300" />
                <span>Ver Meu Diploma</span>
              </button>
              
              <button
                onClick={() => setShowUnlockModal(false)}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-sm rounded-2xl cursor-pointer transition-colors text-center min-h-[44px]"
              >
                Depois
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Notification Opt-In Prompt Modal */}
      {showNotificationOptInPrompt && (
        <div className="fixed inset-0 bg-[#0f172a]/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-navy-50 rounded-full blur-2xl" />
            
            <div className="w-16 h-16 rounded-2xl bg-brand-navy-50 text-brand-navy-700 flex items-center justify-center mx-auto border border-brand-navy-100 shadow-sm animate-pulse">
              <Bell className="w-8 h-8 text-brand-navy-600 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-brand-navy-50 text-brand-navy-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                Mantenha-se Motivado! 🌟
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight leading-tight">Ativar Notificações de Aprendizado?</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Parabéns por concluir a sua primeira aula! 🥳 Para te ajudar a manter o ritmo e não perder o seu streak de dias ativos, quer receber um breve lembrete diário e aprender a divertida <strong>Palavra do Dia</strong>?
              </p>
            </div>

            {notificationPromptError && (
              <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-3 text-xs font-semibold text-left">
                {notificationPromptError}
              </div>
            )}

            {/* Prompt actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                onClick={async () => {
                  setNotificationPromptError(null);
                  const permission = await requestNotificationPermission();
                  if (permission === 'granted' && userProfile) {
                    const updates = { notificationsEnabled: true };
                    const updatedProfile = { ...userProfile, ...updates };
                    setUserProfile(updatedProfile);
                    if (currentUser && currentUser.uid !== 'guest_user_123') {
                      await saveUserProfile(currentUser.uid, updatedProfile);
                    }
                    setShowNotificationOptInPrompt(false);
                  } else if (permission !== 'granted') {
                    setNotificationPromptError('Por favor, conceda permissão de notificações nas definições do seu navegador para receber lembretes.');
                  }
                }}
                className="w-full sm:flex-1 py-3 bg-brand-navy-600 hover:bg-brand-navy-750 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl cursor-pointer shadow-sm transition-all text-center flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Sim, Ativar Notificações!</span>
              </button>
              
              <button
                onClick={async () => {
                  setShowNotificationOptInPrompt(false);
                  setNotificationPromptError(null);
                  if (userProfile) {
                    const updates = { notificationsEnabled: false };
                    const updatedProfile = { ...userProfile, ...updates };
                    setUserProfile(updatedProfile);
                    if (currentUser && currentUser.uid !== 'guest_user_123') {
                      await saveUserProfile(currentUser.uid, updatedProfile);
                    }
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-extrabold text-xs uppercase tracking-wider rounded-2xl cursor-pointer transition-colors text-center min-h-[44px]"
              >
                Talvez Mais Tarde
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. PhrasePack Detail & Progress Modal Overlay */}
      {selectedPhrasePackForDetail && (
        <PhrasePackModal
          pack={selectedPhrasePackForDetail}
          onClose={() => setSelectedPhrasePackForDetail(null)}
          onNavigateToLesson={(lessonId) => {
            setInitialLessonIdForView(lessonId);
            setActiveTab('lessons');
            setSelectedPhrasePackForDetail(null);
          }}
          onNavigateToRoleplay={(scenarioId) => {
            setInitialTutorModeForView('roleplay');
            setInitialScenarioIdForView(scenarioId);
            setActiveTab('chat');
            setSelectedPhrasePackForDetail(null);
          }}
          onNavigateToFlashcards={(vocabWords) => {
            setInitialFlashcardWordsForView(vocabWords);
            setInitialReviewActiveForView(true);
            setActiveTab('progress');
            setSelectedPhrasePackForDetail(null);
          }}
          onCompletePack={handleCompletePhrasePack}
          completedLessons={completedLessons}
          completedPacks={completedPacks}
        />
      )}
    </>
  );
}
