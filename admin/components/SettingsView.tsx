/**
 * @file SettingsView.tsx
 * @description Admin portal configuration, Firebase BaaS telemetry, and security policy inspector.
 */

import React from 'react';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Key, 
  Server, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface SettingsViewProps {
  isDarkMode: boolean;
  appsCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  appsCount
}) => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          App Store Developer Console Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Backend infrastructure, Firestore collections, and security configuration.
        </p>
      </div>

      {/* Cloud Firestore BaaS Card */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cloud Firestore Database</h3>
              <p className="text-xs text-slate-400">Harmony Super App Central BaaS</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active & Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Project ID</div>
            <div className="text-slate-200 truncate">{firebaseConfig.projectId}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Catalog Collection</div>
            <div className="text-blue-400 font-bold">central_apps_catalog</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Security Rules</div>
            <div className="text-emerald-400">rules_version = '2' (Deployed)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Total Documents</div>
            <div className="text-slate-200">{appsCount} Mini App Manifests</div>
          </div>
        </div>
      </div>

      {/* Security Rules Documentation */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm">Security & Access Policy</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          All client devices running the Harmony Super App have public read access to <code className="text-blue-400 bg-slate-800 px-1 py-0.5 rounded">/central_apps_catalog/{'{appId}'}</code> to discover and install packages. Administrative writes, updates, and removals are protected via Cloud Firestore Security Rules.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
          <pre>{`match /central_apps_catalog/{appId} {
  allow read: if true;
  allow write: if isAuthenticated() || isLocalAdmin();
}`}</pre>
        </div>
      </div>
    </div>
  );
};
