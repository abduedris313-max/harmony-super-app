/**
 * @file DeveloperDocsView.tsx
 * @description Comprehensive Developer Hub and Mini App Templates view inside the Harmony Developer Console.
 * Features SDK quickstart, interactive starter template inspector, live sandbox preview triggers,
 * and an interactive app-manifest.json generator.
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  FileCode, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  PlaySquare, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Smartphone, 
  Zap, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  PlusCircle,
  Vibrate
} from 'lucide-react';
import { triggerHaptic } from '../../src/utils/haptics';

interface DeveloperDocsViewProps {
  isDarkMode: boolean;
  onLaunchInSandbox?: (url: string) => void;
  onOpenPublishStudioWithTemplate?: (template: any) => void;
}

type SubTab = 'templates' | 'sdk' | 'manifest' | 'guidelines';

export const DeveloperDocsView: React.FC<DeveloperDocsViewProps> = ({
  isDarkMode,
  onLaunchInSandbox,
  onOpenPublishStudioWithTemplate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('templates');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTemplateForCode, setSelectedTemplateForCode] = useState<string | null>(null);
  const [activeFileTab, setActiveFileTab] = useState<'manifest' | 'code' | 'readme'>('manifest');

  // Manifest Generator Form State
  const [genName, setGenName] = useState('My Quick Utility');
  const [genId, setGenId] = useState('com.developer.quick-utility');
  const [genCategory, setGenCategory] = useState('productivity');
  const [genVersion, setGenVersion] = useState('1.0.0');
  const [genIcon, setGenIcon] = useState('zap');
  const [genColor, setGenColor] = useState('from-blue-500 to-indigo-600');
  const [genUrl, setGenUrl] = useState('https://my-domain.github.io/my-mini-app/');
  const [genRepo, setGenRepo] = useState('https://github.com/my-domain/my-mini-app');
  const [genDesc, setGenDesc] = useState('A fast, native-feeling mini app built with Harmony OS SDK.');
  const [genPermStorage, setGenPermStorage] = useState(true);
  const [genPermHaptics, setGenPermHaptics] = useState(true);
  const [genPermClipboard, setGenPermClipboard] = useState(true);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    triggerHaptic('success');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const starterTemplates = [
    {
      id: 'template-vanilla-starter',
      name: 'Vanilla Web Starter',
      tagline: 'Zero-Dependency HTML5, CSS3, & ES6',
      category: 'Utilities',
      badge: 'Zero Build Step',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      size: '42 KB',
      deployedUrl: '/templates/vanilla-mini-app/index.html',
      description: 'Ultra-lightweight starter with pure JavaScript. No bundlers or Node.js required. Runs directly in any web browser or iframe with full Harmony SDK bridge support.',
      files: {
        manifest: `{
  "$schema": "https://harmony.os/schemas/mini-app-manifest.v1.json",
  "id": "template-vanilla-starter",
  "name": "Vanilla Mini App Starter",
  "version": "1.0.0",
  "category": "utilities",
  "icon": "zap",
  "color": "from-amber-500 to-orange-600",
  "deployedUrl": "/templates/vanilla-mini-app/index.html",
  "permissions": ["storage", "haptics", "clipboard"]
}`,
        code: `// Vanilla Mini App Entry (app.js)
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Handshake with Host
  const context = await Harmony.init();
  console.log('Host connected. App ID:', context.appId);

  // 2. Synchronize Dark / Light Mode
  Harmony.theme.onChange((isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
  });

  // 3. Tactile Vibration
  document.getElementById('tap-btn')?.addEventListener('click', () => {
    Harmony.ui.triggerHaptic('light');
  });

  // 4. Scoped Persistent Storage
  await Harmony.storage.setItem('last_active', Date.now());
});`,
        readme: `# Vanilla Mini App Starter
Deploy \`index.html\`, \`style.css\`, and \`app.js\` directly to GitHub Pages or Firebase Hosting.
Include:
\`\`\`html
<script src="/harmony-sdk.js"></script>
\`\`\``
      }
    },
    {
      id: 'template-react-starter',
      name: 'React 18 + TypeScript Starter',
      tagline: 'Modern React, Tailwind CSS, & Typed Bridge',
      category: 'Productivity',
      badge: 'Recommended',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      size: '86 KB',
      deployedUrl: '/templates/react-mini-app/index.html',
      description: 'Production-ready React 18 template with TypeScript, Tailwind CSS, Cupertino glassmorphic UI components, daily habit tracking, and reactive dark mode state hooks.',
      files: {
        manifest: `{
  "$schema": "https://harmony.os/schemas/mini-app-manifest.v1.json",
  "id": "template-react-starter",
  "name": "React + TypeScript Starter",
  "version": "1.0.0",
  "category": "productivity",
  "icon": "sparkles",
  "color": "from-blue-500 to-indigo-600",
  "deployedUrl": "/templates/react-mini-app/index.html",
  "permissions": ["storage", "haptics", "clipboard", "notifications"]
}`,
        code: `// React Functional Component (App.tsx)
import React, { useState, useEffect } from 'react';
import Harmony from './harmony-sdk';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    Harmony.init().then(ctx => setIsDark(ctx.isDarkMode));
    return Harmony.theme.onChange(dark => setIsDark(dark));
  }, []);

  const handleTap = () => {
    Harmony.ui.triggerHaptic('success');
    Harmony.ui.showToast({ title: 'Task Completed', type: 'success' });
  };

  return (
    <div className={isDark ? 'dark bg-black text-white' : 'bg-[#f2f2f7] text-neutral-900'}>
      <button onClick={handleTap} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">
        Tap with Haptics
      </button>
    </div>
  );
};`,
        readme: `# React 18 + TypeScript Starter
\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`
Deploy \`dist/\` to any HTTPS host, then publish via Developer Console.`
      }
    },
    {
      id: 'template-ai-assistant',
      name: 'AI Text & Prompt Refiner',
      tagline: 'Prompt Engineering & NLP Transformation',
      category: 'AI Tools',
      badge: 'AI Starter',
      icon: Bot,
      color: 'from-purple-500 to-indigo-600',
      size: '78 KB',
      deployedUrl: '/templates/ai-tool-mini-app/index.html',
      description: 'Specialized template for building AI copilot mini apps with multi-mode prompt transformation, token calculations, clipboard integration, and response history persistence.',
      files: {
        manifest: `{
  "$schema": "https://harmony.os/schemas/mini-app-manifest.v1.json",
  "id": "template-ai-assistant",
  "name": "AI Text & Prompt Refiner",
  "version": "1.0.0",
  "category": "ai",
  "icon": "bot",
  "color": "from-purple-500 to-indigo-600",
  "deployedUrl": "/templates/ai-tool-mini-app/index.html",
  "permissions": ["storage", "haptics", "clipboard"]
}`,
        code: `// AI Tool Transformation Logic
document.getElementById('refine-btn')?.addEventListener('click', async () => {
  Harmony.ui.triggerHaptic('medium');
  const prompt = document.getElementById('prompt-input').value;
  
  // Transform and persist to scoped storage
  await Harmony.storage.setItem('last_prompt', prompt);
  await Harmony.clipboard.writeText(prompt);
  
  Harmony.ui.showToast({ title: 'Prompt Refined & Copied!', type: 'success' });
});`,
        readme: `# AI Tool Mini App Starter
Integrates AI workflows, markdown outputs, token tracking, and clipboard copying into the Harmony OS shell.`
      }
    }
  ];

  // Generated JSON manifest
  const permissionsList = [
    ...(genPermStorage ? ['storage'] : []),
    ...(genPermHaptics ? ['haptics'] : []),
    ...(genPermClipboard ? ['clipboard'] : [])
  ];

  const generatedManifestJson = JSON.stringify({
    "$schema": "https://harmony.os/schemas/mini-app-manifest.v1.json",
    "id": genId,
    "name": genName,
    "version": genVersion,
    "tagline": genDesc.slice(0, 50),
    "description": genDesc,
    "category": genCategory,
    "icon": genIcon,
    "color": genColor,
    "author": "Third-Party Developer",
    "deployedUrl": genUrl,
    "repoUrl": genRepo,
    "status": "published",
    "permissions": permissionsList,
    "supportedOrientations": ["portrait", "landscape"],
    "minPlatformVersion": "2.0.0"
  }, null, 2);

  const selectedTemplate = starterTemplates.find(t => t.id === selectedTemplateForCode);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold">Developer Hub & Mini App Templates</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Build, test, and package micro-frontend mini applications for the Harmony OS Super App.
            Leverage our Universal SDK for tactile haptics, dynamic theme synchronization, and persistent storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/public/harmony-sdk.js"
            download="harmony-sdk.js"
            className="px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SDK (v1.0)</span>
          </a>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-slate-700/40 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('templates')}
          className={`pb-3 flex items-center gap-2 cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'templates'
              ? 'border-blue-500 text-blue-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Starter Templates (3)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sdk')}
          className={`pb-3 flex items-center gap-2 cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'sdk'
              ? 'border-blue-500 text-blue-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>SDK API Reference & Bridge</span>
        </button>

        <button
          onClick={() => setActiveSubTab('manifest')}
          className={`pb-3 flex items-center gap-2 cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'manifest'
              ? 'border-blue-500 text-blue-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Manifest Generator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guidelines')}
          className={`pb-3 flex items-center gap-2 cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'guidelines'
              ? 'border-blue-500 text-blue-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>iOS HIG & Security</span>
        </button>
      </div>

      {/* SUB-TAB 1: STARTER TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {starterTemplates.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <div
                  key={tpl.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                    isDarkMode ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tpl.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {tpl.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{tpl.name}</h3>
                      <p className="text-[11px] text-blue-400 font-medium">{tpl.tagline}</p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {tpl.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>{tpl.category}</span>
                      <span>•</span>
                      <span>{tpl.size}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 mt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedTemplateForCode(tpl.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Inspect Files</span>
                      </button>

                      <button
                        onClick={() => onLaunchInSandbox?.(tpl.deployedUrl)}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        title="Open directly in the interactive iPhone/iPad simulator"
                      >
                        <PlaySquare className="w-3.5 h-3.5" />
                        <span>Test Sandbox</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenPublishStudioWithTemplate?.({
                        name: tpl.name,
                        id: tpl.id,
                        tagline: tpl.tagline,
                        description: tpl.description,
                        category: tpl.category.toLowerCase(),
                        deployedUrl: tpl.deployedUrl,
                        icon: tpl.id.includes('vanilla') ? 'zap' : tpl.id.includes('react') ? 'sparkles' : 'bot',
                        color: tpl.color
                      })}
                      className={`w-full py-1.5 rounded-xl border text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-transparent' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800 border-transparent'
                      }`}
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Pre-fill in Publish Studio</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Template File Inspector Modal / View */}
          {selectedTemplate && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${selectedTemplate.color} flex items-center justify-center text-white`}>
                    <selectedTemplate.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{selectedTemplate.name} — Source Code</h4>
                    <p className="text-[11px] text-slate-400">Inspect file contents or copy into your local project</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTemplateForCode(null)}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* File Selector Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFileTab('manifest')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeFileTab === 'manifest' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    app-manifest.json
                  </button>
                  <button
                    onClick={() => setActiveFileTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeFileTab === 'code' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    App Source Code
                  </button>
                  <button
                    onClick={() => setActiveFileTab('readme')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeFileTab === 'readme' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    README.md
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(selectedTemplate.files[activeFileTab], 'template_code')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'template_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'template_code' ? 'Copied' : 'Copy File'}</span>
                </button>
              </div>

              {/* Code Display Area */}
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-80">
                {selectedTemplate.files[activeFileTab]}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SDK API REFERENCE & LIVE TESTER */}
      {activeSubTab === 'sdk' && (
        <div className="space-y-6">
          {/* Quickstart Card */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Universal Harmony SDK Quickstart</span>
            </h3>
            <p className="text-xs text-slate-400">
              Load the SDK via script tag or import as a module in any modern frontend framework.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Option A: Universal HTML Script</span>
                  <button 
                    onClick={() => copyToClipboard('<script src="https://harmony.os/harmony-sdk.js"></script>', 'cdn_script')}
                    className="hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'cdn_script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <code className="text-xs font-mono text-emerald-400 block whitespace-pre-wrap">
                  &lt;script src="/harmony-sdk.js"&gt;&lt;/script&gt;
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Option B: TypeScript / React Import</span>
                  <button 
                    onClick={() => copyToClipboard("import Harmony from './harmony-sdk';", 'ts_import')}
                    className="hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'ts_import' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <code className="text-xs font-mono text-blue-400 block whitespace-pre-wrap">
                  import Harmony from './harmony-sdk';
                </code>
              </div>
            </div>
          </div>

          {/* Interactive Bridge Playground */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-purple-400" />
              <span>Interactive SDK Playground (Test In-Console)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click the triggers below to test the Harmony host haptic engine and event notifications directly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => triggerHaptic('light')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
              >
                <span>Tap Light</span>
                <span className="text-[10px] text-slate-400 font-mono">10ms pulse</span>
              </button>

              <button
                onClick={() => triggerHaptic('medium')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
              >
                <span>Tap Medium</span>
                <span className="text-[10px] text-slate-400 font-mono">18ms pulse</span>
              </button>

              <button
                onClick={() => triggerHaptic('heavy')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
              >
                <span>Tap Heavy</span>
                <span className="text-[10px] text-slate-400 font-mono">32ms pulse</span>
              </button>

              <button
                onClick={() => triggerHaptic('success')}
                className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex flex-col items-center gap-1.5 border border-emerald-500/30 cursor-pointer active:scale-95 transition-all"
              >
                <span>Success Haptic</span>
                <span className="text-[10px] text-emerald-400 font-mono">[12, 40, 18]ms</span>
              </button>
            </div>
          </div>

          {/* API Method Reference Table */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Harmony SDK API Reference</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2.5">Method</th>
                    <th className="pb-2.5">Arguments</th>
                    <th className="pb-2.5">Return Type</th>
                    <th className="pb-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2.5 text-blue-400">Harmony.init()</td>
                    <td className="py-2.5 text-slate-400">none</td>
                    <td className="py-2.5 text-slate-300">Promise&lt;Context&gt;</td>
                    <td className="py-2.5 text-slate-400 font-sans">Performs initial bidirectional handshake with Harmony host.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-purple-400">Harmony.theme.onChange(cb)</td>
                    <td className="py-2.5 text-slate-400">(isDark: boolean) =&gt; void</td>
                    <td className="py-2.5 text-slate-300">UnsubscribeFn</td>
                    <td className="py-2.5 text-slate-400 font-sans">Subscribes to host dark/light mode toggle events.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-amber-400">Harmony.ui.triggerHaptic(type)</td>
                    <td className="py-2.5 text-slate-400">'light'|'medium'|'heavy'|'success'</td>
                    <td className="py-2.5 text-slate-300">void</td>
                    <td className="py-2.5 text-slate-400 font-sans">Vibrates device matching Apple iOS Taptic Engine.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-emerald-400">Harmony.storage.setItem(key, val)</td>
                    <td className="py-2.5 text-slate-400">string, any</td>
                    <td className="py-2.5 text-slate-300">Promise&lt;boolean&gt;</td>
                    <td className="py-2.5 text-slate-400 font-sans">Stores JSON data isolated to mini app namespace.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-emerald-400">Harmony.storage.getItem(key)</td>
                    <td className="py-2.5 text-slate-400">string</td>
                    <td className="py-2.5 text-slate-300">Promise&lt;any&gt;</td>
                    <td className="py-2.5 text-slate-400 font-sans">Retrieves stored item with automatic cache fallback.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-rose-400">Harmony.ui.close()</td>
                    <td className="py-2.5 text-slate-400">none</td>
                    <td className="py-2.5 text-slate-300">void</td>
                    <td className="py-2.5 text-slate-400 font-sans">Dismisses active mini app with native spring exit.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-cyan-400">Harmony.navigation.openApp(appId)</td>
                    <td className="py-2.5 text-slate-400">string, object?</td>
                    <td className="py-2.5 text-slate-300">void</td>
                    <td className="py-2.5 text-slate-400 font-sans">Launches another mini app inside Harmony OS.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MANIFEST GENERATOR */}
      {activeSubTab === 'manifest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Controls */}
          <div className={`lg:col-span-6 p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Interactive Manifest Authoring Form</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">App Display Name</label>
                <input
                  type="text"
                  value={genName}
                  onChange={(e) => {
                    setGenName(e.target.value);
                    setGenId('com.developer.' + e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Package ID</label>
                  <input
                    type="text"
                    value={genId}
                    onChange={(e) => setGenId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="productivity">Productivity</option>
                    <option value="utilities">Utilities</option>
                    <option value="developer">Developer</option>
                    <option value="finance">Finance</option>
                    <option value="ai">AI Tools</option>
                    <option value="audio">Audio / Music</option>
                    <option value="health">Health & Habits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Version</label>
                  <input
                    type="text"
                    value={genVersion}
                    onChange={(e) => setGenVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Lucide Icon</label>
                  <input
                    type="text"
                    value={genIcon}
                    onChange={(e) => setGenIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 outline-none focus:border-blue-500"
                    placeholder="zap, sparkles, bot..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Deployed HTTPS URL</label>
                <input
                  type="url"
                  value={genUrl}
                  onChange={(e) => setGenUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={genDesc}
                  onChange={(e) => setGenDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Permissions Checkboxes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Permissions</label>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={genPermStorage} onChange={(e) => setGenPermStorage(e.target.checked)} className="rounded text-blue-600" />
                    <span>storage</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={genPermHaptics} onChange={(e) => setGenPermHaptics(e.target.checked)} className="rounded text-blue-600" />
                    <span>haptics</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={genPermClipboard} onChange={(e) => setGenPermClipboard(e.target.checked)} className="rounded text-blue-600" />
                    <span>clipboard</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Live JSON Preview */}
          <div className={`lg:col-span-6 p-5 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-mono">app-manifest.json</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  RFC Compliant
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed">
                {generatedManifestJson}
              </pre>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex gap-2">
              <button
                onClick={() => copyToClipboard(generatedManifestJson, 'gen_manifest')}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedKey === 'gen_manifest' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'gen_manifest' ? 'Copied to Clipboard' : 'Copy Manifest JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GUIDELINES & HIG */}
      {activeSubTab === 'guidelines' && (
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Apple iOS Human Interface Guidelines (HIG) Certification</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All applications published to the Central Repository undergo automated and manual review against the following iOS HIG standards:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1. Touch Target Geometry</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Buttons, list items, and icons must measure at least <strong>44 × 44 pt</strong>. Avoid tiny interactive elements that cause mis-taps on touchscreens.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2. Safe Area Inset Handling</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Add <code className="text-blue-400">padding-top: env(safe-area-inset-top)</code> and bottom padding to avoid clipping behind the status bar or iOS home bar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3. Dynamic Dark / Light Themes</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Respond dynamically to <code className="text-purple-400">Harmony.theme.onChange()</code>. Pass WCAG AA contrast (4.5:1 ratio).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>4. Haptic Feedback Semantics</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Use light taps for selections, medium for form completions, and heavy or warning patterns for deletions. Avoid excessive vibration spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
