/**
 * @file offlinePersistence.ts
 * @description Resilient offline persistence layer and Service Worker caching interface for Harmony OS Super App.
 * Ensures all mini-apps (Notes, Docs, Writing, Music Player, Docs AI) remain fully accessible and editable offline.
 */

import { useState, useEffect, useCallback } from 'react';
import { HarmonyNote, HarmonyDoc, HarmonyWritingDraft, HarmonyPlaylist, HarmonyAiChat, HarmonyCalendarEvent, SystemSettings } from '../types';
import { FinanceTransaction, FinanceAccount, FinanceBudget, FinanceLoan, FinanceSubscription } from '../apps/finance/types';

// Storage keys used across AppRunner and individual mini-apps
export const STORAGE_KEYS = {
  NOTES: 'harmony_notes_data',
  DOCS: 'harmony_docs_data',
  DRAFTS: 'harmony_writing_data',
  PLAYLISTS: 'harmony_music_data',
  AI_CHATS: 'harmony_docs_ai_data',
  CALENDAR: 'harmony_calendar_data',
  FINANCE_TRANSACTIONS: 'harmony_finance_transactions_data',
  FINANCE_ACCOUNTS: 'harmony_finance_accounts_data',
  FINANCE_BUDGETS: 'harmony_finance_budgets_data',
  FINANCE_LOANS: 'harmony_finance_loans_data',
  FINANCE_SUBSCRIPTIONS: 'harmony_finance_subscriptions_data',
  PINNED_APPS: 'harmony_pinned_apps_v1',
  HOME_WIDGETS: 'harmony_home_widgets_v1',
  SETTINGS: 'harmony_system_settings_v1',
  NOTIFICATIONS: 'harmony_system_notifications_v1',
  SYSTEM_NOTES: 'harmony_offline_notes',
  SYSTEM_DOCS: 'harmony_offline_docs',
  SYSTEM_DRAFTS: 'harmony_offline_drafts',
  SYSTEM_PLAYLISTS: 'harmony_offline_playlists',
  SYSTEM_CHATS: 'harmony_offline_aichats',
  SYSTEM_CALENDAR: 'harmony_offline_calendar',
  SYNC_QUEUE: 'harmony_offline_sync_queue',
  LAST_SYNC: 'harmony_last_sync_timestamp',
} as const;

export const DEFAULT_DOCK_APP_IDS: string[] = [
  'harmony-notes',
  'harmony-docs',
  'harmony-writing',
  'harmony-music-player',
  'harmony-app-store',
  'harmony-calendar',
  'harmony-finance',
  'harmony-docs-ai'
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  isDarkMode: true,
  themeMode: 'dark',
  themePreset: 'slate',
  volume: 0.8,
  brightness: 1,
  typewriterSounds: true,
  hapticFeedback: true,
  defaultViewMode: 'native',
  accentColor: '#8b5cf6',
  focusMode: false,
  dockAppIds: DEFAULT_DOCK_APP_IDS,
  dockMaxSmallScreen: 5,
  dockMaxLargeScreen: 7,
};

export interface QueuedSyncAction {
  id: string;
  entity: 'notes' | 'docs' | 'drafts' | 'playlists' | 'aichats' | 'calendar';
  action: 'save' | 'delete';
  payload: any;
  timestamp: number;
}

