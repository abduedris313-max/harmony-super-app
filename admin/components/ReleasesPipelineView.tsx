/**
 * @file ReleasesPipelineView.tsx
 * @description Release pipeline, semantic versioning logs, and rollback history for the Central Repository.
 */

import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Layers, 
  ShieldCheck, 
  Tag, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AdminMiniApp } from '../types';

interface ReleasesPipelineViewProps {
  apps: AdminMiniApp[];
  isDarkMode: boolean;
  onOpenAppDetail: (app: AdminMiniApp) => void;
}

export const ReleasesPipelineView: React.FC<ReleasesPipelineViewProps> = ({
  apps,
  isDarkMode,
  onOpenAppDetail
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Collect all releases across all apps
  const allReleases = apps.flatMap((app) => {
    const versions = app.versions || [
      {
        version: app.version || '1.0.0',
        releaseDate: '2026-08-20',
        changelog: `Production release for ${app.name}.`,
        bundleSize: app.size || '1.8 MB',
        checksumSha256: `sha256_${app.id}_1_0_0`,
        status: 'active' as const
      }
    ];

    return versions.map((ver) => ({
      ...ver,
      appId: app.id,
      appName: app.name,
      appIcon: app.iconCdnUrl,
      appBgHex: app.bgHex,
      appCategory: app.category,
      rawApp: app
    }));
  }).sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  const filteredReleases = allReleases.filter(r => 
    r.appName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.version.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.changelog.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-500" />
            Central Repository Release Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Semantic version audit trail and package bundle history across all ecosystem mini apps.
          </p>
        </div>

        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter releases by app or version..."
          className={`px-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
          }`}
        />
      </div>

      {/* Releases Timeline List */}
      <div className="space-y-3">
        {filteredReleases.map((release, idx) => (
          <div
            key={`${release.appId}-${release.version}-${idx}`}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: release.appBgHex || '#3b82f6' }}
              >
                {release.appIcon ? (
                  <img 
                    src={release.appIcon} 
                    alt={release.appName} 
                    className="w-5 h-5 object-contain invert brightness-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Layers className="w-5 h-5 text-white" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-100">{release.appName}</h4>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    v{release.version}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {release.releaseDate}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {release.changelog}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                  <span>Size: {release.bundleSize}</span>
                  <span>•</span>
                  <span className="truncate max-w-[240px]">Hash: {release.checksumSha256}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onOpenAppDetail(release.rawApp)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Inspect Release
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
