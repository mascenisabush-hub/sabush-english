/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
// Import the generated premium branding banner asset
// @ts-ignore
import sabushBanner from '../assets/images/sabush_banner_1781359379070.jpg';

interface SabushLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onDark?: boolean;
}

// Global cached variables to share single Firestore listener across all component instances
let globalLogoUrl: string | null = null;
const globalListeners: Set<(url: string | null) => void> = new Set();
let unsubscribeGlobal: (() => void) | null = null;

function subscribeGlobal() {
  if (unsubscribeGlobal) return;
  try {
    unsubscribeGlobal = onSnapshot(doc(db, 'clubSettings', 'branding'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        globalLogoUrl = data?.logoUrl || null;
      } else {
        globalLogoUrl = null;
      }
      globalListeners.forEach(listener => listener(globalLogoUrl));
    }, (error) => {
      console.debug("Benign: error listening to branding logo settings (regular users do not have branding collection permissions):", error);
    });
  } catch (err) {
    console.debug("Benign: Could not establish branding logo listener", err);
  }
}

function unsubscribeIfNeeded() {
  if (globalListeners.size === 0 && unsubscribeGlobal) {
    unsubscribeGlobal();
    unsubscribeGlobal = null;
  }
}

export function SabushLogo({ size = 'md', className = '', onDark = true }: SabushLogoProps) {
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(globalLogoUrl);
  const [lowDataMode, setLowDataMode] = useState(() => localStorage.getItem('lowDataMode') === 'true');

  useEffect(() => {
    // Synchronize initial component state with current global cache value
    setCurrentLogoUrl(globalLogoUrl);

    const handleUpdate = (url: string | null) => {
      setCurrentLogoUrl(url);
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

  // Setup sizing classes depending on the requested logo size
  const sizeClasses = {
    sm: 'h-10 w-auto rounded-lg border border-brand-red-500 hover:scale-105 transition-all shadow-sm',
    md: 'w-48 rounded-xl border-2 border-brand-red-650 hover:scale-102 transition-all shadow-md',
    lg: 'w-full max-w-[340px] rounded-2xl border-2 border-brand-red-650 hover:scale-102 transition-all shadow-lg',
    xl: 'w-full max-w-sm rounded-[24px] border-2 border-brand-red-650 hover:scale-101 transition-all shadow-xl',
  };

  const borderContrast = onDark 
    ? 'border-brand-red-500' 
    : 'border-brand-red-650 shadow-md';

  const logoSrc = lowDataMode ? sabushBanner : (currentLogoUrl || sabushBanner);

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Sabush English Club Official Banner"
        referrerPolicy="no-referrer"
        className={`object-cover ${sizeClasses[size]} ${borderContrast}`}
      />
    </div>
  );
}
