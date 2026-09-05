/**
 * @file SettingsModal.tsx
 * @description iOS System Settings App modal for Harmony OS Super App with Light, Dark, System themes and accent presets.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Settings, Github, ExternalLink, ShieldCheck, Download, Smartphone, 
  Flame, Info, Moon, Sun, Monitor, Volume2, BellOff, Check, Palette,
  Sliders, ArrowUp, ArrowDown, RotateCcw, Eye, Smartphone as MobileIcon, Laptop,
  Notebook, FileText, PenTool, Disc, Sparkles, Calendar, Wallet, ShoppingBag, Layers, Plus, Trash2,
  User, LogIn, LayoutGrid
} from 'lucide-react';
import { HARMONY_APPS } from '../config/apps';
import { SystemSettings, ThemeMode, ThemePreset, SystemUser } from '../types';
import { soundManager } from '../lib/soundManager';
import { DEFAULT_DOCK_APP_IDS } from '../lib/offlinePersistence';
import { HarmonyLogo } from './HarmonyLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (updated: Partial<SystemSettings>) => void;
  currentUser?: SystemUser | null;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onOpenOnboarding?: () => void;
  onOpenHomeScreenSetup?: () => void;
}

interface ThemePresetOption {
  id: ThemePreset;
  name: string;
  tagline: string;
  gradient: string;
  dotColor: string;
}

const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'slate',
    name: 'Apple Slate',
    tagline: 'Classic Cupertino Indigo & Slate',
    gradient: 'from-indigo-600 to-slate-800',
    dotColor: 'bg-indigo-500'
  },
  {
    id: 'oled',
    name: 'Midnight OLED',
    tagline: 'Deep Pitch Obsidian & Violet Glow',
    gradient: 'from-purple-900 to-black',
    dotColor: 'bg-purple-500'
  },
  {
    id: 'sunset',
    name: 'Solar Sunset',
    tagline: 'Warm Amber Dawn & Crimson Coral',
    gradient: 'from-amber-600 to-rose-700',
    dotColor: 'bg-amber-500'
  },
  {
    id: 'emerald',
    name: 'Alpine Emerald',
    tagline: 'Crisp Mint Green & Deep Teal',
    gradient: 'from-emerald-600 to-teal-900',
    dotColor: 'bg-emerald-500'
  },
  {
    id: 'lavender',
    name: 'Royal Lavender',
    tagline: 'Dreamy Lilac Orchid & Mauve',
    gradient: 'from-fuchsia-600 to-indigo-900',
    dotColor: 'bg-fuchsia-400'
  }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentUser,
  onOpenAuth,
  onOpenOnboarding,
  onOpenHomeScreenSetup
}) => {
  if (!isOpen) return null;

  const isDark = settings.isDarkMode;
  const currentMode = settings.themeMode || (settings.isDarkMode ? 'dark' : 'light');
  const currentPreset = settings.themePreset || 'slate';

  const handleModeChange = (mode: ThemeMode) => {
    soundManager.playHapticClick();
    let isDarkResolved = isDark;
    if (mode === 'dark') isDarkResolved = true;
    else if (mode === 'light') isDarkResolved = false;
    else {
      isDarkResolved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    onUpdateSettings({
      themeMode: mode,
      isDarkMode: isDarkResolved
    });
  };

  const PRESET_ACCENTS: Record<ThemePreset, string> = {
    slate: '#6366f1',
    oled: '#a855f7',
    sunset: '#f59e0b',
    emerald: '#10b981',
    lavender: '#d946ef'
  };

  const handlePresetChange = (preset: ThemePreset) => {
    soundManager.playHapticClick();
    onUpdateSettings({ 
      themePreset: preset,
      accentColor: PRESET_ACCENTS[preset]
    });
  };

  // Dock Configuration State & Handlers
  const [previewScreen, setPreviewScreen] = useState<'small' | 'large'>('small');

  const dockAppIds = settings.dockAppIds && settings.dockAppIds.length > 0 
    ? settings.dockAppIds 
    : DEFAULT_DOCK_APP_IDS;

  const dockMaxSmall = settings.dockMaxSmallScreen ?? 5;
  const dockMaxLarge = settings.dockMaxLargeScreen ?? 7;

  const getDockAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'notebook': return <Notebook className="w-4 h-4 text-white" />;
      case 'file-text': return <FileText className="w-4 h-4 text-white" />;
      case 'pen-tool': return <PenTool className="w-4 h-4 text-white" />;
      case 'disc': return <Disc className="w-4 h-4 text-white" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-white" />;
      case 'calendar': return <Calendar className="w-4 h-4 text-white" />;
      case 'wallet': return <Wallet className="w-4 h-4 text-white" />;
      case 'shopping-bag':
      case 'store':
        return <ShoppingBag className="w-4 h-4 text-white" />;
      default: return <Layers className="w-4 h-4 text-white" />;
    }
  };

  const handleToggleDockApp = (appId: string) => {
    soundManager.playClickSound();
    let next: string[];
    if (dockAppIds.includes(appId)) {
      if (dockAppIds.length <= 1) return;
      next = dockAppIds.filter((id) => id !== appId);
    } else {
      next = [...dockAppIds, appId];
    }
    onUpdateSettings({ dockAppIds: next });
  };

  const handleMoveDockApp = (index: number, direction: 'up' | 'down') => {
    soundManager.playClickSound();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dockAppIds.length) return;
    const next = [...dockAppIds];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onUpdateSettings({ dockAppIds: next });
  };

  const handleSetMaxSmall = (count: number) => {
    soundManager.playClickSound();
    onUpdateSettings({ dockMaxSmallScreen: count });
  };

  const handleSetMaxLarge = (count: number) => {
    soundManager.playClickSound();
    onUpdateSettings({ dockMaxLargeScreen: count });
  };

  const handleResetDock = () => {
    soundManager.playClickSound();
    onUpdateSettings({
      dockAppIds: DEFAULT_DOCK_APP_IDS,
      dockMaxSmallScreen: 5,
      dockMaxLargeScreen: 7
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border transition-colors ${
          isDark
            ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]'
            : 'bg-white border-neutral-200 text-neutral-800 shadow-neutral-500/20'
        }`}
      >
        {/* Settings Navigation Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between transition-colors ${
          isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <div className="flex items-center gap-3">
            <HarmonyLogo size="sm" isDarkMode={isDark} />
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                <span>Harmony Settings</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
                  v2.0
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                Themes, Dock, Focus Mode & Unified Apps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark
                ? 'bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-none">
          {/* Section: Account & Harmony Setup */}
          <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
            isDark
              ? 'bg-[#0d1117] border-[#30363d]'
              : 'bg-neutral-50/80 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {currentUser && !currentUser.isAnonymous
                      ? (currentUser.displayName || currentUser.email || 'Registered User')
                      : 'Guest User (Offline Mode)'}
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    {currentUser && !currentUser.isAnonymous
                      ? 'Real-time Firebase sync active'
                      : 'Optional account • Guest data saved locally'}
                  </p>
                </div>
              </div>

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{currentUser && !currentUser.isAnonymous ? 'Manage Account' : 'Sign In / Sign Up'}</span>
                </button>
              )}
            </div>

            {/* Quick shortcuts to Home Screen Setup and Welcome Tour */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-inherit">
              {onOpenHomeScreenSetup && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHomeScreenSetup();
                  }}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-[#161b22] hover:bg-[#21262d] text-white border-[#30363d]'
                      : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Home Screen Setup</span>
                </button>
              )}

              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOnboarding();
                  }}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-[#161b22] hover:bg-[#21262d] text-white border-[#30363d]'
                      : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Replay Welcome Tour</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 0: Appearance & Theme Modes */}
          <div className={`p-4 rounded-xl border space-y-4 transition-colors ${
            isDark
              ? 'bg-[#0d1117] border-[#30363d]'
              : 'bg-neutral-50/80 border-neutral-200'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4" /> Appearance & Display Themes
              </span>
              <span className="text-[10px] text-amber-500 font-mono flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> Cloud Synced
              </span>
            </h4>

            {/* Visual Theme Mode Selector (Light / Dark / System) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Light Theme Card */}
              <button
                id="btn-theme-light"
                type="button"
                onClick={() => handleModeChange('light')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all relative ${
                  currentMode === 'light'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark
                      ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]'
                      : 'bg-white border-neutral-200 hover:border-indigo-400'
                }`}
              >
                {/* Visual mini screen representation */}
                <div className="w-full h-14 rounded-lg bg-gradient-to-b from-neutral-100 to-white border border-neutral-300 p-1.5 flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="w-4 h-1 rounded-full bg-neutral-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-3 rounded bg-neutral-200" />
                    <div className="h-3 rounded bg-neutral-200" />
                    <div className="h-3 rounded bg-indigo-200" />
                  </div>
                  <div className="h-2 rounded bg-neutral-200/90 w-full" />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Light</span>
                </div>
                {currentMode === 'light' && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </button>

              {/* Dark Theme Card */}
              <button
                id="btn-theme-dark"
                type="button"
                onClick={() => handleModeChange('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all relative ${
                  currentMode === 'dark'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark
                      ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]'
                      : 'bg-white border-neutral-200 hover:border-indigo-400'
                }`}
              >
                {/* Visual mini screen representation */}
                <div className="w-full h-14 rounded-lg bg-gradient-to-b from-[#161b22] to-[#0d1117] border border-[#30363d] p-1.5 flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="w-4 h-1 rounded-full bg-neutral-600" />
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-3 rounded bg-neutral-800" />
                    <div className="h-3 rounded bg-neutral-800" />
                    <div className="h-3 rounded bg-indigo-900" />
                  </div>
                  <div className="h-2 rounded bg-neutral-800 w-full" />
                </div>

                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Dark</span>
                </div>
                {currentMode === 'dark' && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </button>

              {/* System Automatic Card */}
              <button
                id="btn-theme-system"
                type="button"
                onClick={() => handleModeChange('system')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all relative ${
                  currentMode === 'system'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark
                      ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]'
                      : 'bg-white border-neutral-200 hover:border-indigo-400'
                }`}
              >
                {/* Visual mini screen split */}
                <div className="w-full h-14 rounded-lg overflow-hidden border border-neutral-300 dark:border-[#30363d] flex shadow-inner">
                  <div className="w-1/2 h-full bg-white p-1 flex flex-col justify-between">
                    <div className="w-3 h-1 rounded-full bg-neutral-400" />
                    <div className="h-3 rounded bg-neutral-200" />
                    <div className="h-2 rounded bg-neutral-200 w-full" />
                  </div>
                  <div className="w-1/2 h-full bg-[#0d1117] p-1 flex flex-col justify-between">
                    <div className="w-3 h-1 rounded-full bg-neutral-600 ml-auto" />
                    <div className="h-3 rounded bg-neutral-800" />
                    <div className="h-2 rounded bg-neutral-800 w-full" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>System</span>
                </div>
                {currentMode === 'system' && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Auto
                  </span>
                )}
              </button>
            </div>

            {/* Theme Color Presets */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                  Accent Color & Wallpaper Atmosphere
                </span>
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono capitalize">
                  {currentPreset}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {THEME_PRESETS.map((p) => {
                  const isSelected = currentPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/40'
                          : isDark
                            ? 'bg-[#161b22] border-[#30363d] hover:border-neutral-500'
                            : 'bg-white border-neutral-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`w-4 h-4 rounded-full ${p.dotColor} ring-2 ring-white/20`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
                      </div>
                      <div>
                        <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {p.name.replace('Apple ', '').replace('Solar ', '').replace('Alpine ', '').replace('Royal ', '')}
                        </div>
                        <div className={`text-[9px] truncate ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                          {p.id.toUpperCase()}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 1: Focus Mode & Volume Controls */}
          <div className={`p-4 rounded-xl border space-y-4 transition-colors ${
            isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50/80 border-neutral-200'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BellOff className="w-4 h-4" /> Focus Mode & Sound Controls
              </span>
            </h4>

            {/* Focus Mode Toggle */}
            <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  settings.focusMode ? 'bg-indigo-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                  <BellOff className="w-4 h-4" />
                </div>
                <div>
                  <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Focus Mode (Do Not Disturb)
                  </h5>
                  <p className={`text-[11px] ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    Suppresses notifications and mutes non-essential system sounds
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !settings.focusMode;
                  onUpdateSettings({ focusMode: next });
                  soundManager.playFocusToggleSound(next);
                }}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  settings.focusMode ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-[#30363d]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.focusMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Master Volume */}
            <div className={`p-3 rounded-lg border space-y-2 transition-colors ${
              isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className={`flex items-center gap-2 font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span>Master Volume Setting</span>
                </span>
                <span className="font-mono text-emerald-500 font-bold">{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  onUpdateSettings({ volume: vol });
                  soundManager.setSettings({ volume: vol });
                }}
                className={`w-full accent-indigo-500 rounded-lg h-2 cursor-pointer ${
                  isDark ? 'bg-[#30363d]' : 'bg-neutral-200'
                }`}
              />
            </div>
          </div>

          {/* Section: Bottom Dock Personalization & Icon Configuration */}
          <div className={`p-4 rounded-xl border space-y-4 transition-colors ${
            isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50/80 border-neutral-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Bottom Dock & App Icon Configuration
              </h4>
              <button
                type="button"
                onClick={handleResetDock}
                className={`text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors self-start sm:self-auto ${
                  isDark
                    ? 'bg-[#161b22] border-[#30363d] text-neutral-300 hover:bg-[#21262d] hover:text-white'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
                title="Reset dock to default 5 apps (mobile) and 7 apps (desktop)"
              >
                <RotateCcw className="w-3 h-3 text-indigo-400" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-neutral-600'}`}>
              Customize which apps appear on your bottom dock, their priority order, and the maximum number of visible icons on small and large screens.
            </p>

            {/* Screen Size Limits Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Small Screen Limit (Mobile) */}
              <div className={`p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    <MobileIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Small Screen (Mobile)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                    {dockMaxSmall} Apps {dockMaxSmall === 5 ? '(Default)' : ''}
                  </span>
                </div>
                <p className={`text-[11px] mb-2.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                  Max dock apps on phones & compact displays (&lt; 640px)
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={`small-${num}`}
                      type="button"
                      onClick={() => handleSetMaxSmall(num)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        dockMaxSmall === num
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                          : isDark
                            ? 'bg-[#0d1117] border-[#30363d] text-neutral-400 hover:text-white hover:border-neutral-500'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Screen Limit (Desktop & Tablets) */}
              <div className={`p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Large Screen (Desktop)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    {dockMaxLarge} Apps {dockMaxLarge === 7 ? '(Default)' : ''}
                  </span>
                </div>
                <p className={`text-[11px] mb-2.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                  Max dock apps on laptops, tablets & desktops (≥ 640px)
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={`large-${num}`}
                      type="button"
                      onClick={() => handleSetMaxLarge(num)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        dockMaxLarge === num
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                          : isDark
                            ? 'bg-[#0d1117] border-[#30363d] text-neutral-400 hover:text-white hover:border-neutral-500'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Live Dock Preview */}
            <div className={`p-3 rounded-xl border transition-colors ${
              isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Live Dock Preview
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-neutral-200 dark:bg-[#0d1117] p-0.5 rounded-lg text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewScreen('small')}
                    className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                      previewScreen === 'small'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <MobileIcon className="w-2.5 h-2.5" />
                    <span>Mobile ({dockMaxSmall})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScreen('large')}
                    className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                      previewScreen === 'large'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Laptop className="w-2.5 h-2.5" />
                    <span>Desktop ({dockMaxLarge})</span>
                  </button>
                </div>
              </div>

              {/* Preview Dock Mockup */}
              <div className="flex justify-center p-3 rounded-lg bg-neutral-100 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#21262d] overflow-x-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-[#161b22]/90 border border-neutral-300/80 dark:border-[#30363d] shadow-sm">
                  {dockAppIds
                    .slice(0, previewScreen === 'small' ? dockMaxSmall : dockMaxLarge)
                    .map((id) => {
                      const app = HARMONY_APPS.find((a) => a.id === id);
                      if (!app) return null;
                      return (
                        <div
                          key={`preview-${id}`}
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.colorGradient} flex items-center justify-center shadow-sm text-white`}
                          title={app.name}
                        >
                          {getDockAppIcon(app.iconName)}
                        </div>
                      );
                    })}
                  <div className="w-px h-5 bg-neutral-300 dark:bg-white/20 mx-0.5" />
                  <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-purple-400 border border-neutral-300 dark:border-neutral-700">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Configurable App List & Ordering */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={isDark ? 'text-white' : 'text-neutral-900'}>
                  Apps on Dock ({dockAppIds.length} of {HARMONY_APPS.length} enabled)
                </span>
                <span className={`text-[11px] font-normal ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                  Use arrows to prioritize position
                </span>
              </div>

              <div className="space-y-1.5">
                {/* Apps currently in dock */}
                {dockAppIds.map((id, index) => {
                  const app = HARMONY_APPS.find((a) => a.id === id);
                  if (!app) return null;

                  const isVisibleMobile = index < dockMaxSmall;
                  const isVisibleDesktop = index < dockMaxLarge;

                  return (
                    <div
                      key={`dock-item-${id}`}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-colors ${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 text-center text-xs font-mono font-bold ${
                          isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>
                          #{index + 1}
                        </span>
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.colorGradient} flex items-center justify-center shadow-sm text-white shrink-0`}>
                          {getDockAppIcon(app.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {app.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isVisibleMobile && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
                                Mobile (1-{dockMaxSmall})
                              </span>
                            )}
                            {isVisibleDesktop && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                                Desktop (1-{dockMaxLarge})
                              </span>
                            )}
                            {!isVisibleMobile && !isVisibleDesktop && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold">
                                Standby
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveDockApp(index, 'up')}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                            index === 0
                              ? 'opacity-30 cursor-not-allowed border-transparent'
                              : isDark
                                ? 'bg-[#0d1117] border-[#30363d] text-neutral-300 hover:bg-indigo-600 hover:text-white'
                                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-indigo-600 hover:text-white'
                          }`}
                          title="Move up in dock priority"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === dockAppIds.length - 1}
                          onClick={() => handleMoveDockApp(index, 'down')}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                            index === dockAppIds.length - 1
                              ? 'opacity-30 cursor-not-allowed border-transparent'
                              : isDark
                                ? 'bg-[#0d1117] border-[#30363d] text-neutral-300 hover:bg-indigo-600 hover:text-white'
                                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-indigo-600 hover:text-white'
                          }`}
                          title="Move down in dock priority"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove from Dock */}
                        <button
                          type="button"
                          disabled={dockAppIds.length <= 1}
                          onClick={() => handleToggleDockApp(id)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-rose-500 transition-colors ${
                            dockAppIds.length <= 1
                              ? 'opacity-30 cursor-not-allowed'
                              : isDark
                                ? 'bg-[#0d1117] border-[#30363d] hover:bg-rose-600 hover:text-white'
                                : 'bg-neutral-100 border-neutral-200 hover:bg-rose-600 hover:text-white'
                          }`}
                          title="Remove from Dock"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Available apps not in dock */}
                {HARMONY_APPS.filter((a) => !dockAppIds.includes(a.id)).length > 0 && (
                  <div className="pt-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                      Available Ecosystem Apps to Add
                    </span>
                    <div className="space-y-1.5">
                      {HARMONY_APPS.filter((a) => !dockAppIds.includes(a.id)).map((app) => (
                        <div
                          key={`undocked-${app.id}`}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2.5 transition-colors opacity-75 hover:opacity-100 ${
                            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${app.colorGradient} flex items-center justify-center shadow-sm text-white shrink-0`}>
                              {getDockAppIcon(app.iconName)}
                            </div>
                            <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {app.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleDockApp(app.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-600 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add to Dock</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Harmony WebApps Catalog */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
              isDark ? 'text-[#8b949e]' : 'text-neutral-500'
            }`}>
              <Github className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Integrated GitHub Pages & Repositories</span>
            </h4>

            <div className="space-y-2.5">
              {HARMONY_APPS.map((app) => (
                <div
                  key={app.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isDark
                      ? 'bg-[#0d1117] border-[#30363d]'
                      : 'bg-white border-neutral-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                      ✨
                    </div>
                    <div>
                      <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{app.name}</h5>
                      <p className={`text-[11px] ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>{app.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={app.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold hover:bg-indigo-600/20 flex items-center gap-1 transition-colors"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={app.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        isDark
                          ? 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d] hover:text-white'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900'
                      }`}
                    >
                      <Github className="w-3 h-3" />
                      <span>Repo</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Progressive Web App & Service Worker */}
          <div className={`p-4 rounded-xl border transition-colors ${
            isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            <h4 className={`text-xs font-bold flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>PWA Support & Offline Capability</span>
            </h4>
            <p className={`text-xs mb-3 ${isDark ? 'text-[#8b949e]' : 'text-neutral-600'}`}>
              Harmony is PWA compliant with Web App Manifest (<code className="text-indigo-500 dark:text-indigo-400">manifest.json</code>) and Service Worker (<code className="text-indigo-500 dark:text-indigo-400">sw.js</code>) caching for mobile home screen installation.
            </p>
            <div className="flex items-center justify-between text-xs text-emerald-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Service Worker Registered
              </span>
              <span className={isDark ? 'text-[#8b949e]' : 'text-neutral-500'}>Cache: harmony-v1</span>
            </div>
          </div>

          {/* Section 4: Firebase Architecture Info */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <h4 className={`text-xs font-bold flex items-center gap-2 mb-1 ${isDark ? 'text-white' : 'text-amber-900'}`}>
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Firebase Cloud Backend</span>
            </h4>
            <p className={`text-xs ${isDark ? 'text-amber-200/80' : 'text-amber-800'}`}>
              Project ID: <code className="font-mono font-bold text-amber-600 dark:text-amber-300">concrete-lead-kc9s2</code> • Auth & Firestore enabled.
            </p>
          </div>

          {/* Section 5: About Harmony */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
            isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <HarmonyLogo size="lg" isDarkMode={isDark} />
            <div className="space-y-0.5 min-w-0">
              <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                <span>Harmony</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
                  Official Release
                </span>
              </h4>
              <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-neutral-600'}`}>
                Next-generation unified mini-app ecosystem with real-time cloud sync, customizable smart dock, and live widgets.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 text-center text-xs border-t transition-colors ${
          isDark ? 'bg-[#0d1117] text-[#8b949e] border-[#30363d]' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
        }`}>
          Harmony Portal: <a href="https://abduedris313-max.github.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 underline">https://abduedris313-max.github.io/</a>
        </div>
      </motion.div>
    </div>
  );
};
