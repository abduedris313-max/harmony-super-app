/**
 * @file CalendarConverterView.tsx
 * @description Real-time bidirectional converter between Gregorian, Hijri, and Ethiopian calendar systems.
 * Visualizes the astronomical bridge and day equivalencies with copyable dates and quick presets.
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Copy, 
  Check, 
  Sparkles,
  Globe2,
  Compass,
  Sunrise
} from 'lucide-react';
import { 
  CalendarSystem 
} from '../types';
import {
  GregorianDate,
  HijriDate,
  EthiopianDate,
  gregorianToJdn,
  jdnToGregorian,
  jdnToHijri,
  jdnToEthiopian,
  hijriToJdn,
  ethiopianToJdn,
  getGregorianDaysInMonth,
  getHijriDaysInMonth,
  getEthiopianDaysInMonth,
  GREGORIAN_MONTH_NAMES,
  HIJRI_MONTH_NAMES,
  ETHIOPIAN_MONTH_NAMES,
  WEEKDAY_NAMES_EN,
  WEEKDAY_NAMES_AR,
  WEEKDAY_NAMES_AM,
  formatGregorianString,
  formatHijriString,
  formatEthiopianString
} from '../../../lib/calendarConversions';

export const CalendarConverterView: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<CalendarSystem>('gregorian');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Initialize with today's Gregorian date
  const today = useMemo(() => new Date(), []);
  const [gregYear, setGregYear] = useState<number>(today.getFullYear());
  const [gregMonth, setGregMonth] = useState<number>(today.getMonth() + 1);
  const [gregDay, setGregDay] = useState<number>(today.getDate());

  // Hijri inputs
  const initialHijri = useMemo(() => {
    const jdn = gregorianToJdn(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return jdnToHijri(jdn);
  }, [today]);
  const [hijriYear, setHijriYear] = useState<number>(initialHijri.year);
  const [hijriMonth, setHijriMonth] = useState<number>(initialHijri.month);
  const [hijriDay, setHijriDay] = useState<number>(initialHijri.day);

  // Ethiopian inputs
  const initialEth = useMemo(() => {
    const jdn = gregorianToJdn(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return jdnToEthiopian(jdn);
  }, [today]);
  const [ethYear, setEthYear] = useState<number>(initialEth.year);
  const [ethMonth, setEthMonth] = useState<number>(initialEth.month);
  const [ethDay, setEthDay] = useState<number>(initialEth.day);

  // Derived Julian Day Number from current source
  const currentJdn = useMemo(() => {
    if (selectedSource === 'gregorian') {
      return gregorianToJdn(gregYear, gregMonth, gregDay);
    } else if (selectedSource === 'hijri') {
      return hijriToJdn(hijriYear, hijriMonth, hijriDay);
    } else {
      return ethiopianToJdn(ethYear, ethMonth, ethDay);
    }
  }, [selectedSource, gregYear, gregMonth, gregDay, hijriYear, hijriMonth, hijriDay, ethYear, ethMonth, ethDay]);

  // Derived converted targets
  const convertedGregorian: GregorianDate = useMemo(() => jdnToGregorian(currentJdn), [currentJdn]);
  const convertedHijri: HijriDate = useMemo(() => jdnToHijri(currentJdn), [currentJdn]);
  const convertedEthiopian: EthiopianDate = useMemo(() => jdnToEthiopian(currentJdn), [currentJdn]);
  const weekdayIndex = useMemo(() => (currentJdn + 1) % 7, [currentJdn]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSetToday = () => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    setGregYear(gy);
    setGregMonth(gm);
    setGregDay(gd);

    const jdn = gregorianToJdn(gy, gm, gd);
    const h = jdnToHijri(jdn);
    setHijriYear(h.year);
    setHijriMonth(h.month);
    setHijriDay(h.day);

    const e = jdnToEthiopian(jdn);
    setEthYear(e.year);
    setEthMonth(e.month);
    setEthDay(e.day);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/10">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            Universal Calendar Converter
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Astronomical Julian Day Number (JDN {currentJdn}) conversion across solar, lunar, and Ge'ez cycles
          </p>
        </div>

        <button
          type="button"
          onClick={handleSetToday}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs text-neutral-800 dark:text-white flex items-center gap-1.5 transition-colors"
        >
          <Clock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
          Reset to Today
        </button>
      </div>

      {/* Select Source Calendar Tabs */}
      <div>
        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
          Convert From (Source System)
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setSelectedSource('gregorian')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedSource === 'gregorian'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            Gregorian
          </button>
          <button
            type="button"
            onClick={() => setSelectedSource('hijri')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedSource === 'hijri'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sunrise className="w-3.5 h-3.5" />
            Hijri (Islamic)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSource('ethiopian')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedSource === 'ethiopian'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Ethiopian (Ge'ez)
          </button>
        </div>
      </div>

      {/* Dynamic Input Form for Source System */}
      <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-4 shadow-xs">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          Specify Source Date:
        </h3>

        {selectedSource === 'gregorian' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Month</label>
              <select
                aria-label="Gregorian Month"
                value={gregMonth}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setGregMonth(m);
                  const maxD = getGregorianDaysInMonth(gregYear, m);
                  if (gregDay > maxD) setGregDay(maxD);
                }}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              >
                {GREGORIAN_MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {i + 1} - {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Day</label>
              <input
                type="number"
                aria-label="Gregorian Day"
                min={1}
                max={getGregorianDaysInMonth(gregYear, gregMonth)}
                value={gregDay}
                onChange={(e) => setGregDay(Math.max(1, Math.min(getGregorianDaysInMonth(gregYear, gregMonth), Number(e.target.value))))}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Year (CE)</label>
              <input
                type="number"
                aria-label="Gregorian Year"
                min={1900}
                max={2200}
                value={gregYear}
                onChange={(e) => setGregYear(Number(e.target.value))}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {selectedSource === 'hijri' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Month</label>
              <select
                aria-label="Hijri Month"
                value={hijriMonth}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setHijriMonth(m);
                  const maxD = getHijriDaysInMonth(hijriYear, m);
                  if (hijriDay > maxD) setHijriDay(maxD);
                }}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              >
                {HIJRI_MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {i + 1} - {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Day</label>
              <input
                type="number"
                aria-label="Hijri Day"
                min={1}
                max={getHijriDaysInMonth(hijriYear, hijriMonth)}
                value={hijriDay}
                onChange={(e) => setHijriDay(Math.max(1, Math.min(getHijriDaysInMonth(hijriYear, hijriMonth), Number(e.target.value))))}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Year (AH)</label>
              <input
                type="number"
                aria-label="Hijri Year"
                min={1300}
                max={1600}
                value={hijriYear}
                onChange={(e) => setHijriYear(Number(e.target.value))}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {selectedSource === 'ethiopian' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Month</label>
              <select
                aria-label="Ethiopian Month"
                value={ethMonth}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setEthMonth(m);
                  const maxD = getEthiopianDaysInMonth(ethYear, m);
                  if (ethDay > maxD) setEthDay(maxD);
                }}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              >
                {ETHIOPIAN_MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {i + 1} - {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Day</label>
              <input
                type="number"
                aria-label="Ethiopian Day"
                min={1}
                max={getEthiopianDaysInMonth(ethYear, ethMonth)}
                value={ethDay}
                onChange={(e) => setEthDay(Math.max(1, Math.min(getEthiopianDaysInMonth(ethYear, ethMonth), Number(e.target.value))))}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-600 dark:text-neutral-400 block mb-1">Year (EE)</label>
              <input
                type="number"
                aria-label="Ethiopian Year"
                min={1900}
                max={2200}
                value={ethYear}
                onChange={(e) => setEthYear(Number(e.target.value))}
                className="w-full bg-neutral-50 dark:bg-[#161b22] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>
        )}

        <div className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-3 pt-2">
          <span>
            Weekday: <strong className="text-neutral-900 dark:text-white">{WEEKDAY_NAMES_EN[weekdayIndex]}</strong>
          </span>
          <span>•</span>
          <span>
            Arabic: <strong className="text-neutral-900 dark:text-white">{WEEKDAY_NAMES_AR[weekdayIndex]}</strong>
          </span>
          <span>•</span>
          <span>
            Amharic: <strong className="text-neutral-900 dark:text-white">{WEEKDAY_NAMES_AM[weekdayIndex]}</strong>
          </span>
        </div>
      </div>

      {/* Converted Output Cards */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
          Tri-Calendar Equivalencies
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gregorian Result */}
          <div className={`p-4 rounded-2xl border transition-all ${
            selectedSource === 'gregorian'
              ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/40 ring-1 ring-rose-500/30'
              : 'bg-white dark:bg-white/[0.04] border-neutral-200 dark:border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                Gregorian (Standard)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(formatGregorianString(convertedGregorian), 'greg')}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded transition-colors"
                title="Copy formatted date"
              >
                {copiedKey === 'greg' ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatGregorianString(convertedGregorian)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {convertedGregorian.year}-{String(convertedGregorian.month).padStart(2, '0')}-{String(convertedGregorian.day).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-3 pt-2 border-t border-neutral-200 dark:border-white/5">
              Solar calendar with leap cycle every 4/400 years
            </div>
          </div>

          {/* Hijri Result */}
          <div className={`p-4 rounded-2xl border transition-all ${
            selectedSource === 'hijri'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/40 ring-1 ring-emerald-500/30'
              : 'bg-white dark:bg-white/[0.04] border-neutral-200 dark:border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5" />
                Hijri (Islamic Lunar)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(formatHijriString(convertedHijri), 'hijri')}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded transition-colors"
                title="Copy formatted date"
              >
                {copiedKey === 'hijri' ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatHijriString(convertedHijri)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {HIJRI_MONTH_NAMES[convertedHijri.month - 1]}
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-3 pt-2 border-t border-neutral-200 dark:border-white/5">
              12 lunar synodic months (~354-355 days/year)
            </div>
          </div>

          {/* Ethiopian Result */}
          <div className={`p-4 rounded-2xl border transition-all ${
            selectedSource === 'ethiopian'
              ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/40 ring-1 ring-amber-500/30'
              : 'bg-white dark:bg-white/[0.04] border-neutral-200 dark:border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Ethiopian (Ge'ez 13-Mo)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(formatEthiopianString(convertedEthiopian), 'eth')}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded transition-colors"
                title="Copy formatted date"
              >
                {copiedKey === 'eth' ? <Check className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatEthiopianString(convertedEthiopian)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {ETHIOPIAN_MONTH_NAMES[convertedEthiopian.month - 1]}
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-3 pt-2 border-t border-neutral-200 dark:border-white/5">
              12 months of 30 days + Pagumē (5 or 6 leap days)
            </div>
          </div>
        </div>
      </div>

      {/* Preset Cultural Anchors */}
      <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 space-y-3 shadow-xs">
        <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          Quick Conversion Anchors & Holidays:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedSource('ethiopian');
              setEthYear(2019);
              setEthMonth(1);
              setEthDay(1);
            }}
            className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-left border border-neutral-200 dark:border-white/5 transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900 dark:text-white">Enkutatash</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400">1 Meskerem (Eth. New Year)</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedSource('hijri');
              setHijriYear(1448);
              setHijriMonth(9);
              setHijriDay(1);
            }}
            className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-left border border-neutral-200 dark:border-white/5 transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900 dark:text-white">1st of Ramadan</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">1 Ramadan 1448 AH</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedSource('hijri');
              setHijriYear(1448);
              setHijriMonth(10);
              setHijriDay(1);
            }}
            className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-left border border-neutral-200 dark:border-white/5 transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900 dark:text-white">Eid al-Fitr</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">1 Shawwal 1448 AH</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedSource('ethiopian');
              setEthYear(2018);
              setEthMonth(13);
              setEthDay(1);
            }}
            className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-left border border-neutral-200 dark:border-white/5 transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900 dark:text-white">Pagumē 1</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400">Ethiopian 13th Month</div>
          </button>
        </div>
      </div>
    </div>
  );
};
