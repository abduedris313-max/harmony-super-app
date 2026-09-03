import { HarmonyCalendarEvent } from '../../types';

export type CalendarSystem = 'gregorian' | 'hijri' | 'ethiopian';

export type CalendarViewMode = 'month' | 'converter' | 'events' | 'google-sync';

export interface CalendarDayCell {
  dateBundle: {
    gregorian: { year: number; month: number; day: number };
    hijri: { year: number; month: number; day: number };
    ethiopian: { year: number; month: number; day: number };
    julianDay: number;
    dayOfWeek: number;
  };
  isCurrentMonth: boolean;
  isToday: boolean;
  events: HarmonyCalendarEvent[];
}

export interface ConverterState {
  sourceSystem: CalendarSystem;
  year: number;
  month: number;
  day: number;
}
