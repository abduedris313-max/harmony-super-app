/**
 * @file calendarConversions.ts
 * @description Astronomical and algorithmic date conversion utilities between:
 *  1. Gregorian Calendar (standard solar calendar)
 *  2. Hijri Calendar (Umm al-Qura algorithmic Islamic lunar calendar)
 *  3. Ethiopian Calendar (Ge'ez 13-month solar calendar: 12 months of 30 days + Pagumē of 5/6 days)
 *
 * All conversions use Julian Day Number (JDN) as the common astronomical invariant bridge.
 */

export interface GregorianDate {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 31
}

export interface HijriDate {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 30
}

export interface EthiopianDate {
  year: number;
  month: number; // 1 - 13 (13 is Pagumē)
  day: number;   // 1 - 30 (1-5/6 in Pagumē)
}

export interface CalendarDateBundle {
  gregorian: GregorianDate;
  hijri: HijriDate;
  ethiopian: EthiopianDate;
  julianDay: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
}

// -----------------------------------------------------------------------------
// MONTH & DAY LABELS & LOCALIZATION
// -----------------------------------------------------------------------------

export const GREGORIAN_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const HIJRI_MONTH_NAMES = [
  'Muḥarram (مُحَرَّم)',
  'Ṣafar (صَفَر)',
  'Rabīʿ al-Awwal (رَبِيع الأَوَّل)',
  'Rabīʿ al-Thānī (رَبِيع الآخِر)',
  'Jumādā al-Ūlā (جُمَادَى الأُولَى)',
  'Jumādā al-Ākhirah (جُمَادَى الآخِرَة)',
  'Rajab (رَجَب)',
  'Shaʿbān (شَعْبَان)',
  'Ramaḍān (رَمَضَان)',
  'Shawwāl (شَوَّال)',
  'Dhū al-Qaʿdah (ذُو القَعْدَة)',
  'Dhū al-Ḥijjah (ذُو الحِجَّة)'
];

export const HIJRI_MONTH_SHORT_NAMES = [
  'Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II',
  'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

export const ETHIOPIAN_MONTH_NAMES = [
  'Mäskäräm (መስከረም)',
  'Ṭəqəmt (ጥቅምት)',
  'Ḫədar (ኅዳር)',
  'Taḫśaś (ታኅሣሥ)',
  'Ṭərr (ጥር)',
  'Yäkatit (የካቲት)',
  'Mägabit (መጋቢት)',
  'Miyazya (ሚያዝያ)',
  'Gənbot (ግንቦት)',
  'Säne (ሰኔ)',
  'Ḥamle (ሐምሌ)',
  'Nähase (ነሐሴ)',
  'Pagumē (ጳጉሜን)'
];

export const ETHIOPIAN_MONTH_SHORT_NAMES = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yakatit',
  'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

export const WEEKDAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAY_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WEEKDAY_NAMES_AR = [
  'al-Aḥad (الأحد)', 'al-Ithnayn (الإثنين)', 'al-Thulāthāʾ (الثلاثاء)',
  'al-Arbaʿāʾ (الأربعاء)', 'al-Khamīs (الخميس)', 'al-Jumuʿah (الجمعة)', 'al-Sabt (السبت)'
];

export const WEEKDAY_NAMES_AM = [
  'Ihud (እሑድ)', 'Sanyo (ሰኞ)', 'Maksanyo (ማክሰኞ)',
  'Erob (ረቡዕ)', 'Hamus (ሐሙስ)', 'Arb (ዓርብ)', 'Qedame (ቅዳሜ)'
];

// -----------------------------------------------------------------------------
// JUGGLING JDN (JULIAN DAY NUMBER) - ASTRONOMICAL ANCHOR
// -----------------------------------------------------------------------------

/**
 * Convert Gregorian date to Julian Day Number (JDN).
 * Standard Fliegel-Van Flandern algorithm (valid for Gregorian calendar).
 */
export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Convert Julian Day Number (JDN) to Gregorian date.
 */
export function jdnToGregorian(jdn: number): GregorianDate {
  const l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const day = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;

  return { year, month, day };
}

// -----------------------------------------------------------------------------
// ETHIOPIAN CALENDAR CONVERSIONS
// Ethiopian Era (Incarnation) starts on August 29, 8 CE (Julian) -> JDN 1724220.5
// 12 months of 30 days, followed by 13th month (Pagumē) of 5 days (6 in leap years).
// Ethiopian leap year occurs every 4 years without century exceptions (like the Julian cycle).
// An Ethiopian year is a leap year if (year % 4 === 3).
// -----------------------------------------------------------------------------

const ETHIOPIAN_EPOCH_JDN = 1723856; // 1 Meskerem 1 EE in JDN integer

export function isEthiopianLeapYear(year: number): boolean {
  return (year % 4) === 3;
}

/**
 * Convert Ethiopian date to JDN
 */
export function ethiopianToJdn(year: number, month: number, day: number): number {
  return (
    ETHIOPIAN_EPOCH_JDN +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    day -
    1
  );
}

/**
 * Convert JDN to Ethiopian date
 */
export function jdnToEthiopian(jdn: number): EthiopianDate {
  const r = (jdn - ETHIOPIAN_EPOCH_JDN) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - ETHIOPIAN_EPOCH_JDN) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  return { year, month, day };
}

// -----------------------------------------------------------------------------
// HIJRI CALENDAR CONVERSIONS (Tabular Islamic Calendar / Umm al-Qura algorithmic approximation)
// Epoch: July 16, 622 CE (Julian) = JDN 1948439.5
// Standard astronomical 30-year cycle has leap years in years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29.
// -----------------------------------------------------------------------------

