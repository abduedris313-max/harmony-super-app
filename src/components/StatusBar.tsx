/**
 * @file StatusBar.tsx
 * @description iOS 18 style Top Status Bar and Dynamic Island for Harmony OS Super App.
 */

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging, Flame, Disc, Sparkles, SlidersHorizontal, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HarmonyLogo } from './HarmonyLogo';

interface StatusBarProps {
  onOpenControlCenter: () => void;
  activeMusicTrack?: string;
  isAiThinking?: boolean;
  isFirebaseConnected?: boolean;
  focusMode?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  onOpenControlCenter,
  activeMusicTrack,
  isAiThinking,
  isFirebaseConnected = true,
  focusMode = false,
  isDarkMode = true,
  onToggleTheme
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="status-bar" 
      className={`w-full h-8 px-3.5 flex items-center justify-between text-[11px] font-semibold z-40 relative backdrop-blur-md select-none border-b transition-colors ${
        isDarkMode
          ? 'bg-[#0d1117]/80 text-[#c9d1d9] border-[#30363d]'
          : 'bg-white/85 text-neutral-800 border-neutral-200/80 shadow-xs'
      }`}
    >
      {/* Time Display & Focus Indicator */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenControlCenter} title="Harmony System Control">
        <HarmonyLogo size="xs" isDarkMode={isDarkMode} />
        <span className={`font-bold tracking-tight text-xs ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
          {timeStr || '9:41'}
        </span>

        {/* iOS Focus Mode Moon Badge */}
        {focusMode && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 dark:text-indigo-300 text-[9px] border border-indigo-500/30 animate-fade-in font-medium">
            <Moon className="w-2.5 h-2.5 fill-indigo-400 text-indigo-400" />
            <span className="hidden xs:inline">Focus</span>
          </span>
        )}

        {isFirebaseConnected && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[9px] border border-amber-500/30">
            <Flame className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Firebase</span>
          </span>
        )}
      </div>

      {/* Dynamic Island Pill */}
      <motion.div 
        onClick={onOpenControlCenter}
        className="cursor-pointer"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {activeMusicTrack ? (
            <motion.div
              key="music-pill"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="px-2.5 py-0.5 bg-neutral-900/90 border border-neutral-700/80 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xl"
            >
              <Disc className="w-3 h-3 text-fuchsia-400 animate-spin" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate text-[10px] text-fuchsia-200 font-medium">
                {activeMusicTrack}
              </span>
            </motion.div>
          ) : isAiThinking ? (
            <motion.div
              key="ai-pill"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="px-2.5 py-0.5 bg-purple-950/80 border border-purple-500/50 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-xl"
            >
              <Sparkles className="w-3 h-3 text-purple-300 animate-bounce" />
              <span className="text-[10px] text-purple-200 font-medium">AI Thinking...</span>
            </motion.div>
          ) : (
            <motion.div
              key="default-island"
              className={`h-4 w-20 rounded-full border flex items-center justify-center gap-1 shadow-inner ${
                isDarkMode ? 'bg-black/80 border-neutral-800/80' : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400/80"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600/60"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Battery, Wifi, Quick Theme & Control Center Toggle Button */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {onToggleTheme && (
          <button
            id="btn-quick-theme-toggle"
            onClick={onToggleTheme}
            className={`p-1 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
              isDarkMode
                ? 'hover:bg-white/10 text-amber-300 hover:text-amber-200'
                : 'hover:bg-neutral-200 text-amber-600 hover:text-amber-700'
            }`}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        )}
        <Wifi className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white/80' : 'text-neutral-700'}`} />
        <div className="flex items-center gap-1 text-[11px] text-emerald-500">
          <span className="font-mono text-[10px] hidden sm:inline">100%</span>
          <BatteryCharging className="w-4 h-4 text-emerald-500" />
        </div>
        <button
          id="btn-control-center-trigger"
          onClick={onOpenControlCenter}
          className={`p-1 rounded-full transition-transform active:scale-90 ${
            isDarkMode ? 'hover:bg-white/10 text-white/90' : 'hover:bg-neutral-200 text-neutral-800'
          }`}
          title="Open Control Center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
