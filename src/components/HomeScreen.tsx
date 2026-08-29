/**
 * @file HomeScreen.tsx
 * @description iOS 18 Springboard Launcher Grid & Widgets view for Harmony OS Super App.
 */

import React from 'react';
import { motion } from 'motion/react';
import { HARMONY_APPS } from '../config/apps';
import { MiniAppConfig, HarmonyNote, HarmonyWritingDraft, Track } from '../types';
import { 
  Search, 
  Settings, 
  User, 
  Play, 
  Pause, 
  Sparkles, 
  Notebook, 
  PenTool, 
  FileText, 
  Disc, 
  ExternalLink,
  ChevronRight,
  Flame
} from 'lucide-react';

interface HomeScreenProps {
  onOpenApp: (appId: string) => void;
  onOpenSpotlight: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  recentNotes: HarmonyNote[];
  latestDraft?: HarmonyWritingDraft;
  currentTrack?: Track;
  isPlayingMusic?: boolean;
  onTogglePlayMusic?: () => void;
  userDisplayName?: string | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenApp,
  onOpenSpotlight,
  onOpenSettings,
  onOpenAuth,
  recentNotes,
  latestDraft,
  currentTrack,
  isPlayingMusic,
  onTogglePlayMusic,
  userDisplayName
}) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'notebook': return <Notebook className="w-8 h-8 text-white drop-shadow-md" />;
      case 'file-text': return <FileText className="w-8 h-8 text-white drop-shadow-md" />;
      case 'pen-tool': return <PenTool className="w-8 h-8 text-white drop-shadow-md" />;
      case 'disc': return <Disc className="w-8 h-8 text-white drop-shadow-md animate-spin-slow" />;
      case 'sparkles': return <Sparkles className="w-8 h-8 text-white drop-shadow-md" />;
      default: return <Sparkles className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div id="home-screen" className="flex-1 w-full flex flex-col items-center overflow-y-auto px-4 py-6 scrollbar-none max-w-4xl mx-auto">
      {/* iOS Spotlight Search Trigger Bar */}
      <motion.button
        id="btn-spotlight-search"
        onClick={onOpenSpotlight}
        whileTap={{ scale: 0.98 }}
        className="w-full max-w-md mb-6 py-2.5 px-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-between text-[#8b949e] hover:text-white hover:border-[#58a6ff] transition-all shadow-lg text-sm"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[#8b949e]" />
          <span>Search Harmony Apps, Notes, Docs & AI...</span>
        </div>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">⌘K</kbd>
      </motion.button>

      {/* iOS Smart Stack Widgets Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Widget 1: Music Player Smart Widget */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all shadow-xl flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wide">
              <Disc className="w-4 h-4 animate-spin-slow" />
              <span>HARMONY MUSIC</span>
            </div>
            <button
              onClick={() => onOpenApp('harmony-music-player')}
              className="text-xs text-[#8b949e] hover:text-white flex items-center gap-0.5"
            >
              Open <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="my-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              🎵
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {currentTrack ? currentTrack.title : 'Ambient Study Beats'}
              </p>
              <p className="text-[#8b949e] text-xs truncate">
                {currentTrack ? currentTrack.artist : 'Harmony Music Player'}
              </p>
            </div>
            <button
              onClick={onTogglePlayMusic}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 active:scale-95 transition-transform shrink-0"
            >
              {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8b949e] border-t border-[#30363d] pt-2">
            <span>Hi-Fi Audio Synthesizer</span>
            <span className="text-green-400 font-mono">Firebase Synced</span>
          </div>
        </motion.div>

        {/* Widget 2: Harmony AI Quick Copilot Widget */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all shadow-xl flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>HARMONY DOCS AI</span>
            </div>
            <button
              onClick={() => onOpenApp('harmony-docs-ai')}
              className="text-xs text-[#8b949e] hover:text-white flex items-center gap-0.5"
            >
              Launch AI <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="my-2">
            <p className="text-[#c9d1d9] text-xs font-medium line-clamp-2 italic">
              "Summarize document, outline ideas, or refine draft prose with Gemini 2.5 AI."
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenApp('harmony-docs-ai')}
              className="px-3 py-1.5 rounded-full bg-[#21262d] text-white text-xs font-medium hover:bg-[#30363d] transition-colors flex items-center gap-1.5 border border-[#30363d]"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Ask AI Copilot</span>
            </button>
            <span className="text-[10px] text-[#8b949e]">Powered by Gemini</span>
          </div>
        </motion.div>
      </div>

      {/* iOS Springboard App Launcher Grid Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold tracking-wider text-white/50 uppercase">Harmony Mini Apps</h2>
        <span className="text-xs text-amber-400/80 font-mono flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> 5 Mini Apps Ready
        </span>
      </div>

      {/* iOS 18 Springboard App Grid */}
      <div className="w-full grid grid-cols-3 sm:grid-cols-5 gap-6 mb-10">
        {HARMONY_APPS.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => onOpenApp(app.id)}
          >
            {/* iOS App Icon Squircle Container */}
            <div 
              id={`app-icon-${app.id}`}
              className={`w-20 h-20 rounded-[22px] bg-gradient-to-br ${app.colorGradient} p-0.5 shadow-xl shadow-black/40 flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:shadow-2xl group-hover:shadow-purple-500/20`}
            >
              {/* Glossy inner sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none rounded-[22px]" />
              
              {/* App Icon */}
              <div className="z-10 flex flex-col items-center justify-center">
                {getIconComponent(app.iconName)}
              </div>

              {/* Badge */}
              {app.badge && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-black/40 text-[9px] font-bold text-white backdrop-blur-md border border-white/20">
                  {app.badge}
                </span>
              )}
            </div>

            {/* iOS App Title Label */}
            <span className="mt-2 text-xs font-medium text-white/90 text-center tracking-tight truncate max-w-[90px]">
              {app.name}
            </span>
          </motion.div>
        ))}

        {/* System Settings App Icon */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="flex flex-col items-center group cursor-pointer"
          onClick={onOpenSettings}
        >
          <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-0.5 shadow-xl shadow-black/40 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[22px]" />
            <Settings className="w-8 h-8 text-slate-200 z-10" />
          </div>
          <span className="mt-2 text-xs font-medium text-white/90 text-center tracking-tight">
            Settings
          </span>
        </motion.div>

        {/* User Auth Profile Icon */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="flex flex-col items-center group cursor-pointer"
          onClick={onOpenAuth}
        >
          <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 p-0.5 shadow-xl shadow-black/40 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[22px]" />
            <User className="w-8 h-8 text-indigo-100 z-10" />
          </div>
          <span className="mt-2 text-xs font-medium text-white/90 text-center tracking-tight truncate max-w-[90px]">
            {userDisplayName || 'Firebase Auth'}
          </span>
        </motion.div>
      </div>

      {/* Quick Access Activity Snap Section */}
      <div className="w-full bg-[#161b22] rounded-2xl p-5 border border-[#30363d] mb-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-3">
          Recent Activity & Firebase Cloud Synced Items
        </h3>
        
        <div className="space-y-2">
          {recentNotes.length > 0 ? (
            recentNotes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                onClick={() => onOpenApp('harmony-notes')}
                className="p-3 rounded-xl bg-[#0d1117] hover:bg-[#21262d] cursor-pointer flex items-center justify-between border border-[#30363d] hover:border-[#58a6ff] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
                    📝
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{note.title}</h4>
                    <p className="text-[11px] text-[#8b949e] line-clamp-1">{note.content || 'Empty note content...'}</p>
                  </div>
                </div>
                <span className="text-[10px] text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  {note.category}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#8b949e] italic py-2">
              No recent notes. Launch Harmony Notes to write your first cloud-synced document.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
