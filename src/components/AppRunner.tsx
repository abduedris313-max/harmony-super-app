/**
 * @file AppRunner.tsx
 * @description iOS Mini App container frame supporting both GitHub Pages IFrame and Native Firebase modes.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  RotateCw, 
  Github, 
  Maximize2, 
  Minimize2, 
  Cloud, 
  Globe, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { MiniAppConfig, SystemUser, HarmonyNote, HarmonyDoc, HarmonyWritingDraft, HarmonyPlaylist, HarmonyAiChat } from '../types';
import { HarmonyNotesApp } from './mini-apps/HarmonyNotesApp';
import { HarmonyDocsApp } from './mini-apps/HarmonyDocsApp';
import { HarmonyWritingApp } from './mini-apps/HarmonyWritingApp';
import { HarmonyMusicPlayerApp } from './mini-apps/HarmonyMusicPlayerApp';
import { HarmonyDocsAiApp } from './mini-apps/HarmonyDocsAiApp';

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
  onPlayTrack?: (track: any) => void;
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
  onPlayTrack
}) => {
  const [mode, setMode] = useState<'native' | 'iframe'>(defaultMode);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderNativeApp = () => {
    switch (app.id) {
      case 'harmony-notes':
        return (
          <HarmonyNotesApp
            user={user}
            notes={notes}
            onSaveNote={onSaveNote}
            onDeleteNote={onDeleteNote}
          />
        );
      case 'harmony-docs':
        return (
          <HarmonyDocsApp
            user={user}
            docs={docs}
            onSaveDoc={onSaveDoc}
            onDeleteDoc={onDeleteDoc}
          />
        );
      case 'harmony-writing':
        return (
          <HarmonyWritingApp
            user={user}
            drafts={drafts}
            onSaveDraft={onSaveDraft}
            onDeleteDraft={onDeleteDraft}
          />
        );
      case 'harmony-music-player':
        return (
          <HarmonyMusicPlayerApp
            user={user}
            playlists={playlists}
            onSavePlaylist={onSavePlaylist}
            onPlayTrack={onPlayTrack}
          />
        );
      case 'harmony-docs-ai':
        return (
          <HarmonyDocsAiApp
            user={user}
            aiChats={aiChats}
            onSaveAiChat={onSaveAiChat}
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

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0, y: 30 }}
      className={`w-full flex-1 flex flex-col bg-[#0d1117] overflow-hidden relative ${isFullscreen ? 'fixed inset-0 z-50' : 'max-w-6xl mx-auto rounded-t-2xl border-t border-x border-[#30363d] shadow-2xl'}`}
    >
      {/* iOS App Navigation Header */}
      <div className="h-14 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-[#c9d1d9] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white flex items-center gap-1 text-xs font-semibold px-2.5 transition-colors border border-[#30363d]"
          >
            <ChevronLeft className="w-4 h-4 text-indigo-400" />
            <span>Home</span>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
              📱
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{app.name}</h3>
              <p className="text-[10px] text-[#8b949e] leading-tight hidden sm:block">{app.tagline}</p>
            </div>
          </div>
        </div>

        {/* Mode Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-[#0d1117] p-1 rounded-xl border border-[#30363d] text-xs">
            <button
              onClick={() => setMode('native')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${mode === 'native' ? 'bg-indigo-600 text-white shadow-md' : 'text-[#8b949e] hover:text-white'}`}
            >
              <Cloud className="w-3 h-3" />
              <span>Native</span>
            </button>
            <button
              onClick={() => setMode('iframe')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${mode === 'iframe' ? 'bg-indigo-600 text-white shadow-md' : 'text-[#8b949e] hover:text-white'}`}
            >
              <Globe className="w-3 h-3" />
              <span>GitHub Pages</span>
            </button>
          </div>

          {/* GitHub Repo Link */}
          <a
            href={app.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors hidden md:flex"
            title="Open GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Open Deployment in New Tab */}
          <a
            href={app.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Open Deployed WebApp"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* IFrame Refresh */}
          {mode === 'iframe' && (
            <button
              onClick={() => setIframeKey(k => k + 1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Refresh IFrame"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mini App Content View */}
      <div className="flex-1 w-full relative overflow-hidden flex flex-col">
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
      </div>
    </motion.div>
  );
};
