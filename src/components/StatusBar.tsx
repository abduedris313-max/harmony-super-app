/**
 * @file StatusBar.tsx
 * @description iOS 18 style Top Status Bar and Dynamic Island for Harmony OS Super App.
 */

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging, Flame, Disc, Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatusBarProps {
  onOpenControlCenter: () => void;
  activeMusicTrack?: string;
  isAiThinking?: boolean;
  isFirebaseConnected?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  onOpenControlCenter,
  activeMusicTrack,
  isAiThinking,
  isFirebaseConnected = true
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
      className="w-full h-8 px-3.5 flex items-center justify-between text-[11px] font-semibold text-[#c9d1d9] z-40 relative backdrop-blur-md bg-[#0d1117]/80 select-none border-b border-[#30363d]"
    >
      {/* Time Display */}
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={onOpenControlCenter}>
        <span className="font-bold tracking-tight text-xs text-white">{timeStr || '9:41'}</span>
        {isFirebaseConnected && (
          <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[9px] border border-amber-500/30">
            <Flame className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
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
              className="h-4 w-20 bg-black/80 rounded-full border border-neutral-800/80 flex items-center justify-center gap-1 shadow-inner"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400/80"></div>
              <div className="w-1 h-1 rounded-full bg-slate-600/60"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Battery, Wifi & Control Center Toggle Button */}
      <div className="flex items-center gap-3">
        <Wifi className="w-3.5 h-3.5 text-white/80" />
        <div className="flex items-center gap-1 text-[11px] text-emerald-400">
          <span className="font-mono text-[10px] hidden sm:inline">100%</span>
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
        </div>
        <button
          id="btn-control-center-trigger"
          onClick={onOpenControlCenter}
          className="p-1 rounded-full hover:bg-white/10 active:scale-90 transition-transform"
          title="Open Control Center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/90" />
        </button>
      </div>
    </div>
  );
};