// Default initial datasets if storage is empty offline
export const INITIAL_OFFLINE_NOTES: HarmonyNote[] = [
  {
    id: 'offline-note-1',
    userId: 'offline-user',
    title: '📱 Offline Cache & Service Worker Ready',
    content: `# Offline First in Harmony OS

All core mini-apps in Harmony OS are backed by a Service Worker and an in-browser persistence layer.

## How it works:
1. **Instant Offline Access**: Every note, doc, and draft is cached in LocalStorage & Service Worker Cache.
2. **Background Sync Queue**: Changes made while disconnected are queued and automatically pushed to Firebase when connectivity resumes.
3. **PWA Compliance**: The app shell, assets, and data remain available even with zero network.`,
    category: 'Work',
    tags: ['Offline', 'PWA', 'Architecture'],
    pinned: true,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'offline-note-2',
    userId: 'offline-user',
    title: '💡 Quick Offline Scratchpad',
    content: `Jot down thoughts anywhere, on any device. Changes sync seamlessly once you're back online.`,
    category: 'Ideas',
    tags: ['Scratchpad', 'Notes'],
    pinned: false,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const INITIAL_OFFLINE_DOCS: HarmonyDoc[] = [
  {
    id: 'offline-doc-1',
    userId: 'offline-user',
    title: '📖 Harmony Super App Offline Guide',
    content: `# Harmony Super App Offline Architecture

The Harmony Super App uses a dual-engine architecture:
- **Cloud Firestore**: Real-time multi-device synchronization when online.
- **Service Worker Cache & Offline Persistence**: Complete offline capability for Native Mini-Apps.

### Caching Strategy:
- **App Shell**: Cached on first load using the Cache API.
- **Data Persistence**: Synced to LocalStorage and posted to Service Worker cache snapshots.
- **Graceful Fallback**: Native mini-apps seamlessly switch to local cache when offline.`,
    wordCount: 82,
    readingTimeMinutes: 1,
    category: 'Documentation',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_DRAFTS: HarmonyWritingDraft[] = [
  {
    id: 'offline-draft-1',
    userId: 'offline-user',
    title: 'Midnight Musings (Offline Draft)',
    content: `The hum of the machine is quiet now. Through the glass, the faint glow of city lights scatters across the desk. Words flow uninterrupted, saved directly to local storage.`,
    targetWordCount: 500,
    currentWordCount: 31,
    typewriterSound: true,
    theme: 'twilight',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_PLAYLISTS: HarmonyPlaylist[] = [
  {
    id: 'offline-playlist-1',
    userId: 'offline-user',
    name: 'Lo-Fi Focus & Offline Beats',
    tracks: [
      {
        id: 't-1',
        title: 'Harmony Ambient Flow',
        artist: 'Harmony Soundscapes',
        album: 'Serenade OS Vol. 1',
        duration: 180,
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
        genre: 'Ambient Chill'
      },
      {
        id: 't-2',
        title: 'Deep Coding Frequency',
        artist: 'SynthWave Harmony',
        album: 'Serenade OS Vol. 1',
        duration: 215,
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
        genre: 'Lo-Fi Chill'
      }
    ],
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_EVENTS: HarmonyCalendarEvent[] = [
  {
    id: 'cal-event-1',
    userId: 'offline-user',
    title: 'Enkutatash (Ethiopian New Year)',
    description: 'National holiday marking the start of Meskerem in the Ethiopian calendar.',
    location: 'Addis Ababa & Global Diaspora',
    gregorianDate: '2026-09-11',
    startTime: '09:00',
    endTime: '17:00',
    allDay: true,
    category: 'Holiday',
    color: '#10b981',
    hijriDate: '29 Safar 1448 AH',
    ethiopianDate: '1 Meskerem 2019 EE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cal-event-2',
    userId: 'offline-user',
    title: 'Mawlid an-Nabi (Prophet\'s Birthday)',
    description: '12 Rabi al-Awwal observed across Islamic lunar calendar communities.',
    location: 'Global',
    gregorianDate: '2026-09-24',
    startTime: '10:00',
    endTime: '14:00',
    allDay: true,
    category: 'Religious',
    color: '#8b5cf6',
    hijriDate: '12 Rabi I 1448 AH',
    ethiopianDate: '14 Meskerem 2019 EE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cal-event-3',
    userId: 'offline-user',
    title: 'Sprint Planning & System Architecture',
    description: 'Tri-calendar synchronization review and Google Calendar OAuth validation.',
    location: 'Harmony Virtual Studio',
    gregorianDate: '2026-09-03',
    startTime: '14:00',
    endTime: '15:30',
    allDay: false,
    category: 'Work',
    color: '#3b82f6',
    hijriDate: '21 Safar 1448 AH',
    ethiopianDate: '23 Nehase 2018 EE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// In-memory fallback if Tracking Prevention or browser policy blocks window.localStorage
const memoryStorage = new Map<string, string>();

function safeGetStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Tracking Prevention or SecurityError
  }
  return null;
}

// Helper to safely read from localStorage (with tracking-prevention resilient memory fallback)
export function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const storage = safeGetStorage();
    const raw = storage ? storage.getItem(key) : memoryStorage.get(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    const memoryRaw = memoryStorage.get(key);
    if (memoryRaw) {
      try {
        return JSON.parse(memoryRaw) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

// Helper to safely write to localStorage & notify Service Worker (with tracking-prevention resilient memory fallback)
export function setLocalItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    memoryStorage.set(key, serialized);
    const storage = safeGetStorage();
    if (storage) {
      storage.setItem(key, serialized);
    }
    // Broadcast snapshot to Service Worker if available
    notifyServiceWorkerSnapshot(key, value);
  } catch {
    // Handled silently by in-memory storage fallback
  }
}

// Send snapshot to Service Worker cache
export function notifyServiceWorkerSnapshot(key: string, data: any) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_MINI_APP_SNAPSHOT',
        key,
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.debug('[OfflinePersistence] SW postMessage skipped:', err);
    }
  }
}

// Queue an action for when connection restores
export function enqueueOfflineAction(entity: QueuedSyncAction['entity'], action: 'save' | 'delete', payload: any): void {
  const queue = getLocalItem<QueuedSyncAction[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  const newAction: QueuedSyncAction = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entity,
    action,
    payload,
    timestamp: Date.now()
  };
  queue.push(newAction);
  setLocalItem(STORAGE_KEYS.SYNC_QUEUE, queue);
}

// Clear the sync queue
export function clearOfflineQueue(): void {
  setLocalItem(STORAGE_KEYS.SYNC_QUEUE, []);
}

// Hook for AppRunner and components to observe & interact with offline persistence
export function useOfflinePersistence(cloudState?: {
  notes?: HarmonyNote[];
  docs?: HarmonyDoc[];
  drafts?: HarmonyWritingDraft[];
  playlists?: HarmonyPlaylist[];
  aiChats?: HarmonyAiChat[];
  calendarEvents?: HarmonyCalendarEvent[];
}) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => {
    return getLocalItem<QueuedSyncAction[]>(STORAGE_KEYS.SYNC_QUEUE, []).length;
  });
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return getLocalItem<string>(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [cachedItemsCount, setCachedItemsCount] = useState<number>(0);

  // Compute total cached records
  const updateCachedCount = useCallback(() => {
    try {
      const notes = getLocalItem<any[]>(STORAGE_KEYS.NOTES, []);
      const docs = getLocalItem<any[]>(STORAGE_KEYS.DOCS, []);
      const drafts = getLocalItem<any[]>(STORAGE_KEYS.DRAFTS, []);
      const playlists = getLocalItem<any[]>(STORAGE_KEYS.PLAYLISTS, []);
      const events = getLocalItem<any[]>(STORAGE_KEYS.CALENDAR, []);
      setCachedItemsCount(notes.length + docs.length + drafts.length + playlists.length + events.length);
    } catch {
      setCachedItemsCount(0);
    }
  }, []);

  // Sync cloud state into local storage when available
  useEffect(() => {
    if (cloudState?.notes && cloudState.notes.length > 0) {
      setLocalItem(STORAGE_KEYS.NOTES, cloudState.notes);
      setLocalItem(STORAGE_KEYS.SYSTEM_NOTES, cloudState.notes);
      updateCachedCount();
    }
  }, [cloudState?.notes, updateCachedCount]);

  useEffect(() => {
    if (cloudState?.docs && cloudState.docs.length > 0) {
      setLocalItem(STORAGE_KEYS.DOCS, cloudState.docs);
      setLocalItem(STORAGE_KEYS.SYSTEM_DOCS, cloudState.docs);
      updateCachedCount();
    }
  }, [cloudState?.docs, updateCachedCount]);

  useEffect(() => {
    if (cloudState?.drafts && cloudState.drafts.length > 0) {
      setLocalItem(STORAGE_KEYS.DRAFTS, cloudState.drafts);
      setLocalItem(STORAGE_KEYS.SYSTEM_DRAFTS, cloudState.drafts);
      updateCachedCount();
    }
  }, [cloudState?.drafts, updateCachedCount]);

  useEffect(() => {
    if (cloudState?.playlists && cloudState.playlists.length > 0) {
      setLocalItem(STORAGE_KEYS.PLAYLISTS, cloudState.playlists);
      setLocalItem(STORAGE_KEYS.SYSTEM_PLAYLISTS, cloudState.playlists);
      updateCachedCount();
    }
  }, [cloudState?.playlists, updateCachedCount]);

  useEffect(() => {
    if (cloudState?.calendarEvents && cloudState.calendarEvents.length > 0) {
      setLocalItem(STORAGE_KEYS.CALENDAR, cloudState.calendarEvents);
      setLocalItem(STORAGE_KEYS.SYSTEM_CALENDAR, cloudState.calendarEvents);
      updateCachedCount();
    }
  }, [cloudState?.calendarEvents, updateCachedCount]);

  useEffect(() => {
    if (cloudState?.aiChats && cloudState.aiChats.length > 0) {
      setLocalItem(STORAGE_KEYS.AI_CHATS, cloudState.aiChats);
      setLocalItem(STORAGE_KEYS.SYSTEM_CHATS, cloudState.aiChats);
    }
  }, [cloudState?.aiChats]);

  // Online / Offline window listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLocalItem(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial cache tally
    updateCachedCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateCachedCount]);

  // Update pending queue count whenever storage changes
  const refreshQueueCount = useCallback(() => {
    const queue = getLocalItem<QueuedSyncAction[]>(STORAGE_KEYS.SYNC_QUEUE, []);
    setPendingSyncCount(queue.length);
  }, []);

  return {
    isOnline,
    pendingSyncCount,
    lastSyncTime,
    isSyncing,
    cachedItemsCount,
    setIsSyncing,
    refreshQueueCount,
    setLastSyncTime,
    snapshotMiniAppData: (appId: string, data: any) => {
      setLocalItem(`harmony_snapshot_${appId}`, data);
      notifyServiceWorkerSnapshot(`harmony_snapshot_${appId}`, data);
      updateCachedCount();
    },
    // Direct accessors to cached data with fallback
    getCachedNotes: () => getLocalItem<HarmonyNote[]>(STORAGE_KEYS.NOTES, INITIAL_OFFLINE_NOTES),
    getCachedDocs: () => getLocalItem<HarmonyDoc[]>(STORAGE_KEYS.DOCS, INITIAL_OFFLINE_DOCS),
    getCachedDrafts: () => getLocalItem<HarmonyWritingDraft[]>(STORAGE_KEYS.DRAFTS, INITIAL_OFFLINE_DRAFTS),
    getCachedPlaylists: () => getLocalItem<HarmonyPlaylist[]>(STORAGE_KEYS.PLAYLISTS, INITIAL_OFFLINE_PLAYLISTS),
    getCachedAiChats: () => getLocalItem<HarmonyAiChat[]>(STORAGE_KEYS.AI_CHATS, [])
  };
}

// -----------------------------------------------------------------------------
// Initial Offline Datasets for Finance & Ledger Suite
// -----------------------------------------------------------------------------
export const INITIAL_OFFLINE_FINANCE_ACCOUNTS: FinanceAccount[] = [
  {
    id: 'acc-checking',
    name: 'Primary Checking',
    type: 'checking',
    balance: 8450.00,
    currency: 'USD',
    institution: 'Chase Bank',
    accountNumberMasked: '4892',
    color: '#3b82f6',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc-savings',
    name: 'High Yield Savings',
    type: 'savings',
    balance: 24500.00,
    currency: 'USD',
    institution: 'Marcus by GS',
    accountNumberMasked: '9103',
    color: '#10b981',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc-credit',
    name: 'Sapphire Preferred',
    type: 'credit_card',
    balance: -1240.50,
    currency: 'USD',
    institution: 'Chase',
    accountNumberMasked: '7721',
    color: '#f59e0b',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'acc-cash',
    name: 'Cash Wallet',
    type: 'cash',
    balance: 320.00,
    currency: 'USD',
    color: '#8b5cf6',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_FINANCE_BUDGETS: FinanceBudget[] = [
  {
    id: 'bud-food',
    category: 'Food & Dining',
    monthlyLimit: 600,
    alertThreshold: 80,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bud-groceries',
    category: 'Groceries',
    monthlyLimit: 500,
    alertThreshold: 85,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bud-housing',
    category: 'Housing',
    monthlyLimit: 1800,
    alertThreshold: 90,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bud-transport',
    category: 'Transportation',
    monthlyLimit: 300,
    alertThreshold: 75,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bud-entertainment',
    category: 'Entertainment',
    monthlyLimit: 250,
    alertThreshold: 80,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_FINANCE_LOANS: FinanceLoan[] = [
  {
    id: 'loan-car',
    title: 'Tesla Model 3 Auto Loan',
    type: 'borrowed',
    lenderOrBorrower: 'Tesla Financial',
    originalPrincipal: 35000,
    currentBalance: 21400,
    interestRate: 4.99,
    tenureMonths: 60,
    monthlyEmi: 659.87,
    startDate: '2024-01-15',
    nextDueDate: '2026-10-15',
    status: 'active',
    totalPaidSoFar: 14517.14,
    notes: 'Low fixed interest auto financing',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'loan-student',
    title: 'Graduate Student Loan',
    type: 'borrowed',
    lenderOrBorrower: 'Nelnet Federal',
    originalPrincipal: 28000,
    currentBalance: 12800,
    interestRate: 5.50,
    tenureMonths: 120,
    monthlyEmi: 303.88,
    startDate: '2022-06-01',
    nextDueDate: '2026-10-01',
    status: 'active',
    totalPaidSoFar: 18232.80,
    notes: 'Income-driven repayment tier',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_FINANCE_SUBSCRIPTIONS: FinanceSubscription[] = [
  {
    id: 'sub-netflix',
    name: 'Netflix Premium 4K',
    amount: 22.99,
    category: 'Entertainment',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-18',
    accountId: 'acc-checking',
    status: 'active',
    remindDaysBefore: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub-spotify',
    name: 'Spotify Family Plan',
    amount: 19.99,
    category: 'Entertainment',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-24',
    accountId: 'acc-credit',
    status: 'active',
    remindDaysBefore: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub-cloud',
    name: 'GitHub Copilot & Cloud VPS',
    amount: 40.00,
    category: 'Subscriptions',
    billingCycle: 'monthly',
    nextBillingDate: '2026-10-01',
    accountId: 'acc-credit',
    status: 'active',
    remindDaysBefore: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_OFFLINE_FINANCE_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx-1',
    title: 'Bi-Weekly Tech Consulting Salary',
    amount: 4250.00,
    type: 'income',
    category: 'Salary',
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    accountId: 'acc-checking',
    paymentMethod: 'bank_transfer',
    tags: ['Income', 'Payroll'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-2',
    title: 'Whole Foods Market',
    amount: 142.80,
    type: 'expense',
    category: 'Groceries',
    date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
    accountId: 'acc-checking',
    paymentMethod: 'debit_card',
    tags: ['Groceries', 'Organic'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-3',
    title: 'Monthly Apartment Rent',
    amount: 1750.00,
    type: 'expense',
    category: 'Housing',
    date: new Date().toISOString().slice(0, 7) + '-01',
    accountId: 'acc-checking',
    paymentMethod: 'bank_transfer',
    tags: ['Housing', 'Fixed'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-4',
    title: 'Blue Bottle Coffee & Breakfast',
    amount: 18.50,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().slice(0, 10),
    accountId: 'acc-credit',
    paymentMethod: 'credit_card',
    tags: ['Coffee', 'Dining'],
    createdAt: new Date().toISOString()
  }
];

