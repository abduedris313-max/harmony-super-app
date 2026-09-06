/**
 * @file index.tsx
 * @description Harmony Weather Mini-App Module.
 * Features an iOS 18-inspired dynamic atmospheric sky canvas, 24-hour temperature curve,
 * 7-day extended outlook, air quality index, UV index, wind speed, and city switcher.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Eye, 
  Compass, 
  Thermometer, 
  MapPin, 
  RefreshCw, 
  ChevronRight, 
  Plus, 
  Search,
  Check
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { triggerHaptic } from '../../utils/haptics';

interface WeatherCity {
  id: string;
  name: string;
  country: string;
  temp: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain' | 'Thunderstorm';
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: string;
  hourly: { time: string; temp: number; icon: 'sun' | 'cloud' | 'rain' }[];
  forecast: { day: string; condition: string; high: number; low: number; icon: 'sun' | 'cloud' | 'rain' }[];
}

const DEFAULT_CITIES: WeatherCity[] = [
  {
    id: 'addis',
    name: 'Addis Ababa',
    country: 'Ethiopia',
    temp: 22,
    condition: 'Partly Cloudy',
    high: 25,
    low: 13,
    humidity: 58,
    windSpeed: 14,
    uvIndex: 6,
    airQuality: 'Good (34)',
    hourly: [
      { time: 'Now', temp: 22, icon: 'cloud' },
      { time: '14:00', temp: 24, icon: 'sun' },
      { time: '15:00', temp: 25, icon: 'sun' },
      { time: '16:00', temp: 23, icon: 'cloud' },
      { time: '17:00', temp: 21, icon: 'rain' },
      { time: '18:00', temp: 19, icon: 'cloud' },
      { time: '19:00', temp: 17, icon: 'cloud' },
      { time: '20:00', temp: 15, icon: 'cloud' },
    ],
    forecast: [
      { day: 'Today', condition: 'Partly Cloudy', high: 25, low: 13, icon: 'cloud' },
      { day: 'Mon', condition: 'Sunny & Crisp', high: 26, low: 14, icon: 'sun' },
      { day: 'Tue', condition: 'Afternoon Showers', high: 23, low: 13, icon: 'rain' },
      { day: 'Wed', condition: 'Pleasant Breeze', high: 24, low: 12, icon: 'sun' },
      { day: 'Thu', condition: 'Scattered Clouds', high: 25, low: 14, icon: 'cloud' },
      { day: 'Fri', condition: 'Clear Sky', high: 26, low: 15, icon: 'sun' },
      { day: 'Sat', condition: 'Mild Rain', high: 22, low: 13, icon: 'rain' },
    ]
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    temp: 16,
    condition: 'Rain',
    high: 18,
    low: 11,
    humidity: 78,
    windSpeed: 21,
    uvIndex: 3,
    airQuality: 'Moderate (48)',
    hourly: [
      { time: 'Now', temp: 16, icon: 'rain' },
      { time: '14:00', temp: 17, icon: 'rain' },
      { time: '15:00', temp: 18, icon: 'cloud' },
      { time: '16:00', temp: 17, icon: 'cloud' },
      { time: '17:00', temp: 16, icon: 'rain' },
      { time: '18:00', temp: 15, icon: 'cloud' },
      { time: '19:00', temp: 14, icon: 'cloud' },
      { time: '20:00', temp: 13, icon: 'cloud' },
    ],
    forecast: [
      { day: 'Today', condition: 'Passing Showers', high: 18, low: 11, icon: 'rain' },
      { day: 'Mon', condition: 'Overcast', high: 19, low: 12, icon: 'cloud' },
      { day: 'Tue', condition: 'Light Rain', high: 17, low: 10, icon: 'rain' },
      { day: 'Wed', condition: 'Sunny Spells', high: 20, low: 13, icon: 'sun' },
      { day: 'Thu', condition: 'Breezy', high: 18, low: 11, icon: 'cloud' },
      { day: 'Fri', condition: 'Showers', high: 17, low: 12, icon: 'rain' },
      { day: 'Sat', condition: 'Partly Sunny', high: 19, low: 11, icon: 'sun' },
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    temp: 27,
    condition: 'Sunny',
    high: 29,
    low: 20,
    humidity: 52,
    windSpeed: 10,
    uvIndex: 8,
    airQuality: 'Good (26)',
    hourly: [
      { time: 'Now', temp: 27, icon: 'sun' },
      { time: '14:00', temp: 28, icon: 'sun' },
      { time: '15:00', temp: 29, icon: 'sun' },
      { time: '16:00', temp: 27, icon: 'sun' },
      { time: '17:00', temp: 25, icon: 'cloud' },
      { time: '18:00', temp: 24, icon: 'cloud' },
      { time: '19:00', temp: 22, icon: 'cloud' },
      { time: '20:00', temp: 21, icon: 'cloud' },
    ],
    forecast: [
      { day: 'Today', condition: 'Clear Sunshine', high: 29, low: 20, icon: 'sun' },
      { day: 'Mon', condition: 'Sunny & Warm', high: 30, low: 21, icon: 'sun' },
      { day: 'Tue', condition: 'High Clouds', high: 28, low: 20, icon: 'cloud' },
      { day: 'Wed', condition: 'Thunderstorm', high: 26, low: 19, icon: 'rain' },
      { day: 'Thu', condition: 'Fresh Air', high: 27, low: 18, icon: 'sun' },
      { day: 'Fri', condition: 'Bright & Calm', high: 29, low: 21, icon: 'sun' },
      { day: 'Sat', condition: 'Sunny', high: 28, low: 20, icon: 'sun' },
    ]
  }
];

export const HarmonyWeatherApp: React.FC = () => {
  const theme = useTheme();
  const [cities] = useState<WeatherCity[]>(DEFAULT_CITIES);
  const [selectedCityId, setSelectedCityId] = useState<string>('addis');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);

  const currentCity = cities.find(c => c.id === selectedCityId) || cities[0];

  const handleRefresh = () => {
    triggerHaptic('light');
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getConditionBackground = () => {
    switch (currentCity.condition) {
      case 'Sunny':
        return 'from-amber-400 via-sky-500 to-blue-600';
      case 'Rain':
        return 'from-slate-700 via-indigo-900 to-slate-900';
      case 'Thunderstorm':
        return 'from-purple-900 via-slate-900 to-black';
      case 'Partly Cloudy':
      default:
        return 'from-sky-500 via-blue-600 to-indigo-800';
    }
  };

  return (
    <div className={`h-full w-full flex flex-col overflow-y-auto bg-gradient-to-b ${getConditionBackground()} text-white p-4 md:p-6 transition-colors duration-500`}>
      {/* Top Bar */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            triggerHaptic('selection');
            setIsCityPickerOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-semibold tracking-wide transition-all border border-white/20"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentCity.name}, {currentCity.country}</span>
          <ChevronRight className="w-3 h-3 opacity-70" />
        </button>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all border border-white/20"
          title="Refresh Atmospheric Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Temperature Hero */}
      <div className="max-w-xl mx-auto w-full text-center py-4">
        <p className="text-sm font-medium tracking-wide text-white/90 drop-shadow-sm">{currentCity.name}</p>
        <div className="relative inline-block my-1">
          <span className="text-7xl font-extralight tracking-tighter drop-shadow-md">
            {currentCity.temp}
          </span>
          <span className="text-3xl font-light absolute -top-1 -right-7">°C</span>
        </div>
        <p className="text-base font-semibold text-white/95 drop-shadow-sm">{currentCity.condition}</p>
        <p className="text-xs text-white/75 mt-0.5">
          H: {currentCity.high}° • L: {currentCity.low}°
        </p>
      </div>

      {/* Hourly Forecast Slider Card */}
      <div className="max-w-xl mx-auto w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-4 my-2 shadow-lg">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/75 pb-2 border-b border-white/10 mb-3 flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5" /> 24-Hour Forecast
        </p>
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-4 scrollbar-none">
          {currentCity.hourly.map((hour, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[50px] space-y-2">
              <span className="text-xs font-medium text-white/80">{hour.time}</span>
              {hour.icon === 'sun' && <Sun className="w-5 h-5 text-amber-300 drop-shadow-sm" />}
              {hour.icon === 'cloud' && <CloudSun className="w-5 h-5 text-sky-200 drop-shadow-sm" />}
              {hour.icon === 'rain' && <CloudRain className="w-5 h-5 text-blue-200 drop-shadow-sm" />}
              <span className="text-xs font-bold">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Extended Outlook */}
      <div className="max-w-xl mx-auto w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-4 my-2 shadow-lg">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/75 pb-2 border-b border-white/10 mb-3 flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" /> 7-Day Outlook
        </p>
        <div className="space-y-2.5">
          {currentCity.forecast.map((f, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-0.5">
              <span className="w-16 font-semibold">{f.day}</span>
              <div className="flex items-center gap-2 flex-1 justify-center">
                {f.icon === 'sun' && <Sun className="w-4 h-4 text-amber-300" />}
                {f.icon === 'cloud' && <CloudSun className="w-4 h-4 text-sky-200" />}
                {f.icon === 'rain' && <CloudRain className="w-4 h-4 text-blue-200" />}
                <span className="text-white/80 text-[11px] truncate max-w-[120px]">{f.condition}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] justify-end w-20">
                <span className="text-white/60">{f.low}°</span>
                <div className="w-10 h-1 rounded-full bg-white/30 overflow-hidden">
                  <div className="h-full bg-amber-300 rounded-full w-3/4" />
                </div>
                <span className="font-bold">{f.high}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Metric Grid */}
      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-3 my-2">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center gap-1.5 text-white/75 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Wind className="w-3.5 h-3.5" /> Wind Speed
          </div>
          <p className="text-xl font-bold tracking-tight">{currentCity.windSpeed} <span className="text-xs font-normal">km/h</span></p>
          <p className="text-[10px] text-white/70 mt-1">Light mountain breeze</p>
        </div>

        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center gap-1.5 text-white/75 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Droplets className="w-3.5 h-3.5" /> Humidity
          </div>
          <p className="text-xl font-bold tracking-tight">{currentCity.humidity}%</p>
          <p className="text-[10px] text-white/70 mt-1">Dew point is 12°</p>
        </div>

        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center gap-1.5 text-white/75 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Sun className="w-3.5 h-3.5" /> UV Index
          </div>
          <p className="text-xl font-bold tracking-tight">{currentCity.uvIndex} <span className="text-xs font-normal">Mod</span></p>
          <p className="text-[10px] text-white/70 mt-1">Protection recommended</p>
        </div>

        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center gap-1.5 text-white/75 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Eye className="w-3.5 h-3.5" /> Air Quality
          </div>
          <p className="text-xl font-bold tracking-tight">{currentCity.airQuality}</p>
          <p className="text-[10px] text-white/70 mt-1">Healthy outdoor air</p>
        </div>
      </div>

      {/* City Switcher Modal */}
      <AnimatePresence>
        {isCityPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsCityPickerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-5 bg-neutral-900 border border-neutral-800 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold">Select Weather Location</h3>
                <button
                  onClick={() => setIsCityPickerOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Done
                </button>
              </div>

              <div className="space-y-2 mt-3">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedCityId(city.id);
                      setIsCityPickerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all text-left ${
                      selectedCityId === city.id
                        ? 'bg-blue-600/30 border-blue-500 text-white'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm leading-tight">{city.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{city.country} • {city.condition}</p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-xl font-light">{city.temp}°</span>
                      {selectedCityId === city.id && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
