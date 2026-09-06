/**
 * @file AdminSidebar.tsx
 * @description Sidebar navigation for the Harmony App Store Developer Console.
 */

import React from 'react';
import { 
  Grid, 
  PlusCircle, 
  GitBranch, 
  Server, 
  BarChart3, 
  PlaySquare, 
  Settings,
  Database,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

export type AdminTab = 'catalog' | 'publish' | 'docs' | 'releases' | 'repositories' | 'analytics' | 'sandbox' | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isDarkMode: boolean;
  appsCount: number;
  publishedCount: number;
  firestoreConnected: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  appsCount,
  publishedCount,
  firestoreConnected
}) => {
  const navItems: { id: AdminTab; label: string; icon: any; count?: number; badge?: string }[] = [
    { id: 'catalog', label: 'App Catalog', icon: Grid, count: appsCount },
    { id: 'publish', label: 'Publish Studio', icon: PlusCircle, badge: 'New' },
    { id: 'docs', label: 'Docs & Templates', icon: BookOpen, badge: 'SDK' },
    { id: 'releases', label: 'Releases & Pipeline', icon: GitBranch },
    { id: 'repositories', label: 'Central Repositories', icon: Server },
    { id: 'analytics', label: 'Analytics & Metrics', icon: BarChart3 },
    { id: 'sandbox', label: 'Test Sandbox', icon: PlaySquare },
    { id: 'settings', label: 'Settings & Cloud DB', icon: Settings },
  ];

  return (
    <aside className={`w-64 shrink-0 border-r flex flex-col justify-between p-4 transition-colors ${
      isDarkMode 
        ? 'bg-slate-900/60 border-slate-800 text-slate-300' 
        : 'bg-slate-50/80 border-slate-200 text-slate-700'
    }`}>
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? isDarkMode
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                  : isDarkMode
                    ? 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    : 'hover:bg-slate-200/60 text-slate-700 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.count}
                </span>
              )}

              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloud & Central Repository Status Widget */}
      <div className={`p-3.5 rounded-xl border mt-6 space-y-3 ${
        isDarkMode ? 'bg-slate-850/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Central Repo Status
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Database</span>
            <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Published Packages</span>
            <span className="font-semibold text-slate-200 font-mono">{publishedCount} / {appsCount}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Target Platform</span>
            <span className="font-semibold text-slate-200">Harmony OS 2.4</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/50">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Open Super App in New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
