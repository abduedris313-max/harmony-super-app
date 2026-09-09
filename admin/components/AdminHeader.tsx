/**
 * @file AdminHeader.tsx
 * @description Header bar for the Harmony App Store Developer Console with role-based authentication status.
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Sun, 
  Moon, 
  Radio,
  User,
  Crown,
  ShieldCheck,
  Code2,
  Eye,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { AdminUserProfile } from '../types';

interface AdminHeaderProps {
  isDarkMode: boolean;
  userProfile: AdminUserProfile | null;
  onToggleTheme: () => void;
  onOpenPublishModal: () => void;
  onRefreshCatalog: () => void;
  onExportManifest: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  isRefreshing: boolean;
  appsCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isDarkMode,
  userProfile,
  onToggleTheme,
  onOpenPublishModal,
  onRefreshCatalog,
  onExportManifest,
  onOpenAuthModal,
  onSignOut,
  isRefreshing,
  appsCount
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Crown className="w-2.5 h-2.5" />
            SUPER ADMIN
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5" />
            STORE ADMIN
          </span>
        );
      case 'developer':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Code2 className="w-2.5 h-2.5" />
            DEVELOPER
          </span>
        );
      case 'viewer':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30 flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" />
            VIEWER
          </span>
        );
    }
  };

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
            <span>{appsCount} Packages Managed</span>
          </div>
        </div>
      </div>

      {/* Header Actions & Account Role Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Account / Role Badge Pill */}
        <div className="relative">
          {userProfile ? (
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <img
                src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.displayName)}`}
                alt={userProfile.displayName}
                className="w-6 h-6 rounded-full object-cover border border-blue-500/40"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">{userProfile.displayName}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{userProfile.organization || userProfile.email}</span>
              </div>
              {getRoleBadge(userProfile.role)}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && userProfile && (
            <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 transition-all ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="p-3 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-bold">{userProfile.displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Console Role:</span>
                  {getRoleBadge(userProfile.role)}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                Switch Account or Role
              </button>

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-all cursor-pointer mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out from Console
              </button>
            </div>
          )}
        </div>

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
