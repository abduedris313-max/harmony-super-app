/**
 * @file cdn.ts
 * @description CDN utilities for icon assets and logos.
 * Uses jsDelivr and unpkg Lucide Static CDN URLs for icons instead of local image files.
 */

export const LUCIDE_CDN_BASE = 'https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons';

/**
 * Get direct CDN SVG URL for any Lucide icon
 */
export function getLucideCdnIconUrl(iconName: string): string {
  const normalized = iconName.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
  return `${LUCIDE_CDN_BASE}/${normalized}.svg`;
}

/**
 * Predefined CDN Icon URLs for Harmony OS Super App
 */
export const CDN_ICONS = {
  appLogo: `${LUCIDE_CDN_BASE}/layers.svg`,
  notes: `${LUCIDE_CDN_BASE}/notebook.svg`,
  docs: `${LUCIDE_CDN_BASE}/file-text.svg`,
  writing: `${LUCIDE_CDN_BASE}/pen-tool.svg`,
  music: `${LUCIDE_CDN_BASE}/disc.svg`,
  docsAi: `${LUCIDE_CDN_BASE}/sparkles.svg`,
  github: `${LUCIDE_CDN_BASE}/github.svg`,
  firebase: `${LUCIDE_CDN_BASE}/flame.svg`,
  search: `${LUCIDE_CDN_BASE}/search.svg`,
  settings: `${LUCIDE_CDN_BASE}/settings.svg`,
  user: `${LUCIDE_CDN_BASE}/user.svg`,
  wifi: `${LUCIDE_CDN_BASE}/wifi.svg`,
  battery: `${LUCIDE_CDN_BASE}/battery-charging.svg`,
  sliders: `${LUCIDE_CDN_BASE}/sliders.svg`,
  play: `${LUCIDE_CDN_BASE}/play.svg`,
  pause: `${LUCIDE_CDN_BASE}/pause.svg`,
  externalLink: `${LUCIDE_CDN_BASE}/external-link.svg`,
  refresh: `${LUCIDE_CDN_BASE}/rotate-cw.svg`,
};
