/**
 * @file ControlCenter.tsx
 * @description iOS 18 Control Center slide-down overlay.
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Volume2, 
  Sun, 
  Flame, 
  VolumeX, 
  Github, 
  Sparkles, 
  Layers, 
  Wifi, 
  ShieldCheck, 
  Check, 
  Smartphone
} from 'lucide-react';
import { SystemSettings } from '../types';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (updated: Partial<SystemSettings>) => void;
  isFirebaseConnected: boolean;
  userEmail?: string | null;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isFirebaseConnected,
  userEmail
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4 bg-black/70 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl text-[#c9d1d9] relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#30363d] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Harmony Control Center</h3>
              <p className="text-xs text-[#8b949e]">iOS 18 System Controls & Firebase Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#21262d] hover:bg-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* System Tiles Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Firebase Connection Card */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-amber-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Firestore
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-white">Firebase Backend</h4>
              <p className="text-[11px] text-amber-200/80">
                {isFirebaseConnected ? 'Connected & Synced' : 'Offline Mode'}
              </p>
              <p className="text-[10px] text-[#8b949e] truncate mt-0.5">
                {userEmail || 'Anonymous Session'}
              </p>
            </div>
          </div>

          {/* GitHub Repos Quick Link */}
          <a
            href="https://github.com/abduedris313-max"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] flex flex-col justify-between transition-all group"
          >
            <div className="flex items-center justify-between">
              <Github className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-white">GitHub Base URL</h4>
              <p className="text-[11px] text-[#8b949e] truncate">@abduedris313-max</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">5 Mini Apps Source</p>
            </div>
          </a>
        </div>

        {/* Sliders: Brightness & Volume */}
        <div className="space-y-4 mb-6">
          {/* Volume Control */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] flex items-center gap-3">
            <button
              onClick={() => onUpdateSettings({ volume: settings.volume === 0 ? 0.8 : 0 })}
              className="p-2 rounded-lg bg-[#21262d] text-white hover:bg-[#30363d]"
            >
              {settings.volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-medium text-[#c9d1d9] mb-1">
                <span>Audio Volume</span>
                <span>{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 bg-[#30363d] rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Typewriter Sounds Toggle */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                ⌨️
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Typewriter Audio FX</h4>
                <p className="text-[11px] text-[#8b949e]">Tactile key clicking sound in Harmony Writing</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ typewriterSounds: !settings.typewriterSounds })}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${settings.typewriterSounds ? 'bg-emerald-500' : 'bg-[#30363d]'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.typewriterSounds ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Default App View Mode (Native vs GitHub Pages IFrame) */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Default Runner Mode</h4>
                <p className="text-[11px] text-[#8b949e]">Switch between Cloud Native & Live GitHub Pages</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#21262d] p-1 rounded-lg border border-[#30363d] text-xs">
              <button
                onClick={() => onUpdateSettings({ defaultViewMode: 'native' })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${settings.defaultViewMode === 'native' ? 'bg-indigo-600 text-white shadow' : 'text-[#8b949e] hover:text-white'}`}
              >
                Native
              </button>
              <button
                onClick={() => onUpdateSettings({ defaultViewMode: 'iframe' })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${settings.defaultViewMode === 'iframe' ? 'bg-indigo-600 text-white shadow' : 'text-[#8b949e] hover:text-white'}`}
              >
                IFrame
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#8b949e] pt-2 border-t border-[#30363d]">
          Harmony OS Super App v1.0 • Built for @abduedris313-max
        </div>
      </motion.div>
    </div>
  );
};
