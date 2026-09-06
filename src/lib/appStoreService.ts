/**
 * @file appStoreService.ts
 * @description Central Repository & Package Management Service for Harmony App Store.
 * Handles fetching repository manifests, streaming package downloads, offline caching,
 * install/uninstall lifecycle, and Firestore synchronization.
 */

import { MiniAppConfig, AppRepositorySource } from '../types';
import { 
  CENTRAL_REPOSITORY_APPS, 
  DEFAULT_REPOSITORIES, 
  DEFAULT_INSTALLED_APP_IDS, 
  fetchCentralRepository 
} from '../config/appRepository';
import { STORAGE_KEYS, getLocalItem, setLocalItem, notifyServiceWorkerSnapshot } from './offlinePersistence';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { triggerHaptic } from '../utils/haptics';

export interface AppPackageMeta {
  appId: string;
  version: string;
  installedAt: string;
  sizeBytes: number;
  cachedOffline: boolean;
}

/**
 * Retrieve installed app IDs from local persistence, fallback to default 8 core apps
 */
export function getInstalledAppIds(): string[] {
  return getLocalItem<string[]>(STORAGE_KEYS.INSTALLED_APPS, DEFAULT_INSTALLED_APP_IDS);
}

/**
 * Save installed app IDs to local persistence and optionally Firestore
 */
export async function saveInstalledAppIds(
  installedIds: string[], 
  userId?: string | null
): Promise<void> {
  setLocalItem(STORAGE_KEYS.INSTALLED_APPS, installedIds);
  notifyServiceWorkerSnapshot(STORAGE_KEYS.INSTALLED_APPS, installedIds);

  if (userId && firestore) {
    try {
      const userInstalledDocRef = doc(firestore, 'installed_apps', userId);
      await setDoc(userInstalledDocRef, {
        appIds: installedIds,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[AppStoreService] Firestore installed_apps sync notice:', err);
    }
  }
}

/**
 * Sync installed apps from Firestore for authenticated user
 */
export async function syncInstalledAppsFromCloud(userId: string): Promise<string[]> {
  if (!firestore) return getInstalledAppIds();
  try {
    const docRef = doc(firestore, 'installed_apps', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const cloudIds = snap.data().appIds;
      if (Array.isArray(cloudIds) && cloudIds.length > 0) {
        setLocalItem(STORAGE_KEYS.INSTALLED_APPS, cloudIds);
        return cloudIds;
      }
    }
  } catch (err) {
    console.warn('[AppStoreService] Error syncing installed apps from Firestore:', err);
  }
  return getInstalledAppIds();
}

/**
 * Retrieve all registered Central Repositories
 */
export function getAppRepositories(): AppRepositorySource[] {
  return getLocalItem<AppRepositorySource[]>(STORAGE_KEYS.APP_REPOSITORIES, DEFAULT_REPOSITORIES);
}

/**
 * Save Central Repositories
 */
export function saveAppRepositories(repos: AppRepositorySource[]): void {
  setLocalItem(STORAGE_KEYS.APP_REPOSITORIES, repos);
}

/**
 * Downloads an app package from the Central Repository.
 * Simulates chunked network stream with realistic progress callback and caches in Service Worker.
 */
export async function downloadAppPackage(
  app: MiniAppConfig,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; appId: string }> {
  triggerHaptic('medium');

  // Multi-step progress simulation
  const progressSteps = [15, 38, 64, 85, 100];
  for (const step of progressSteps) {
    await new Promise((res) => setTimeout(res, 140));
    if (onProgress) onProgress(step);
    if (step === 64) triggerHaptic('selection');
  }

  // 1. Update installed apps list
  const current = getInstalledAppIds();
  if (!current.includes(app.id)) {
    const updated = [...current, app.id];
    setLocalItem(STORAGE_KEYS.INSTALLED_APPS, updated);
    notifyServiceWorkerSnapshot(STORAGE_KEYS.INSTALLED_APPS, updated);
  }

  // 2. Cache app package bundle metadata for offline execution
  const currentPackages = getLocalItem<Record<string, AppPackageMeta>>(STORAGE_KEYS.DOWNLOADED_APP_BUNDLES, {});
  currentPackages[app.id] = {
    appId: app.id,
    version: app.version || '1.0.0',
    installedAt: new Date().toISOString(),
    sizeBytes: parseSizeToBytes(app.size || '1.5 MB'),
    cachedOffline: true
  };
  setLocalItem(STORAGE_KEYS.DOWNLOADED_APP_BUNDLES, currentPackages);

  // 3. Post notification to Service Worker to precache synthetic app route
  notifyServiceWorkerSnapshot(`app_bundle_${app.id}`, {
    id: app.id,
    name: app.name,
    version: app.version,
    status: 'cached'
  });

  triggerHaptic('success');
  return { success: true, appId: app.id };
}

/**
 * Uninstalls / offloads an app package to free memory and remove from Springboard
 */
export async function uninstallAppPackage(appId: string): Promise<string[]> {
  triggerHaptic('heavy');
  const current = getInstalledAppIds();
  const updated = current.filter((id) => id !== appId);
  setLocalItem(STORAGE_KEYS.INSTALLED_APPS, updated);
  notifyServiceWorkerSnapshot(STORAGE_KEYS.INSTALLED_APPS, updated);

  // Remove bundle metadata
  const currentPackages = getLocalItem<Record<string, AppPackageMeta>>(STORAGE_KEYS.DOWNLOADED_APP_BUNDLES, {});
  if (currentPackages[appId]) {
    delete currentPackages[appId];
    setLocalItem(STORAGE_KEYS.DOWNLOADED_APP_BUNDLES, currentPackages);
  }

  return updated;
}

/**
 * Calculates total storage used by all installed apps
 */
export function calculateInstalledStorageFootprint(installedIds: string[]): {
  totalBytes: number;
  totalFormatted: string;
  appCount: number;
} {
  let totalBytes = 0;
  for (const id of installedIds) {
    const matched = CENTRAL_REPOSITORY_APPS.find((a) => a.id === id);
    if (matched && matched.size) {
      totalBytes += parseSizeToBytes(matched.size);
    } else {
      totalBytes += 1.5 * 1024 * 1024;
    }
  }

  const inMB = (totalBytes / (1024 * 1024)).toFixed(1);
  return {
    totalBytes,
    totalFormatted: `${inMB} MB`,
    appCount: installedIds.length
  };
}

function parseSizeToBytes(sizeStr: string): number {
  const parts = sizeStr.trim().split(' ');
  const num = parseFloat(parts[0]) || 1.5;
  const unit = (parts[1] || 'MB').toUpperCase();
  if (unit === 'KB') return num * 1024;
  if (unit === 'GB') return num * 1024 * 1024 * 1024;
  return num * 1024 * 1024;
}
