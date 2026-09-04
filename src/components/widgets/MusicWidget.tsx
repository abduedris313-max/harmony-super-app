/**
 * @file MusicWidget.tsx
 * @description iOS Smart Stack widget displaying the active track & audio playback controls.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Disc, ChevronRight, Play, Pause, Radio } from 'lucide-react';
import { Track } from '../../types';

interface MusicWidgetProps {
  currentTrack: Track | null;
  isPlayingMusic: boolean;
  onTogglePlayMusic: () => void;
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  currentTrack,
  isPlayingMusic,
  onTogglePlayMusic,
  onOpenApp,
  isDarkMode = true,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3.5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between min-h-[148px] ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-purple-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-purple-400 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-fuchsia-500 font-semibold text-[11px] tracking-wide">
          <Disc className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-spin-slow' : ''}`} />
          <span>HARMONY AUDIO</span>
        </div>
        <button
          onClick={() => onOpenApp('harmony-music-player')}
          className={`text-[11px] flex items-center gap-0.5 transition-colors font-medium ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Open <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Track info & Play/Pause */}
      <div className="my-1.5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 border border-white/20">
          🎵
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-xs truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            {currentTrack ? currentTrack.title : 'Ambient Study Waves'}
          </p>
          <p className={`text-[11px] truncate ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {currentTrack ? currentTrack.artist : 'Harmony Synth Stream'}
          </p>
        </div>
        <button
          onClick={onTogglePlayMusic}
          className="w-9 h-9 rounded-full bg-fuchsia-600 text-white flex items-center justify-center shadow-md hover:bg-fuchsia-500 active:scale-95 transition-transform shrink-0"
          aria-label={isPlayingMusic ? 'Pause Music' : 'Play Music'}
        >
          {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </div>

      {/* Bottom Status / Equalizer */}
      <div className={`p-2 rounded-xl border text-[10px] flex items-center justify-between ${
        isDarkMode ? 'bg-[#0d1117] border-[#30363d] text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'
      }`}>
        <span className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-fuchsia-500" />
          Hi-Fi Audio Synth
        </span>
        <span className="text-emerald-500 font-mono font-medium">
          {isPlayingMusic ? 'Streaming Live' : 'Ready'}
        </span>
      </div>
    </motion.div>
  );
};
