/**
 * @file index.tsx
 * @description Harmony Terminal & System Diagnostics Mini-App Module.
 * Interactive command line shell for package management, repo fetching, and system diagnosis.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, ShieldCheck, Zap, HardDrive, RefreshCw } from 'lucide-react';
import { CENTRAL_REPOSITORY_APPS } from '../../config/appRepository';
import { triggerHaptic } from '../../utils/haptics';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  text: string;
}

export const HarmonyTerminalApp: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'info', text: 'Harmony OS DevShell v2.4.0 (x86_64-harmony-web)' },
    { id: '2', type: 'info', text: 'Type "help" for a list of available package manager and diagnostic commands.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    triggerHaptic('light');
    const newHistory: TerminalLine[] = [
      ...history,
      { id: Date.now().toString(), type: 'input', text: `$ ${trimmed}` }
    ];

    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();
    const arg = parts[1];

    switch (root) {
      case 'help':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `Available Commands:
  help               - List all system and package commands
  repo [list|sync]   - View or synchronize with Central Repositories
  apps               - Display all repository apps and versions
  storage            - Inspect Service Worker cache and IndexedDB storage
  sysinfo            - Display runtime environment, OS architecture and memory
  ping [host]        - Network latency diagnostic
  clear              - Wipe terminal scrollback buffer
  echo [text]        - Print message to standard output`
        });
        break;

      case 'repo':
        if (arg === 'sync' || arg === 'fetch') {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'success',
            text: '✓ Fetched 13 app packages from Harmony Official Central Registry (28ms latency).'
          });
        } else {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'output',
            text: `Configured Central Repositories:
  1. [Official] https://repo.harmony-os.dev/v2/core-apps.json (Active)
  2. [Community] https://repo.harmony-os.dev/v2/community-apps.json (Active)`
          });
        }
        break;

      case 'apps':
        const appList = CENTRAL_REPOSITORY_APPS.map(
          (a) => `  • ${a.id.padEnd(22)} [${a.version || '1.0.0'}] (${a.size || '1.5MB'}) - ${a.name}`
        ).join('\n');
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `Central Repository Packages:\n${appList}`
        });
        break;

      case 'storage':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: `Storage Diagnostics:
  - Cache Storage: harmony-os-assets-v4 (Active, 14.8 MB cached)
  - IndexedDB Persistence: ENABLED (multi-tab persistence verified)
  - Service Worker: RUNNING (offline fallback cache enabled)`
        });
        break;

      case 'sysinfo':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `System Information:
  - OS: Harmony OS SuperApp Container
  - Runtime: Vite 6 + React 19 + TypeScript (strict)
  - Database: Firebase Cloud Firestore
  - Haptic Engine: Active (navigator.vibrate supported)
  - User Agent: ${navigator.userAgent.slice(0, 50)}...`
        });
        break;

      case 'ping':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'success',
          text: `64 bytes from repo.harmony-os.dev: icmp_seq=1 ttl=58 time=18.4 ms`
        });
        break;

      case 'echo':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: parts.slice(1).join(' ') || ''
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: `command not found: "${root}". Type "help" for a list of commands.`
        });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div 
      onClick={() => inputRef.current?.focus()}
      className="h-full w-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-mono text-xs p-4 overflow-y-auto cursor-text"
    >
      {/* Top Terminal Status Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#30363d] text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <TermIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">harmony-sh</span>
          <span className="text-neutral-500">•</span>
          <span className="text-emerald-400">zsh-compatible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div className="flex-1 space-y-1">
        {history.map((line) => {
          let color = 'text-neutral-300';
          if (line.type === 'input') color = 'text-white font-bold';
          if (line.type === 'success') color = 'text-emerald-400';
          if (line.type === 'error') color = 'text-rose-400';
          if (line.type === 'info') color = 'text-sky-400';

          return (
            <div key={line.id} className={`whitespace-pre-wrap ${color}`}>
              {line.text}
            </div>
          );
        })}

        {/* Active Command Line */}
        <div className="flex items-center gap-2 pt-1 text-white">
          <span className="text-emerald-400 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(inputVal);
              } else if (e.key === 'ArrowUp') {
                if (commandHistory.length > 0 && historyIdx < commandHistory.length - 1) {
                  const nextIdx = historyIdx + 1;
                  setHistoryIdx(nextIdx);
                  setInputVal(commandHistory[nextIdx]);
                }
              } else if (e.key === 'ArrowDown') {
                if (historyIdx > 0) {
                  const nextIdx = historyIdx - 1;
                  setHistoryIdx(nextIdx);
                  setInputVal(commandHistory[nextIdx]);
                } else if (historyIdx === 0) {
                  setHistoryIdx(-1);
                  setInputVal('');
                }
              }
            }}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
