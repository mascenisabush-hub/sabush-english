import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { auth, saveUserProfile, getUserProfile } from '../firebase';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { Mail, Lock, Phone, Key, HelpCircle, Loader2, RefreshCw, CheckCircle2, MessageSquare, Trophy, Heart, Rocket, BookOpen, ShieldCheck } from 'lucide-react';
import { EnglishLevel } from '../types';

// @ts-ignore
import sabushLogoFlags from '../assets/images/sabush_logo_flags_1781360603744.jpg';
// @ts-ignore
import sabushBanner from '../assets/images/sabush_banner_1781359379070.jpg';

export function getMozambicanCarrier(phoneNumber: string) {
  const digits = phoneNumber.replace(/\s+/g, '').replace(/[-()]/g, '');
  let baseDigits = digits;
  if (digits.startsWith('+258')) {
    baseDigits = digits.slice(4);
  } else if (digits.startsWith('258')) {
    baseDigits = digits.slice(3);
  } else if (digits.startsWith('0')) {
    baseDigits = digits.slice(1);
  }
  
  if (baseDigits.length >= 2) {
    const prefix2 = baseDigits.substring(0, 2);
    if (prefix2 === '84' || prefix2 === '85') {
      return { 
        name: 'Vodacom Moçambique', 
        color: 'text-red-400 bg-red-950/40 border-red-800/40', 
        logo: '🔴', 
        prefix: ['84', '85'] 
      };
    }
    if (prefix2 === '86' || prefix2 === '87') {
      return { 
        name: 'Movitel Moçambique', 
        color: 'text-amber-400 bg-amber-950/40 border-amber-800/40', 
        logo: '🟡', 
        prefix: ['86', '87'] 
      };
    }
    if (prefix2 === '82' || prefix2 === '83') {
      return { 
        name: 'Tmcel (mcel) Moçambique', 
        color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40', 
        logo: '🟢', 
        prefix: ['82', '83'] 
      };
    }
  }
  return null;
}

interface AuthPageProps {
  onAuthSuccess: (userId: string, isNewUser: boolean) => void;
  onNavigateToVerify: () => void;
}

