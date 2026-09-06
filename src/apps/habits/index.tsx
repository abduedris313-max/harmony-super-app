/**
 * @file index.tsx
 * @description Harmony Habits Mini-App Module.
 * Apple Health-inspired concentric activity rings, streak tracking, and daily goals.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Flame, 
  Check, 
  Plus, 
  Droplet, 
  Dumbbell, 
  BookOpen, 
  Moon, 
  Heart, 
  Award,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { triggerHaptic } from '../../utils/haptics';

interface HabitItem {
  id: string;
  name: string;
  category: 'fitness' | 'mind' | 'health';
  color: string;
  target: string;
  streak: number;
  completed: boolean;
  icon: 'dumbbell' | 'droplet' | 'book' | 'moon' | 'heart';
}

export const HarmonyHabitsApp: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.isDark;

  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', name: 'Hydration (2.5L Water)', category: 'health', color: '#06b6d4', target: '2500 ml', streak: 12, completed: true, icon: 'droplet' },
    { id: '2', name: 'Cardio & Strength Workout', category: 'fitness', color: '#f43f5e', target: '45 mins', streak: 5, completed: true, icon: 'dumbbell' },
    { id: '3', name: 'Deep Reading & Notes', category: 'mind', color: '#10b981', target: '20 pages', streak: 8, completed: false, icon: 'book' },
    { id: '4', name: 'Mindfulness & Breathing', category: 'mind', color: '#8b5cf6', target: '10 mins', streak: 14, completed: false, icon: 'heart' },
    { id: '5', name: 'Sleep Target (8 Hours)', category: 'health', color: '#6366f1', target: '8 hrs', streak: 4, completed: true, icon: 'moon' },
  ]);

  const toggleHabit = (id: string) => {
    triggerHaptic('medium');
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed;
          return {
            ...h,
            completed: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      })
    );
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progressRatio = completedCount / habits.length;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dumbbell': return <Dumbbell className="w-4 h-4 text-white" />;
      case 'droplet': return <Droplet className="w-4 h-4 text-white" />;
      case 'book': return <BookOpen className="w-4 h-4 text-white" />;
      case 'moon': return <Moon className="w-4 h-4 text-white" />;
      case 'heart': return <Heart className="w-4 h-4 text-white" />;
      default: return <Activity className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className={`h-full w-full flex flex-col items-center overflow-y-auto p-4 md:p-6 select-none ${
      isDarkMode ? 'bg-[#0d1117] text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>
      {/* Top Rings Summary Header */}
      <div className={`w-full max-w-md p-5 rounded-3xl border flex items-center justify-between mb-4 shadow-sm ${
        isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-neutral-200'
      }`}>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Today's Activity Rings</span>
          </div>
          <p className="text-2xl font-black mt-1 tracking-tight">
            {Math.round(progressRatio * 100)}% <span className="text-xs font-normal text-neutral-400">Done</span>
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {completedCount} of {habits.length} habits closed today
          </p>
        </div>

        {/* Apple Fitness Style Concentric Rings SVG */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Outer Ring: Health */}
            <circle cx="50" cy="50" r="38" className="stroke-neutral-800 fill-none" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#06b6d4"
              className="fill-none transition-all duration-500"
              strokeWidth="6"
              strokeDasharray={238}
              strokeDashoffset={238 * (1 - (habits.filter(h => h.category === 'health' && h.completed).length / 2))}
              strokeLinecap="round"
            />

            {/* Middle Ring: Fitness */}
            <circle cx="50" cy="50" r="28" className="stroke-neutral-800 fill-none" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="28"
              stroke="#f43f5e"
              className="fill-none transition-all duration-500"
              strokeWidth="6"
              strokeDasharray={175}
              strokeDashoffset={175 * (1 - (habits.filter(h => h.category === 'fitness' && h.completed).length / 1))}
              strokeLinecap="round"
            />

            {/* Inner Ring: Mind */}
            <circle cx="50" cy="50" r="18" className="stroke-neutral-800 fill-none" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="18"
              stroke="#10b981"
              className="fill-none transition-all duration-500"
              strokeWidth="6"
              strokeDasharray={113}
              strokeDashoffset={113 * (1 - (habits.filter(h => h.category === 'mind' && h.completed).length / 2))}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Habits Checklist */}
      <div className="w-full max-w-md space-y-2.5">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleHabit(habit.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              habit.completed
                ? isDarkMode
                  ? 'bg-neutral-900/60 border-neutral-800 opacity-90'
                  : 'bg-white border-neutral-200 shadow-xs'
                : isDarkMode
                  ? 'bg-[#161b22] border-[#30363d] hover:border-neutral-500'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                style={{ backgroundColor: habit.color }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
              >
                {getIcon(habit.icon)}
              </div>
              <div className="min-w-0">
                <p className={`font-semibold text-xs truncate ${habit.completed ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>
                  {habit.name}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Target: {habit.target}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-500 font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{habit.streak}d</span>
              </div>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                habit.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-neutral-400 dark:border-neutral-600'
              }`}>
                {habit.completed && <Check className="w-4 h-4" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
