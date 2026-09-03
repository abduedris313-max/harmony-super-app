/**
 * @file EventModal.tsx
 * @description iOS 18 style modal for creating or editing calendar events
 * with automated tri-calendar translation (Gregorian, Hijri, Ethiopian)
 * and optional Google Calendar sync toggle.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  Cloud, 
  Globe2, 
  Sunrise, 
  Compass, 
  Trash2, 
  Save 
} from 'lucide-react';
import { HarmonyCalendarEvent } from '../../../types';
import { 
  getCalendarBundleFromGregorian, 
  formatHijriString, 
  formatEthiopianString 
} from '../../../lib/calendarConversions';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: HarmonyCalendarEvent | null;
  initialDate?: string; // YYYY-MM-DD
  isGoogleConnected: boolean;
  onSave: (event: Partial<HarmonyCalendarEvent> & { id: string; title: string; gregorianDate: string }, syncToGoogle?: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const CATEGORIES: Array<HarmonyCalendarEvent['category']> = [
  'Personal', 'Work', 'Religious', 'Holiday', 'Other'
];

const COLOR_OPTIONS = [
  { label: 'Rose Red', hex: '#ef4444' },
  { label: 'Emerald Green', hex: '#10b981' },
  { label: 'Amber Gold', hex: '#f59e0b' },
  { label: 'Royal Blue', hex: '#3b82f6' },
  { label: 'Purple Violet', hex: '#8b5cf6' },
  { label: 'Cyan Teal', hex: '#06b6d4' }
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  initialDate,
  isGoogleConnected,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [gregorianDate, setGregorianDate] = useState(() => {
    return initialDate || new Date().toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [category, setCategory] = useState<HarmonyCalendarEvent['category']>('Personal');
  const [color, setColor] = useState('#ef4444');
  const [syncGoogle, setSyncGoogle] = useState(isGoogleConnected);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setLocation(eventToEdit.location || '');
      setGregorianDate(eventToEdit.gregorianDate);
      setStartTime(eventToEdit.startTime || '09:00');
      setEndTime(eventToEdit.endTime || '10:00');
      setAllDay(eventToEdit.allDay ?? false);
      setCategory(eventToEdit.category || 'Personal');
      setColor(eventToEdit.color || '#ef4444');
      setSyncGoogle(eventToEdit.syncedToGoogle || false);
    } else {
      setTitle('');
      setDescription('');
      setLocation('');
      setGregorianDate(initialDate || new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
      setAllDay(false);
      setCategory('Personal');
      setColor('#ef4444');
      setSyncGoogle(isGoogleConnected);
    }
  }, [eventToEdit, initialDate, isGoogleConnected, isOpen]);

  // Derived tri-calendar representations
  const dateBundle = useMemo(() => {
    try {
      const [y, m, d] = gregorianDate.split('-').map(Number);
      if (y && m && d) {
        return getCalendarBundleFromGregorian(y, m, d);
      }
    } catch {
      // Fallback
    }
    const now = new Date();
    return getCalendarBundleFromGregorian(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, [gregorianDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !gregorianDate) return;

    setIsSaving(true);
    try {
      const eventId = eventToEdit?.id || `cal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await onSave({
        id: eventId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        gregorianDate,
        startTime: allDay ? undefined : startTime,
        endTime: allDay ? undefined : endTime,
        allDay,
        category,
        color,
        hijriDate: formatHijriString(dateBundle.hijri),
        ethiopianDate: formatEthiopianString(dateBundle.ethiopian),
        syncedToGoogle: syncGoogle
      }, syncGoogle);
      onClose();
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit?.id || !onDelete) return;
    setIsSaving(true);
    try {
      await onDelete(eventToEdit.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete event:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#1c2128] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {eventToEdit ? 'Edit Event' : 'New Calendar Event'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Synchronizes with Gregorian, Hijri, and Ethiopian timelines
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Team Sync or Eid Gathering"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Date Picker & Tri-Calendar badges */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Date (Gregorian Anchor) *
            </label>
            <input
              type="date"
              required
              value={gregorianDate}
              onChange={(e) => setGregorianDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-rose-500"
            />

            {/* Tri-Calendar Live Preview */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{formatHijriString(dateBundle.hijri)}</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{formatEthiopianString(dateBundle.ethiopian)}</span>
              </div>
            </div>
          </div>

          {/* Time & All-Day Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">Time</label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="rounded border-white/20 text-rose-500 focus:ring-rose-500 bg-white/5"
                />
                All-Day Event
              </label>
            </div>

            {!allDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#161b22] border border-white/10 text-white text-xs focus:outline-hidden focus:border-rose-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Accent Color</label>
              <div className="flex items-center gap-2 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1c2128] scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-neutral-400" />
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Conference Room A or Online Meet"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Notes & Description</label>
            <textarea
              rows={2}
              placeholder="Add details, agenda, or prayer notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-rose-500 resize-none"
            />
          </div>

          {/* Google Calendar Sync Option */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs font-semibold text-white">Sync with Google Calendar</div>
                <div className="text-[10px] text-blue-300">
                  {isGoogleConnected 
                    ? 'Sync this event directly to primary Google Calendar'
                    : 'Requires Google account connection in top bar'}
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              disabled={!isGoogleConnected}
              checked={syncGoogle && isGoogleConnected}
              onChange={(e) => setSyncGoogle(e.target.checked)}
              className="rounded border-white/20 text-blue-500 focus:ring-blue-500 bg-white/5 disabled:opacity-40"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            {eventToEdit?.id && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