export function AuthPage({ onAuthSuccess, onNavigateToVerify }: AuthPageProps) {
  // Tabs: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  // Sub-tabs for email: 'login' | 'signup'
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('login');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Mozambican phone inputs
  const [phone, setPhone] = useState('');
  const [detectedCarrier, setDetectedCarrier] = useState<{ name: string; color: string; logo: string; prefix: string[] } | null>(null);
  const [smsCode, setSmsCode] = useState('');
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [showGoogleSandboxSimulator, setShowGoogleSandboxSimulator] = useState(false);
  const [simName, setSimName] = useState('Sabush VIP Student');
  const [simEmail, setSimEmail] = useState('sabushagency@gmail.com');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sandbox / Dynamic Preview environment check
  const isSandboxEnvironment = typeof window !== 'undefined' && (
    window.location.hostname.includes('run.app') || 
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1') ||
    window.location.hostname.includes('google') ||
    window.location.hostname.includes('webcontainer') ||
    window.location.hostname === ''
  );

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Recaptcha verifier ref
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [recaptchaResetIndex, setRecaptchaResetIndex] = useState<number>(0);

  // SMS resend cooldown timer (default: 30 seconds)
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    let timer: any = null;
    if (isSmsSent && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSmsSent, cooldown]);

  // Dev state
  const [showDevOptions, setShowDevOptions] = useState(() => {
    return localStorage.getItem('sabush_show_dev') === 'true' || 
           window.location.search.includes('dev=true');
  });
  const logoClicksRef = useRef(0);

  const handleLogoClick = () => {
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 5) {
      const newValue = !showDevOptions;
      setShowDevOptions(newValue);
      if (newValue) {
        localStorage.setItem('sabush_show_dev', 'true');
        console.log('[SABUSH DEV] Developer / demo options enabled!');
      } else {
        localStorage.removeItem('sabush_show_dev');
        console.log('[SABUSH DEV] Developer / demo options disabled!');
      }
      logoClicksRef.current = 0;
    }
  };

  useEffect(() => {
    if (window.location.search.includes('dev=true')) {
      setShowDevOptions(true);
      localStorage.setItem('sabush_show_dev', 'true');
    }
  }, []);

  // Clean up function helper to cleanly destroy recaptcha widget and increment index so React replaces the DOM node
  const cleanRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        console.log('[SABUSH CLUB RECAPTCHA] Clearing RecaptchaVerifier...');
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        console.warn('Error during recaptchaVerifierRef.current.clear():', e);
      }
      recaptchaVerifierRef.current = null;
    }
    setRecaptchaResetIndex(prev => prev + 1);
  };

  const handleGuestLogin = () => {
    localStorage.setItem('sabush_guest_active', 'true');
    setSuccessMsg('Iniciando sessão de demonstração...');
    setTimeout(() => {
      onAuthSuccess('guest_user_123', false);
    }, 300);
  };

  const handleCopyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSimulatedGoogleLogin = (chosenEmail: string, chosenName: string) => {
    localStorage.setItem('sabush_guest_active', 'true');
    localStorage.setItem('sabush_simulated_phone', '+258840000000');
    localStorage.setItem('sabush_simulated_name', chosenName);
    localStorage.setItem('sabush_simulated_email', chosenEmail);
    localStorage.setItem('sabush_onboarded', 'true');

    setSuccessMsg(`Sessão iniciada com sucesso (Simulador Google) como ${chosenName}!`);
    setShowGoogleSandboxSimulator(false);
    setTimeout(() => {
      onAuthSuccess('guest_user_123', false);
    }, 300);
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    console.log('[SABUSH CLUB AUTH] Google Sign-In attempted. Active Project ID:', firebaseConfig.projectId);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if profile exists
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        // Initialize user profile
        await saveUserProfile(user.uid, {
          userId: user.uid,
          name: user.displayName || 'Aprendiz Sabush',
          email: user.email || undefined,
          phoneNumber: user.phoneNumber || undefined,
          level: 'beginner',
          learningGoal: 'Conversation',
          xp: 0,
          streak: 1,
          completedLessons: [],
          lastActiveDate: new Date().toDateString(),
          subscriptionStatus: 'Activo'
        });
      }

      setSuccessMsg('Sessão iniciada com Google!');
      setTimeout(() => {
        onAuthSuccess(user.uid, !profile);
      }, 300);
    } catch (err: any) {
      console.error(err);

      const isDomainError = err.code === 'auth/app-not-authorized' || 
                            err.code === 'auth/unauthorized-domain' || 
                            (err.message && (err.message.includes('auth/app-not-authorized') || err.message.includes('unauthorized-domain') || err.message.includes('authorized-domain'))) ||
                            err.code === 'auth/internal-error';

      const isPopupError = err.code === 'auth/popup-blocked' || 
                           err.code === 'auth/popup-closed-by-user' ||
                           (err.message && (err.message.includes('popup-blocked') || err.message.includes('popup-closed-by-user')));

      if (isDomainError || (isSandboxEnvironment && isPopupError)) {
        console.log('[SABUSH CLUB GOOGLE SIMULATOR] Domain/Pop-up restriction detected. Activating google simulator...');
        setShowGoogleSandboxSimulator(true);
        setError('O login do Google falhou devido a restrições do domínio ou popups bloqueados na pré-visualização. Ativámos o Simulador Google de Teste para poder aceder imediatamente!');
        return;
      }

      let friendlyError = err.message;
      if (err.code === 'auth/popup-blocked') {
        friendlyError = 'O popup de autenticação do Google foi bloqueado pelo seu navegador. Por favor, permita popups para este site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyError = 'O login com o Google foi fechado antes de ser concluído.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'O login por Google não está ativo. Por favor, ative o método "Google" na Consola do Firebase: https://console.firebase.google.com/project/' + (firebaseConfig.projectId || 'your-project') + '/authentication/providers';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // Clean error on toggling methods
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
  }, [authMethod, emailMode]);

  // Manage RecaptchaVerifier lifecycle strictly inside a useEffect hook
  useEffect(() => {
    if (authMethod !== 'phone') {
      return;
    }

    let isMounted = true;
    console.log('[SABUSH CLUB RECAPTCHA] useEffect: initializing RecaptchaVerifier...');

    // Clear contents of the container to be absolutely safe
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }

    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('[SABUSH CLUB RECAPTCHA] Invisible challenge solved successfully!');
        },
        'expired-callback': () => {
          console.warn('[SABUSH CLUB RECAPTCHA] Invisible challenge expired!');
          setError('O reCAPTCHA expirou. Por favor, tente novamente.');
        }
      });
      console.log('[SABUSH CLUB RECAPTCHA] Instantiated brand new RecaptchaVerifier successfully in useEffect.');
    } catch (err) {
      console.error('[SABUSH CLUB RECAPTCHA] Error creating RecaptchaVerifier inside useEffect:', err);
    }

    return () => {
      isMounted = false;
      if (recaptchaVerifierRef.current) {
        try {
          console.log('[SABUSH CLUB RECAPTCHA] useEffect cleanup: Clearing RecaptchaVerifier...');
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.warn('[SABUSH CLUB RECAPTCHA] Error during RecaptchaVerifier clear inside cleanup:', e);
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, [authMethod, recaptchaResetIndex]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    console.log('[SABUSH CLUB AUTH] Email Sign-In/Sign-Up attempted. Mode:', emailMode, 'Active Project ID:', firebaseConfig.projectId);

    try {
      if (emailMode === 'signup') {
        if (!name.trim()) {
          throw new Error('Por favor, introduza o seu nome.');
        }
        if (password.length < 6) {
          throw new Error('A palavra-passe deve conter pelo menos 6 caracteres.');
        }

        // Register user
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // Initialize user profile
        await saveUserProfile(user.uid, {
          userId: user.uid,
          name: name.trim(),
          email: user.email || undefined,
          level: 'beginner',
          learningGoal: 'Conversation',
          xp: 0,
          streak: 1,
          completedLessons: [],
          lastActiveDate: new Date().toDateString(),
        });

        setSuccessMsg('Conta criada com sucesso!');
        setTimeout(() => {
          onAuthSuccess(user.uid, true);
        }, 300);
      } else {
        // Log In
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;
        
        // Check if profile exists
        const profile = await getUserProfile(user.uid);
        
        setSuccessMsg('Sessão iniciada com sucesso!');
        setTimeout(() => {
          onAuthSuccess(user.uid, !profile);
        }, 300);
      }
    } catch (err: any) {
      console.error("Email auth error details:", err);
      let friendlyError = err.message;
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'Este endereço de e-mail já está associado a uma conta.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'E-mail ou palavra-passe incorretos. Por favor, tente novamente.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Por favor, introduza um e-mail válido.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'A palavra-passe deve conter pelo menos 6 caracteres.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'O método de login por E-mail & Senha não está ativo no Firebase. Ative "E-mail/Palavra-passe" na Consola do Firebase: https://console.firebase.google.com/project/' + (firebaseConfig.projectId || 'your-project') + '/authentication/providers';
      }
      
      const errorCodeMsg = err.code ? `[Código: ${err.code}] ` : '';
      setError(`${errorCodeMsg}${friendlyError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double trigger
    setError(null);
    setLoading(true);

    try {
      // Normalize number
      let cleanedPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
      if (!cleanedPhone) {
        throw new Error('Por favor, introduza o seu número de telemóvel.');
      }

      // Check format
      // Mozambican phone numbers typically are 9 digits (82, 83, 84, 85, 86, 87)
      if (cleanedPhone.startsWith('0')) {
        cleanedPhone = cleanedPhone.slice(1);
      }
      
      let finalPhone = cleanedPhone;
      if (!cleanedPhone.startsWith('+')) {
        if (cleanedPhone.startsWith('258')) {
          finalPhone = '+' + cleanedPhone;
        } else {
          finalPhone = '+258' + cleanedPhone;
        }
      }

      // Validate digits count to be realistic (typically +258 + 9 digits = 13 chars, or international)
      if (finalPhone.length < 11 || finalPhone.length > 15) {
        throw new Error('Por favor, introduza um número de telemóvel válido (ex: 84 123 4567).');
      }

      console.log('[SABUSH CLUB AUTH] Phone SMS send attempted. Target:', finalPhone, 'Active Project ID:', firebaseConfig.projectId);

      // Lazy initialization of RecaptchaVerifier
      let verifier = recaptchaVerifierRef.current;
      if (!verifier) {
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          const newContainer = document.createElement('div');
          newContainer.id = 'recaptcha-container';
          newContainer.className = 'fixed bottom-0 right-0 z-[9999] pointer-events-none w-0 h-0 opacity-0';
          document.body.appendChild(newContainer);
        } else {
          container.innerHTML = '';
        }
        
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('[SABUSH CLUB RECAPTCHA] Invisible challenge solved successfully!');
          },
          'expired-callback': () => {
            console.warn('[SABUSH CLUB RECAPTCHA] Invisible challenge expired!');
            setError('O reCAPTCHA expirou. Por favor, tente novamente.');
          }
        });
        recaptchaVerifierRef.current = verifier;
      }

      const result = await signInWithPhoneNumber(auth, finalPhone, verifier);
      
      setConfirmationResult(result);
      setIsSmsSent(true);
      setCooldown(30); // reset cooldown to 30 when SMS is first sent
      setSuccessMsg('Código de verificação SMS enviado!');
    } catch (err: any) {
      console.error("Phone send SMS error details:", err);
      
      if (isSandboxEnvironment) {
        console.log('[SABUSH CLUB SMS SIMULATOR] Activating SMS simulation sandbox for error:', err.code, err.message);
        const mockCode = String(Math.floor(100000 + Math.random() * 900000));
        localStorage.setItem('sabush_simulated_sms_code', mockCode);
        localStorage.setItem('sabush_simulated_phone', phone.replace(/\s+/g, '').replace(/[-()]/g, ''));
        
        setIsSandboxMode(true);
        setIsSmsSent(true);
        setCooldown(30);
        setSmsCode('');
        
        setSuccessMsg(`[SIMULADOR DE TESTE] Ativámos o simulador local automático porque o envio de SMS real falhou ou o domínio não está autorizado no Firebase. Use este código de teste para entrar: ${mockCode}`);
        return;
      }

      let friendlyError = err.message;
      if (err.code === 'auth/invalid-phone-number') {
        friendlyError = 'O número de telemóvel introduzido não é válido.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = 'Muitas tentativas feitas para este telemóvel. Por favor, tente mais tarde.';
      } else if (err.code === 'auth/operation-not-allowed') {
        if (err.message && (err.message.includes('region') || err.message.includes('região') || err.message.includes('SMS unable to be sent'))) {
          friendlyError = '[Erro de Região SMS] O envio de SMS está bloqueado para Moçambique. Ative a região de Moçambique (+258) na Consola do Firebase: Aceda a Authentication > Configurações (Settings) > Política de Região de SMS (SMS Region Policy) e mude para "Permitir" ou selecione explicitamente "Moçambique (+258)".';
        } else {
          friendlyError = 'O login por telefone (SMS) não está ativo no Firebase. Ative "Telefone" (Phone) na Consola do Firebase: https://console.firebase.google.com/project/' + (firebaseConfig.projectId || 'your-project') + '/authentication/providers';
        }
      } else if (err.message && (err.message.includes('region') || err.message.includes('SMS unable to be sent'))) {
        friendlyError = '[Erro de Região SMS] O envio de SMS está bloqueado para Moçambique. Ative a região de Moçambique (+258) na Consola do Firebase: Aceda a Authentication > Configurações (Settings) > Política de Região de SMS (SMS Region Policy) e mude para "Permitir" ou selecione explicitamente "Moçambique (+258)".';
      }
      
      const errorCodeMsg = err.code ? `[Código: ${err.code}] ` : '';
      setError(`${errorCodeMsg}${friendlyError}`);
      
      // Reset Recaptcha after failure
      cleanRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log('[SABUSH CLUB AUTH] Phone SMS verification code confirmation attempted. Active Project ID:', firebaseConfig.projectId);

    try {
      if (!smsCode || smsCode.length < 6) {
        throw new Error('Por favor, introduza o código de 6 dígitos recebido.');
      }

      if (isSandboxMode) {
        const storedCode = localStorage.getItem('sabush_simulated_sms_code');
        let storedPhone = localStorage.getItem('sabush_simulated_phone') || '840000000';
        if (storedPhone.startsWith('0')) {
          storedPhone = storedPhone.slice(1);
        }
        let finalPhone = storedPhone;
        if (!storedPhone.startsWith('+')) {
          if (storedPhone.startsWith('258')) {
            finalPhone = '+' + storedPhone;
          } else {
            finalPhone = '+258' + storedPhone;
          }
        }

        if (smsCode !== storedCode) {
          throw { code: 'auth/invalid-verification-code', message: 'O código de verificação SMS introduzido está incorreto.' };
        }

        // Set local storage values for guest/sandbox flow so App.tsx can mock the user correctly
        localStorage.setItem('sabush_guest_active', 'true');
        localStorage.setItem('sabush_simulated_phone', finalPhone);
        localStorage.setItem('sabush_simulated_name', 'Aluno Sabush ' + finalPhone.slice(-4));
        localStorage.setItem('sabush_onboarded', 'true');

        setSuccessMsg('Telemóvel verificado com sucesso (Modo Simulado)!');
        setTimeout(() => {
          onAuthSuccess('guest_user_123', false);
        }, 300);
        return;
      }

      if (!confirmationResult) {
        throw new Error('Sessão expirada. Por favor, solicite um novo código SMS.');
      }

      const userCredential = await confirmationResult.confirm(smsCode);
      const user = userCredential.user;

      // Check if profile exists
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        // We will save user profile during onboarding/setup.
        // For now, let's pre-initialize with phone number
        await saveUserProfile(user.uid, {
          userId: user.uid,
          name: 'Aprendiz Club',
          phoneNumber: user.phoneNumber || undefined,
          level: 'beginner',
          learningGoal: 'Conversation',
          xp: 0,
          streak: 1,
          completedLessons: [],
          lastActiveDate: new Date().toDateString(),
        });
      }

      setSuccessMsg('Telemóvel verificado com sucesso!');
      setTimeout(() => {
        onAuthSuccess(user.uid, !profile);
      }, 300);
    } catch (err: any) {
      console.error("Verify SMS error details:", err);
      let friendlyError = err.message;
      if (err.code === 'auth/invalid-verification-code') {
        friendlyError = 'O código de verificação SMS introduzido está incorreto ou expirou.';
      } else if (err.code === 'auth/code-expired') {
        friendlyError = 'Este código SMS expirou. Por favor, solicite um novo.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'Operação não permitida. Verifique os métodos de login na Consola do Firebase.';
      }
      
      const errorCodeMsg = err.code ? `[Código: ${err.code}] ` : '';
      setError(`${errorCodeMsg}${friendlyError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendSms = async () => {
    if (cooldown > 0 || loading) return;
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // Normalize number
      let cleanedPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
      if (!cleanedPhone) {
        throw new Error('Por favor, introduza o seu número de telemóvel.');
      }

      if (cleanedPhone.startsWith('0')) {
        cleanedPhone = cleanedPhone.slice(1);
      }
      
      let finalPhone = cleanedPhone;
      if (!cleanedPhone.startsWith('+')) {
        if (cleanedPhone.startsWith('258')) {
          finalPhone = '+' + cleanedPhone;
        } else {
          finalPhone = '+258' + cleanedPhone;
        }
      }

      console.log('[SABUSH CLUB AUTH] Phone SMS resend attempted. Target:', finalPhone, 'Active Project ID:', firebaseConfig.projectId);

      if (isSandboxMode) {
        console.log('[SABUSH CLUB SMS SIMULATOR] Resending simulated SMS...');
        const mockCode = String(Math.floor(100000 + Math.random() * 900000));
        localStorage.setItem('sabush_simulated_sms_code', mockCode);
        setCooldown(30);
        setSmsCode('');
        setSuccessMsg(`[SIMULADOR SABUSH] Novo código SMS enviado! Use o código de teste: ${mockCode}`);
        return;
      }

      // Lazy initialization of RecaptchaVerifier
      let verifier = recaptchaVerifierRef.current;
      if (!verifier) {
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          const newContainer = document.createElement('div');
          newContainer.id = 'recaptcha-container';
          newContainer.className = 'fixed bottom-0 right-0 z-[9999] pointer-events-none w-0 h-0 opacity-0';
          document.body.appendChild(newContainer);
        } else {
          container.innerHTML = '';
        }
        
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('[SABUSH CLUB RECAPTCHA] Invisible challenge solved successfully!');
          },
          'expired-callback': () => {
            console.warn('[SABUSH CLUB RECAPTCHA] Invisible challenge expired!');
            setError('O reCAPTCHA expirou. Por favor, tente novamente.');
          }
        });
        recaptchaVerifierRef.current = verifier;
      }

      const result = await signInWithPhoneNumber(auth, finalPhone, verifier);
      
      setConfirmationResult(result);
      setCooldown(30);
      setSuccessMsg('Novo código de verificação SMS enviado com sucesso!');
    } catch (err: any) {
      console.error("Phone resend SMS error details:", err);
      let friendlyError = err.message;
      if (err.code === 'auth/invalid-phone-number') {
        friendlyError = 'O número de telemóvel introduzido não é válido.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = 'Muitas tentativas feitas para este telemóvel. Por favor, tente mais tarde.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'O login por telefone (SMS) não está ativo no Firebase.';
      }
      setError(friendlyError);
      cleanRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPhoneForm = () => {
    setIsSmsSent(false);
    setConfirmationResult(null);
    setSmsCode('');
    setError(null);
    setSuccessMsg(null);
    setCooldown(30);
    setIsSandboxMode(false);
    cleanRecaptcha();
  };

  const handlePhoneChange = (val: string) => {
    const sanitized = val.replace(/[^0-9\s+]/g, '');
    setPhone(sanitized);
    const carrier = getMozambicanCarrier(sanitized);
    setDetectedCarrier(carrier);
  };

  return (
    <div className="min-h-screen bg-[#0A2A4A] text-slate-800 flex flex-col justify-between p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Soft elegant gold and blue ambient background glows on the navy backdrop */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#CFAC62]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full border border-[#CFAC62]/20 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-64 h-64 bg-[#1D5C97]/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Brand Ribbon Accent at Top of screen - blue to gold silk thread */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#153E68] via-[#CFAC62] to-[#1D5C97] z-50" />

      <div className="flex-1 flex flex-col justify-center items-center py-4 z-10 w-full animate-fade-in">
        {/* Main luxury responsive card */}
        <div className="w-full max-w-[442px] bg-white rounded-[38px] shadow-[0_24px_70px_rgba(29,62,36,0.06)] overflow-hidden border border-[#CFAC62]/15 flex flex-col relative transition-all duration-300 hover:shadow-[0_32px_90px_rgba(29,62,36,0.09)]">
          
          {/* CURVED ACADEMIA HEADER */}
          <div className="relative bg-gradient-to-br from-[#153E68] via-[#1D5C97] to-[#2872B5] h-[190px] w-full overflow-hidden border-b border-[#CFAC62]/20 flex flex-col items-center justify-center shrink-0">
            {/* Subtle decorative gold-toned geometric circle overlays for luxury texture */}
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#CFAC62_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br from-[#CFAC62]/15 to-transparent rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tl from-[#CFAC62]/10 to-transparent rounded-full blur-2xl" />

            {/* Premium Typography Badge heading on Dark Header */}
            <div className="text-center z-10 -mt-6 px-4">
              <span className="font-display text-[9px] uppercase tracking-[0.34em] text-[#CFAC62] font-semibold block mb-1 drop-shadow-xs">Bem-vindo ao Prestigiado</span>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#FAF9F5] uppercase tracking-[0.08em] drop-shadow-sm select-none">
                SABUSH
              </h1>
              <span className="text-[#CFAC62]/70 font-serif italic text-xs tracking-wider block mt-0.5">English Club</span>
            </div>
            
            {/* Absolute overlapping gold-rimmed medallion container */}
            <div 
              onClick={handleLogoClick}
              title="Clique 5 vezes para alternar opções de desenvolvimento"
              className="absolute bottom-[-38px] left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-[3px] border-[#FAF9F5] bg-white shadow-[0_12px_28px_rgba(29,62,36,0.11)] flex flex-col items-center justify-center overflow-hidden p-2.5 z-20 hover:scale-105 hover:border-[#CFAC62] transition-all duration-350 cursor-pointer"
            >
              <img 
                src={sabushLogoFlags} 
                alt="Sabush English Club Logo" 
                referrerPolicy="no-referrer"
                className="w-[85%] h-auto object-contain"
              />
              <img 
                src={sabushBanner} 
                alt="Sabush Coupon" 
                referrerPolicy="no-referrer"
                className="w-[85%] h-[28%] object-cover rounded border border-slate-100 shadow-3xs mt-1"
              />
            </div>
          </div>

          {/* CARD BODY CONTENT */}
          <div className="p-6 md:p-7 pt-13 space-y-5 flex flex-col items-center shrink-0">
            
            {/* PRESTIGIOUS CREDENTIAL BADGES */}
            <div className="flex items-center justify-center gap-3 w-full">
              <span className="bg-[#FAF9F5] text-[#1D5C97] border border-[#CFAC62]/30 font-bold text-[10.5px] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-3xs transform hover:scale-103 transition-transform cursor-pointer select-none uppercase tracking-wider">
                <span className="text-xs">⭐</span>
                <span>6 aulas grátis</span>
              </span>
              <span className="bg-[#1D5C97]/5 text-[#1D5C97] border border-[#1D5C97]/15 font-bold text-[10.5px] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-3xs transform hover:scale-103 transition-transform cursor-pointer select-none uppercase tracking-wider">
                <span className="w-3.5 h-3.5 bg-[#1D5C97] text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none pb-[1px]">✓</span>
                <span>100% grátis</span>
              </span>
            </div>

            {/* DESCRIPTION TEXT WITH ELEGANT GRAPHICS */}
            <p className="font-sans text-[12.5px] md:text-[13px] text-[#424B45] text-center font-medium leading-relaxed max-w-[340px] mx-auto tracking-wide">
              Entre na sua conta para progredir nas aulas, acumular <span className="text-[#1D5C97] font-bold">pontos (XP)</span> e esclarecer dúvidas com o <span className="text-[#CFAC62] font-semibold font-serif italic">Mocho Co-Piloto</span>.
            </p>

            {/* ERROR / SUCCESS ALERTS */}
            {successMsg && (
              <div className="bg-[#1D5C97]/5 text-[#1D5C97] border border-[#1D5C97]/20 p-3.5 px-4 rounded-2xl text-[12.5px] font-bold flex items-center gap-2.5 shadow-3xs w-full animate-fade-in leading-snug">
                <span className="w-5 h-5 bg-[#1D5C97] text-white rounded-full flex items-center justify-center text-[10px] font-black leading-none shrink-0 shadow-sm select-none">✓</span>
                <span className="tracking-tight text-left">{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="space-y-2.5 animate-fade-in w-full">
                <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-2xl text-[12px] font-medium text-rose-800 leading-normal shadow-3xs text-center flex items-center justify-center gap-2.5">
                  <span className="shrink-0 text-amber-500">⚠️</span>
                  <span className="text-left font-semibold">{error}</span>
                </div>
                {!isSmsSent && (showDevOptions || isSandboxEnvironment) && (
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="w-full bg-[#FAF9F5] border border-[#CFAC62]/30 hover:bg-[#FAF9F5]/40 text-[#1D5C97] text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-3xs font-sans"
                  >
                    <span>🚀 Entrar com Acesso de Teste (Bypass)</span>
                  </button>
                )}
              </div>
            )}

            {/* METHOD TABS SELECTOR (GLASS FEEL SLIDER) */}
            {!isSmsSent && (
              <div className="grid grid-cols-2 p-1 bg-[#1D5C97]/5 rounded-2xl border border-[#1D5C97]/10 w-full shrink-0">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMethod === 'email'
                      ? 'bg-[#1D5C97] text-white shadow-xs'
                      : 'text-[#424B45] hover:text-[#1D5C97]'
                  }`}
                >
                  <span>✉️</span> E-mail &amp; Senha
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone'
                      ? 'bg-[#1D5C97] text-white shadow-xs'
                      : 'text-[#424B45] hover:text-[#1D5C97]'
                  }`}
                >
                  <span>🇲🇿</span> Telemóvel (SMS)
                </button>
              </div>
            )}

            {/* MAIN FORMS */}
            {authMethod === 'email' ? (
              <form onSubmit={handleEmailAuth} className="space-y-4 w-full shrink-0">
                <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-[#1D5C97]">
                    {emailMode === 'login' ? 'Iniciar Sessão' : 'Criar Nova Conta'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEmailMode(emailMode === 'login' ? 'signup' : 'login')}
                    className="text-slate-400 hover:text-[#1D5C97] hover:underline transition-all cursor-pointer font-bold lowercase first-letter:uppercase"
                  >
                    {emailMode === 'login' ? 'Não tem conta? Registar' : 'Já tem conta? Entrar'}
                  </button>
                </div>

                {emailMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#556059] block">Nome Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João Tembe"
                        className="w-full bg-white/70 border border-[#1D5C97]/15 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1D5C97]/5 focus:border-[#1D5C97] focus:bg-white transition-all shadow-3xs h-12"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold select-none">A</div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#556059] block">Endereço de E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: joao@gmail.com"
                      className="w-full bg-white/70 border border-[#1D5C97]/15 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1D5C97]/5 focus:border-[#1D5C97] focus:bg-white transition-all shadow-3xs h-12"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#556059] block">Palavra-passe</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-white/70 border border-[#1D5C97]/15 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1D5C97]/5 focus:border-[#1D5C97] focus:bg-white transition-all shadow-3xs h-12"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1D5C97] hover:bg-[#153E68] active:scale-[0.98] text-[#FAF9F5] font-bold text-xs py-3.5 rounded-2xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 min-h-[46px] select-none uppercase tracking-[0.12em] border border-[#CFAC62]/35 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <span>{emailMode === 'login' ? 'Entrar no Club' : 'Criar Conta & Começar'}</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 w-full shrink-0">
                {!isSmsSent ? (
                  <form onSubmit={handleSendSms} className="space-y-4 w-full">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#556059] block">Número de Telefone</label>
                      <div className="flex w-full items-stretch rounded-2xl border border-[#1D5C97]/20 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#1D5C97]/5 focus-within:border-[#1D5C97] transition-all h-12 relative">
                        <div className="bg-[#1D5C97] text-[#FAF9F5] flex items-center justify-center px-4 font-bold text-sm select-none shrink-0 rounded-l-2xl border border-[#1D5C97]">
                          <span>+258</span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="870 242 114"
                          className="flex-1 bg-white px-4 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none"
                        />
                      </div>
                      
                      {detectedCarrier && (() => {
                        let lightColorClass = 'bg-slate-50 text-slate-700 border-slate-200';
                        if (detectedCarrier.name.includes('Vodacom')) {
                          lightColorClass = 'bg-rose-50 text-rose-700 border-rose-100';
                        } else if (detectedCarrier.name.includes('Movitel')) {
                          lightColorClass = 'bg-amber-50 text-amber-705 border-amber-200/50';
                        } else if (detectedCarrier.name.includes('Tmcel')) {
                          lightColorClass = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                        }
                        return (
                          <div className={`mt-2 flex items-center justify-between text-[11px] p-2.5 px-3 border rounded-xl leading-snug animate-fade-in ${lightColorClass}`}>
                            <span className="font-bold flex items-center gap-1.5">
                              <span>{detectedCarrier.logo}</span>
                              <span className="font-semibold">Rede: {detectedCarrier.name}</span>
                            </span>
                            <span className="text-[10px] opacity-80 font-semibold">Prefixos: {detectedCarrier.prefix.join(', ')}</span>
                          </div>
                        );
                      })()}
                      <div className="mt-2.5 bg-[#FAF9F5] p-3 rounded-2xl border border-[#CFAC62]/20 flex items-start gap-2.5 animate-fade-in">
                        <ShieldCheck className="w-4 h-4 text-[#CFAC62] shrink-0 mt-0.5" />
                        <div className="text-left text-[10.5px] text-[#556059] font-medium leading-relaxed">
                          <strong className="text-[#1D5C97] block font-bold mb-0.5">Segurança &amp; Progresso</strong>
                          Usamos o teu número para guardar o teu progresso e enviar lembretes.
                        </div>
                      </div>
                      
                      <span className="text-[9.5px] text-slate-400 block leading-tight mt-1.5 pl-0.5">
                        Enviaremos um código de verificação gratuito por SMS.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1D5C97] hover:bg-[#153E68] active:scale-[0.98] text-[#FAF9F5] font-bold text-xs py-3.5 rounded-2xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 min-h-[46px] select-none uppercase tracking-[0.12em] border border-[#CFAC62]/35 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-[#FAF9F5] shrink-0" />
                          <span>Enviar Código por SMS</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifySms} className="space-y-4 w-full">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                        <span className="text-[#424B45]">Código SMS recebido</span>
                        <button
                          type="button"
                          onClick={handleResetPhoneForm}
                          className="text-[#1D5C97] hover:text-[#CFAC62] hover:underline cursor-pointer flex items-center space-x-1 font-bold text-[10px]"
                        >
                          <RefreshCw className="w-3 h-3 text-[#1D5C97]" />
                          <span className="text-[#1D5C97] font-bold">Mudar número</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={smsCode}
                          onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ex:  1  2  3  4  5  6"
                          className="w-full bg-white border border-[#1D5C97]/15 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold tracking-[0.4em] text-center text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1D5C97]/5 focus:border-[#1D5C97] transition-all shadow-inner h-12"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400">
                          <Key className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Introduza o código numérico de 6 dígitos enviado para <span className="font-extrabold text-[#1D5C97]">+258 {phone || '870242114'}</span>.
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/60 mt-3.5">
                        <span className="text-[10.5px] text-[#556059] font-medium">Não recebeste o código?</span>
                        {cooldown > 0 ? (
                          <span className="text-[10px] text-slate-400 font-bold font-mono flex items-center gap-1 bg-[#FAF9F5] px-2.5 py-1 rounded-md border border-[#CFAC62]/30">
                            Reenviar em {cooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendSms}
                            disabled={loading}
                            className="text-[#1D5C97] hover:text-[#CFAC62] hover:underline text-[10.5px] font-bold cursor-pointer flex items-center gap-1 disabled:opacity-50"
                          >
                            <RefreshCw className="w-3 h-3 text-[#1D5C97]" />
                            Reenviar código
                          </button>
                        )}
                      </div>

                      {/* Help box for code delivery issues */}
                      <div className="bg-amber-50/60 border border-amber-200/40 rounded-2xl p-3.5 text-[10.5px] text-amber-900 leading-relaxed font-medium mt-3 flex gap-2.5 w-full text-left">
                        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-950 font-bold block mb-0.5">Problemas com o SMS?</strong>
                          As operadoras (Vodacom, Movitel, Tmcel) por vezes atrasam o envio. Se o código não chegar, podes clicar em "Mudar número" acima para corrigir o número, tentar fazer login com a tua conta <strong className="text-[#1D5C97] font-bold">Google</strong>, ou contactar-nos no WhatsApp: <a href="https://wa.me/258872421114" target="_blank" rel="noreferrer" className="underline font-bold text-amber-900 hover:text-amber-950">+258 87 242 1114</a>.
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1D5C97] hover:bg-[#153E68] active:scale-[0.98] text-[#FAF9F5] font-bold text-xs py-3.5 rounded-2xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 min-h-[46px] select-none uppercase tracking-[0.12em] border border-[#CFAC62]/35 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <span>Confirmar Código SMS</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* SEPARATOR AND ALTERNATIVE ACTION BUTTONS */}
            {!isSmsSent && (
              <div className="space-y-4 pt-1 w-full shrink-0">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-100/70"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em]">ou continua com</span>
                  <div className="flex-grow border-t border-slate-100/70"></div>
                </div>

                <div className={`grid ${showDevOptions ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full shrink-0`}>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="bg-white hover:bg-[#FAF9F5] active:scale-95 text-[#1D5C97] font-bold text-[11px] py-3.5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-3xs border border-[#1D5C97]/15 select-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#CFAC62]/50"
                  >
                    <svg className="w-4.5 h-4.5 shrink-0 animate-pulse-slow" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.183-2.773-6.183-6.183 0-3.41 2.773-6.183 6.183-6.183 1.482 0 2.851.524 3.921 1.405l3.18-3.18C18.995 2.053 15.82 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.826 0 10.741-4.204 11.202-9.782h-11.2v-3.413h.238z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.442 12.24c0-.825-.075-1.613-.197-2.385H12.24v4.545h6.314c-.27 1.439-1.082 2.658-2.298 3.473v2.887h3.722c2.18-2.003 3.464-4.949 3.464-8.52z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M12.24 23.48c3.09 0 5.67-1.025 7.56-2.793l-3.722-2.887c-1.025.688-2.33 1.096-3.838 1.096-2.95 0-5.45-1.99-6.346-4.665H2.072v3.011C4.015 21.08 7.857 23.48 12.24 23.48z"
                      />
                      <path
                        fill="#34A853"
                        d="M5.894 14.23a6.764 6.764 0 0 1 0-4.321V6.898H2.072a11.232 11.232 0 0 0 0 10.343l3.822-3.011z"
                      />
                    </svg>
                    <span>Continuar com Google</span>
                  </button>

                  {showDevOptions && (
                    <button
                      type="button"
                      onClick={handleGuestLogin}
                      disabled={loading}
                      className="bg-[#1D5C97]/10 hover:bg-[#1D5C97]/15 active:scale-95 text-[#1D5C97] font-bold text-[11px] py-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-center space-x-1.5 shadow-3xs border border-[#1D5C97]/10 select-none disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                    >
                      <span className="text-xs">👤</span>
                      <span>Modo de Demonstração</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 flex flex-col justify-center items-center w-full">
                  <button
                    type="button"
                    onClick={onNavigateToVerify}
                    className="text-slate-400 hover:text-[#1D5C97] text-[10px] font-bold tracking-wide py-1 transition-all cursor-pointer flex items-center justify-center space-x-1.5 hover:underline select-none"
                  >
                    <span>🎓 Confirmar Certificado de Conclusão Público</span>
                  </button>
                </div>
              </div>
            )}

            {/* BENTO GRAPHICS / ICON BADGES */}
            <div className="relative flex justify-center items-center gap-4 py-2 mt-2 w-full select-none">
              {/* Particle stars */}
              <span className="absolute left-6 top-1 text-[11px] text-[#CFAC62] animate-pulse">✦</span>
              <span className="absolute right-8 bottom-0 text-[11px] text-[#2872B5] animate-pulse">✦</span>
              <span className="absolute left-1/4 bottom-2 text-[10px] text-[#CFAC62]/60 animate-pulse">✧</span>
              <span className="absolute right-1/4 top-3 text-[10px] text-[#1D5C97]/40 animate-pulse">✧</span>

              {/* Trophy Circle - Luxury brass style */}
              <div 
                title="Sua Jornada de Ouro"
                className="w-10 h-10 rounded-full bg-[#FAF9F5] text-[#CFAC62] border border-[#CFAC62]/35 flex items-center justify-center shadow-sm transform hover:scale-110 hover:rotate-6 transition-all duration-300"
              >
                <Trophy className="w-5 h-5 text-[#CFAC62]" />
              </div>

              {/* Heart Circle - Soft crimson */}
              <div 
                title="Focado em Conversação"
                className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/25 flex items-center justify-center shadow-sm transform hover:scale-110 hover:-rotate-6 transition-all duration-300"
              >
                <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
              </div>

              {/* Rocket Circle - Elite green */}
              <div 
                title="Resultados Acelerados"
                className="w-10 h-10 rounded-full bg-[#1D5C97]/10 text-[#1D5C97] border border-[#1D5C97]/25 flex items-center justify-center shadow-sm transform hover:scale-110 hover:rotate-6 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 text-[#1D5C97]" />
              </div>

              {/* BookOpen Circle - Academic ink */}
              <div 
                title="Currículo Estruturado"
                className="w-10 h-10 rounded-full bg-slate-900/5 text-slate-800 border border-slate-900/15 flex items-center justify-center shadow-sm transform hover:scale-110 hover:-rotate-6 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 text-slate-800" />
              </div>
            </div>

          </div>

          {/* Invisible Recaptcha Area */}
          <div 
            key={`recaptcha-${authMethod}-${recaptchaResetIndex}`}
            id="recaptcha-container" 
            className="fixed bottom-0 right-0 z-[9999] pointer-events-none w-0 h-0 opacity-0" 
          />

        </div>
      </div>

      {/* GOOGLE AUTH SANDBOX SIMULATOR MODAL */}
      {showGoogleSandboxSimulator && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[10000] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-[#FAF9F5] border border-[#CFAC62]/35 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-left space-y-5 my-8">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className="bg-[#CFAC62]/20 text-[#1D5C97] border border-[#CFAC62]/30 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider block w-max select-none">
                  Ambiente de Teste (AI Studio)
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1D5C97] tracking-tight">
                  🔌 Simulador de Entrada do Google
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleSandboxSimulator(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Explanation */}
            <div className="text-[12px] text-slate-700 leading-relaxed space-y-2.5 bg-amber-50/60 border border-amber-200/40 p-4 rounded-2xl">
              <p>
                <strong>O que aconteceu?</strong> O Firebase retornou um erro de <code className="bg-amber-100/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-amber-900 font-bold">auth/unauthorized-domain</code>.
              </p>
              <p>
                Isto é normal no ambiente de teste do AI Studio! Significa que o domínio de pré-visualização (<strong>{typeof window !== 'undefined' ? window.location.hostname : 'run.app'}</strong>) ainda não está registado nas configurações do seu projeto Firebase.
              </p>
            </div>

            {/* How to fix permanently */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#1D5C97] uppercase tracking-wider select-none">
                🛠️ Como resolver no Firebase (Produção)
              </h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Para que o login com o Google real funcione neste domínio, aceda a:
                <br />
                <a 
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId || 'sabush-english-club-8fddd'}/authentication/settings`}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#CFAC62] font-bold underline hover:text-[#1D5C97]"
                >
                  Consola Firebase &gt; Authentication &gt; Settings &gt; Authorized domains
                </a>
              </p>
              <div className="space-y-2 bg-slate-900 text-slate-100 p-3.5 rounded-2xl font-mono text-[10.5px] border border-slate-800">
                <span className="text-slate-400 text-[9.5px] uppercase font-bold block border-b border-slate-800 pb-1.5 mb-1.5 select-none">
                  Adicione estes domínios ao Firebase:
                </span>
                {[
                  'aistudio.google.com',
                  'ais-dev-tzgs5o34sl2niugeeg2f4s-926917621799.europe-west2.run.app',
                  'ais-pre-tzgs5o34sl2niugeeg2f4s-926917621799.europe-west2.run.app'
                ].map((dom) => (
                  <div key={dom} className="flex items-center justify-between gap-2.5 py-1">
                    <span className="truncate select-all text-emerald-400">{dom}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(dom)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wide shrink-0 transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedText === dom ? 'Copiado! ✓' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated options */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-[#1D5C97] uppercase tracking-wider select-none">
                ⚡ Continuar Imediatamente (Simulador Google)
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleLogin('sabushagency@gmail.com', 'Sabush Agency Admin')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left transition-all hover:border-[#CFAC62]/60 hover:shadow-xs cursor-pointer"
                >
                  <div className="font-bold text-xs text-[#1D5C97]">Sabush Agency Admin</div>
                  <div className="text-[10px] text-slate-400 truncate">sabushagency@gmail.com</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleLogin('visitante@sabush.club', 'Aluno Convidado')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left transition-all hover:border-[#CFAC62]/60 hover:shadow-xs cursor-pointer"
                >
                  <div className="font-bold text-xs text-[#1D5C97]">Aluno Convidado</div>
                  <div className="text-[10px] text-slate-400 truncate">visitante@sabush.club</div>
                </button>
              </div>

              {/* Custom simulated inputs */}
              <div className="space-y-2 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl mt-1 text-slate-800">
                <span className="text-[10.5px] font-bold text-slate-500 block select-none">Ou personalizar conta de teste:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    placeholder="Nome"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#CFAC62]"
                  />
                  <input
                    type="email"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    placeholder="E-mail"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#CFAC62]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleLogin(simEmail, simName)}
                  className="w-full bg-[#1D5C97] hover:bg-[#153E68] text-[#FAF9F5] font-bold text-xs py-2 rounded-xl mt-1 cursor-pointer transition-all uppercase tracking-wider text-center"
                >
                  Entrar com Conta Personalizada
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER AREA - DESIGN REFINED BOX */}
      <div className="py-5 border-t border-[#1D5C97]/5 text-center text-[10.5px] text-[#556059] space-y-1.5 z-10 w-full shrink-0">
        <p className="font-bold text-[#1D5C97] flex items-center justify-center gap-1.5 select-none uppercase tracking-wider text-[9.5px]">
          <ShieldCheck className="w-4 h-4 text-[#CFAC62]" />
          <span>Interface em Português para facilitar os seus estudos</span>
        </p>
        <p className="text-slate-400 font-medium font-sans">A taxa de envio de SMS é coberta integralmente pela Sabush Agency.</p>
      </div>
    </div>
  );
}
