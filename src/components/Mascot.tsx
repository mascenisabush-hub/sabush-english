/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface MascotProps {
  expression?: 'happy' | 'thinking' | 'talking' | 'standard';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onDark?: boolean; // Enable contrast styling for dark vs light backgrounds
}

// Global cached variables to share single Firestore listener across all component instances
let globalMascotImages: Record<string, string> = {};
const globalListeners: Set<(images: Record<string, string>) => void> = new Set();
let unsubscribeGlobal: (() => void) | null = null;

function subscribeGlobal() {
  if (unsubscribeGlobal) return;
  try {
    unsubscribeGlobal = onSnapshot(doc(db, 'clubSettings', 'branding'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        globalMascotImages = data?.mascotImages || {};
      } else {
        globalMascotImages = {};
      }
      globalListeners.forEach(listener => listener(globalMascotImages));
    }, (error) => {
      console.debug("Benign: error listening to branding mascot settings (regular users do not have branding collection permissions):", error);
    });
  } catch (err) {
    console.debug("Benign: Could not establish branding mascot listener", err);
  }
}

function unsubscribeIfNeeded() {
  if (globalListeners.size === 0 && unsubscribeGlobal) {
    unsubscribeGlobal();
    unsubscribeGlobal = null;
  }
}

function renderDefaultMascotSvg(expression: 'standard' | 'happy' | 'thinking' | 'talking') {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft glow or shield shadow */}
      <circle cx="50" cy="50" r="46" fill="#F8FAFC" />
      
      {/* Outer brand circle with Mozambican & British color patterns */}
      <circle cx="50" cy="50" r="42" fill="#1B2A4A" stroke="#D4AF37" strokeWidth="2.5" />
      
      {/* Red accent ribbon at the bottom of outer circle */}
      <path d="M 18 73 A 42 42 0 0 0 82 73 Z" fill="#DC2626" opacity="0.85" />
      
      {/* Lion mane (gold clouds) */}
      <path 
        d="M 50 16 
           C 42 16, 36 21, 36 29 
           C 27 29, 21 37, 21 46 
           C 21 55, 27 63, 36 63 
           C 36 71, 42 76, 50 76 
           C 58 76, 64 71, 64 63 
           C 73 63, 79 55, 79 46 
           C 79 37, 73 29, 64 29 
           C 64 21, 58 16, 50 16 Z" 
        fill="#F1C40F" 
        stroke="#D4AF37" 
        strokeWidth="1.5" 
      />
      
      {/* Inner lion face (warm peachy) */}
      <circle cx="50" cy="48" r="23" fill="#FDEBD0" stroke="#E59866" strokeWidth="1.2" />
      
      {/* Lion ears */}
      <circle cx="32" cy="28" r="6" fill="#F1C40F" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="32" cy="28" r="3.5" fill="#FDEBD0" />
      <circle cx="68" cy="28" r="6" fill="#F1C40F" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="68" cy="28" r="3.5" fill="#FDEBD0" />
      
      {/* Academic/Scholarly Cap */}
      <polygon points="50,13 71,20 50,27 29,20" fill="#111827" stroke="#F1C40F" strokeWidth="0.8" />
      <rect x="45" y="22" width="10" height="5" fill="#111827" />
      <line x1="50" y1="20" x2="65" y2="25" stroke="#F1C40F" strokeWidth="1" />
      <circle cx="65" cy="25" r="1.5" fill="#F1C40F" />
      
      {/* Cute blush cheeks */}
      <circle cx="36" cy="51" r="2.5" fill="#F87171" opacity="0.6" />
      <circle cx="64" cy="51" r="2.5" fill="#F87171" opacity="0.6" />
      
      {/* Lion nose */}
      <polygon points="48,46 52,46 50,48.5" fill="#D35400" />
      <line x1="50" y1="48.5" x2="50" y2="52" stroke="#D35400" strokeWidth="1" />

      {/* Expression rendering */}
      {expression === 'standard' && (
        <g>
          {/* Eyes */}
          <circle cx="39" cy="42" r="3" fill="#111827" />
          <circle cx="38" cy="40.5" r="0.9" fill="#FFFFFF" />
          <circle cx="61" cy="42" r="3" fill="#111827" />
          <circle cx="60" cy="40.5" r="0.9" fill="#FFFFFF" />
          {/* Mouth */}
          <path d="M 45 52 Q 50 56 55 52" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {expression === 'happy' && (
        <g>
          {/* Laughing curved eyes */}
          <path d="M 35 43 Q 39 38 43 43" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 57 43 Q 61 38 65 43" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
          {/* Wide open laughing mouth */}
          <path d="M 44 51 Q 50 59 56 51 Z" fill="#C0392B" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 47 54 Q 50 57 53 54" fill="#F87171" />
          {/* Floating celebratory confetti stars/dots */}
          <circle cx="14" cy="30" r="1.5" fill="#F1C40F" />
          <circle cx="23" cy="20" r="1.2" fill="#EF4444" />
          <circle cx="86" cy="33" r="1.5" fill="#3B82F6" />
          <circle cx="78" cy="18" r="1.2" fill="#F1C40F" />
        </g>
      )}

      {expression === 'thinking' && (
        <g>
          {/* Curious eyes, one raised eyebrow */}
          <circle cx="39" cy="41" r="3" fill="#111827" />
          <circle cx="38" cy="39.5" r="0.9" fill="#FFFFFF" />
          <circle cx="61" cy="39" r="3" fill="#111827" />
          <circle cx="60" cy="37.5" r="0.9" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 35 35 Q 39 34 43 36" fill="none" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 57 32 Q 61 30 65 33" fill="none" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
          {/* Thinking squiggly mouth */}
          <path d="M 45 52 Q 47.5 49 50 52 T 55 52" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cute paw resting on chin */}
          <path d="M 44 55 Q 41 62 45 64 Q 49 64 47 55" fill="#FDEBD0" stroke="#E59866" strokeWidth="1" />
          <circle cx="44.5" cy="61" r="0.6" fill="#E59866" />
          <circle cx="46.5" cy="61" r="0.6" fill="#E59866" />
          {/* Small glowing lightbulb of insight */}
          <g transform="translate(74, 8) scale(0.18)">
            <path d="M 50 20 C 35 20, 25 30, 25 45 C 25 55, 32 62, 35 68 L 35 78 C 35 80, 37 82, 40 82 L 60 82 C 63 82, 65 80, 65 78 L 65 68 C 68 62, 75 55, 75 45 C 75 30, 65 20, 50 20 Z" fill="#F1C40F" stroke="#D35400" strokeWidth="3" />
            <rect x="42" y="82" width="16" height="5" rx="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="10" stroke="#F1C40F" strokeWidth="3" strokeLinecap="round" />
            <line x1="25" y1="45" x2="15" y2="45" stroke="#F1C40F" strokeWidth="3" strokeLinecap="round" />
            <line x1="75" y1="45" x2="85" y2="45" stroke="#F1C40F" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      )}

      {expression === 'talking' && (
        <g>
          {/* Attentive eyes */}
          <circle cx="39" cy="42" r="3" fill="#111827" />
          <circle cx="38" cy="40.5" r="0.9" fill="#FFFFFF" />
          <circle cx="61" cy="42" r="3" fill="#111827" />
          <circle cx="60" cy="40.5" r="0.9" fill="#FFFFFF" />
          {/* Rounded vocalizing mouth */}
          <ellipse cx="50" cy="53" rx="3.5" ry="5.5" fill="#111827" />
          <ellipse cx="50" cy="55.5" rx="2" ry="2.5" fill="#F87171" />
          {/* Golden expanding soundwave elements */}
          <path d="M 76 40 Q 80 46 76 52" fill="none" stroke="#F1C40F" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 80 35 Q 86 46 80 57" fill="none" stroke="#F1C40F" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        </g>
      )}
    </svg>
  );
}

