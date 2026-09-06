/**
 * @file CalendarWidget.tsx
 * @description iOS Smart Stack widget displaying live Tri-Calendar dates & upcoming agenda items with resizable S/M/L modes.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronRight, Clock, Plus, Moon, Sun, Globe } from 'lucide-react';
import { HarmonyCalendarEvent } from '../../types';
import { WidgetSize } from './types';
import { WidgetSizeSelector } from './WidgetSizeSelector';
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
  size?: WidgetSize;
  onResize?: (size: WidgetSize) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  events = [],
  onOpenApp,
  isDarkMode = true,
  size = 'medium',
  onResize
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

  // Sorted upcoming events
  const upcomingEvents = useMemo(() => {
    if (!events.length) return [];
    const sorted = [...events].sort((a, b) => a.gregorianDate.localeCompare(b.gregorianDate));
    return sorted.filter(e => e.gregorianDate >= todayIso).slice(0, 3);
  }, [events, todayIso]);

  const nextEvent = upcomingEvents[0] || (events.length > 0 ? events[0] : null);

  const dayOfWeekName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const fullDayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = today.getDate();

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`p-2.5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
        size === 'large' 
          ? 'min-h-[210px] sm:min-h-[230px]' 
          : size === 'medium'
            ? 'min-h-[96px] sm:min-h-[110px]'
            : 'min-h-[96px] sm:min-h-[110px]'
      } ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-rose-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-rose-400 hover:shadow-sm'
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-rose-500 font-semibold text-[10px] sm:text-[11px] tracking-wide">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="font-bold">TRI-CALENDAR</span>
        </div>

        <div className="flex items-center gap-1.5">
          <WidgetSizeSelector size={size} onResize={onResize} isDarkMode={isDarkMode} />
          <button
            onClick={() => onOpenApp('harmony-calendar')}
            className={`text-[10px] flex items-center gap-0.5 transition-colors font-medium ${
              isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Open <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ================= SMALL SIZE LAYOUT ================= */}
      {size === 'small' && (
        <>
          <div className="my-1 flex items-center gap-2">
            {/* iOS Calendar Date Tile */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col items-center justify-center shadow-xs shrink-0 border border-white/20">
              <span className="text-[7px] uppercase font-bold tracking-wider leading-none text-rose-100">
                {dayOfWeekName}
              </span>
              <span className="text-sm sm:text-base font-black leading-none mt-0.5 tracking-tighter">
                {dayNumber}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {formatGregorianString(triDateBundle.gregorian)}
              </p>
              <p className="text-[8px] text-emerald-400 font-mono truncate">
                🌙 {formatHijriString(triDateBundle.hijri)}
              </p>
            </div>
          </div>

          <div className={`px-1.5 py-0.5 rounded-lg border text-[8px] flex items-center justify-between ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <span className="text-neutral-400 truncate">
              {nextEvent ? nextEvent.title : 'No events today'}
            </span>
            <span className="text-rose-400 font-mono shrink-0 ml-1">
              {nextEvent ? nextEvent.startTime || 'Today' : 'Sync'}
            </span>
          </div>
        </>
      )}

      {/* ================= MEDIUM SIZE LAYOUT ================= */}
      {size === 'medium' && (
        <>
          {/* Tri-Calendar Live Dates Row */}
          <div className="my-1 flex items-center gap-2.5">
            {/* iOS Calendar Date Tile */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col items-center justify-center shadow-xs shrink-0 border border-white/20">
              <span className="text-[8px] uppercase font-bold tracking-wider leading-none text-rose-100">
                {dayOfWeekName}
              </span>
              <span className="text-base sm:text-lg font-black leading-none mt-0.5 tracking-tighter">
                {dayNumber}
              </span>
            </div>

            {/* Multi-Calendar Pills */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <p className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {formatGregorianString(triDateBundle.gregorian)}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-mono text-[8.5px] font-semibold border border-emerald-500/20 truncate">
                  🌙 {formatHijriString(triDateBundle.hijri)}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400 font-mono text-[8.5px] font-semibold border border-amber-500/20 truncate">
                  ☀️ {formatEthiopianString(triDateBundle.ethiopian)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Upcoming Agenda Item */}
          <div className={`px-2 py-1 rounded-lg border text-[9px] sm:text-[10px] flex items-center justify-between gap-1.5 ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            {nextEvent ? (
              <div className="min-w-0 flex-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <p className={`font-semibold truncate ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                  {nextEvent.title}
                </p>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 font-mono shrink-0 ml-auto">
                  {nextEvent.startTime || 'All day'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full text-neutral-400">
                <span className="text-[9px] italic">No upcoming events scheduled</span>
                <span className="text-[8px] text-rose-500 font-medium">{events.length} Events</span>
              </div>
            )}

            <button
              onClick={() => onOpenApp('harmony-calendar')}
              className="p-0.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shrink-0"
              title="Add Calendar Event"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </>
      )}

      {/* ================= LARGE SIZE LAYOUT ================= */}
      {size === 'large' && (
        <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
          {/* Triple Date Matrix Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Gregorian */}
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDarkMode ? 'bg-[#0d1117] border-rose-500/30' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <div className="flex items-center gap-1 text-[9px] font-bold text-rose-500">
                <Globe className="w-2.5 h-2.5" />
                <span>GREGORIAN</span>
              </div>
              <p className="text-base font-black my-0.5">{dayNumber}</p>
              <p className="text-[9px] text-neutral-400 font-medium truncate">
                {fullDayOfWeek}
              </p>
            </div>

            {/* Hijri */}
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDarkMode ? 'bg-[#0d1117] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
            }`}>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
                <Moon className="w-2.5 h-2.5" />
                <span>HIJRI LUNAR</span>
              </div>
              <p className="text-xs font-bold text-emerald-400 my-0.5 truncate">
                {formatHijriString(triDateBundle.hijri)}
              </p>
              <p className="text-[8px] text-neutral-400 font-mono">Islamic Year {triDateBundle.hijri.year} AH</p>
            </div>

            {/* Ethiopian */}
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDarkMode ? 'bg-[#0d1117] border-amber-500/30' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                <Sun className="w-2.5 h-2.5" />
                <span>ETHIOPIAN</span>
              </div>
              <p className="text-xs font-bold text-amber-400 my-0.5 truncate">
                {formatEthiopianString(triDateBundle.ethiopian)}
              </p>
              <p className="text-[8px] text-neutral-400 font-mono">13 Months of Sun</p>
            </div>
          </div>

          {/* Agenda items list */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 px-0.5">
              <span>Upcoming Agenda ({upcomingEvents.length})</span>
              <button 
                onClick={() => onOpenApp('harmony-calendar')}
                className="text-rose-400 hover:text-rose-300 text-[9px] font-semibold flex items-center gap-0.5"
              >
                <Plus className="w-2.5 h-2.5" /> New Event
              </button>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-1">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between ${
                      isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${evt.color ? `bg-${evt.color}` : 'bg-rose-500'} shrink-0`} />
                      <span className="font-semibold truncate">{evt.title}</span>
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono shrink-0">
                      {evt.startTime || 'All Day'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-2 rounded-xl border text-center text-[10px] text-neutral-400 ${
                isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
              }`}>
                No upcoming events for this week. Tap "+ New Event" to create one.
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
