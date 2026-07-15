import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { auth, saveUserProfile, getUserProfile } from '../firebase';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { Mail, Lock, Loader2, Trophy, Heart, Rocket, BookOpen, ShieldCheck } from 'lucide-react';
import { EnglishLevel } from '../types';

// @ts-ignore
import sabushLogoFlags from '../assets/images/sabush_logo_flags_1781360603744.jpg';

interface AuthPageProps {
  onAuthSuccess: (userId: string, isNewUser: boolean) => void;
  onNavigateToVerify: () => void;
}

export function AuthPage({ onAuthSuccess, onNavigateToVerify }: AuthPageProps) {
  // Sub-tabs for email: 'login' | 'signup'
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('login');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  // Clean error on toggling sign in / sign up mode
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
  }, [emailMode]);

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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1F6F4B_0%,_#0E3A28_45%,_#081F16_100%)] text-slate-800 flex flex-col justify-between p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Radiant gold and emerald ambient glows on the dark green backdrop */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#CFAC62]/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full border border-[#CFAC62]/20 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-64 h-64 bg-[#2E8F63]/30 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#1F6F4B]/25 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Ribbon Accent at Top of screen - emerald to gold silk thread */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0E3A28] via-[#CFAC62] to-[#1F6F4B] z-50" />

      <div className="flex-1 flex flex-col justify-center items-center py-4 z-10 w-full animate-fade-in">
        {/* Main luxury responsive card */}
        <div className="w-full max-w-[442px] bg-white rounded-[38px] shadow-[0_24px_70px_rgba(29,62,36,0.06)] overflow-hidden border border-[#CFAC62]/15 flex flex-col relative transition-all duration-300 hover:shadow-[0_32px_90px_rgba(29,62,36,0.09)]">
          
          {/* CURVED ACADEMIA HEADER */}
          <div className="relative bg-gradient-to-b from-[#153E68] to-[#1D5C97] h-[210px] w-full overflow-hidden border-b border-[#CFAC62]/20 flex flex-col items-center justify-center shrink-0">
            {/* Subtle decorative gold-toned geometric circle overlays for luxury texture */}
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#CFAC62_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border border-[#CFAC62]/25" />
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br from-[#CFAC62]/15 to-transparent rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tl from-[#CFAC62]/10 to-transparent rounded-full blur-2xl" />

            {/* Gold hairline above the eyebrow */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-px bg-[#CFAC62]/60" />

            {/* Premium Typography Badge heading on Dark Header */}
            <div className="text-center z-10 -mt-6 px-4">
              <span className="font-display text-[9px] uppercase tracking-[0.34em] text-[#CFAC62] font-semibold block mb-1 drop-shadow-xs">Bem-vindo ao Prestigiado</span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#FAF9F5] uppercase tracking-[0.12em] drop-shadow-sm select-none">
                SABUSH
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="w-4 h-px bg-[#CFAC62]/70 inline-block" />
                <span className="text-[#CFAC62]/90 font-serif italic text-xs tracking-wider">English Club</span>
                <span className="w-4 h-px bg-[#CFAC62]/70 inline-block" />
              </div>
            </div>
            
            {/* Absolute overlapping gold-rimmed medallion container */}
            <div 
              onClick={handleLogoClick}
              title="Clique 5 vezes para alternar opções de desenvolvimento"
              className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[3px] border-[#FAF9F5] bg-white shadow-[0_0_0_4px_#0A2A4A,0_0_0_5px_rgba(217,184,106,0.45),0_12px_28px_rgba(10,42,74,0.25)] flex items-center justify-center overflow-hidden p-3 z-20 hover:scale-105 hover:border-[#CFAC62] transition-all duration-350 cursor-pointer"
            >
              {/* Laurel accents flanking the medallion */}
              <svg className="absolute -left-8 top-1/2 -translate-y-1/2 w-9 h-16 opacity-70 pointer-events-none" viewBox="0 0 36 64" aria-hidden="true">
                <path d="M28 8 Q34 24 26 34 Q30 24 20 16" fill="none" stroke="#CFAC62" strokeWidth="1.5" />
                <path d="M28 44 Q34 28 26 20" fill="none" stroke="#CFAC62" strokeWidth="1.5" opacity="0.6" />
              </svg>
              <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-9 h-16 opacity-70 pointer-events-none" viewBox="0 0 36 64" aria-hidden="true">
                <path d="M8 8 Q2 24 10 34 Q6 24 16 16" fill="none" stroke="#CFAC62" strokeWidth="1.5" />
                <path d="M8 44 Q2 28 10 20" fill="none" stroke="#CFAC62" strokeWidth="1.5" opacity="0.6" />
              </svg>
              <img 
                src={sabushLogoFlags} 
                alt="Sabush English Club Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* CARD BODY CONTENT */}
          <div className="p-6 md:p-7 pt-16 space-y-5 flex flex-col items-center shrink-0">
            
            {/* PRESTIGIOUS CREDENTIAL BADGE */}
            <div className="flex items-center justify-center w-full">
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
                {(showDevOptions || isSandboxEnvironment) && (
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

            {/* EMAIL / PASSWORD FORM */}
            <>
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
            </>

            {/* SEPARATOR AND ALTERNATIVE ACTION BUTTONS */}
            {(
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
        <p className="text-slate-400 font-medium font-sans">Aprende inglês com o apoio da Sabush Agency.</p>
      </div>
    </div>
  );
}
