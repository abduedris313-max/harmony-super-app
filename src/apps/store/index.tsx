/**
 * @file index.tsx
 * @description Harmony App Store Mini App Module.
 * Showcases all ecosystem apps, features detail modals, and enables users to
 * pin or unpin apps from their Home Screen layout.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Pin, 
  PinOff, 
  ExternalLink, 
  Github, 
  Play, 
  Sparkles, 
  Check, 
  Info, 
  RotateCcw, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { HARMONY_APPS } from '../../config/apps';
import { MiniAppConfig, SystemUser } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface HarmonyAppStoreProps {
  user?: SystemUser | null;
  pinnedAppIds: string[];
  onTogglePinApp: (appId: string) => void;
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

type CategoryFilter = 'all' | 'pinned' | 'productivity' | 'finance' | 'audio' | 'ai';

export const HarmonyAppStoreModule: React.FC<HarmonyAppStoreProps> = ({
  pinnedAppIds,
  onTogglePinApp,
  onOpenApp,
  isDarkMode: propIsDarkMode,
}) => {
  const theme = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : theme.isDark;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedApp, setSelectedApp] = useState<MiniAppConfig | null>(null);

  // Filter apps
  const filteredApps = useMemo(() => {
    return HARMONY_APPS.filter((app) => {
      // Exclude self from pinning/unpinning if desired, or allow pinning App Store as well
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const isPinned = pinnedAppIds.includes(app.id);

      switch (activeCategory) {
        case 'pinned':
          return isPinned;
        case 'productivity':
          return ['harmony-notes', 'harmony-docs', 'harmony-writing', 'harmony-calendar'].includes(app.id);
        case 'finance':
          return app.id === 'harmony-finance';
        case 'audio':
          return app.id === 'harmony-music-player';
        case 'ai':
          return app.id === 'harmony-docs-ai';
        case 'all':
        default:
          return true;
      }
    });
  }, [searchQuery, activeCategory, pinnedAppIds]);

  const pinnedCount = pinnedAppIds.length;
  const totalCount = HARMONY_APPS.length;

  return (
    <div className={`h-full w-full flex flex-col overflow-y-auto ${
      isDarkMode ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-neutral-50 text-neutral-900'
    }`}>
      {/* App Store Top Hero Header */}
      <div className={`p-6 border-b shrink-0 ${
        isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Harmony App Store
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Ecosystem
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                  Discover verified Harmony mini apps and personalize your Home Screen layout.
                </p>
              </div>
            </div>

            {/* Layout Personalization Stats Pill */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-100 border-neutral-200'
            }`}>
              <div className="text-right">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Home Screen Layout</p>
                <p className="text-xs font-bold text-indigo-400">
                  {pinnedCount} of {totalCount} Apps Pinned
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Search & Category Filter Chips */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search mini apps, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
                  isDarkMode
                    ? 'bg-[#0d1117] border-[#30363d] text-white focus:border-blue-500'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:border-blue-500 shadow-sm'
                }`}
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'pinned', label: `Pinned (${pinnedCount})` },
                  { id: 'productivity', label: 'Productivity' },
                  { id: 'finance', label: 'Finance' },
                  { id: 'audio', label: 'Audio' },
                  { id: 'ai', label: 'AI' }
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : isDarkMode
                        ? 'bg-[#0d1117] text-neutral-400 border-[#30363d] hover:text-white'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="max-w-4xl mx-auto w-full p-6 flex-1">
        {filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-10 h-10 mx-auto text-neutral-500 mb-2 opacity-50" />
            <p className="text-sm font-semibold">No apps match your filter</p>
            <p className="text-xs text-neutral-400 mt-1">Try searching for a different keyword or resetting categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => {
              const isPinned = pinnedAppIds.includes(app.id);

              return (
                <motion.div
                  key={app.id}
                  whileHover={{ y: -2 }}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isDarkMode
                      ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]'
                      : 'bg-white border-neutral-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: App Icon + Titles + Category Badge */}
                    <div className="flex items-start gap-3.5">
                      <div
                        onClick={() => setSelectedApp(app)}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.colorGradient} p-0.5 shadow-md flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-2xl" />
                        <span className="text-2xl z-10">{getAppEmoji(app.id)}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            onClick={() => setSelectedApp(app)}
                            className={`font-bold text-sm truncate cursor-pointer hover:underline ${
                              isDarkMode ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            {app.name}
                          </h3>
                          {app.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                              {app.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate font-medium mt-0.5 ${
                          isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                          {app.tagline}
                        </p>
                        <p className={`text-xs line-clamp-2 mt-1.5 leading-tight ${
                          isDarkMode ? 'text-[#8b949e]' : 'text-neutral-500'
                        }`}>
                          {app.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons: Pin / Unpin & Launch */}
                  <div className="mt-4 pt-3 border-t border-neutral-700/40 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-[11px] text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
                    >
                      <Info className="w-3.5 h-3.5" /> Details
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Pin / Unpin toggle */}
                      <button
                        onClick={() => onTogglePinApp(app.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isPinned
                            ? isDarkMode
                              ? 'bg-[#21262d] text-indigo-300 border border-indigo-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/50'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                            : isDarkMode
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-md'
                        }`}
                        title={isPinned ? 'Click to unpin from Home Screen' : 'Pin to Home Screen'}
                      >
                        {isPinned ? (
                          <>
                            <Pin className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Pinned</span>
                          </>
                        ) : (
                          <>
                            <Pin className="w-3.5 h-3.5" />
                            <span>Pin to Home</span>
                          </>
                        )}
                      </button>

                      {/* Launch App */}
                      <button
                        onClick={() => onOpenApp(app.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-md transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* App Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl ${
                isDarkMode ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedApp.colorGradient} p-0.5 shadow-lg flex items-center justify-center text-3xl shrink-0`}>
                    {getAppEmoji(selectedApp.id)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">{selectedApp.name}</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">{selectedApp.tagline}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified Ecosystem App
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Offline Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="my-5 space-y-3 text-xs leading-relaxed text-neutral-300 dark:text-neutral-300">
                <p>{selectedApp.description}</p>
                <div className={`p-3 rounded-xl border text-[11px] ${
                  isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <h4 className="font-semibold mb-1 text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Storage & Security Architecture
                  </h4>
                  <p className="text-neutral-400">
                    Syncs in real-time with Firebase Cloud Firestore when authenticated, and falls back to encrypted IndexedDB / LocalStorage offline.
                  </p>
                </div>
              </div>

              {/* External Links */}
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-700/50 text-xs">
                {selectedApp.repoUrl && (
                  <a
                    href={selectedApp.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" /> Source Code <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
                {selectedApp.deployedUrl && selectedApp.deployedUrl !== '#' && (
                  <a
                    href={selectedApp.deployedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> GitHub Pages <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 gap-3">
                <button
                  onClick={() => onTogglePinApp(selectedApp.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    pinnedAppIds.includes(selectedApp.id)
                      ? 'bg-[#21262d] text-indigo-300 border-indigo-500/40 hover:bg-rose-500/20 hover:text-rose-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent'
                  }`}
                >
                  {pinnedAppIds.includes(selectedApp.id) ? (
                    <>
                      <PinOff className="w-3.5 h-3.5" />
                      <span>Unpin from Home</span>
                    </>
                  ) : (
                    <>
                      <Pin className="w-3.5 h-3.5" />
                      <span>Pin to Home</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const appId = selectedApp.id;
                    setSelectedApp(null);
                    onOpenApp(appId);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Mini App</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to provide friendly emojis for each app
function getAppEmoji(id: string): string {
  switch (id) {
    case 'harmony-notes': return '📝';
    case 'harmony-docs': return '📄';
    case 'harmony-writing': return '✍️';
    case 'harmony-music-player': return '🎵';
    case 'harmony-docs-ai': return '✨';
    case 'harmony-calendar': return '📅';
    case 'harmony-finance': return '💳';
    case 'harmony-app-store': return '🛍️';
    default: return '📱';
  }
}
