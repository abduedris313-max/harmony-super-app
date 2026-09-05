/**
 * @file CalendarMonthGrid.tsx
 * @description Monthly matrix grid rendering Gregorian, Hijri, and Ethiopian dates
 * simultaneously in each cell with event markers and date selection.
 */

import React, { useMemo } from 'react';
import { 
  CalendarSystem, 
  CalendarDayCell 
} from '../types';
import { HarmonyCalendarEvent } from '../../../types';
import {
  WEEKDAY_SHORT_EN,
  getCalendarBundleFromGregorian,
  getGregorianDaysInMonth,
  GREGORIAN_MONTH_NAMES,
  HIJRI_MONTH_NAMES,
  ETHIOPIAN_MONTH_NAMES
} from '../../../lib/calendarConversions';

interface CalendarMonthGridProps {
  currentYear: number;
  currentMonth: number; // 1-12
  primarySystem: CalendarSystem;
  events: HarmonyCalendarEvent[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  onOpenNewEvent: (dateStr: string) => void;
  onOpenEditEvent: (event: HarmonyCalendarEvent) => void;
}

export const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
  currentYear,
  currentMonth,
  primarySystem,
  events,
  selectedDate,
  onSelectDate,
  onOpenNewEvent,
  onOpenEditEvent
}) => {
  // Generate the 35 or 42 grid cells for the month
  const gridCells = useMemo(() => {
    const cells: CalendarDayCell[] = [];
    const daysInCurrent = getGregorianDaysInMonth(currentYear, currentMonth);

    // First day of current month
    const firstDayDate = new Date(currentYear, currentMonth - 1, 1);
    const startWeekday = firstDayDate.getDay(); // 0 = Sun ... 6 = Sat

    // Days in previous month to fill leading blank slots
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const daysInPrev = getGregorianDaysInMonth(prevYear, prevMonth);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Leading days
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = daysInPrev - i;
      const dateBundle = getCalendarBundleFromGregorian(prevYear, prevMonth, d);
      const isoStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.gregorianDate === isoStr);

      cells.push({
        dateBundle,
        isCurrentMonth: false,
        isToday: isoStr === todayStr,
        events: dayEvents
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrent; d++) {
      const dateBundle = getCalendarBundleFromGregorian(currentYear, currentMonth, d);
      const isoStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.gregorianDate === isoStr);

      cells.push({
        dateBundle,
        isCurrentMonth: true,
        isToday: isoStr === todayStr,
        events: dayEvents
      });
    }

    // Trailing days to fill 5 or 6 rows (multiple of 7)
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const remaining = (7 - (cells.length % 7)) % 7;

    for (let d = 1; d <= remaining; d++) {
      const dateBundle = getCalendarBundleFromGregorian(nextYear, nextMonth, d);
      const isoStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.gregorianDate === isoStr);

      cells.push({
        dateBundle,
        isCurrentMonth: false,
        isToday: isoStr === todayStr,
        events: dayEvents
      });
    }

    return cells;
  }, [currentYear, currentMonth, events]);

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-[#0d1117] overflow-hidden">
      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
        {WEEKDAY_SHORT_EN.map((day, idx) => (
          <div
            key={day}
            className={`py-2 text-center text-[11px] font-bold tracking-wider uppercase ${
              idx === 0 || idx === 6 ? 'text-rose-500 dark:text-rose-400/80' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Matrix */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6 gap-px bg-neutral-200 dark:bg-white/10 p-px">
        {gridCells.map((cell, index) => {
          const greg = cell.dateBundle.gregorian;
          const hijri = cell.dateBundle.hijri;
          const eth = cell.dateBundle.ethiopian;
          const isoDate = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
          const isSelected = selectedDate === isoDate;

          // Display labels depending on primary active calendar preference
          const primaryNumber = 
            primarySystem === 'hijri' ? hijri.day :
            primarySystem === 'ethiopian' ? eth.day :
            greg.day;

          return (
            <div
              key={`${isoDate}-${index}`}
              onClick={() => onSelectDate(isoDate)}
              onDoubleClick={() => onOpenNewEvent(isoDate)}
              className={`relative flex flex-col p-1.5 md:p-2 select-none cursor-pointer transition-colors ${
                cell.isCurrentMonth ? 'bg-white dark:bg-[#161b22]' : 'bg-neutral-50 dark:bg-[#161b22]/50 opacity-60'
              } ${
                isSelected ? 'ring-2 ring-rose-500 ring-inset z-10' : 'hover:bg-neutral-100 dark:hover:bg-white/[0.06]'
              }`}
            >
              {/* Day Header with Primary and Secondary numbers */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs md:text-sm font-bold flex items-center justify-center rounded-full w-5 h-5 md:w-6 md:h-6 ${
                      cell.isToday
                        ? 'bg-rose-500 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  >
                    {primaryNumber}
                  </span>

                  {/* Show primary month name badge if 1st of month */}
                  {primaryNumber === 1 && (
                    <span className="hidden sm:inline px-1 py-0.2 rounded-xs bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[9px] font-semibold">
                      {primarySystem === 'hijri' 
                        ? HIJRI_MONTH_NAMES[hijri.month - 1]?.split(' ')[0] 
                        : primarySystem === 'ethiopian'
                        ? ETHIOPIAN_MONTH_NAMES[eth.month - 1]?.split(' ')[0]
                        : GREGORIAN_MONTH_NAMES[greg.month - 1]?.substring(0, 3)}
                    </span>
                  )}
                </div>

                {/* Secondary & Tertiary Badges (Subtle) */}
                <div className="flex flex-col items-end text-[9px] leading-tight font-mono">
                  {primarySystem !== 'hijri' && (
                    <span className="text-emerald-600 dark:text-emerald-400/90" title={`Hijri: ${hijri.day}/${hijri.month}`}>
                      H:{hijri.day}
                    </span>
                  )}
                  {primarySystem !== 'ethiopian' && (
                    <span className="text-amber-600 dark:text-amber-400/90" title={`Ethiopian: ${eth.day}/${eth.month}`}>
                      E:{eth.day}
                    </span>
                  )}
                  {primarySystem !== 'gregorian' && (
                    <span className="text-neutral-500 dark:text-neutral-400" title={`Gregorian: ${greg.day}/${greg.month}`}>
                      G:{greg.day}
                    </span>
                  )}
                </div>
              </div>

              {/* Event indicators in this cell */}
              <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                {cell.events.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditEvent(ev);
                    }}
                    style={{ borderLeftColor: ev.color || '#ef4444' }}
                    className="px-1.5 py-0.5 rounded-xs bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 border-l-2 text-[10px] text-neutral-900 dark:text-white truncate font-medium flex items-center gap-1 shadow-xs"
                  >
                    {ev.syncedToGoogle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Synced to Google Calendar" />
                    )}
                    <span className="truncate">{ev.title}</span>
                  </div>
                ))}

                {cell.events.length > 2 && (
                  <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-semibold pl-1">
                    +{cell.events.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
