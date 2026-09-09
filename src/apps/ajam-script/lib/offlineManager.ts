/**
 * @file offlineManager.ts
 * @description Helper utility to synchronize AjamScript manuscript metadata, high-frequency character sets,
 * and the local lexicon JSON with the Service Worker Cache API for full offline readability.
 */

import { sampleManuscripts } from '../data/sampleManuscripts';
import { AJAM_RULES, VIRTUAL_AJAM_KEYBOARD } from './ajamEngine';
import { AJAM_LEXICON } from '../data/ajamLexicon';

export interface AjamOfflineStatus {
  isServiceWorkerReady: boolean;
  isCachedOffline: boolean;
  lastCachedAt: string | null;
  cachedManuscriptsCount: number;
  cachedCharactersCount: number;
  cachedLexiconCount: number;
}

const LOCAL_STORAGE_KEY = 'harmony_ajam_offline_meta_v1';

/**
 * Initializes and registers service worker caching for AjamScript offline manuscripts and character sets.
 */
export async function syncAjamOfflineData(): Promise<AjamOfflineStatus> {
  const isSW = 'serviceWorker' in navigator;
  
  if (!isSW) {
    return {
      isServiceWorkerReady: false,
      isCachedOffline: false,
      lastCachedAt: null,
      cachedManuscriptsCount: 0,
      cachedCharactersCount: 0,
      cachedLexiconCount: 0
    };
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const activeWorker = swRegistration.active || navigator.serviceWorker.controller;

    const payload = {
      timestamp: Date.now(),
      manuscripts: sampleManuscripts,
      characterSets: {
        rules: AJAM_RULES,
        virtualKeyboard: VIRTUAL_AJAM_KEYBOARD
      },
      lexicon: AJAM_LEXICON
    };

    // Save metadata in localStorage as client fallback
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));

    if (activeWorker) {
      // Send manuscript metadata to Service Worker
      activeWorker.postMessage({
        type: 'CACHE_FIRESTORE_DATA',
        key: 'ajam_manuscripts_metadata',
        entity: 'ajam_manuscripts',
        data: sampleManuscripts,
        timestamp: payload.timestamp
      });

      // Send high frequency character sets to Service Worker
      activeWorker.postMessage({
        type: 'CACHE_FIRESTORE_DATA',
        key: 'ajam_high_freq_characters',
        entity: 'ajam_character_sets',
        data: payload.characterSets,
        timestamp: payload.timestamp
      });

      // Send lexicon JSON to Service Worker
      activeWorker.postMessage({
        type: 'CACHE_FIRESTORE_DATA',
        key: 'ajam_lexicon',
        entity: 'ajam_lexicon_db',
        data: AJAM_LEXICON,
        timestamp: payload.timestamp
      });
    }

    return {
      isServiceWorkerReady: true,
      isCachedOffline: true,
      lastCachedAt: new Date().toISOString(),
      cachedManuscriptsCount: sampleManuscripts.length,
      cachedCharactersCount: AJAM_RULES.length,
      cachedLexiconCount: AJAM_LEXICON.length
    };
  } catch (err) {
    console.warn('[AjamScript Offline Manager] Cache sync warning:', err);
    return {
      isServiceWorkerReady: false,
      isCachedOffline: false,
      lastCachedAt: null,
      cachedManuscriptsCount: sampleManuscripts.length,
      cachedCharactersCount: AJAM_RULES.length,
      cachedLexiconCount: AJAM_LEXICON.length
    };
  }
}

/**
 * Retrieves cached offline manuscript metadata when network is unavailable
 */
export function getOfflineAjamSnapshot() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[AjamScript Offline Manager] Error reading local snapshot:', err);
  }
  return {
    manuscripts: sampleManuscripts,
    characterSets: {
      rules: AJAM_RULES,
      virtualKeyboard: VIRTUAL_AJAM_KEYBOARD
    },
    lexicon: AJAM_LEXICON
  };
}
