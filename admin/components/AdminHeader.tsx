/**
 * @file AdminHeader.tsx
 * @description Header bar for the Harmony App Store Developer Console.
 */

import React from 'react';
import { 
  ShoppingBag, 
  Plus, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Sun, 
  Moon, 
  Database, 
  ShieldCheck, 
  Radio
} from 'lucide-react';

interface AdminHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPublishModal: () => void;
  onRefreshCatalog: () => void;
  onExportManifest: () => void;
  isRefreshing: boolean;
  appsCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenPublishModal,
  onRefreshCatalog,
  onExportManifest,
  isRefreshing,
  appsCount
}) => {
  return (
    <header className={`sticky top-0 z-30 h-16 border-b transition-colors px-4 lg:px-8 flex items-center justify-between ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md'
    }`}>
      {/* Brand & Context */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight">Harmony App Store</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Developer Console
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Central Repo v2.4
            </span>
            <span>•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
              ai-studio-harmonyossuperap...
            </span>
            <span>•</span>
            <span>{appsCount} Packages Managed</span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync / Refresh */}
        <button
          onClick={onRefreshCatalog}
          disabled={isRefreshing}
          className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 font-medium ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
          }`}
          title="Synchronize Central Repository"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span className="hidden md:inline">Sync</span>
        </button>

        {/* Export Manifest */}
        <button
          onClick={onExportManifest}
          className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 font-medium ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
          }`}
          title="Export Central Repository Manifest JSON"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Export Manifest</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition-all ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
          }`}
          title="Toggle Light/Dark Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Return to Super App Link */}
        <a
          href="/"
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
          }`}
          title="Launch Harmony OS Super App"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Launch Super App</span>
        </a>

        {/* Publish Button */}
        <button
          onClick={onOpenPublishModal}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Mini App</span>
        </button>
      </div>
    </header>
  );
};