export function Mascot({ expression = 'standard', size = 'md', className = '', onDark = false }: MascotProps) {
  const [images, setImages] = useState<Record<string, string>>(globalMascotImages);
  const [lowDataMode, setLowDataMode] = useState(() => localStorage.getItem('lowDataMode') === 'true');

  useEffect(() => {
    setImages(globalMascotImages);

    const handleUpdate = (updatedImages: Record<string, string>) => {
      setImages(updatedImages);
    };

    const handleLowDataModeChange = () => {
      setLowDataMode(localStorage.getItem('lowDataMode') === 'true');
    };

    globalListeners.add(handleUpdate);
    subscribeGlobal();
    
    window.addEventListener('lowDataModeChanged', handleLowDataModeChange);

    return () => {
      globalListeners.delete(handleUpdate);
      unsubscribeIfNeeded();
      window.removeEventListener('lowDataModeChanged', handleLowDataModeChange);
    };
  }, []);

  // Sizing definitions targeting containers to keep proportions beautiful
  const sizeClasses = {
    sm: 'h-10 w-10 rounded-lg',
    md: 'h-16 w-16 rounded-xl',
    lg: 'h-24 w-24 rounded-2xl',
    xl: 'h-32 w-32 rounded-3xl',
  };

  const borderStyle = onDark
    ? 'border border-brand-gold-500/50 bg-white shadow-md'
    : 'border border-slate-200 bg-white shadow-sm';

  const customUrl = lowDataMode ? null : images?.[expression];

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className} select-none shrink-0`}>
      <div 
        className={`${sizeClasses[size]} ${borderStyle} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105`}
      >
        {customUrl ? (
          <img
            src={customUrl}
            alt={`Mascote Sabush - ${expression}`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain"
          />
        ) : (
          renderDefaultMascotSvg(expression)
        )}
      </div>
    </div>
  );
}
