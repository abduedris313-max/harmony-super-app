/**
 * @file apps.ts
 * @description Catalog & Metadata for all Harmony Projects mini apps.
 */

import { MiniAppConfig } from '../types';
import { getLucideCdnIconUrl } from '../lib/cdn';

export const HARMONY_APPS: MiniAppConfig[] = [
  {
    id: 'harmony-notes',
    name: 'Harmony Notes',
    tagline: 'Smart Notes & Category Organizers',
    iconName: 'notebook',
    iconCdnUrl: getLucideCdnIconUrl('notebook'),
    colorGradient: 'from-amber-400 via-orange-500 to-amber-600',
    bgHex: '#f59e0b',
    deployedUrl: 'https://abduedris313-max.github.io/harmony-notes/',
    repoUrl: 'https://github.com/abduedris313-max/harmony-notes',
    description: 'Capture quick thoughts, bullet points, voice memos, and tagged categories.',
    badge: 'Notes'
  },
  {
    id: 'harmony-docs',
    name: 'Harmony Docs',
    tagline: 'Rich Text Workspace & Documents',
    iconName: 'file-text',
    iconCdnUrl: getLucideCdnIconUrl('file-text'),
    colorGradient: 'from-blue-500 via-indigo-500 to-cyan-600',
    bgHex: '#3b82f6',
    deployedUrl: 'https://abduedris313-max.github.io/harmony-docs/',
    repoUrl: 'https://github.com/abduedris313-max/harmony-docs',
    description: 'Collaborative document editing, word counting, formatting, and exported PDFs.',
    badge: 'Docs'
  },
  {
    id: 'harmony-writing',
    name: 'Harmony Writing',
    tagline: 'Focus Studio & Daily Word Target',
    iconName: 'pen-tool',
    iconCdnUrl: getLucideCdnIconUrl('pen-tool'),
    colorGradient: 'from-emerald-400 via-teal-500 to-emerald-600',
    bgHex: '#10b981',
    deployedUrl: 'https://abduedris313-max.github.io/harmony-writing/',
    repoUrl: 'https://github.com/abduedris313-max/harmony-writing',
    description: 'Distraction-free typewriter environment, soundscapes, ambient timers, and stats.',
    badge: 'Studio'
  },
  {
    id: 'harmony-music-player',
    name: 'Harmony Music',
    tagline: 'Hi-Fi Playlists & Audio Synth',
    iconName: 'disc',
    iconCdnUrl: getLucideCdnIconUrl('disc'),
    colorGradient: 'from-fuchsia-500 via-purple-600 to-pink-500',
    bgHex: '#d946ef',
    deployedUrl: 'https://abduedris313-max.github.io/harmony-music-player/',
    repoUrl: 'https://github.com/abduedris313-max/harmony-music-player',
    description: 'iOS style Music Player with ambient streams, custom playlists, equalizer, and background mode.',
    badge: 'Audio'
  },
  {
    id: 'harmony-docs-ai',
    name: 'Harmony Docs AI',
    tagline: 'Gemini Document Intelligence & Copilot',
    iconName: 'sparkles',
    iconCdnUrl: getLucideCdnIconUrl('sparkles'),
    colorGradient: 'from-violet-500 via-purple-600 to-indigo-700',
    bgHex: '#8b5cf6',
    deployedUrl: 'https://abduedris313-max.github.io/harmony-docs-ai/',
    repoUrl: 'https://github.com/abduedris313-max/harmony-docs-ai',
    description: 'Ask questions, summarize long documents, generate outlines, and refine draft prose.',
    badge: 'AI'
  }
];
