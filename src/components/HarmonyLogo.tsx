/**
 * @file HarmonyLogo.tsx
 * @description Official luxury icon & logo component for Harmony.
 * Features the custom generated high-res squircle icon with graceful vector SVG fallbacks,
 * subtle specular highlights, and responsive sizes.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HarmonyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
  subtitle?: string;
  isDarkMode?: boolean;
}

export const HarmonyLogo: React.FC<HarmonyLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  onClick,
  subtitle,
  isDarkMode = true
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeDimensions = {
    xs: { icon: 'w-5 h-5', rounded: 'rounded-md', text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-7 h-7', rounded: 'rounded-[8px]', text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', rounded: 'rounded-[10px]', text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', rounded: 'rounded-[14px]', text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', rounded: 'rounded-[18px]', text: 'text-2xl', sub: 'text-sm' },
  }[size];

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Icon Squircle Container */}
      <motion.div
        whileHover={onClick ? { scale: 1.05 } : undefined}
        whileTap={onClick ? { scale: 0.95 } : undefined}
        className={`relative ${sizeDimensions.icon} ${sizeDimensions.rounded} overflow-hidden shadow-lg shadow-indigo-950/30 border border-white/20 shrink-0 bg-neutral-900 group`}
      >
        {!imgError ? (
          <img
            src="./harmony-logo.jpg"
            alt="Harmony"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-end vector SVG fallback if image is loading or unavailable */
          <div className="w-full h-full bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] flex items-center justify-center relative overflow-hidden">
            {/* Glowing radial background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.4),transparent_60%)]" />
            <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white" fill="none">
              <defs>
                <linearGradient id="harm-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
                <linearGradient id="harm-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              {/* Harmonized interlocking infinite wave rings forming an H */}
              <circle cx="50" cy="50" r="38" stroke="url(#harm-grad-1)" strokeWidth="4" strokeOpacity="0.4" />
              <path
                d="M32 28 V72 M68 28 V72 M32 50 C42 42, 58 58, 68 50"
                stroke="url(#harm-grad-2)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
            </svg>
          </div>
        )}

        {/* Specular gloss reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />
      </motion.div>

      {/* Typography Label */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight ${sizeDimensions.text} ${
              isDarkMode 
                ? 'text-white' 
                : 'text-neutral-900'
            }`}>
              Harmony
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          {subtitle && (
            <span className={`${sizeDimensions.sub} font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
