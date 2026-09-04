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

export interface HarmonyCalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  location?: string;
  // Gregorian anchor ISO date (YYYY-MM-DD)
  gregorianDate: string;
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  allDay: boolean;
  color?: string;
  category?: 'Personal' | 'Work' | 'Religious' | 'Holiday' | 'Other';
  // Cached tri-calendar dates
  hijriDate?: string;
  ethiopianDate?: string;
  // Google Calendar integration
  googleEventId?: string;
  syncedToGoogle?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type ThemePreset = 'slate' | 'oled' | 'sunset' | 'emerald' | 'lavender';

export interface SystemSettings {
  isDarkMode: boolean;
  themeMode?: ThemeMode;
  themePreset?: ThemePreset;
  volume: number;
  brightness: number;
  typewriterSounds: boolean;
  hapticFeedback: boolean;
  defaultViewMode: 'native' | 'iframe'; // 'iframe' loads GitHub Pages deployment, 'native' loads Firebase cloud version
  accentColor: string;
  focusMode: boolean; // Focus Mode: suppresses notifications and mutes non-essential system sounds
  // Dock Configuration
  dockAppIds?: string[]; // Ordered list of app IDs pinned to the dock
  dockMaxSmallScreen?: number; // Maximum apps on small screen (<640px, default: 5)
  dockMaxLargeScreen?: number; // Maximum apps on large screen (>=640px, default: 7)
  updatedAt?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  appName?: string;
  icon?: string;
  suppressedByFocus?: boolean;
}

export interface SystemUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
