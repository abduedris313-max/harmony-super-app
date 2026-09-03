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
  Flame,
  Calendar as CalendarIcon,
  Wallet
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
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
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
  userDisplayName,
  isDarkMode = true,
  onToggleTheme
}) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'notebook': return <Notebook className="w-6 h-6 text-white drop-shadow-md" />;
      case 'file-text': return <FileText className="w-6 h-6 text-white drop-shadow-md" />;
      case 'pen-tool': return <PenTool className="w-6 h-6 text-white drop-shadow-md" />;
      case 'disc': return <Disc className="w-6 h-6 text-white drop-shadow-md animate-spin-slow" />;
      case 'sparkles': return <Sparkles className="w-6 h-6 text-white drop-shadow-md" />;
      case 'calendar': return <CalendarIcon className="w-6 h-6 text-white drop-shadow-md" />;
      case 'wallet': return <Wallet className="w-6 h-6 text-white drop-shadow-md" />;
      default: return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div id="home-screen" className="flex-1 w-full flex flex-col items-center overflow-y-auto px-3 py-3 scrollbar-none max-w-4xl mx-auto">
      {/* iOS Spotlight Search Trigger Bar */}
      <motion.button
        id="btn-spotlight-search"
        onClick={onOpenSpotlight}
        whileTap={{ scale: 0.98 }}
        className={`w-full max-w-md mb-3 py-2 px-3.5 rounded-xl border flex items-center justify-between transition-all shadow-sm text-xs ${
          isDarkMode
            ? 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#58a6ff]'
            : 'bg-white/85 border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-indigo-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <Search className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'}`} />
          <span>Search Apps, Notes, Docs & AI...</span>
        </div>
        <kbd className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
          isDarkMode
            ? 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
        }`}>⌘K</kbd>
      </motion.button>

      {/* iOS Smart Stack Widgets Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Widget 1: Music Player Smart Widget */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`p-3.5 rounded-xl border transition-all shadow-sm flex flex-col justify-between min-h-[110px] ${
            isDarkMode
              ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]'
              : 'bg-white/85 border-neutral-200/90 hover:border-indigo-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 font-semibold text-[11px] tracking-wide">
              <Disc className="w-3.5 h-3.5 animate-spin-slow" />
              <span>MUSIC</span>
            </div>
            <button
              onClick={() => onOpenApp('harmony-music-player')}
              className={`text-[11px] flex items-center gap-0.5 transition-colors ${
                isDarkMode ? 'text-[#8b949e] hover:text-white' : 'text-neutral-500 hover:text-neutral-900 font-medium'
              }`}
            >
              Open <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="my-1 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              🎵
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-xs truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {currentTrack ? currentTrack.title : 'Ambient Study Beats'}
              </p>
              <p className={`text-[11px] truncate ${isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                {currentTrack ? currentTrack.artist : 'Harmony Music Player'}
              </p>
            </div>
            <button
              onClick={onTogglePlayMusic}
              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-500 active:scale-95 transition-transform shrink-0"
            >
              {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          <div className={`flex items-center justify-between text-[10px] border-t pt-1.5 ${
            isDarkMode ? 'text-[#8b949e] border-[#30363d]' : 'text-neutral-500 border-neutral-200'
          }`}>
            <span>Hi-Fi Audio Synth</span>
            <span className="text-emerald-500 font-mono">Firebase Synced</span>
          </div>
        </motion.div>

        {/* Widget 2: Harmony AI Quick Copilot Widget */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`p-3.5 rounded-xl border transition-all shadow-sm flex flex-col justify-between min-h-[110px] ${
            isDarkMode
              ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]'
              : 'bg-white/85 border-neutral-200/90 hover:border-indigo-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 font-semibold text-[11px] tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>DOCS AI</span>
            </div>
            <button
              onClick={() => onOpenApp('harmony-docs-ai')}
              className={`text-[11px] flex items-center gap-0.5 transition-colors ${
                isDarkMode ? 'text-[#8b949e] hover:text-white' : 'text-neutral-500 hover:text-neutral-900 font-medium'
              }`}
            >
              Launch AI <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="my-1">
            <p className={`text-[11px] font-medium line-clamp-2 italic ${
              isDarkMode ? 'text-[#c9d1d9]' : 'text-neutral-700'
            }`}>
              "Summarize document, outline ideas, or refine draft prose with Gemini 2.5 AI."
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenApp('harmony-docs-ai')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors flex items-center gap-1 border ${
                isDarkMode
                  ? 'bg-[#21262d] text-white hover:bg-[#30363d] border-[#30363d]'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-neutral-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              <span>Ask AI Copilot</span>
            </button>
            <span className={`text-[10px] ${isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'}`}>Gemini 2.5</span>
          </div>
        </motion.div>
      </div>

      {/* iOS Springboard App Launcher Grid Header */}
      <div className="w-full flex items-center justify-between mb-2.5">
        <h2 className={`text-[11px] font-bold tracking-wider uppercase ${
          isDarkMode ? 'text-white/60' : 'text-neutral-700 font-bold'
        }`}>Harmony Mini Apps</h2>
        <span className="text-[11px] text-amber-500 font-mono flex items-center gap-1">
          <Flame className="w-3 h-3" /> {HARMONY_APPS.length} Mini Apps Ready
        </span>
      </div>

      {/* iOS 18 Springboard App Grid - Responsive 4 cols on mobile, up to 8 cols on sm/md */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 mb-5">
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
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] bg-gradient-to-br ${app.colorGradient} p-0.5 shadow-md shadow-black/30 flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:shadow-lg group-hover:shadow-purple-500/20`}
            >
              {/* Glossy inner sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none rounded-[16px]" />
              
              {/* App Icon */}
              <div className="z-10 flex flex-col items-center justify-center">
                {getIconComponent(app.iconName)}
              </div>

              {/* Badge */}
              {app.badge && (
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full bg-black/50 text-[8px] font-bold text-white backdrop-blur-md border border-white/20">
                  {app.badge}
                </span>
              )}
            </div>

            {/* iOS App Title Label */}
            <span className={`mt-1.5 text-[11px] text-center tracking-tight truncate max-w-[72px] ${
              isDarkMode 
                ? 'text-white/90 font-medium' 
                : 'text-neutral-800 font-semibold'
            }`}>
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
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-0.5 shadow-md shadow-black/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[16px]" />
            <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-slate-200 z-10" />
          </div>
          <span className={`mt-1.5 text-[11px] text-center tracking-tight ${
            isDarkMode ? 'text-white/90 font-medium' : 'text-neutral-800 font-semibold'
          }`}>
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
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 p-0.5 shadow-md shadow-black/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[16px]" />
            <User className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-100 z-10" />
          </div>
          <span className={`mt-1.5 text-[11px] text-center tracking-tight truncate max-w-[72px] ${
            isDarkMode ? 'text-white/90 font-medium' : 'text-neutral-800 font-semibold'
          }`}>
            {userDisplayName || 'Auth'}
          </span>
        </motion.div>
      </div>

      {/* Quick Access Activity Snap Section */}
      <div className={`w-full rounded-xl p-3.5 border mb-3 shadow-sm ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d]'
          : 'bg-white/85 border-neutral-200/80 shadow-sm'
      }`}>
        <h3 className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
          isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'
        }`}>
          Recent Activity & Cloud Synced Items
        </h3>
        
        <div className="space-y-1.5">
          {recentNotes.length > 0 ? (
            recentNotes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                onClick={() => onOpenApp('harmony-notes')}
                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between border transition-all ${
                  isDarkMode
                    ? 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] hover:border-[#58a6ff]'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/90 text-neutral-900 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] border border-indigo-500/20">
                    📝
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold leading-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                      {note.title}
                    </h4>
                    <p className={`text-[10px] line-clamp-1 leading-tight ${isDarkMode ? 'text-[#8b949e]' : 'text-neutral-600'}`}>
                      {note.content || 'Empty note content...'}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] text-indigo-500 dark:text-indigo-400 px-1.5 py-0.2 rounded-full bg-indigo-500/10 border border-indigo-500/20 font-medium">
                  {note.category}
                </span>
              </div>
            ))
          ) : (
            <p className={`text-[11px] italic py-1 ${isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
              No recent notes. Launch Harmony Notes to write your first document.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
