/**
 * @file DayAgendaPanel.tsx
 * @description Inspector sidebar showing detailed day events, tri-calendar badges,
 * and quick event creation for the currently selected date.
 */

import React, { useMemo } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  Sunrise, 
  Compass, 
  Globe2, 
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { HarmonyCalendarEvent } from '../../../types';
import { 
  getCalendarBundleFromGregorian,
  formatGregorianString,
  formatHijriString,
  formatEthiopianString,
  WEEKDAY_NAMES_EN
} from '../../../lib/calendarConversions';

interface DayAgendaPanelProps {
  selectedDate: string; // YYYY-MM-DD
  events: HarmonyCalendarEvent[];
  onOpenNewEvent: (dateStr: string) => void;
  onOpenEditEvent: (event: HarmonyCalendarEvent) => void;
}

export const DayAgendaPanel: React.FC<DayAgendaPanelProps> = ({
  selectedDate,
  events,
  onOpenNewEvent,
  onOpenEditEvent
}) => {
  const dateBundle = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      if (y && m && d) {
        return getCalendarBundleFromGregorian(y, m, d);
      }
    } catch {
      // Fallback
    }
    const now = new Date();
    return getCalendarBundleFromGregorian(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, [selectedDate]);

  // Filter events for this specific date
  const dayEvents = useMemo(() => {
    return events.filter(e => e.gregorianDate === selectedDate);
  }, [events, selectedDate]);

  return (
    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-white/10 bg-white dark:bg-[#161b22] flex flex-col h-auto md:h-full">
      {/* Selected Day Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              {WEEKDAY_NAMES_EN[dateBundle.dayOfWeek]}
            </span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {formatGregorianString(dateBundle.gregorian)}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onOpenNewEvent(selectedDate)}
            className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 transition-all flex items-center justify-center"
            title="Add event on this date"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Calendar Equivalency Badges */}
        <div className="space-y-1.5 pt-1">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
            <Sunrise className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium truncate">
              Hijri: {formatHijriString(dateBundle.hijri)}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-[11px] text-amber-700 dark:text-amber-300 font-medium truncate">
              Ethiopian: {formatEthiopianString(dateBundle.ethiopian)}
            </div>
          </div>
        </div>
      </div>

      {/* Events List for Selected Day */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Events ({dayEvents.length})
          </span>
        </div>

        {dayEvents.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-dashed border-neutral-200 dark:border-white/10 space-y-2">
            <CalendarIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">No events scheduled for this day</p>
            <button
              type="button"
              onClick={() => onOpenNewEvent(selectedDate)}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs text-neutral-800 dark:text-white transition-colors"
            >
              + Create Event
            </button>
          </div>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onOpenEditEvent(event)}
              className="p-3 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/10 cursor-pointer transition-all space-y-2 group shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: event.color || '#ef4444' }}
                  />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                    {event.title}
                  </h4>
                </div>

                {event.syncedToGoogle && (
                  <span className="flex items-center gap-1 text-[9px] text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                    <Cloud className="w-2.5 h-2.5" />
                    Google
                  </span>
                )}
              </div>

              {event.description && (
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200 dark:border-white/5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                  {event.allDay ? 'All Day' : `${event.startTime || '09:00'} - ${event.endTime || '10:00'}`}
                </span>

                {event.location && (
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                    {event.location}
                  </span>
                )}

                {event.category && (
                  <span className="px-1.5 py-0.5 rounded-md bg-neutral-200/60 dark:bg-white/5 text-neutral-700 dark:text-neutral-300">
                    {event.category}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
