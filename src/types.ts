/**
 * @file types.ts
 * @description Core TypeScript type definitions for Harmony OS Super App ecosystem.
 */

export interface MiniAppConfig {
  id: string;
  name: string;
  tagline: string;
  iconName: string; // Lucide icon identifier
  iconCdnUrl: string; // Lucide CDN SVG URL
  colorGradient: string; // Tailwind gradient
  bgHex: string;
  deployedUrl: string;
  repoUrl: string;
  description: string;
  badge?: string;
}

export interface HarmonyNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'Personal' | 'Work' | 'Ideas' | 'Drafts';
  tags: string[];
  pinned?: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface HarmonyDoc {
  id: string;
  userId: string;
  title: string;
  content: string;
  wordCount: number;
  readingTimeMinutes: number;
  category: string;
  updatedAt: string;
  createdAt: string;
}

export interface HarmonyWritingDraft {
  id: string;
  userId: string;
  title: string;
  content: string;
  targetWordCount: number;
  currentWordCount: number;
  typewriterSound: boolean;
  theme: 'paper' | 'twilight' | 'cyber' | 'sepia';
  updatedAt: string;
  createdAt: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string; // audio source or synthetic synth audio
  genre: string;
}

export interface HarmonyPlaylist {
  id: string;
  userId: string;
  name: string;
  tracks: Track[];
  updatedAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface HarmonyAiChat {
  id: string;
  userId: string;
  docTitle: string;
  messages: AiChatMessage[];
  updatedAt: string;
}

export interface SystemSettings {
  isDarkMode: boolean;
  volume: number;
  brightness: number;
  typewriterSounds: boolean;
  hapticFeedback: boolean;
  defaultViewMode: 'native' | 'iframe'; // 'iframe' loads GitHub Pages deployment, 'native' loads Firebase cloud version
  accentColor: string;
}

export interface SystemUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
