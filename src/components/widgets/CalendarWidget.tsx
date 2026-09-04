/**
 * @file CalendarWidget.tsx
 * @description iOS Smart Stack widget displaying live Tri-Calendar dates & upcoming agenda items.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronRight, Clock, MapPin, Sparkles, Plus } from 'lucide-react';
import { HarmonyCalendarEvent } from '../../types';
import { 
  getCalendarBundleFromGregorian, 
  formatGregorianString, 
  formatHijriString, 
  formatEthiopianString 
} from '../../lib/calendarConversions';

interface CalendarWidgetProps {
  events?: HarmonyCalendarEvent[];
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  events = [],
  onOpenApp,
  isDarkMode = true,
}) => {
  const today = useMemo(() => new Date(), []);
  
  const triDateBundle = useMemo(() => {
    return getCalendarBundleFromGregorian(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
  }, [today]);

  const todayIso = today.toISOString().slice(0, 10);

  // Find next upcoming event (today or upcoming)
  const nextEvent = useMemo(() => {
    if (!events.length) return null;
    const sorted = [...events].sort((a, b) => a.gregorianDate.localeCompare(b.gregorianDate));
    return sorted.find(e => e.gregorianDate >= todayIso) || sorted[0];
  }, [events, todayIso]);

  const dayOfWeekName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = today.getDate();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3.5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between min-h-[148px] ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-rose-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-rose-400 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-rose-500 font-semibold text-[11px] tracking-wide">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>TRI-CALENDAR</span>
        </div>
        <button
          onClick={() => onOpenApp('harmony-calendar')}
          className={`text-[11px] flex items-center gap-0.5 transition-colors font-medium ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Open <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Tri-Calendar Live Dates Row */}
      <div className="my-1.5 flex items-center gap-3">
        {/* iOS Calendar Date Tile */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col items-center justify-center shadow-md shrink-0 border border-white/20">
          <span className="text-[9px] uppercase font-bold tracking-widest leading-none text-rose-100">
            {dayOfWeekName}
          </span>
          <span className="text-xl font-black leading-none mt-0.5 tracking-tighter">
            {dayNumber}
          </span>
        </div>

        {/* Multi-Calendar Pills */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            {formatGregorianString(triDateBundle.gregorian)}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-mono text-[9px] font-semibold border border-emerald-500/20 truncate">
              🌙 {formatHijriString(triDateBundle.hijri)}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400 font-mono text-[9px] font-semibold border border-amber-500/20 truncate">
              ☀️ {formatEthiopianString(triDateBundle.ethiopian)}
            </span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Agenda Item */}
      <div className={`p-2 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
        isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
      }`}>
        {nextEvent ? (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <p className={`font-semibold truncate ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                {nextEvent.title}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5 ml-3 font-mono">
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {nextEvent.gregorianDate === todayIso ? 'Today' : nextEvent.gregorianDate}
                {nextEvent.startTime ? ` @ ${nextEvent.startTime}` : ''}
              </span>
              {nextEvent.location && (
                <span className="flex items-center gap-0.5 truncate max-w-[100px]">
                  <MapPin className="w-2.5 h-2.5" /> {nextEvent.location}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-neutral-400">
            <span className="text-[10px] italic">No upcoming events scheduled</span>
            <span className="text-[10px] text-rose-500 font-medium">3 Calendars in Sync</span>
          </div>
        )}

        <button
          onClick={() => onOpenApp('harmony-calendar')}
          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shrink-0"
          title="Add Calendar Event"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
