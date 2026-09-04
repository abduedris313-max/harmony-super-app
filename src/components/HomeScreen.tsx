/**
 * @file HomeScreen.tsx
 * @description iOS 18 Springboard Launcher Grid & Widgets view for Harmony OS Super App.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HARMONY_APPS } from '../config/apps';
import { MiniAppConfig, HarmonyNote, HarmonyWritingDraft, HarmonyCalendarEvent, Track } from '../types';
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
  Wallet,
  ShoppingBag,
  Pin,
  Plus,
  Layers
} from 'lucide-react';
import { WidgetFramework } from './widgets/WidgetFramework';
import { HarmonyLogo } from './HarmonyLogo';

interface HomeScreenProps {
  onOpenApp: (appId: string) => void;
  onOpenSpotlight: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  recentNotes: HarmonyNote[];
  latestDraft?: HarmonyWritingDraft;
  currentTrack?: Track | null;
  isPlayingMusic?: boolean;
  onTogglePlayMusic?: () => void;
  userDisplayName?: string | null;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  calendarEvents?: HarmonyCalendarEvent[];
  pinnedAppIds?: string[];
  onTogglePinApp?: (appId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenApp,
  onOpenSpotlight,
  onOpenSettings,
  onOpenAuth,
  recentNotes,
  latestDraft,
  currentTrack = null,
  isPlayingMusic = false,
  onTogglePlayMusic = () => {},
  userDisplayName,
  isDarkMode = true,
  onToggleTheme,
  calendarEvents = [],
  pinnedAppIds,
  onTogglePinApp
}) => {
  const [showUnpinnedLibrary, setShowUnpinnedLibrary] = useState(false);

  // Derive pinned vs unpinned apps
  const effectivePinnedIds = pinnedAppIds || HARMONY_APPS.map(a => a.id);
  const pinnedApps = HARMONY_APPS.filter(a => effectivePinnedIds.includes(a.id));
  const unpinnedApps = HARMONY_APPS.filter(a => !effectivePinnedIds.includes(a.id));

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'notebook': return <Notebook className="w-6 h-6 text-white drop-shadow-md" />;
      case 'file-text': return <FileText className="w-6 h-6 text-white drop-shadow-md" />;
      case 'pen-tool': return <PenTool className="w-6 h-6 text-white drop-shadow-md" />;
      case 'disc': return <Disc className="w-6 h-6 text-white drop-shadow-md animate-spin-slow" />;
      case 'sparkles': return <Sparkles className="w-6 h-6 text-white drop-shadow-md" />;
      case 'calendar': return <CalendarIcon className="w-6 h-6 text-white drop-shadow-md" />;
      case 'wallet': return <Wallet className="w-6 h-6 text-white drop-shadow-md" />;
      case 'shopping-bag':
      case 'store':
        return <ShoppingBag className="w-6 h-6 text-white drop-shadow-md" />;
      default: return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div id="home-screen" className="flex-1 w-full flex flex-col items-center overflow-y-auto px-3 py-3 scrollbar-none max-w-4xl mx-auto">
      {/* Harmony Brand Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-2.5 px-1">
        <HarmonyLogo 
          size="sm" 
          showText={true} 
          subtitle={userDisplayName ? `Hello, ${userDisplayName.split(' ')[0]}` : 'Unified Ecosystem'} 
          isDarkMode={isDarkMode}
          onClick={onOpenSettings}
        />
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSettings}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isDarkMode
                ? 'bg-[#161b22] border-[#30363d] text-neutral-400 hover:text-white'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs'
            }`}
            title="System Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenAuth}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isDarkMode
                ? 'bg-[#161b22] border-[#30363d] text-neutral-400 hover:text-white'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs'
            }`}
            title="Profile & Cloud"
          >
            <User className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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

      {/* iOS Smart Stack Widgets Framework (Calendar, Finance, Music, AI, etc.) */}
      <WidgetFramework
        onOpenApp={onOpenApp}
        calendarEvents={calendarEvents}
        recentNotes={recentNotes}
        latestDraft={latestDraft}
        currentTrack={currentTrack}
        isPlayingMusic={isPlayingMusic}
        onTogglePlayMusic={onTogglePlayMusic}
        isDarkMode={isDarkMode}
      />

      {/* iOS Springboard App Launcher Grid Header */}
      <div className="w-full flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className={`text-[11px] font-bold tracking-wider uppercase ${
            isDarkMode ? 'text-white/60' : 'text-neutral-700 font-bold'
          }`}>
            Pinned Apps ({pinnedApps.length})
          </h2>
        </div>

        {/* Quick link to App Store to pin/unpin apps */}
        <button
          onClick={() => onOpenApp('harmony-app-store')}
          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> App Store
        </button>
      </div>

      {/* iOS 18 Springboard App Grid - Shows only pinned apps */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 mb-4">
        {pinnedApps.map((app) => (
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

      {/* Unpinned Apps Library Drawer (if any apps are unpinned) */}
      {unpinnedApps.length > 0 && (
        <div className={`w-full rounded-xl p-3 border mb-4 ${
          isDarkMode ? 'bg-[#161b22]/70 border-[#30363d]' : 'bg-neutral-100/80 border-neutral-200'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowUnpinnedLibrary(!showUnpinnedLibrary)}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>App Library ({unpinnedApps.length} unpinned {unpinnedApps.length === 1 ? 'app' : 'apps'})</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${showUnpinnedLibrary ? 'rotate-90' : ''}`} />
            </button>

            <button
              onClick={() => onOpenApp('harmony-app-store')}
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Manage in App Store
            </button>
          </div>

          <AnimatePresence>
            {showUnpinnedLibrary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3 pt-3 border-t border-neutral-700/40"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {unpinnedApps.map((app) => (
                    <div
                      key={app.id}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                        isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-neutral-200'
                      }`}
                    >
                      <div 
                        onClick={() => onOpenApp(app.id)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white shrink-0`}>
                          {getIconComponent(app.iconName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                            {app.name}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate">
                            {app.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onTogglePinApp && (
                          <button
                            onClick={() => onTogglePinApp(app.id)}
                            className="px-2 py-1 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 flex items-center gap-1 transition-colors"
                            title="Pin to Home Screen"
                          >
                            <Plus className="w-3 h-3" /> Pin
                          </button>
                        )}
                        <button
                          onClick={() => onOpenApp(app.id)}
                          className="px-2 py-1 rounded text-[10px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
