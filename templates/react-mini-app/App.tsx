import React, { useState, useEffect } from 'react';
import Harmony from './harmony-sdk';

interface HabitItem {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
}

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', title: 'Morning Hydration & Water (500ml)', streak: 12, completedToday: true },
    { id: '2', title: 'Deep Work Session (45 min)', streak: 5, completedToday: false },
    { id: '3', title: 'Evening Walk / Cardio', streak: 8, completedToday: false },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initialize Harmony Bridge & Listen for Host Theme
  useEffect(() => {
    Harmony.init().then((ctx) => {
      setIsDark(ctx.isDarkMode);
    });

    const unsubscribe = Harmony.theme.onChange((dark) => {
      setIsDark(dark);
    });

    // 2. Load stored habits from persistent storage
    Harmony.storage.getItem<HabitItem[]>('user_habits').then((saved) => {
      if (saved && Array.isArray(saved)) {
        setHabits(saved);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const saveHabits = (updated: HabitItem[]) => {
    setHabits(updated);
    Harmony.storage.setItem('user_habits', updated);
  };

  const toggleHabit = (id: string) => {
    Harmony.ui.triggerHaptic('success');
    const updated = habits.map(h => {
      if (h.id === id) {
        const nextState = !h.completedToday;
        return {
          ...h,
          completedToday: nextState,
          streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    });
    saveHabits(updated);

    Harmony.ui.showToast({
      title: 'Habit Updated',
      message: 'Keep the momentum going!',
      type: 'success'
    });
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    Harmony.ui.triggerHaptic('medium');

    const newHabit: HabitItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      streak: 1,
      completedToday: true
    };
    const updated = [newHabit, ...habits];
    saveHabits(updated);
    setNewTitle('');

    Harmony.ui.showToast({
      title: 'Habit Created',
      type: 'info'
    });
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const progressPct = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-200 p-4 pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,20px)] ${
      isDark ? 'bg-black text-white' : 'bg-[#f2f2f7] text-neutral-900'
    } font-sans`}>
      <div className="max-w-md mx-auto space-y-4">
        
        {/* iOS Navigation Header */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 text-xl font-bold">
              ✦
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Daily Momentum</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">React + Harmony SDK Starter</p>
            </div>
          </div>

          <button
            onClick={() => {
              Harmony.ui.triggerHaptic('dismiss');
              Harmony.ui.close();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              isDark ? 'bg-white/10 hover:bg-white/20 text-neutral-200' : 'bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700'
            }`}
          >
            Close
          </button>
        </header>

        {/* Progress Card */}
        <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
          isDark ? 'bg-[#1c1c1e]/85 border-white/10' : 'bg-white/90 border-black/5 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Today's Progress</span>
            <span className="text-xs font-bold font-mono text-blue-500">{completedCount} of {habits.length} ({progressPct}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Add Habit Form */}
        <form onSubmit={addHabit} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new habit (e.g. Read 15 pages)..."
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
              isDark 
                ? 'bg-[#1c1c1e] border-white/10 text-white placeholder:text-neutral-500 focus:border-blue-500' 
                : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* Habits List */}
        <div className="space-y-2.5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all select-none ${
                habit.completedToday
                  ? isDark 
                    ? 'bg-blue-950/20 border-blue-500/30' 
                    : 'bg-blue-50/70 border-blue-200'
                  : isDark 
                    ? 'bg-[#1c1c1e]/80 border-white/10 hover:border-white/20' 
                    : 'bg-white border-black/5 hover:border-black/10 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  habit.completedToday
                    ? 'bg-blue-600 text-white'
                    : isDark ? 'border-2 border-neutral-600' : 'border-2 border-neutral-300'
                }`}>
                  {habit.completedToday && '✓'}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    habit.completedToday ? 'line-through text-neutral-400' : ''
                  }`}>
                    {habit.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span>🔥 {habit.streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Haptic Bar */}
        <div className={`p-3 rounded-2xl border text-center space-y-2 ${
          isDark ? 'bg-[#1c1c1e]/50 border-white/10' : 'bg-white/60 border-black/5'
        }`}>
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Test Haptic Feedback
          </div>
          <div className="flex justify-center gap-2">
            {(['light', 'medium', 'heavy'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => Harmony.ui.triggerHaptic(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-neutral-200' : 'bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
