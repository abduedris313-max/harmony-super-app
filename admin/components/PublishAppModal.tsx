/**
 * @file PublishAppModal.tsx
 * @description Modal form and live preview studio to publish new mini apps into the Central Repository.
 */

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Layers, 
  Check, 
  AlertCircle, 
  Palette, 
  Globe, 
  Github, 
  ShieldCheck, 
  FileText, 
  Star,
  ExternalLink,
  Download
} from 'lucide-react';
import { PublishAppFormData, AppPublishStatus } from '../types';
import { getLucideCdnIconUrl } from '../../src/lib/cdn';

interface PublishAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (formData: PublishAppFormData) => Promise<void>;
  isDarkMode: boolean;
}

const PRESET_ICONS = [
  'code-2', 'cpu', 'database', 'globe', 'compass', 'book-open', 
  'camera', 'mail', 'music', 'mic', 'map', 'palette', 'zap', 
  'shield', 'heart', 'coffee', 'clock', 'sparkles', 'box', 'terminal'
];

const PRESET_THEMES = [
  { name: 'Indigo / Sky', gradient: 'from-blue-600 via-sky-500 to-indigo-600', hex: '#0284c7' },
  { name: 'Emerald / Mint', gradient: 'from-emerald-500 via-teal-500 to-cyan-600', hex: '#059669' },
  { name: 'Amber / Sunset', gradient: 'from-amber-400 via-orange-500 to-rose-600', hex: '#f59e0b' },
  { name: 'Fuchsia / Neon', gradient: 'from-fuchsia-500 via-purple-600 to-pink-500', hex: '#d946ef' },
  { name: 'Violet / Cosmos', gradient: 'from-violet-500 via-purple-600 to-indigo-700', hex: '#8b5cf6' },
  { name: 'Rose / Crimson', gradient: 'from-rose-500 via-red-600 to-amber-600', hex: '#ef4444' },
];

const PERMISSION_OPTIONS = [
  { id: 'storage', label: 'Local & Cloud Storage' },
  { id: 'network', label: 'Network Fetch & APIs' },
  { id: 'offline-cache', label: 'Service Worker Offline Cache' },
  { id: 'audio', label: 'Web Audio Synthesizer' },
  { id: 'notifications', label: 'Push Notifications' },
  { id: 'system-diagnostics', label: 'System Diagnostics & Telemetry' }
];

