/**
 * @file App.tsx
 * @description Main application controller for Harmony OS Super App ecosystem.
 * Integrates all Harmony WebApps (Notes, Docs, Writing, Music Player, Docs AI) in iOS style UI with Firebase sync.
 */

import React, { useState, useEffect } from 'react';
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
  Track
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
  saveHarmonyAiChat 
} from './lib/firebase';
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

  // Synced Firestore Data
  const [notes, setNotes] = useState<HarmonyNote[]>([]);
  const [docs, setDocs] = useState<HarmonyDoc[]>([]);
  const [drafts, setDrafts] = useState<HarmonyWritingDraft[]>([]);
  const [playlists, setPlaylists] = useState<HarmonyPlaylist[]>([]);
  const [aiChats, setAiChats] = useState<HarmonyAiChat[]>([]);

  // System Settings
  const [settings, setSettings] = useState<SystemSettings>({
    isDarkMode: true,
    volume: 0.8,
    brightness: 1,
    typewriterSounds: true,
    hapticFeedback: true,
    defaultViewMode: 'native',
    accentColor: '#8b5cf6'
  });

  // Service Worker Registration for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
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

  // Real-time Firestore Data Listeners
  useEffect(() => {
    if (!user) return;

    const unsubNotes = subscribeHarmonyNotes(user.uid, (data) => setNotes(data));
    const unsubDocs = subscribeHarmonyDocs(user.uid, (data) => setDocs(data));
    const unsubDrafts = subscribeHarmonyDrafts(user.uid, (data) => setDrafts(data));
    const unsubPlaylists = subscribeHarmonyPlaylists(user.uid, (data) => setPlaylists(data));
    const unsubChats = subscribeHarmonyAiChats(user.uid, (data) => setAiChats(data));

    return () => {
      if (unsubNotes) unsubNotes();
      if (unsubDocs) unsubDocs();
      if (unsubDrafts) unsubDrafts();
      if (unsubPlaylists) unsubPlaylists();
      if (unsubChats) unsubChats();
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

  return (
    <div id="harmony-os-root" className="w-screen h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden select-none relative">
      {/* Dynamic Background Wallpaper Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#161b22] via-[#0d1117] to-black pointer-events-none" />

      {/* iOS Top Status Bar */}
      <StatusBar
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        activeMusicTrack={isPlayingMusic && currentTrack ? `${currentTrack.title} • ${currentTrack.artist}` : undefined}
        isFirebaseConnected={!!user}
      />

      {/* Primary View Router: Active Mini App OR Home Screen */}
      <main className="flex-1 w-full flex flex-col relative z-10 overflow-hidden min-h-0">
        {activeAppConfig ? (
          <AppRunner
            app={activeAppConfig}
            onClose={handleCloseActiveApp}
            user={user}
            defaultMode={settings.defaultViewMode}
            notes={notes}
            onSaveNote={(note) => saveHarmonyNote(user?.uid || 'guest', note)}
            onDeleteNote={(id) => deleteHarmonyNote(id)}
            docs={docs}
            onSaveDoc={(docItem) => saveHarmonyDoc(user?.uid || 'guest', docItem)}
            onDeleteDoc={(id) => deleteHarmonyDoc(id)}
            drafts={drafts}
            onSaveDraft={(draft) => saveHarmonyDraft(user?.uid || 'guest', draft)}
            onDeleteDraft={(id) => deleteHarmonyDraft(id)}
            playlists={playlists}
            onSavePlaylist={(pl) => saveHarmonyPlaylist(user?.uid || 'guest', pl)}
            aiChats={aiChats}
            onSaveAiChat={(chat) => saveHarmonyAiChat(user?.uid || 'guest', chat)}
            onPlayTrack={(track) => {
              setCurrentTrack(track);
              setIsPlayingMusic(true);
            }}
          />
        ) : (
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
          />
        )}
      </main>

      {/* iOS Bottom Floating Dock */}
      {!activeAppId && (
        <Dock
          onOpenApp={handleOpenApp}
          onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          activeAppId={activeAppId}
        />
      )}

      {/* Overlays & Modals */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => setSettings(prev => ({ ...prev, ...updated }))}
        isFirebaseConnected={!!user}
        userEmail={user?.email || user?.displayName}
      />

      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onOpenApp={handleOpenApp}
        notes={notes}
        docs={docs}
        drafts={drafts}
      />

      <AppSwitcher
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        openAppIds={openAppIds}
        activeAppId={activeAppId}
        onSelectApp={(appId) => handleOpenApp(appId)}
        onCloseApp={handleCloseAppFromSwitcher}
        onCloseAllApps={handleCloseAllApps}
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
        onUpdateSettings={(updated) => setSettings(prev => ({ ...prev, ...updated }))}
      />

      {/* Mobile PWA Installation Banner */}
      <PwaInstallPrompt />
    </div>
  );
}
