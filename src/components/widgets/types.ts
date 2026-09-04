/**
 * @file types.ts
 * @description Type definitions for the Harmony Home Screen Widget Framework.
 */

export type HomeWidgetId = 'calendar' | 'finance' | 'music' | 'docs-ai' | 'notes' | 'writing';

export interface HomeWidgetMeta {
  id: HomeWidgetId;
  appId: string;
  title: string;
  category: string;
  icon: string;
  defaultEnabled: boolean;
  description: string;
}

export const AVAILABLE_WIDGETS: HomeWidgetMeta[] = [
  {
    id: 'calendar',
    appId: 'harmony-calendar',
    title: 'Tri-Calendar',
    category: 'Time & Planning',
    icon: 'calendar',
    defaultEnabled: true,
    description: 'Today’s Gregorian, Hijri, and Ethiopian dates with upcoming agenda items.'
  },
  {
    id: 'finance',
    appId: 'harmony-finance',
    title: 'Finance & Ledger',
    category: 'Finance',
    icon: 'wallet',
    defaultEnabled: true,
    description: 'Net worth snapshot, monthly cash flow, and category budget health.'
  },
  {
    id: 'music',
    appId: 'harmony-music-player',
    title: 'Music Player',
    category: 'Audio',
    icon: 'disc',
    defaultEnabled: true,
    description: 'Now playing track or ambient stream with instant play/pause control.'
  },
  {
    id: 'docs-ai',
    appId: 'harmony-docs-ai',
    title: 'Gemini AI Copilot',
    category: 'Productivity',
    icon: 'sparkles',
    defaultEnabled: true,
    description: 'Quick document summarizer and creative writing prompts.'
  },
  {
    id: 'notes',
    appId: 'harmony-notes',
    title: 'Quick Notes',
    category: 'Productivity',
    icon: 'notebook',
    defaultEnabled: false,
    description: 'Recent thoughts, category tags, and one-tap note capture.'
  },
  {
    id: 'writing',
    appId: 'harmony-writing',
    title: 'Writing Target',
    category: 'Creativity',
    icon: 'pen-tool',
    defaultEnabled: false,
    description: 'Daily word goal progress ring and focus streak tracker.'
  }
];
