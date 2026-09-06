/**
 * @file SandboxTesterView.tsx
 * @description Interactive test sandbox simulator to preview and test mini apps before publishing.
 */

import React, { useState } from 'react';
import { 
  PlaySquare, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  Play,
  Layers
} from 'lucide-react';
import { AdminMiniApp } from '../types';

interface SandboxTesterViewProps {
  apps: AdminMiniApp[];
  initialApp?: AdminMiniApp | null;
  isDarkMode: boolean;
}

export const SandboxTesterView: React.FC<SandboxTesterViewProps> = ({
  apps,
  initialApp,
  isDarkMode
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(initialApp?.id || apps[0]?.id || 'harmony-notes');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'tablet' | 'desktop'>('phone');
  const [iframeKey, setIframeKey] = useState<number>(0);

  const selectedApp = apps.find(a => a.id === selectedAppId);
  const targetUrl = customUrl || selectedApp?.deployedUrl || 'https://abduedris313-max.github.io/harmony-notes/';

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Sandbox Controls Bar */}
      <div className={`p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* App Selector */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Mini App</label>
            <select
              value={selectedAppId}
              onChange={(e) => {
                setSelectedAppId(e.target.value);
                setCustomUrl('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              {apps.map((a) => (
                <option key={a.id} value={a.id}>{a.name} (v{a.version})</option>
              ))}
            </select>
          </div>

          {/* Custom URL */}
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Live URL Override</label>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Or enter custom deployed HTTPS url..."
              className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono border focus:outline-none ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}>
            <button
              onClick={() => setDeviceFrame('phone')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceFrame === 'phone' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="iPhone 16 Pro (393px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone</span>
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceFrame === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="iPad Air (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceFrame === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Width Responsive"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Responsive</span>
            </button>
          </div>

          <button
            onClick={handleReload}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
            title="Reload Sandbox Frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center items-start min-h-[620px] p-4 rounded-3xl bg-slate-950/60 border border-slate-800/80">
        <div 
          className={`transition-all duration-300 rounded-[32px] overflow-hidden border-4 border-slate-800 shadow-2xl bg-black flex flex-col ${
            deviceFrame === 'phone' ? 'w-[393px] h-[780px]' :
            deviceFrame === 'tablet' ? 'w-[720px] h-[800px]' :
            'w-full h-[760px]'
          }`}
        >
          {/* Simulated Dynamic Island / Header for Phone */}
          {deviceFrame === 'phone' && (
            <div className="h-6 bg-black flex items-center justify-center shrink-0">
              <div className="w-24 h-4 bg-slate-900 rounded-full" />
            </div>
          )}

          {/* Iframe View */}
          <iframe
            key={iframeKey}
            src={targetUrl}
            title={selectedApp?.name || 'Mini App Sandbox'}
            className="w-full flex-1 border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </div>
      </div>
    </div>
  );
};
