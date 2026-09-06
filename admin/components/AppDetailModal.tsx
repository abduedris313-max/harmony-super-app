/**
 * @file AppDetailModal.tsx
 * @description Inspector and metadata editor for published mini apps in the Central Repository.
 */

import React, { useState } from 'react';
import { 
  X, 
  Save, 
  GitBranch, 
  ExternalLink, 
  Github, 
  Star, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Play, 
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { AdminMiniApp, AppPublishStatus } from '../types';

interface AppDetailModalProps {
  app: AdminMiniApp | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApp: (appId: string, updates: Partial<AdminMiniApp>) => Promise<void>;
  onOpenSandbox: (app: AdminMiniApp) => void;
  isDarkMode: boolean;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  isOpen,
  onClose,
  onUpdateApp,
  onOpenSandbox,
  isDarkMode
}) => {
  if (!isOpen || !app) return null;

  const [name, setName] = useState(app.name);
  const [tagline, setTagline] = useState(app.tagline || '');
  const [description, setDescription] = useState(app.description || '');
  const [version, setVersion] = useState(app.version || '1.0.0');
  const [status, setStatus] = useState<AppPublishStatus>(app.status || 'published');
  const [badge, setBadge] = useState(app.badge || '');
  const [deployedUrl, setDeployedUrl] = useState(app.deployedUrl || '');
  const [repoUrl, setRepoUrl] = useState(app.repoUrl || '');
  const [releaseNotes, setReleaseNotes] = useState(app.releaseNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'metadata' | 'versions' | 'permissions'>('metadata');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateApp(app.id, {
        name,
        tagline,
        description,
        version,
        status,
        badge,
        deployedUrl,
        repoUrl,
        releaseNotes
      });
      onClose();
    } catch (err) {
      alert('Failed to update app metadata');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickVersionBump = (type: 'patch' | 'minor' | 'major') => {
    const parts = version.split('.').map(p => parseInt(p, 10) || 0);
    while (parts.length < 3) parts.push(0);
    if (type === 'patch') parts[2]++;
    if (type === 'minor') { parts[1]++; parts[2] = 0; }
    if (type === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
    const nextVer = parts.join('.');
    setVersion(nextVer);
    setReleaseNotes(`Release v${nextVer}: Performance enhancements, package updates and stability improvements.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: app.bgHex || '#3b82f6' }}
            >
              {app.iconCdnUrl ? (
                <img 
                  src={app.iconCdnUrl} 
                  alt={app.name} 
                  className="w-5 h-5 object-contain invert brightness-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Layers className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">{app.name}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  v{app.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{app.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSandbox(app);
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Sandbox</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'metadata' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            General Metadata
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'versions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Release Versions ({app.versions?.length || 1})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'permissions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Declared Permissions ({app.permissions?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSave} className="p-6">
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Application Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AppPublishStatus)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="published">Published</option>
                    <option value="in_review">In Review</option>
                    <option value="draft">Draft</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* Version Bump Controls */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                    Version Bump & Release Pipeline
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickVersionBump('patch')}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      +Patch
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickVersionBump('minor')}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 cursor-pointer"
                    >
                      +Minor
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickVersionBump('major')}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 cursor-pointer"
                    >
                      +Major
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">New Version</label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Store Badge</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. Core, Featured"
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Release Notes / Changelog</label>
                  <input
                    type="text"
                    value={releaseNotes}
                    onChange={(e) => setReleaseNotes(e.target.value)}
                    placeholder="Changelog for this version..."
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Deployed & Repo URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deployed URL</label>
                  <input
                    type="url"
                    value={deployedUrl}
                    onChange={(e) => setDeployedUrl(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Repository URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {(app.versions && app.versions.length > 0 ? app.versions : [
                {
                  version: app.version || '1.0.0',
                  releaseDate: '2026-08-25',
                  changelog: 'Official stable production build.',
                  bundleSize: app.size || '1.8 MB',
                  checksumSha256: `sha256_${app.id}_1_0_0`,
                  status: 'active' as const
                }
              ]).map((ver, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-400">v{ver.version}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ver.releaseDate}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ver.changelog}</p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                    <span>Size: {ver.bundleSize}</span>
                    <span className="truncate">Checksum: {ver.checksumSha256}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-3">
                Sandbox permissions declared by this mini-app package.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(app.permissions || ['storage', 'network']).map((perm) => (
                  <div 
                    key={perm}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/30 flex items-center gap-2 text-xs text-slate-300"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Last synced: <span className="font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Updates'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
