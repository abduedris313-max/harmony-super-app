/**
 * @file AppRunner.tsx
 * @description iOS Mini App container frame with Framer Motion spring entrance/exit animations,
 * dual GitHub Pages IFrame and Native Firebase modes, and comprehensive Service Worker offline persistence.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  RotateCw, 
  Github, 
  Maximize2, 
  Minimize2, 
  Cloud, 
  Globe, 
  ChevronLeft,
  Wifi,
  WifiOff,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Info
} from 'lucide-react';
import { MiniAppConfig, SystemUser, HarmonyNote, HarmonyDoc, HarmonyWritingDraft, HarmonyPlaylist, HarmonyAiChat, HarmonyCalendarEvent } from '../types';
import { HarmonyNotesApp } from './mini-apps/HarmonyNotesApp';
import { HarmonyDocsApp } from './mini-apps/HarmonyDocsApp';
import { HarmonyWritingApp } from './mini-apps/HarmonyWritingApp';
import { HarmonyMusicPlayerApp } from './mini-apps/HarmonyMusicPlayerApp';
import { HarmonyDocsAiApp } from './mini-apps/HarmonyDocsAiApp';
import { HarmonyCalendarApp } from './mini-apps/HarmonyCalendarApp';
import { HarmonyFinanceApp } from './mini-apps/HarmonyFinanceApp';
import { HarmonyAppStoreApp } from './mini-apps/HarmonyAppStoreApp';
import { 
  useOfflinePersistence, 
  setLocalItem, 
  notifyServiceWorkerSnapshot, 
  enqueueOfflineAction, 
  STORAGE_KEYS 
} from '../lib/offlinePersistence';

interface AppRunnerProps {
  app: MiniAppConfig;
  onClose: () => void;
  user: SystemUser | null;
  defaultMode?: 'native' | 'iframe';
  // State handlers for native mini apps
  notes: HarmonyNote[];
  onSaveNote: (note: Partial<HarmonyNote> & { id: string; title: string }) => Promise<any>;
  onDeleteNote: (id: string) => Promise<void>;
  docs: HarmonyDoc[];
  onSaveDoc: (docItem: Partial<HarmonyDoc> & { id: string; title: string }) => Promise<any>;
  onDeleteDoc: (id: string) => Promise<void>;
  drafts: HarmonyWritingDraft[];
  onSaveDraft: (draft: Partial<HarmonyWritingDraft> & { id: string; title: string }) => Promise<any>;
  onDeleteDraft: (id: string) => Promise<void>;
  playlists: HarmonyPlaylist[];
  onSavePlaylist: (playlist: Partial<HarmonyPlaylist> & { id: string; name: string }) => Promise<any>;
  aiChats: HarmonyAiChat[];
  onSaveAiChat: (chat: Partial<HarmonyAiChat> & { id: string }) => Promise<any>;
  calendarEvents?: HarmonyCalendarEvent[];
  onSaveCalendarEvent?: (event: Partial<HarmonyCalendarEvent> & { id: string; title: string; gregorianDate: string }) => Promise<any>;
  onDeleteCalendarEvent?: (id: string) => Promise<void>;
  onPlayTrack?: (track: any) => void;
  pinnedAppIds?: string[];
  onTogglePinApp?: (appId: string) => void;
  onOpenApp?: (appId: string) => void;
}

export const AppRunner: React.FC<AppRunnerProps> = ({
  app,
  onClose,
  user,
  defaultMode = 'native',
  notes,
  onSaveNote,
  onDeleteNote,
  docs,
  onSaveDoc,
  onDeleteDoc,
  drafts,
  onSaveDraft,
  onDeleteDraft,
  playlists,
  onSavePlaylist,
  aiChats,
  onSaveAiChat,
  calendarEvents,
  onSaveCalendarEvent,
  onDeleteCalendarEvent,
  onPlayTrack,
  pinnedAppIds = [],
  onTogglePinApp,
  onOpenApp
}) => {
  const [mode, setMode] = useState<'native' | 'iframe'>(defaultMode);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOfflineDetails, setShowOfflineDetails] = useState(false);
  const [justSavedLocal, setJustSavedLocal] = useState(false);

  // Hook into offline persistence layer
  const { 
    isOnline, 
    pendingSyncCount, 
    lastSyncTime, 
    cachedItemsCount, 
    getCachedNotes, 
    getCachedDocs, 
    getCachedDrafts, 
    getCachedPlaylists, 
    getCachedAiChats,
    snapshotMiniAppData
  } = useOfflinePersistence({
    notes,
    docs,
    drafts,
    playlists,
    aiChats
  });

  // Effective datasets with offline fallback
  const effectiveNotes = notes.length > 0 ? notes : getCachedNotes();
  const effectiveDocs = docs.length > 0 ? docs : getCachedDocs();
  const effectiveDrafts = drafts.length > 0 ? drafts : getCachedDrafts();
  const effectivePlaylists = playlists.length > 0 ? playlists : getCachedPlaylists();
  const effectiveAiChats = aiChats.length > 0 ? aiChats : getCachedAiChats();

  // Snapshot active mini-app data whenever it opens
  useEffect(() => {
    snapshotMiniAppData(app.id, {
      notesCount: effectiveNotes.length,
      docsCount: effectiveDocs.length,
      draftsCount: effectiveDrafts.length,
      openedAt: new Date().toISOString()
    });
  }, [app.id, effectiveNotes.length, effectiveDocs.length, effectiveDrafts.length, snapshotMiniAppData]);

  // Keyboard listener: Escape returns to home with exit animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Wrapper methods that guarantee offline persistence and Service Worker caching
  const handleSaveNoteWithPersistence = useCallback(async (note: Partial<HarmonyNote> & { id: string; title: string }) => {
    // 1. Save immediately to offline storage
    const currentNotes = getCachedNotes();
    const updated = [note as HarmonyNote, ...currentNotes.filter(n => n.id !== note.id)];
    setLocalItem(STORAGE_KEYS.NOTES, updated);
    setLocalItem(STORAGE_KEYS.SYSTEM_NOTES, updated);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.NOTES, updated);
    setJustSavedLocal(true);
    setTimeout(() => setJustSavedLocal(false), 2000);

    // 2. If offline, enqueue sync; if online, call cloud
    if (!navigator.onLine) {
      enqueueOfflineAction('notes', 'save', note);
      return note;
    }
    try {
      return await onSaveNote(note);
    } catch {
      enqueueOfflineAction('notes', 'save', note);
      return note;
    }
  }, [getCachedNotes, onSaveNote]);

  const handleDeleteNoteWithPersistence = useCallback(async (id: string) => {
    const currentNotes = getCachedNotes();
    const filtered = currentNotes.filter(n => n.id !== id);
    setLocalItem(STORAGE_KEYS.NOTES, filtered);
    setLocalItem(STORAGE_KEYS.SYSTEM_NOTES, filtered);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.NOTES, filtered);

    if (!navigator.onLine) {
      enqueueOfflineAction('notes', 'delete', { id });
      return;
    }
    try {
      await onDeleteNote(id);
    } catch {
      enqueueOfflineAction('notes', 'delete', { id });
    }
  }, [getCachedNotes, onDeleteNote]);

  const handleSaveDocWithPersistence = useCallback(async (docItem: Partial<HarmonyDoc> & { id: string; title: string }) => {
    const currentDocs = getCachedDocs();
    const updated = [docItem as HarmonyDoc, ...currentDocs.filter(d => d.id !== docItem.id)];
    setLocalItem(STORAGE_KEYS.DOCS, updated);
    setLocalItem(STORAGE_KEYS.SYSTEM_DOCS, updated);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.DOCS, updated);
    setJustSavedLocal(true);
    setTimeout(() => setJustSavedLocal(false), 2000);

    if (!navigator.onLine) {
      enqueueOfflineAction('docs', 'save', docItem);
      return docItem;
    }
    try {
      return await onSaveDoc(docItem);
    } catch {
      enqueueOfflineAction('docs', 'save', docItem);
      return docItem;
    }
  }, [getCachedDocs, onSaveDoc]);

  const handleDeleteDocWithPersistence = useCallback(async (id: string) => {
    const currentDocs = getCachedDocs();
    const filtered = currentDocs.filter(d => d.id !== id);
    setLocalItem(STORAGE_KEYS.DOCS, filtered);
    setLocalItem(STORAGE_KEYS.SYSTEM_DOCS, filtered);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.DOCS, filtered);

    if (!navigator.onLine) {
      enqueueOfflineAction('docs', 'delete', { id });
      return;
    }
    try {
      await onDeleteDoc(id);
    } catch {
      enqueueOfflineAction('docs', 'delete', { id });
    }
  }, [getCachedDocs, onDeleteDoc]);

  const handleSaveDraftWithPersistence = useCallback(async (draft: Partial<HarmonyWritingDraft> & { id: string; title: string }) => {
    const currentDrafts = getCachedDrafts();
    const updated = [draft as HarmonyWritingDraft, ...currentDrafts.filter(d => d.id !== draft.id)];
    setLocalItem(STORAGE_KEYS.DRAFTS, updated);
    setLocalItem(STORAGE_KEYS.SYSTEM_DRAFTS, updated);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.DRAFTS, updated);
    setJustSavedLocal(true);
    setTimeout(() => setJustSavedLocal(false), 2000);

    if (!navigator.onLine) {
      enqueueOfflineAction('drafts', 'save', draft);
      return draft;
    }
    try {
      return await onSaveDraft(draft);
    } catch {
      enqueueOfflineAction('drafts', 'save', draft);
      return draft;
    }
  }, [getCachedDrafts, onSaveDraft]);

  const handleDeleteDraftWithPersistence = useCallback(async (id: string) => {
    const currentDrafts = getCachedDrafts();
    const filtered = currentDrafts.filter(d => d.id !== id);
    setLocalItem(STORAGE_KEYS.DRAFTS, filtered);
    setLocalItem(STORAGE_KEYS.SYSTEM_DRAFTS, filtered);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.DRAFTS, filtered);

    if (!navigator.onLine) {
      enqueueOfflineAction('drafts', 'delete', { id });
      return;
    }
    try {
      await onDeleteDraft(id);
    } catch {
      enqueueOfflineAction('drafts', 'delete', { id });
    }
  }, [getCachedDrafts, onDeleteDraft]);

  const handleSavePlaylistWithPersistence = useCallback(async (pl: Partial<HarmonyPlaylist> & { id: string; name: string }) => {
    const currentPl = getCachedPlaylists();
    const updated = [pl as HarmonyPlaylist, ...currentPl.filter(p => p.id !== pl.id)];
    setLocalItem(STORAGE_KEYS.PLAYLISTS, updated);
    setLocalItem(STORAGE_KEYS.SYSTEM_PLAYLISTS, updated);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.PLAYLISTS, updated);

    if (!navigator.onLine) {
      enqueueOfflineAction('playlists', 'save', pl);
      return pl;
    }
    try {
      return await onSavePlaylist(pl);
    } catch {
      enqueueOfflineAction('playlists', 'save', pl);
      return pl;
    }
  }, [getCachedPlaylists, onSavePlaylist]);

  const handleSaveAiChatWithPersistence = useCallback(async (chat: Partial<HarmonyAiChat> & { id: string }) => {
    const currentChats = getCachedAiChats();
    const updated = [chat as HarmonyAiChat, ...currentChats.filter(c => c.id !== chat.id)];
    setLocalItem(STORAGE_KEYS.AI_CHATS, updated);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.AI_CHATS, updated);

    if (!navigator.onLine) {
      enqueueOfflineAction('aichats', 'save', chat);
      return chat;
    }
    try {
      return await onSaveAiChat(chat);
    } catch {
      enqueueOfflineAction('aichats', 'save', chat);
      return chat;
    }
  }, [getCachedAiChats, onSaveAiChat]);

  const renderNativeApp = () => {
    switch (app.id) {
      case 'harmony-notes':
        return (
          <HarmonyNotesApp
            user={user}
            notes={effectiveNotes}
            onSaveNote={handleSaveNoteWithPersistence}
            onDeleteNote={handleDeleteNoteWithPersistence}
          />
        );
      case 'harmony-docs':
        return (
          <HarmonyDocsApp
            user={user}
            docs={effectiveDocs}
            onSaveDoc={handleSaveDocWithPersistence}
            onDeleteDoc={handleDeleteDocWithPersistence}
          />
        );
      case 'harmony-writing':
        return (
          <HarmonyWritingApp
            user={user}
            drafts={effectiveDrafts}
            onSaveDraft={handleSaveDraftWithPersistence}
            onDeleteDraft={handleDeleteDraftWithPersistence}
          />
        );
      case 'harmony-music-player':
        return (
          <HarmonyMusicPlayerApp
            user={user}
            playlists={effectivePlaylists}
            onSavePlaylist={handleSavePlaylistWithPersistence}
            onPlayTrack={onPlayTrack}
          />
        );
      case 'harmony-docs-ai':
        return (
          <HarmonyDocsAiApp
            user={user}
            aiChats={effectiveAiChats}
            onSaveAiChat={handleSaveAiChatWithPersistence}
          />
        );
      case 'harmony-calendar':
        return (
          <HarmonyCalendarApp
            user={user}
            events={calendarEvents}
            onSaveEvent={onSaveCalendarEvent}
            onDeleteEvent={onDeleteCalendarEvent}
          />
        );
      case 'harmony-finance':
        return (
          <HarmonyFinanceApp
            user={user}
          />
        );
      case 'harmony-app-store':
        return (
          <HarmonyAppStoreApp
            user={user}
            pinnedAppIds={pinnedAppIds}
            onTogglePinApp={onTogglePinApp || (() => {})}
            onOpenApp={onOpenApp || (() => {})}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-white">
            <p>Mini App implementation loaded.</p>
          </div>
        );
    }
  };

  // Spring physics matching Apple iOS 18 app launch and dismissal
  const springTransition = {
    type: 'spring' as const,
    stiffness: 340,
    damping: 28,
    mass: 0.82
  };

  return (
    <motion.div
      layout
      variants={{
        initial: { 
          opacity: 0, 
          scale: 0.88, 
          y: 35, 
          filter: 'blur(4px)',
          borderRadius: isFullscreen ? 0 : 28
        },
        animate: { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          filter: 'blur(0px)',
          borderRadius: isFullscreen ? 0 : 16,
          transition: springTransition
        },
        exit: { 
          opacity: 0, 
          scale: 0.88, 
          y: 36, 
          filter: 'blur(3px)',
          borderRadius: 32,
          transition: { 
            duration: 0.24, 
            ease: [0.32, 0.72, 0, 1] 
          } 
        }
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full flex-1 flex flex-col bg-[#0d1117] overflow-hidden relative min-h-0 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none' 
          : 'max-w-6xl mx-auto rounded-t-xl border-t border-x border-[#30363d] shadow-2xl'
      }`}
    >
      {/* iOS App Navigation Header - Compact height with offline persistence indicators */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="h-10 px-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-[#c9d1d9] shrink-0 z-20"
      >
        <div className="flex items-center gap-2">
          {/* iOS Back to Home Button */}
          <button
            onClick={onClose}
            className="p-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white flex items-center gap-0.5 text-[11px] font-semibold px-2 transition-colors border border-[#30363d] active:scale-95"
            title="Return to Springboard (Esc)"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Home</span>
          </button>

          {/* App Title & Identity */}
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}>
              📱
            </div>
            <div>
              <h3 className="text-xs font-bold text-white leading-none">{app.name}</h3>
            </div>
          </div>

          {/* Offline Persistence & Service Worker Status Pill */}
          <div className="relative ml-2 hidden sm:block">
            <button
              onClick={() => setShowOfflineDetails(!showOfflineDetails)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${
                !isOnline
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                  : justSavedLocal
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-[#8b949e] hover:text-white border-[#30363d] hover:border-[#58a6ff]'
              }`}
              title="Click to view Service Worker & Offline Persistence status"
            >
              {!isOnline ? (
                <>
                  <WifiOff className="w-2.5 h-2.5 text-amber-400" />
                  <span>Offline Storage Active</span>
                  {pendingSyncCount > 0 && (
                    <span className="bg-amber-500 text-black px-1 rounded-full text-[9px] font-bold">
                      {pendingSyncCount}
                    </span>
                  )}
                </>
              ) : justSavedLocal ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Cached Locally</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#c9d1d9]">Cloud Synced</span>
                </>
              )}
            </button>

            {/* Offline Cache Info Dropdown Popover */}
            <AnimatePresence>
              {showOfflineDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-7 w-64 p-2.5 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl text-xs z-50 text-[#c9d1d9]"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#30363d] mb-2">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mini-App Persistence Layer</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">SW v2</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Network State:</span>
                      <span className={`font-semibold flex items-center gap-1 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Service Worker:</span>
                      <span className="text-indigo-300 font-medium">Active (Cache-First)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Cached Records:</span>
                      <span className="font-mono text-white">{cachedItemsCount} items</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Pending Cloud Queue:</span>
                      <span className="font-mono text-amber-300">{pendingSyncCount} edits</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Last Sync:</span>
                      <span className="text-[#8b949e]">{lastSyncTime}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#30363d] flex items-center justify-between">
                    <button
                      onClick={() => {
                        snapshotMiniAppData(app.id, { manualCache: true, timestamp: Date.now() });
                        setJustSavedLocal(true);
                        setTimeout(() => setJustSavedLocal(false), 1500);
                      }}
                      className="w-full py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Take Data Snapshot</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mode Switcher & Controls */}
        <div className="flex items-center gap-1.5">
          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-[#0d1117] p-0.5 rounded-lg border border-[#30363d] text-[10px]">
            <button
              onClick={() => setMode('native')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${mode === 'native' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[#8b949e] hover:text-white'}`}
            >
              <Cloud className="w-2.5 h-2.5" />
              <span>Native</span>
            </button>
            <button
              onClick={() => setMode('iframe')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${mode === 'iframe' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[#8b949e] hover:text-white'}`}
            >
              <Globe className="w-2.5 h-2.5" />
              <span>GitHub Pages</span>
            </button>
          </div>

          {/* GitHub Repo Link */}
          <a
            href={app.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors hidden md:flex"
            title="Open GitHub Repository"
          >
            <Github className="w-3.5 h-3.5" />
          </a>

          {/* Open Deployment in New Tab */}
          <a
            href={app.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Open Deployed WebApp"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* IFrame Refresh */}
          {mode === 'iframe' && (
            <button
              onClick={() => setIframeKey(k => k + 1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Refresh IFrame"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </motion.div>

      {/* Mini App Content View */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.08 }}
        className="flex-1 w-full relative overflow-hidden flex flex-col min-h-0"
      >
        {mode === 'iframe' ? (
          <iframe
            key={iframeKey}
            src={app.deployedUrl}
            title={app.name}
            className="w-full h-full border-none bg-white"
            allow="camera; microphone; geolocation; autoplay; clipboard-write; encrypted-media"
          />
        ) : (
          renderNativeApp()
        )}
      </motion.div>

      {/* iOS Bottom Home Bar Indicator Gesture (Click or Tap to dismiss smoothly) */}
      <div 
        onClick={onClose}
        className="h-3.5 w-full bg-[#161b22] border-t border-[#30363d]/60 flex items-center justify-center cursor-pointer hover:bg-[#21262d] transition-colors group shrink-0"
        title="Click to return to Home Screen (Esc)"
      >
        <div className="w-28 h-1 bg-white/20 rounded-full group-hover:bg-white/50 group-hover:w-32 transition-all" />
      </div>
    </motion.div>
  );
};
