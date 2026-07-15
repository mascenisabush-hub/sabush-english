/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Compass, GraduationCap, Home, MessageSquare, Award, Flame, ArrowLeft, User, Sparkles, ShieldCheck, Users, MoreHorizontal, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { auth, FirebaseUserProfile } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  xp: number;
  streak: number;
  onGoBack?: () => void;
  canGoBack?: boolean;
  userProfile: FirebaseUserProfile | null;
}

export function Layout({ children, activeTab, setActiveTab, xp, streak, onGoBack, canGoBack, userProfile }: LayoutProps) {
  const isAdmin = auth.currentUser?.email === 'sabushagency@gmail.com';
  const isSubscribed = userProfile?.subscriptionStatus === 'Activo' || isAdmin;
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'confidence_path', label: '90 Dias 🦉', icon: Sparkles },
    { id: 'levels', label: 'Níveis', icon: Compass },
    { id: 'lessons', label: 'Aulas', icon: BookOpen },
    { id: 'gallery', label: 'Galeria', icon: Image },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'groups', label: 'Grupos', icon: Users },
    { id: 'progress', label: 'Crachás', icon: Award },
    { id: 'account', label: 'Minha Conta', icon: User },
  ];

  if (!isSubscribed) {
    navItems.push({ id: 'membro', label: 'Membro', icon: Sparkles });
  }

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  const primaryBottomItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'lessons', label: 'Aulas', icon: BookOpen },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'groups', label: 'Grupos', icon: Users },
    { id: 'account', label: 'Conta', icon: User },
  ];

  const moreItems = [
    { id: 'confidence_path', label: '90 Dias', icon: Sparkles },
    { id: 'levels', label: 'Níveis', icon: Compass },
    { id: 'gallery', label: 'Galeria', icon: Image },
    { id: 'progress', label: 'Crachás', icon: Award },
  ];

  if (!isSubscribed) {
    moreItems.push({ id: 'membro', label: 'Membro', icon: Sparkles });
  }

  if (isAdmin) {
    moreItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  const isMoreActive = moreItems.some(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row antialiased max-w-md md:max-w-6xl lg:max-w-7xl mx-auto relative border-x border-slate-200 shadow-xl">
      {/* 
         =========================================
         SIDEBAR: Persistent on Tablet & Desktop (>= md)
         =========================================
      */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-brand-navy-800 text-slate-300 border-r-2 border-brand-red-650 sticky top-0 h-screen shrink-0 select-none z-30 transition-all shadow-md">
        {/* Brand Header */}
        <div className="p-5 border-b border-brand-navy-900 flex flex-col items-center justify-center space-y-3 bg-brand-navy-850">
          <SabushLogo size="md" onDark={true} />
          <span className="text-[9px] text-[#ffffff] font-extrabold uppercase tracking-widest bg-brand-red-600 px-3 py-1 rounded-full border border-brand-red-500">
            Official Club 🇲🇿
          </span>
        </div>

        {/* Sync Stats: Streak and XP badges inside sidebar */}
        <div className="px-4 py-3 border-b border-brand-navy-900 bg-brand-navy-800/50 flex flex-col gap-2">
          {/* Flame streak */}
          <div className="flex items-center justify-between bg-brand-navy-700/80 text-brand-gold-300 px-3 py-2 rounded-xl text-xs font-bold border border-brand-red-500/10 shadow-sm">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Ofensiva</span>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 fill-brand-red-500 stroke-brand-red-650 animate-pulse" />
              <span>{streak}d</span>
            </div>
          </div>
          {/* XP badge */}
          <div className="flex items-center justify-between bg-brand-navy-700/80 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-brand-red-500/10 shadow-sm">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Pontuação</span>
            <div className="bg-brand-red-600 text-white px-2.5 py-0.5 rounded-lg text-xs font-extrabold shadow-sm border border-brand-red-500">
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Mozambique Flag Ribbon Accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-teal-600 via-brand-gold-400 to-red-600 animate-pulse" />

        {/* Main Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Soft pastel icon badges with saturated icons matching active item
            const badgeMap: Record<string, { bg: string; text: string }> = {
              home: { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-400 font-extrabold' },
              confidence_path: { bg: 'bg-amber-100 text-amber-700', text: 'text-amber-500 font-black' },
              lessons: { bg: 'bg-rose-50 text-rose-600', text: 'text-rose-450 font-extrabold' },
              chat: { bg: 'bg-purple-50 text-purple-600', text: 'text-purple-400 font-extrabold' },
              groups: { bg: 'bg-orange-50 text-orange-600', text: 'text-orange-450 font-extrabold' },
              account: { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-400 font-extrabold' },
              levels: { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-400 font-extrabold' },
              gallery: { bg: 'bg-yellow-50 text-yellow-650', text: 'text-yellow-400 font-extrabold' },
              progress: { bg: 'bg-amber-50 text-amber-600', text: 'text-amber-400 font-extrabold' },
              membro: { bg: 'bg-indigo-50 text-indigo-650', text: 'text-indigo-400 font-extrabold' },
              admin: { bg: 'bg-slate-200 text-slate-800', text: 'text-slate-400 font-extrabold' },
            };
            
            const badge = badgeMap[item.id] || { bg: 'bg-slate-800 text-slate-300', text: 'text-slate-450' };

            // Real-looking colored icons with high contrast, colored strokes and fills!
            const iconStyleMap: Record<string, string> = {
              home: 'text-blue-600 fill-blue-200',
              confidence_path: 'text-amber-600 fill-amber-300',
              lessons: 'text-rose-600 fill-rose-200',
              chat: 'text-purple-600 fill-purple-200',
              groups: 'text-orange-600 fill-orange-200',
              account: 'text-emerald-600 fill-emerald-200',
              levels: 'text-blue-600 fill-blue-200',
              gallery: 'text-yellow-600 fill-yellow-200',
              progress: 'text-amber-600 fill-amber-300',
              membro: 'text-indigo-600 fill-indigo-200',
              admin: 'text-slate-700 fill-slate-300',
            };

            const iconClass = iconStyleMap[item.id] || 'text-slate-500 fill-slate-200';
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-2xl transition-all duration-200 select-none cursor-pointer text-left relative ${
                  isActive 
                    ? 'text-white font-bold bg-brand-navy-700/60 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-brand-navy-700/30'
                }`}
              >
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-colors ${
                  isActive ? badge.bg : 'bg-brand-navy-800/80 text-slate-400'
                }`}>
                  <Icon className={`w-5 h-5 stroke-[2.2px] ${iconClass}`} />
                </div>
                <span className="text-xs mt-0.5 font-bold tracking-tight truncate leading-none">{item.label}</span>
                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-brand-red-500 rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Mini Footer with contacts */}
        <div className="p-4 border-t border-brand-navy-900 bg-brand-navy-850 text-center text-slate-500 text-[10px]">
          <p className="font-extrabold text-brand-red-400">Sabush English Club</p>
          <p className="mt-1">Moçambique, Maputo</p>
        </div>
      </aside>

      {/* 
         =========================================
         MAIN AREA: Mobile & Desktop Wrappers
         =========================================
      */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen relative bg-slate-50">
        
        {/* Sticky Header is visible ONLY on mobile (hidden on md) with a smooth blue gradient */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 text-white px-4 py-3 flex items-center justify-between border-b border-blue-900/10 shadow-md md:hidden">
          <div className="flex items-center space-x-2">
            {canGoBack && onGoBack && (
              <button
                onClick={onGoBack}
                className="p-1 hover:bg-brand-navy-700/80 active:bg-brand-navy-900 rounded-xl text-brand-gold-400 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
                title="Voltar para a página anterior"
                aria-label="Voltar para a página anterior"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
              </button>
            )}
            <div className="flex items-center">
              <SabushLogo size="sm" />
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="flex items-center space-x-1 bg-brand-navy-700/80 text-brand-gold-300 px-2 py-1 rounded-xl text-xs font-bold border border-brand-red-500/20 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-brand-red-500 stroke-brand-red-650 animate-pulse" />
              <span>{streak}d</span>
            </div>
            <div className="flex items-center space-x-1 bg-brand-red-600 text-white px-2.5 py-1 rounded-xl text-xs font-extrabold shadow-sm border border-brand-red-500">
              <span>{xp} XP</span>
            </div>
          </div>
        </header>

        {/* Top ribbon only on mobile (hidden on md because we render it nicely) */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-600 via-brand-gold-400 to-red-600 md:hidden" />

        {/* Premium ribbon for Widescreen viewports at the very top of content pages */}
        <div className="hidden md:block h-1.5 w-full bg-gradient-to-r from-teal-600 via-brand-gold-400 to-red-600 shrink-0" />

        {/* Primary Scrollable Content Frame containing constrained centered container on md */}
        <main ref={mainRef} className="flex-1 pb-24 md:pb-12 overflow-y-auto px-4.5 py-5 bg-slate-50 flex flex-col justify-between">
          <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">
            <div>
              {canGoBack && onGoBack && (
                <button
                  onClick={onGoBack}
                  className="mb-4 inline-flex items-center space-x-1.5 text-brand-navy-800 hover:text-brand-navy-950 font-extrabold text-xs uppercase tracking-wider bg-slate-200/40 hover:bg-slate-200/75 border border-slate-200 px-3 py-2 rounded-2xl transition-all cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-4.5 h-4.5 stroke-[2.8]" />
                  <span>Voltar atrás</span>
                </button>
              )}
              {children}
            </div>

            {/* Dynamic Navigation Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200 text-center pb-6 space-y-3 shrink-0">
              <div className="flex flex-col items-center justify-center gap-2.5 text-xs font-semibold text-slate-500">
                <a 
                  href="mailto:sabushagency@gmail.com" 
                  className="inline-flex items-center space-x-1.5 hover:text-brand-red-600 transition-colors py-1 px-2 hover:bg-slate-100 rounded-lg min-h-[44px]"
                >
                  <span className="text-brand-red-500 text-sm">✉</span>
                  <span className="font-bold">sabushagency@gmail.com</span>
                </a>
                <a 
                  href="https://wa.me/258858624086" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-1.5 text-emerald-600 hover:text-emerald-700 transition-all py-1 px-3 hover:bg-emerald-50 rounded-lg border border-emerald-100 min-h-[44px]"
                >
                  <svg className="w-4.5 h-4.5 fill-emerald-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.189 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-10.799.002-3.116-1.192-6.049-3.363-8.222-2.172-2.172-5.061-3.366-8.177-3.367-6.381 0-11.574 5.136-11.577 11.454-.001 2.051.525 4.054 1.522 5.825l-.993 3.616 3.702-.958zm13.016-8.242c-.22-.11-.1.3-1.3-.292-.756-.379-.89-.426-1.173-.426-.282 0-.489.11-.71.379-.22.268-.844.837-.1.3-.968.126-.188.244-.459.379-.271.135-.53.078-.71-.053-.18-.13-.806-.264-1.536-.915-.567-.505-.989-1.116-1.1-.3-.103-.18-.012-.278.077-.168.08-.09.18-.328.271-.426.09-.1.124-.168.188-.3.064-.135.034-.244-.015-.353-.05-.11-.489-1.192-.676-1.631-.183-.439-.368-.379-.505-.379-.13 0-.282-.012-.422-.012s-.376.053-.572.268c-.198.22-.756.742-.756 1.808 0 1.066.768 2.094.877 2.24.11.147 1.511 2.33 3.661 3.27.51.22 1.144.35 1.513.39.463.04.887.02 1.22-.03.372-.05.14-.14 2.1-.8 1.4-.53 1.63-.45 1.8-.13.17.3.3.4.15.7z"/>
                  </svg>
                  <span className="font-extrabold">WhatsApp: 858624086</span>
                </a>
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-relaxed mt-2">
                © 2026 Sabush English Club <br /> Maputo, Moçambique
              </p>
            </footer>
          </div>
        </main>

        {/* AnimatePresence for the Mais menu */}
        <AnimatePresence>
          {isMoreOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="more-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMoreOpen(false)}
                className="fixed inset-0 bg-[#02050e]/75 backdrop-blur-sm z-45 md:hidden"
              />
              
              {/* More Floating Drawer */}
              <motion.div
                key="more-drawer"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                className="fixed bottom-[80px] left-3.5 right-3.5 bg-white border border-slate-200 rounded-3xl p-5 z-50 md:hidden shadow-[0_-10px_35px_rgba(10,25,50,0.12)] max-w-md mx-auto"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-navy-900 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full select-none">
                    ⭐ Mais Opções
                  </span>
                  <button
                    onClick={() => setIsMoreOpen(false)}
                    className="text-xs font-black text-brand-navy-900 hover:text-brand-red-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-1.5 px-3.5 rounded-full transition-colors cursor-pointer select-none"
                  >
                    Fechar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMoreOpen(false);
                        }}
                        className={`flex items-center space-x-3 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-brand-red-650 to-brand-red-600 text-white font-extrabold shadow-md border border-brand-red-500'
                            : 'bg-slate-50 hover:bg-slate-100 text-brand-navy-950 border border-slate-200/90'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-[#12284b]/40' : 'bg-slate-100'}`}>
                          <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5px] text-white' : 'stroke-[1.8px] text-brand-navy-900'}`} />
                        </div>
                        <span className={`text-xs font-black tracking-wide leading-none ${isActive ? 'text-white' : 'text-brand-navy-950'}`}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Redesigned 5-Tab Bottom Navigation for Mobile (Clean White Base & Colored Icons / Pastel Badges) - HIDDEN ON DESKTOP */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 px-1 py-1.5 flex justify-around items-center z-45 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:hidden">
          {primaryBottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Beautiful soft pastel background colors with a matching saturated color for the icon Badge
            const badgeStyleMap: Record<string, { bg: string; text: string }> = {
              home: { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-600' },
              lessons: { bg: 'bg-rose-50 text-rose-650', text: 'text-rose-650' },
              chat: { bg: 'bg-purple-50 text-purple-600', text: 'text-purple-650' },
              groups: { bg: 'bg-orange-50 text-orange-600', text: 'text-orange-650' },
              account: { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-650' },
            };
            
            const badge = badgeStyleMap[item.id] || { bg: 'bg-slate-100 text-slate-700', text: 'text-slate-500' };

            // Real-looking colored icons with high contrast, colored strokes and fills!
            const iconStyleMap: Record<string, string> = {
              home: 'text-blue-600 fill-blue-200',
              lessons: 'text-rose-600 fill-rose-200',
              chat: 'text-purple-600 fill-purple-200',
              groups: 'text-orange-600 fill-orange-200',
              account: 'text-emerald-600 fill-emerald-200',
            };

            const iconClass = iconStyleMap[item.id] || 'text-slate-500 fill-slate-200';
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMoreOpen(false);
                }}
                className="flex flex-col items-center justify-center flex-1 py-1 touch-manipulation cursor-pointer select-none"
              >
                <div className="relative flex flex-col items-center justify-center w-full">
                  <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive ? badge.bg : 'bg-transparent text-slate-400 hover:text-slate-600'
                  }`}>
                    <Icon className={`w-5.5 h-5.5 stroke-[2.2px] ${iconClass}`} />
                  </div>
                  <span className={`text-[9px] mt-1 z-10 font-bold tracking-tight text-center leading-none transition-colors duration-150 ${
                    isActive ? badge.text + ' font-black' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
