/**
 * @file AppSwitcher.tsx
 * @description iOS 3D Multitasking App Switcher.
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import { HARMONY_APPS } from '../config/apps';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  openAppIds: string[];
  activeAppId: string | null;
  onSelectApp: (appId: string) => void;
  onCloseApp: (appId: string) => void;
  onCloseAllApps: () => void;
  isDarkMode?: boolean;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({
  isOpen,
  onClose,
  openAppIds,
  activeAppId,
  onSelectApp,
  onCloseApp,
  onCloseAllApps,
  isDarkMode = true
}) => {
  if (!isOpen) return null;

  const runningApps = HARMONY_APPS.filter(a => openAppIds.includes(a.id));

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-2xl flex flex-col items-center justify-between p-6 animate-fade-in ${
      isDarkMode ? 'bg-black/80' : 'bg-neutral-900/60'
    }`}>
      {/* Header */}
      <div className={`w-full max-w-4xl flex items-center justify-between border-b pb-4 ${
        isDarkMode ? 'text-[#c9d1d9] border-[#30363d]' : 'text-white border-white/20'
      }`}>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>iOS App Switcher</span>
          </h2>
          <p className="text-xs text-white/70">{runningApps.length} Harmony Mini Apps in background</p>
        </div>

        <div className="flex items-center gap-3">
          {runningApps.length > 0 && (
            <button
              onClick={onCloseAllApps}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Close All</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D App Cards Deck */}
      <div className="flex-1 w-full max-w-4xl flex items-center justify-center gap-6 overflow-x-auto py-8 scrollbar-none">
        {runningApps.length > 0 ? (
          runningApps.map((app) => (
            <motion.div
              key={app.id}
              drag="y"
              dragConstraints={{ top: -400, bottom: 0 }}
              dragElastic={0.5}
              dragSnapToOrigin={true}
              onDragEnd={(e, info) => {
                if (info.offset.y < -80 || info.velocity.y < -250) {
                  onCloseApp(app.id);
                }
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`w-72 sm:w-80 h-[420px] rounded-[32px] bg-gradient-to-br ${app.colorGradient} p-1 shadow-2xl flex flex-col justify-between relative shrink-0 border border-white/20 cursor-grab active:cursor-grabbing overflow-hidden ${activeAppId === app.id ? 'ring-4 ring-white' : ''}`}
              onClick={() => {
                onSelectApp(app.id);
                onClose();
              }}
            >
              {/* App Top Bar */}
              <div className="p-4 bg-black/60 backdrop-blur-md rounded-t-[28px] flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                    📱
                  </div>
                  <span className="text-sm font-semibold truncate">{app.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseApp(app.id);
                  }}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-red-500 hover:text-white flex items-center justify-center text-white transition-colors"
                  title="Close Mini App"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body Preview */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-black/30 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white text-3xl mb-4 shadow-inner">
                  ✨
                </div>
                <h3 className="text-white font-bold text-lg">{app.name}</h3>
                <p className="text-white/70 text-xs mt-1 max-w-[220px]">{app.description}</p>
                <div className="mt-6 px-4 py-2 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/30 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Resume Mini App</span>
                </div>
              </div>

              {/* Card Bottom Bar */}
              <div className="p-3 bg-black/70 backdrop-blur-md rounded-b-[28px] text-[11px] text-white/60 text-center font-mono truncate px-4">
                {app.deployedUrl}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-white/50">
            <p className="text-base font-semibold">No open apps in background</p>
            <p className="text-xs mt-1">Tap any app icon on the home screen to launch a Harmony Mini App</p>
          </div>
        )}
      </div>

      {/* Swipe Up Home Bar Helper */}
      <button
        onClick={onClose}
        className="w-36 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-colors mb-2 cursor-pointer"
        title="Return to Home Screen"
      />
    </div>
  );
};
