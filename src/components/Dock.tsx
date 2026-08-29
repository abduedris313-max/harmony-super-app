/**
 * @file Dock.tsx
 * @description iOS 18 style floating Dock at bottom of home screen.
 */

import React from 'react';
import { motion } from 'motion/react';
import { HARMONY_APPS } from '../config/apps';
import { Notebook, FileText, PenTool, Disc, Sparkles, Layers } from 'lucide-react';

interface DockProps {
  onOpenApp: (appId: string) => void;
  onOpenAppSwitcher: () => void;
  activeAppId: string | null;
}

export const Dock: React.FC<DockProps> = ({ onOpenApp, onOpenAppSwitcher, activeAppId }) => {
  const getDockIcon = (iconName: string) => {
    switch (iconName) {
      case 'notebook': return <Notebook className="w-5 h-5 text-white" />;
      case 'file-text': return <FileText className="w-5 h-5 text-white" />;
      case 'pen-tool': return <PenTool className="w-5 h-5 text-white" />;
      case 'disc': return <Disc className="w-5 h-5 text-white" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-white" />;
      default: return <Layers className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div id="dock-container" className="w-full flex justify-center pb-2 px-2 pointer-events-auto z-30">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-3 py-1.5 rounded-[24px] bg-[#161b22]/90 backdrop-blur-2xl border border-[#30363d] shadow-xl flex items-center gap-2 sm:gap-3"
      >
        {HARMONY_APPS.map((app) => {
          const isActive = activeAppId === app.id;
          return (
            <motion.button
              key={app.id}
              id={`dock-icon-${app.id}`}
              whileHover={{ y: -4, scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => onOpenApp(app.id)}
              className="relative group flex flex-col items-center"
              title={app.name}
            >
              <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${app.colorGradient} flex items-center justify-center shadow-md p-1 relative overflow-hidden transition-all group-hover:shadow-fuchsia-500/30 ${isActive ? 'ring-2 ring-white scale-105' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-[12px]" />
                {getDockIcon(app.iconName)}
              </div>
              
              {/* iOS Active App Indicator Dot */}
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-white mt-0.5 shadow-glow" />
              )}
            </motion.button>
          );
        })}

        {/* Separator line */}
        <div className="w-px h-6 bg-white/20 mx-0.5" />

        {/* App Switcher Launcher */}
        <motion.button
          id="btn-dock-switcher"
          whileHover={{ y: -4, scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={onOpenAppSwitcher}
          className="w-10 h-10 rounded-[12px] bg-neutral-800/90 border border-neutral-700/80 flex items-center justify-center text-white shadow-md hover:bg-neutral-700"
          title="App Switcher"
        >
          <Layers className="w-5 h-5 text-purple-300" />
        </motion.button>
      </motion.div>
    </div>
  );
};
