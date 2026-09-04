/**
 * @file App.tsx
 * @description Main application controller for Harmony OS Super App ecosystem.
 * Integrates all Harmony WebApps (Notes, Docs, Writing, Music Player, Docs AI) in iOS style UI with Firebase sync.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HARMONY_APPS } from './config/apps';
import { 
  MiniAppConfig, 
  SystemSettings, 
  SystemUser, 
  HarmonyNote, 
  HarmonyDoc, 
  HarmonyWritingDraft, 
  HarmonyPlaylist, 
  HarmonyAiChat,
  HarmonyCalendarEvent,
  Track,
  SystemNotification
} from './types';
import { 
  subscribeToAuth, 
  loginAnonymously, 
  subscribeHarmonyNotes, 
  saveHarmonyNote, 
  deleteHarmonyNote, 
  subscribeHarmonyDocs, 
  saveHarmonyDoc, 
  deleteHarmonyDoc, 
  subscribeHarmonyDrafts, 
  saveHarmonyDraft, 
  deleteHarmonyDraft, 
  subscribeHarmonyPlaylists, 
  saveHarmonyPlaylist, 
  subscribeHarmonyAiChats, 
  saveHarmonyAiChat,
  saveHarmonyCalendarEvent,
  deleteHarmonyCalendarEvent,
  subscribeHarmonyCalendarEvents,
  saveSystemSettings,
  subscribeSystemSettings
} from './lib/firebase';
import { 
  getLocalItem, 
  setLocalItem,
  STORAGE_KEYS, 
  INITIAL_OFFLINE_NOTES, 
  INITIAL_OFFLINE_DOCS, 
  INITIAL_OFFLINE_DRAFTS, 
  INITIAL_OFFLINE_PLAYLISTS,
  INITIAL_OFFLINE_EVENTS,
  DEFAULT_SYSTEM_SETTINGS
} from './lib/offlinePersistence';
import { soundManager } from './lib/soundManager';
import { StatusBar } from './components/StatusBar';
import { HomeScreen } from './components/HomeScreen';
import { Dock } from './components/Dock';
import { ControlCenter } from './components/ControlCenter';
import { SpotlightSearch } from './components/SpotlightSearch';
import { AppSwitcher } from './components/AppSwitcher';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { AppRunner } from './components/AppRunner';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { NotificationBanner } from './components/NotificationBanner';

export default function App() {
  // Navigation & View States
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [openAppIds, setOpenAppIds] = useState<string[]>([]);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio & Music State
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>({
    id: 't-1',
    title: 'Harmony Ambient Flow',
    artist: 'Harmony Soundscapes',
    album: 'Serenade OS Vol. 1',
    duration: 180,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
    genre: 'Ambient Chill'
  });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // User Auth State
  const [user, setUser] = useState<SystemUser | null>(null);

  // Synced Firestore Data with Offline Cache Fallback
  const [notes, setNotes] = useState<HarmonyNote[]>(() => {
    return getLocalItem<HarmonyNote[]>(STORAGE_KEYS.NOTES, INITIAL_OFFLINE_NOTES);
  });
  const [docs, setDocs] = useState<HarmonyDoc[]>(() => {
    return getLocalItem<HarmonyDoc[]>(STORAGE_KEYS.DOCS, INITIAL_OFFLINE_DOCS);
  });
  const [drafts, setDrafts] = useState<HarmonyWritingDraft[]>(() => {
    return getLocalItem<HarmonyWritingDraft[]>(STORAGE_KEYS.DRAFTS, INITIAL_OFFLINE_DRAFTS);
  });
  const [playlists, setPlaylists] = useState<HarmonyPlaylist[]>(() => {
    return getLocalItem<HarmonyPlaylist[]>(STORAGE_KEYS.PLAYLISTS, INITIAL_OFFLINE_PLAYLISTS);
  });
  const [aiChats, setAiChats] = useState<HarmonyAiChat[]>(() => {
    return getLocalItem<HarmonyAiChat[]>(STORAGE_KEYS.AI_CHATS, []);
  });
  const [calendarEvents, setCalendarEvents] = useState<HarmonyCalendarEvent[]>(() => {
    return getLocalItem<HarmonyCalendarEvent[]>(STORAGE_KEYS.CALENDAR, INITIAL_OFFLINE_EVENTS);
  });

  // Pinned Apps for Home Screen personalization
  const DEFAULT_PINNED_APPS = HARMONY_APPS.map(a => a.id);
  const [pinnedAppIds, setPinnedAppIds] = useState<string[]>(() => {
    return getLocalItem<string[]>(STORAGE_KEYS.PINNED_APPS, DEFAULT_PINNED_APPS);
  });

  // Toggle pinning/unpinning apps from the Home Screen
  const handleTogglePinApp = (appId: string) => {
    setPinnedAppIds((prev) => {
      let next: string[];
      const appConfig = HARMONY_APPS.find(a => a.id === appId);
      const appName = appConfig ? appConfig.name : 'App';
      if (prev.includes(appId)) {
        if (prev.length <= 1) {
          triggerNotification('Layout Notice', 'At least 1 app must remain pinned to your Home Screen.', 'App Store');
          return prev;
        }
        next = prev.filter(id => id !== appId);
        triggerNotification('App Unpinned', `${appName} moved to App Library.`, 'App Store');
      } else {
        next = [...prev, appId];
        triggerNotification('App Pinned', `${appName} is now pinned to Home Screen.`, 'App Store');
      }
      setLocalItem(STORAGE_KEYS.PINNED_APPS, next);
      soundManager.playClickSound();
      return next;
    });
  };

  // System Settings with Offline Storage Cache & soundManager synchronization
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = getLocalItem<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SYSTEM_SETTINGS);
    soundManager.setSettings(saved);
    return saved;
  });

  // Notifications State (Focus Mode suppression engine)
  const [activeNotification, setActiveNotification] = useState<SystemNotification | null>(null);
  const [suppressedNotifications, setSuppressedNotifications] = useState<SystemNotification[]>(() => {
    return getLocalItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  });

  // Keep soundManager updated when settings change
  useEffect(() => {
    soundManager.setSettings(settings);
  }, [settings]);

  // Unified Notification Trigger respecting Focus Mode
  const triggerNotification = (title: string, message: string, appName: string = 'Harmony OS') => {
    const notif: SystemNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      title,
      message,
      appName,
      timestamp: new Date().toISOString(),
      suppressedByFocus: settings.focusMode
    };

    if (settings.focusMode) {
      // Silently log to suppressed notifications - no visual banner, no chime
      setSuppressedNotifications((prev) => {
        const next = [notif, ...prev].slice(0, 30);
        setLocalItem(STORAGE_KEYS.NOTIFICATIONS, next);
        return next;
      });
    } else {
      // Normal mode: Play harmonic chime and display animated iOS top banner
      soundManager.playNotificationChime();
      setActiveNotification(notif);
    }
  };

  // Test notification helper for Control Center
  const handleTriggerTestNotification = () => {
    if (settings.focusMode) {
      triggerNotification(
        'Calendar Event: Sprint Review',
        'Silently suppressed by Focus Mode to prevent interruption.',
        'Harmony Focus'
      );
    } else {
      triggerNotification(
        'Cloud Sync Successful',
        'Your theme preferences and volume settings are synced to Firebase.',
        'Harmony Cloud'
      );
    }
  };

  const handleClearSuppressedNotifications = () => {
    setSuppressedNotifications([]);
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, []);
    soundManager.playHapticClick();
  };

  // Update System Settings with instant local persistence & Firestore multi-device synchronization
  const handleUpdateSettings = (updated: Partial<SystemSettings>) => {
    setSettings((prev) => {
      let resolvedDarkMode = updated.isDarkMode ?? prev.isDarkMode;
      if (updated.themeMode === 'system') {
        resolvedDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else if (updated.themeMode === 'dark') {
        resolvedDarkMode = true;
      } else if (updated.themeMode === 'light') {
        resolvedDarkMode = false;
      }

      const next: SystemSettings = { 
        ...prev, 
        ...updated,
        isDarkMode: resolvedDarkMode
      };
      setLocalItem(STORAGE_KEYS.SETTINGS, next);
      soundManager.setSettings(next);

      // Persist to Firebase if user is logged in
      if (user?.uid) {
        saveSystemSettings(user.uid, next).catch((err) => {
          console.warn('[Firebase SystemSettings Save Error]', err);
        });
      }
      return next;
    });
  };

  // Sync document root class and data-theme with settings
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (settings.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.setAttribute('data-theme', settings.themePreset || 'slate');
    }
  }, [settings.isDarkMode, settings.themePreset]);

  // Listen for OS system color scheme changes when themeMode is 'system'
  useEffect(() => {
    if (settings.themeMode !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSchemeChange = (e: MediaQueryListEvent) => {
      handleUpdateSettings({ isDarkMode: e.matches });
    };

    // Ensure initial sync
    if (mediaQuery.matches !== settings.isDarkMode) {
      handleUpdateSettings({ isDarkMode: mediaQuery.matches });
    }

    mediaQuery.addEventListener('change', handleSchemeChange);
    return () => mediaQuery.removeEventListener('change', handleSchemeChange);
  }, [settings.themeMode]);

  // Service Worker Registration for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
    }
  }, []);

  // Firebase Auth Subscription
  useEffect(() => {
    const unsubscribe = subscribeToAuth((fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (fbUser.isAnonymous ? 'Guest User' : fbUser.email?.split('@')[0] || 'User'),
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous
        });
      } else {
        // Auto sign-in anonymously for instant access
        loginAnonymously();
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Data & Settings Listeners
  useEffect(() => {
    if (!user) return;

    const unsubNotes = subscribeHarmonyNotes(user.uid, (data) => setNotes(data));
    const unsubDocs = subscribeHarmonyDocs(user.uid, (data) => setDocs(data));
    const unsubDrafts = subscribeHarmonyDrafts(user.uid, (data) => setDrafts(data));
    const unsubPlaylists = subscribeHarmonyPlaylists(user.uid, (data) => setPlaylists(data));
    const unsubChats = subscribeHarmonyAiChats(user.uid, (data) => setAiChats(data));
    const unsubCalendar = subscribeHarmonyCalendarEvents(user.uid, (data) => {
      if (data && data.length > 0) {
        setCalendarEvents(data);
        setLocalItem(STORAGE_KEYS.CALENDAR, data);
      }
    });

    // Multi-device sync for SystemSettings (theme, volume, focusMode)
    const unsubSettings = subscribeSystemSettings(user.uid, (remoteSettings) => {
      if (remoteSettings) {
        setSettings((current) => {
          // Merge remote settings only if there are genuine updates
          const merged: SystemSettings = {
            ...current,
            ...remoteSettings,
          };
          setLocalItem(STORAGE_KEYS.SETTINGS, merged);
          soundManager.setSettings(merged);
          return merged;
        });
      }
    });

    return () => {
      if (unsubNotes) unsubNotes();
      if (unsubDocs) unsubDocs();
      if (unsubDrafts) unsubDrafts();
      if (unsubPlaylists) unsubPlaylists();
      if (unsubChats) unsubChats();
      if (unsubCalendar) unsubCalendar();
      if (unsubSettings) unsubSettings();
    };
  }, [user]);

  // Keyboard shortcut listener for Spotlight (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Launch Mini App
  const handleOpenApp = (appId: string) => {
    setActiveAppId(appId);
    if (!openAppIds.includes(appId)) {
      setOpenAppIds(prev => [...prev, appId]);
    }
  };

  const handleCloseActiveApp = () => {
    setActiveAppId(null);
  };

  const handleCloseAppFromSwitcher = (appId: string) => {
    setOpenAppIds(prev => prev.filter(id => id !== appId));
    if (activeAppId === appId) {
      setActiveAppId(null);
    }
  };

  const handleCloseAllApps = () => {
    setOpenAppIds([]);
    setActiveAppId(null);
    setIsAppSwitcherOpen(false);
  };

  const activeAppConfig = HARMONY_APPS.find(a => a.id === activeAppId);

  const getWallpaperBackground = () => {
    const isDark = settings.isDarkMode;
    switch (settings.themePreset) {
      case 'oled':
        return isDark ? 'bg-black' : 'bg-white';
      case 'sunset':
        return isDark
          ? 'bg-gradient-to-br from-[#271026] via-[#160d1f] to-[#0d0714]'
          : 'bg-gradient-to-br from-[#fff1f2] via-[#fff7ed] to-[#fef2f2]';
      case 'emerald':
        return isDark
          ? 'bg-gradient-to-br from-[#06201a] via-[#081512] to-[#040c0a]'
          : 'bg-gradient-to-br from-[#ecfdf5] via-[#f0fdf4] to-[#e6f4ea]';
      case 'lavender':
        return isDark
          ? 'bg-gradient-to-br from-[#1a122c] via-[#100e1e] to-[#080713]'
          : 'bg-gradient-to-br from-[#f5f3ff] via-[#faf5ff] to-[#ede9fe]';
      case 'slate':
      default:
        return isDark
          ? 'bg-gradient-to-br from-[#161b22] via-[#0d1117] to-black'
          : 'bg-gradient-to-br from-[#e5e5ea] via-[#f2f2f7] to-[#e4e4ed]';
    }
  };

  return (
    <div 
      id="harmony-os-root" 
      className={`w-screen h-screen flex flex-col font-sans overflow-hidden select-none relative transition-colors duration-300 ${
        settings.isDarkMode ? 'bg-[#0d1117] text-[#c9d1d9] dark' : 'bg-[#f2f2f7] text-neutral-800'
      }`}
    >
      {/* Dynamic Background Wallpaper Glow */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-all duration-500 opacity-100 ${getWallpaperBackground()}`} 
      />

      {/* iOS Top Status Bar */}
      <StatusBar
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        activeMusicTrack={isPlayingMusic && currentTrack ? `${currentTrack.title} • ${currentTrack.artist}` : undefined}
        isFirebaseConnected={!!user}
        focusMode={settings.focusMode}
        isDarkMode={settings.isDarkMode}
        onToggleTheme={() => handleUpdateSettings({ 
          isDarkMode: !settings.isDarkMode, 
          themeMode: !settings.isDarkMode ? 'dark' : 'light' 
        })}
      />

      {/* iOS Notification Banner (Shown ONLY when Focus Mode is OFF) */}
      <NotificationBanner
        notification={activeNotification}
        onDismiss={() => setActiveNotification(null)}
        isDarkMode={settings.isDarkMode}
      />

      {/* Primary View Router: Active Mini App OR Home Screen with iOS Transitions */}
      <main className="flex-1 w-full flex flex-col relative z-10 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {activeAppConfig ? (
            <AppRunner
              key={activeAppConfig.id}
              app={activeAppConfig}
              onClose={handleCloseActiveApp}
              user={user}
              defaultMode={settings.defaultViewMode}
              notes={notes}
              onSaveNote={async (note) => {
                const res = await saveHarmonyNote(user?.uid || 'guest', note);
                triggerNotification('Note Saved', `"${note.title}" synced to cloud`, 'Harmony Notes');
                return res;
              }}
              onDeleteNote={(id) => deleteHarmonyNote(id)}
              docs={docs}
              onSaveDoc={async (docItem) => {
                const res = await saveHarmonyDoc(user?.uid || 'guest', docItem);
                triggerNotification('Document Saved', `"${docItem.title}" synced to cloud`, 'Harmony Docs');
                return res;
              }}
              onDeleteDoc={(id) => deleteHarmonyDoc(id)}
              drafts={drafts}
              onSaveDraft={async (draft) => {
                const res = await saveHarmonyDraft(user?.uid || 'guest', draft);
                triggerNotification('Draft Auto-saved', `"${draft.title}" updated`, 'Harmony Writing');
                return res;
              }}
              onDeleteDraft={(id) => deleteHarmonyDraft(id)}
              playlists={playlists}
              onSavePlaylist={(pl) => saveHarmonyPlaylist(user?.uid || 'guest', pl)}
              aiChats={aiChats}
              onSaveAiChat={(chat) => saveHarmonyAiChat(user?.uid || 'guest', chat)}
              calendarEvents={calendarEvents}
              onSaveCalendarEvent={async (calEv) => {
                const res = await saveHarmonyCalendarEvent(user?.uid || 'guest', calEv);
                triggerNotification('Calendar Updated', `"${calEv.title}" synced to cloud`, 'Harmony Calendar');
                return res;
              }}
              onDeleteCalendarEvent={(id) => deleteHarmonyCalendarEvent(id)}
              onPlayTrack={(track) => {
                setCurrentTrack(track);
                setIsPlayingMusic(true);
              }}
              pinnedAppIds={pinnedAppIds}
              onTogglePinApp={handleTogglePinApp}
              onOpenApp={handleOpenApp}
            />
          ) : (
            <motion.div
              key="home-screen-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)', transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="flex-1 w-full flex flex-col min-h-0 overflow-hidden"
            >
              <HomeScreen
                onOpenApp={handleOpenApp}
                onOpenSpotlight={() => setIsSpotlightOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                recentNotes={notes}
                latestDraft={drafts[0]}
                currentTrack={currentTrack}
                isPlayingMusic={isPlayingMusic}
                onTogglePlayMusic={() => setIsPlayingMusic(!isPlayingMusic)}
                userDisplayName={user?.displayName}
                isDarkMode={settings.isDarkMode}
                calendarEvents={calendarEvents}
                pinnedAppIds={pinnedAppIds}
                onTogglePinApp={handleTogglePinApp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* iOS Bottom Floating Dock with entrance/exit spring */}
      <AnimatePresence>
        {!activeAppId && (
          <motion.div
            key="ios-floating-dock"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="w-full pointer-events-auto"
          >
            <Dock
              onOpenApp={handleOpenApp}
              onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
              activeAppId={activeAppId}
              isDarkMode={settings.isDarkMode}
              dockAppIds={settings.dockAppIds}
              dockMaxSmallScreen={settings.dockMaxSmallScreen}
              dockMaxLargeScreen={settings.dockMaxLargeScreen}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onUpdateSettings={handleUpdateSettings}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays & Modals */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isFirebaseConnected={!!user}
        userEmail={user?.email || user?.displayName}
        suppressedNotifications={suppressedNotifications}
        onClearSuppressedNotifications={handleClearSuppressedNotifications}
        onTriggerTestNotification={handleTriggerTestNotification}
      />

      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onOpenApp={handleOpenApp}
        notes={notes}
        docs={docs}
        drafts={drafts}
        isDarkMode={settings.isDarkMode}
      />

      <AppSwitcher
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        openAppIds={openAppIds}
        activeAppId={activeAppId}
        onSelectApp={(appId) => handleOpenApp(appId)}
        onCloseApp={handleCloseAppFromSwitcher}
        onCloseAllApps={handleCloseAllApps}
        isDarkMode={settings.isDarkMode}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Mobile PWA Installation Banner */}
      <PwaInstallPrompt />
    </div>
  );
}