const HIJRI_EPOCH_JDN = 1948440; // 1 Muharram 1 AH in JDN integer (astronomical)

const HIJRI_LEAP_YEARS_IN_30 = new Set([2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29]);

export function isHijriLeapYear(year: number): boolean {
  const mod = year % 30;
  return HIJRI_LEAP_YEARS_IN_30.has(mod);
}

/**
 * Days in a specific Hijri month (year, month: 1..12)
 */
export function getHijriDaysInMonth(year: number, month: number): number {
  if (month % 2 === 1) return 30; // Odd months have 30 days
  if (month === 12) return isHijriLeapYear(year) ? 30 : 29; // 12th month has 30 in leap year
  return 29; // Even months have 29 days
}

/**
 * Convert Hijri date to JDN
 */
export function hijriToJdn(year: number, month: number, day: number): number {
  const y = year - 1;
  const cycles = Math.floor(y / 30);
  const remYears = y % 30;

  // Leap years in remaining years of cycle
  let leapDaysInCycle = 0;
  for (let i = 1; i <= remYears; i++) {
    if (HIJRI_LEAP_YEARS_IN_30.has(i)) leapDaysInCycle++;
  }

  const daysFromYears = cycles * 10631 + remYears * 354 + leapDaysInCycle;

  // Days in completed months of the current year
  let daysFromMonths = 0;
  for (let m = 1; m < month; m++) {
    daysFromMonths += getHijriDaysInMonth(year, m);
  }

  return HIJRI_EPOCH_JDN + daysFromYears + daysFromMonths + (day - 1);
}

/**
 * Convert JDN to Hijri date
 */
export function jdnToHijri(jdn: number): HijriDate {
  let daysSinceEpoch = jdn - HIJRI_EPOCH_JDN;
  if (daysSinceEpoch < 0) {
    // Fallback for pre-Hijri dates
    return { year: 1, month: 1, day: 1 };
  }

  const cycles = Math.floor(daysSinceEpoch / 10631);
  let remDays = daysSinceEpoch % 10631;

  let yearInCycle = 0;
  for (let y = 1; y <= 30; y++) {
    const isLeap = HIJRI_LEAP_YEARS_IN_30.has(y);
    const yearLength = isLeap ? 355 : 354;
    if (remDays < yearLength) {
      yearInCycle = y;
      break;
    }
    remDays -= yearLength;
  }

  const year = cycles * 30 + yearInCycle;

  let month = 1;
  for (let m = 1; m <= 12; m++) {
    const dim = getHijriDaysInMonth(year, m);
    if (remDays < dim) {
      month = m;
      break;
    }
    remDays -= dim;
  }

  const day = remDays + 1;
  return { year, month, day };
}

// -----------------------------------------------------------------------------
// BUNDLED CONVERSION & UTILITIES
// -----------------------------------------------------------------------------

/**
 * Compute the complete tri-calendar date bundle from any Gregorian Date
 */
export function getCalendarBundleFromGregorian(year: number, month: number, day: number): CalendarDateBundle {
  const jdn = gregorianToJdn(year, month, day);
  const hijri = jdnToHijri(jdn);
  const ethiopian = jdnToEthiopian(jdn);
  // Day of week: JDN 0 was Monday. (jdn + 1) % 7 -> 0 = Sunday, 1 = Monday...
  const dayOfWeek = (jdn + 1) % 7;

  return {
    gregorian: { year, month, day },
    hijri,
    ethiopian,
    julianDay: jdn,
    dayOfWeek
  };
}

/**
 * Compute the complete tri-calendar date bundle from an Ethiopian Date
 */
export function getCalendarBundleFromEthiopian(year: number, month: number, day: number): CalendarDateBundle {
  const jdn = ethiopianToJdn(year, month, day);
  const gregorian = jdnToGregorian(jdn);
  const hijri = jdnToHijri(jdn);
  const dayOfWeek = (jdn + 1) % 7;

  return {
    gregorian,
    hijri,
    ethiopian: { year, month, day },
    julianDay: jdn,
    dayOfWeek
  };
}

/**
 * Compute the complete tri-calendar date bundle from a Hijri Date
 */
export function getCalendarBundleFromHijri(year: number, month: number, day: number): CalendarDateBundle {
  const jdn = hijriToJdn(year, month, day);
  const gregorian = jdnToGregorian(jdn);
  const ethiopian = jdnToEthiopian(jdn);
  const dayOfWeek = (jdn + 1) % 7;

  return {
    gregorian,
    hijri: { year, month, day },
    ethiopian,
    julianDay: jdn,
    dayOfWeek
  };
}

/**
 * Calculate Gregorian days in month
 */
export function getGregorianDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Calculate Ethiopian days in month
 */
export function getEthiopianDaysInMonth(year: number, month: number): number {
  if (month >= 1 && month <= 12) return 30;
  if (month === 13) return isEthiopianLeapYear(year) ? 6 : 5;
  return 30;
}

/**
 * Format date string nicely for UI
 */
export function formatGregorianString(d: GregorianDate): string {
  return `${GREGORIAN_MONTH_NAMES[d.month - 1]} ${d.day}, ${d.year}`;
}

export function formatHijriString(d: HijriDate): string {
  return `${d.day} ${HIJRI_MONTH_SHORT_NAMES[d.month - 1]} ${d.year} AH`;
}

export function formatEthiopianString(d: EthiopianDate): string {
  return `${d.day} ${ETHIOPIAN_MONTH_SHORT_NAMES[d.month - 1]} ${d.year} EE`;
}
