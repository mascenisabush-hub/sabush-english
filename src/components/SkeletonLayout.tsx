/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Users, 
  User, 
  Flame, 
  Award,
  Sparkles
} from 'lucide-react';

export function SkeletonLayout() {
  const bottomItems = [
    { label: 'Início', icon: Home },
    { label: 'Aulas', icon: BookOpen },
    { label: 'AI Tutor', icon: MessageSquare },
    { label: 'Grupos', icon: Users },
    { label: 'Conta', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row antialiased max-w-md md:max-w-6xl lg:max-w-7xl mx-auto relative border-x border-slate-200 shadow-xl overflow-hidden">
      
      {/* SIDEBAR SKELETON (Tablet/Desktop) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-brand-navy-800 text-slate-300 border-r-2 border-brand-red-650 sticky top-0 h-screen shrink-0 select-none z-30 transition-all shadow-md">
        {/* Brand Header */}
        <div className="p-5 border-b border-brand-navy-900 flex flex-col items-center justify-center space-y-3 bg-brand-navy-850">
          <div className="w-36 h-12 bg-slate-700/50 rounded-xl animate-pulse" />
          <div className="w-24 h-5 bg-slate-700/50 rounded-full animate-pulse" />
        </div>

        {/* Shimmer Stats */}
        <div className="px-4 py-3 border-b border-brand-navy-900 bg-brand-navy-800/50 flex flex-col gap-2">
          <div className="h-9 bg-slate-700/30 rounded-xl animate-pulse w-full" />
          <div className="h-9 bg-slate-700/30 rounded-xl animate-pulse w-full" />
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 px-4.5 py-4 overflow-y-auto space-y-1 scrollbar-none">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-slate-700/30 rounded-xl animate-pulse w-full" />
          ))}
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen relative bg-slate-50">
        
        {/* Mobile Header Skeleton */}
        <header className="md:hidden bg-[#0f172a] text-white px-5 py-4.5 flex items-center justify-between border-b border-brand-navy-950 shadow-md sticky top-0 z-30">
          <div className="w-24 h-6 bg-slate-700/50 rounded-lg animate-pulse" />
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-6 bg-slate-700/55 rounded-full animate-pulse" />
            <div className="w-14 h-6 bg-slate-700/55 rounded-full animate-pulse" />
          </div>
        </header>

        {/* MAIN BODY SKELETON */}
        <main className="flex-1 pb-24 md:pb-12 overflow-y-auto px-4.5 py-5 bg-slate-50 flex flex-col justify-between">
          
          <div className="space-y-6 flex-1">
            {/* Shimmer Welcome Banner / Promo */}
            <div className="bg-brand-navy-800 rounded-3xl p-5 sm:p-7 border border-brand-navy-900 shadow-md animate-pulse">
              <div className="h-6 bg-slate-700/50 rounded-md w-2/3 mb-3" />
              <div className="h-4 bg-slate-700/40 rounded-md w-full mb-2" />
              <div className="h-4 bg-slate-700/40 rounded-md w-5/6" />
            </div>

            {/* Shimmer Section Title */}
            <div className="flex justify-between items-center px-0.5">
              <div className="h-5 bg-slate-300 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
            </div>

            {/* Shimmer Grid Items / Lesson Cards */}
            <div className="grid grid-cols-1 gap-4.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-pulse">
                  <div className="flex items-center space-x-3.5 flex-1">
                    <div className="w-11 h-11 bg-slate-200 rounded-xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-5/6" />
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-slate-150 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Shimmer Footer */}
          <footer className="mt-8 text-center text-slate-400 text-[10px] animate-pulse">
            Carregando o painel principal do Sabush Club...
          </footer>
        </main>

        {/* MOBILE BOTTOM NAVIGATION SKELETON */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] text-slate-400 border-t border-brand-navy-950 flex justify-around items-center h-16 px-2.5 z-40 shadow-2xl">
          {bottomItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center space-y-1 py-1 px-2.5 animate-pulse">
                <Icon className="w-5 h-5 text-slate-600" />
                <span className="text-[9px] font-black text-slate-600">{item.label}</span>
              </div>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
