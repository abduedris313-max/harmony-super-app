/**
 * @file index.tsx
 * @description Harmony Focus Studio Mini-App Module.
 * Aesthetic Pomodoro timer with SVG progress ring, Web Audio ambient synth, and task goals.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Flame, 
  Coffee,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { triggerHaptic } from '../../utils/haptics';

type FocusMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<FocusMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const HarmonyFocusApp: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.isDark;

  const [mode, setMode] = useState<FocusMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.pomodoro);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientSoundType, setAmbientSoundType] = useState<'rain' | 'binaural' | 'whitenoise'>('binaural');
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Refine SuperApp Central Repository architecture', done: true },
    { id: '2', text: 'Review offline service worker caching specs', done: false },
    { id: '3', text: 'Test iOS gesture dismiss threshold', done: false }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Audio Context Ref for synthetic ambient sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      triggerHaptic('success');
      setIsActive(false);
      if (mode === 'pomodoro') {
        setCompletedSessions((c) => c + 1);
        setMode('shortBreak');
        setTimeLeft(MODE_DURATIONS.shortBreak);
      } else {
        setMode('pomodoro');
        setTimeLeft(MODE_DURATIONS.pomodoro);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // Handle ambient sound synthesis
  const toggleAmbientSound = () => {
    triggerHaptic('selection');
    if (isAmbientPlaying) {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
        oscRef.current = null;
      }
      setIsAmbientPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Create warm binaural sine wave at 432 Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsAmbientPlaying(true);
      } catch (err) {
        console.debug('Web Audio not available:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
      }
    };
  }, []);

  const handleToggleTimer = () => {
    triggerHaptic('medium');
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    triggerHaptic('light');
    setIsActive(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const handleSwitchMode = (m: FocusMode) => {
    triggerHaptic('selection');
    setMode(m);
    setIsActive(false);
    setTimeLeft(MODE_DURATIONS[m]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = MODE_DURATIONS[mode];
  const progressFraction = (totalDuration - timeLeft) / totalDuration;

  return (
    <div className={`h-full w-full flex flex-col items-center overflow-y-auto p-4 select-none ${
      isDarkMode ? 'bg-[#0d1117] text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>
      {/* Mode Switcher Pill */}
      <div className={`flex items-center p-1 rounded-2xl border mb-6 ${
        isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-300 shadow-sm'
      }`}>
        <button
          onClick={() => handleSwitchMode('pomodoro')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            mode === 'pomodoro' ? 'bg-rose-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Focus (25m)</span>
        </button>
        <button
          onClick={() => handleSwitchMode('shortBreak')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Short (5m)</span>
        </button>
        <button
          onClick={() => handleSwitchMode('longBreak')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            mode === 'longBreak' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Long (15m)</span>
        </button>
      </div>

      {/* Circular SVG Timer */}
      <div className="relative w-56 h-56 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-neutral-200 dark:stroke-neutral-800 fill-none"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className={`fill-none transition-all duration-300 ${
              mode === 'pomodoro' ? 'stroke-rose-500' : 'stroke-emerald-500'
            }`}
            strokeWidth="6"
            strokeDasharray={264}
            strokeDashoffset={264 * (1 - progressFraction)}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extralight font-mono tracking-tight">{timeFormatted}</span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mt-1">
            {isActive ? 'In Progress' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-4 my-4">
        <button
          onClick={handleResetTimer}
          className="p-3 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-white transition-all active:scale-95"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleTimer}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm text-white flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
            isActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-rose-600 hover:bg-rose-500'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isActive ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={toggleAmbientSound}
          className={`p-3 rounded-2xl transition-all active:scale-95 ${
            isAmbientPlaying
              ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
              : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-white'
          }`}
          title="Toggle 432Hz ambient soundscape"
        >
          {isAmbientPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Sessions Streak Indicator */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-6">
        <Flame className="w-3.5 h-3.5 fill-current" />
        <span>{completedSessions} Focus Sessions Completed Today</span>
      </div>

      {/* Task Checklist */}
      <div className={`w-full max-w-sm p-4 rounded-2xl border ${
        isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200 shadow-sm'
      }`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
          <span>Target Tasks</span>
          <span className="font-mono text-[10px]">{tasks.filter(t => t.done).length}/{tasks.length}</span>
        </h3>

        <div className="space-y-2 mb-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                triggerHaptic('light');
                setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
              }}
              className="flex items-center gap-2 text-xs cursor-pointer group"
            >
              {task.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-neutral-400 shrink-0 group-hover:text-white" />
              )}
              <span className={`truncate flex-1 ${task.done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {/* Add new task input */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-700/40">
          <input
            type="text"
            placeholder="Add new focus goal..."
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskInput.trim()) {
                triggerHaptic('light');
                setTasks([...tasks, { id: Date.now().toString(), text: newTaskInput.trim(), done: false }]);
                setNewTaskInput('');
              }
            }}
            className={`flex-1 px-3 py-1.5 rounded-xl text-xs outline-none border ${
              isDarkMode ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-neutral-50 border-neutral-300'
            }`}
          />
          <button
            onClick={() => {
              if (newTaskInput.trim()) {
                triggerHaptic('light');
                setTasks([...tasks, { id: Date.now().toString(), text: newTaskInput.trim(), done: false }]);
                setNewTaskInput('');
              }
            }}
            className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
