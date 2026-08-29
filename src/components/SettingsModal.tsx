/**
 * @file SettingsModal.tsx
 * @description iOS System Settings App modal for Harmony OS Super App.
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Settings, Github, ExternalLink, ShieldCheck, Download, Smartphone, Flame, Info } from 'lucide-react';
import { HARMONY_APPS } from '../config/apps';
import { SystemSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (updated: Partial<SystemSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl text-[#c9d1d9] flex flex-col max-h-[85vh]"
      >
        {/* Settings Navigation Header */}
        <div className="p-5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#21262d] text-indigo-400 border border-[#30363d] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System Settings</h3>
              <p className="text-xs text-[#8b949e]">Harmony Projects & Environment Specs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-none">
          {/* Section 1: Harmony WebApps Catalog */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-3 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-indigo-400" />
              <span>Integrated GitHub Pages & Repositories</span>
            </h4>

            <div className="space-y-2.5">
              {HARMONY_APPS.map((app) => (
                <div key={app.id} className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white shrink-0`}>
                      ✨
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{app.name}</h5>
                      <p className="text-[11px] text-[#8b949e]">{app.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={app.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold hover:bg-indigo-600/40 flex items-center gap-1 transition-colors"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={app.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-[#21262d] text-[#c9d1d9] border border-[#30363d] text-[11px] font-semibold hover:bg-[#30363d] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Github className="w-3 h-3" />
                      <span>Repo</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Progressive Web App & Service Worker */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>PWA Support & Offline Capability</span>
            </h4>
            <p className="text-xs text-[#8b949e] mb-3">
              Harmony OS Super App is PWA compliant with Web App Manifest (<code className="text-indigo-400">manifest.json</code>) and Service Worker (<code className="text-indigo-400">sw.js</code>) caching for mobile home screen installation.
            </p>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Service Worker Registered
              </span>
              <span className="text-[#8b949e]">Cache: harmony-os-v1</span>
            </div>
          </div>

          {/* Section 3: Firebase Architecture Info */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Firebase Cloud Backend</span>
            </h4>
            <p className="text-xs text-amber-200/80">
              Project ID: <code className="font-mono text-white">concrete-lead-kc9s2</code> • Auth & Firestore enabled.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0d1117] text-center text-xs text-[#8b949e] border-t border-[#30363d]">
          Super App Base URL: <a href="https://abduedris313-max.github.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">https://abduedris313-max.github.io/</a>
        </div>
      </motion.div>
    </div>
  );
};
