/**
 * @file types.ts
 * @description Type definitions for the Harmony App Store Developer Console & Admin Portal.
 */

import { MiniAppConfig, AppRepositorySource } from '../src/types';

export type { AppRepositorySource };

export type AppPublishStatus = 'published' | 'in_review' | 'draft' | 'deprecated' | 'archived';

export interface AppReleaseVersion {
  version: string;
  releaseDate: string;
  changelog: string;
  bundleSize: string;
  checksumSha256: string;
  minOsVersion?: string;
  status: 'active' | 'deprecated' | 'rollback';
}

export interface AdminMiniApp extends MiniAppConfig {
  status?: AppPublishStatus;
  releaseNotes?: string;
  submittedAt?: string;
  lastUpdated?: string;
  versions?: AppReleaseVersion[];
  reviewNotes?: string;
  featured?: boolean;
  downloadsToday?: number;
  activeUsers?: number;
  contactEmail?: string;
  privacyPolicyUrl?: string;
}

export interface PublishAppFormData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  iconCdnUrl: string;
  colorGradient: string;
  bgHex: string;
  deployedUrl: string;
  repoUrl: string;
  version: string;
  author: string;
  size: string;
  category: 'productivity' | 'utilities' | 'finance' | 'audio' | 'ai' | 'developer' | 'health';
  badge: string;
  isSystemApp: boolean;
  permissions: string[];
  repositoryId: string;
  releaseNotes: string;
  status: AppPublishStatus;
  contactEmail?: string;
}

export interface CentralRepositoryStats {
  totalApps: number;
  publishedCount: number;
  inReviewCount: number;
  draftCount: number;
  totalDownloads: number;
  officialAppsCount: number;
  communityAppsCount: number;
  activeRepositoriesCount: number;
  lastSyncedAt: string;
  firestoreConnected: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'publish' | 'update' | 'deprecate' | 'delete' | 'sync' | 'rollback';
  appId: string;
  appName: string;
  performedBy: string;
  details: string;
}
