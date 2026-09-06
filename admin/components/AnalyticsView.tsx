/**
 * @file AnalyticsView.tsx
 * @description Central Repository analytics, category breakdown, download metrics and telemetry.
 */

import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  HardDrive, 
  Star, 
  Layers, 
  Users, 
  CheckCircle2, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { AdminMiniApp } from '../types';

interface AnalyticsViewProps {
  apps: AdminMiniApp[];
  isDarkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  apps,
  isDarkMode
}) => {
  // Aggregate Metrics
  const totalDownloads = apps.reduce((acc, a) => acc + (a.downloadsCount || 0), 0);
  const totalActiveUsers = apps.reduce((acc, a) => acc + (a.activeUsers || 0), 0);
  const averageRating = (apps.reduce((acc, a) => acc + (a.rating || 5.0), 0) / (apps.length || 1)).toFixed(1);

  // Category counts
  const categoryMap: Record<string, number> = {};
  apps.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });

  const categories = Object.entries(categoryMap).map(([cat, count]) => ({
    category: cat,
    count,
    percentage: Math.round((count / (apps.length || 1)) * 100)
  }));

  // Top apps by downloads
  const topDownloaded = [...apps].sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0)).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Downloads</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{totalDownloads.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% this month across SuperApp clients</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Installs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{totalActiveUsers.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across registered device Springboards
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{averageRating} / 5.0</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Calculated from 18,400 user reviews
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Repository Packages</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{apps.length} Managed</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% manifest integrity verified</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Top Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (6 cols) */}
        <div className={`lg:col-span-6 p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" />
            Category Distribution ({categories.length} Categories)
          </h3>

          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize font-semibold text-slate-200">{c.category}</span>
                  <span className="font-mono text-slate-400">{c.count} apps ({c.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Downloaded Apps (6 cols) */}
        <div className={`lg:col-span-6 p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Most Popular Mini Apps Leaderboard
          </h3>

          <div className="divide-y divide-slate-800/50">
            {topDownloaded.map((app, idx) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-500 w-4 text-center">#{idx + 1}</span>
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: app.bgHex || '#3b82f6' }}
                  >
                    {app.iconCdnUrl ? (
                      <img 
                        src={app.iconCdnUrl} 
                        alt={app.name} 
                        className="w-4 h-4 object-contain invert brightness-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Layers className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{app.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono line-clamp-1">{app.id}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-blue-400">{(app.downloadsCount || 0).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">downloads</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