export const PublishAppModal: React.FC<PublishAppModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  isDarkMode
}) => {
  const [formData, setFormData] = useState<PublishAppFormData>({
    id: 'harmony-new-app',
    name: '',
    tagline: '',
    description: '',
    iconName: 'sparkles',
    iconCdnUrl: getLucideCdnIconUrl('sparkles'),
    colorGradient: PRESET_THEMES[0].gradient,
    bgHex: PRESET_THEMES[0].hex,
    deployedUrl: 'https://example.github.io/my-mini-app/',
    repoUrl: 'https://github.com/developer/my-mini-app',
    version: '1.0.0',
    author: 'Community Developer',
    size: '1.8 MB',
    category: 'productivity',
    badge: 'New',
    isSystemApp: false,
    permissions: ['storage', 'network', 'offline-cache'],
    repositoryId: 'harmony-community',
    releaseNotes: 'Initial production release to the Harmony Central Repository.',
    status: 'published'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      id: slug ? `harmony-${slug}` : 'harmony-app'
    }));
  };

  const handleIconSelect = (iconName: string) => {
    setFormData((prev) => ({
      ...prev,
      iconName,
      iconCdnUrl: getLucideCdnIconUrl(iconName)
    }));
  };

  const handleThemeSelect = (theme: typeof PRESET_THEMES[0]) => {
    setFormData((prev) => ({
      ...prev,
      colorGradient: theme.gradient,
      bgHex: theme.hex
    }));
  };

  const togglePermission = (permId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists 
          ? prev.permissions.filter(p => p !== permId)
          : [...prev.permissions, permId]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter an application name.');
      return;
    }
    if (!formData.id.trim()) {
      setErrorMsg('Please enter a valid package identifier.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onPublish(formData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish mini app package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Publish Mini App Package
            </h2>
            <p className="text-xs text-slate-400">
              Submit and index an application directly into the central repository.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Form & Live Preview */}
        <form onSubmit={handleSubmit} className="p-6">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* App Name & Identifier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    App Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Code Studio"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Package ID (Unique) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="harmony-my-app"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline (Short Summary) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Lightweight code editor with instant syntax highlighting"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Store Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed explanation of features, offline capabilities, and workflow..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* Category, Version, Author */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="productivity">Productivity</option>
                    <option value="utilities">Utilities</option>
                    <option value="developer">Developer</option>
                    <option value="finance">Finance</option>
                    <option value="audio">Audio</option>
                    <option value="ai">AI</option>
                    <option value="health">Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Version (SemVer)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bundle Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="1.8 MB"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Author & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Author / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Harmony Flow Team"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Store Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Utility, DevTools, Featured"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Choose Icon ({formData.iconName})</span>
                  <span className="text-[10px] text-slate-500">Source: Lucide CDN</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-800/60 bg-slate-950/40 max-h-24 overflow-y-auto">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleIconSelect(icon)}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        formData.iconName === icon
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-mono text-[11px]">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Swatches */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>Color Gradient & Accent</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_THEMES.map((theme, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleThemeSelect(theme)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-medium transition-all cursor-pointer ${
                        formData.bgHex === theme.hex
                          ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div 
                        className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.gradient}`}
                        style={{ backgroundColor: theme.hex }}
                      />
                      <span className="truncate w-full text-center">{theme.name.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* URLs: Deployed URL & GitHub Repo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-400" />
                    Deployed Web App URL
                  </label>
                  <input
                    type="url"
                    value={formData.deployedUrl}
                    onChange={(e) => setFormData({ ...formData, deployedUrl: e.target.value })}
                    placeholder="https://app.github.io/"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Github className="w-3 h-3 text-slate-400" />
                    Source GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    placeholder="https://github.com/org/repo"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Permissions Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Declared Sandbox Permissions</span>
                </label>
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40">
                  {PERMISSION_OPTIONS.map((p) => {
                    const isChecked = formData.permissions.includes(p.id);
                    return (
                      <label 
                        key={p.id}
                        className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(p.id)}
                          className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Live App Store Preview</span>
              </div>

              {/* Mock App Store Card */}
              <div className={`p-5 rounded-2xl border shadow-lg ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}>
                <div className="flex items-start gap-3.5 mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/40"
                    style={{ backgroundColor: formData.bgHex }}
                  >
                    <img 
                      src={formData.iconCdnUrl} 
                      alt={formData.name || 'Preview'} 
                      className="w-7 h-7 object-contain invert brightness-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm truncate">{formData.name || 'Untitled Mini App'}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {formData.badge || 'New'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-mono">{formData.id}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center text-amber-400 font-semibold font-mono">
                        <Star className="w-3 h-3 fill-amber-400 mr-1" />
                        5.0
                      </span>
                      <span>•</span>
                      <span className="font-mono">v{formData.version}</span>
                      <span>•</span>
                      <span className="font-mono">{formData.size}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {formData.tagline || 'Short summary of what your application enables inside Harmony Super App.'}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5 mb-4 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Target Repository:</span>
                    <span className="text-slate-200">harmony-community</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Category:</span>
                    <span className="text-slate-200 capitalize">{formData.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Permissions:</span>
                    <span className="text-emerald-400">{formData.permissions.length} granted</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-2 rounded-xl bg-blue-600/80 text-white font-semibold text-xs flex items-center justify-center gap-1.5 opacity-90 cursor-default"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>GET • Free Install</span>
                </button>
              </div>

              {/* Status Notice */}
              <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs space-y-1 text-slate-300">
                <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Instant Synchronization
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Once published, this mini-app package is instantly stored in Cloud Firestore and available across the Harmony Super App ecosystem for streaming downloads.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Package...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish to Central Repository</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
