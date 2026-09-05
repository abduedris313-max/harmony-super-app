/**
 * @file GoogleSyncView.tsx
 * @description Google Calendar synchronization dashboard:
 * Connect Google account via OAuth, view remote events, import into local/Firestore Harmony Calendar,
 * and push local events to Google Calendar.
 */

import React, { useState } from 'react';
import { 
  Cloud, 
  CloudRain, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  LogIn, 
  LogOut,
  DownloadCloud,
  UploadCloud,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { HarmonyCalendarEvent } from '../../../types';
import { GoogleCalendarEvent } from '../../../lib/googleCalendar';

interface GoogleSyncViewProps {
  isGoogleConnected: boolean;
  googleEvents: GoogleCalendarEvent[];
  isSyncing: boolean;
  onConnectGoogle: () => Promise<void>;
  onDisconnectGoogle: () => void;
  onRefreshGoogleEvents: () => Promise<void>;
  onImportGoogleEvent: (gEvent: GoogleCalendarEvent) => Promise<void>;
  onExportToGoogle: (event: HarmonyCalendarEvent) => Promise<void>;
  localEvents: HarmonyCalendarEvent[];
}

export const GoogleSyncView: React.FC<GoogleSyncViewProps> = ({
  isGoogleConnected,
  googleEvents,
  isSyncing,
  onConnectGoogle,
  onDisconnectGoogle,
  onRefreshGoogleEvents,
  onImportGoogleEvent,
  onExportToGoogle,
  localEvents
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleConnect = async () => {
    setErrorMsg(null);
    try {
      await onConnectGoogle();
      setSuccessMsg('Google Calendar connected successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google Calendar');
    }
  };

  const handleRefresh = async () => {
    setErrorMsg(null);
    try {
      await onRefreshGoogleEvents();
      setSuccessMsg('Calendar events refreshed.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync with Google Calendar');
    }
  };

  const handleImport = async (gEvent: GoogleCalendarEvent) => {
    try {
      await onImportGoogleEvent(gEvent);
      setSuccessMsg(`Imported "${gEvent.summary}" into Harmony Calendar`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import event');
    }
  };

  const handleExport = async (event: HarmonyCalendarEvent) => {
    try {
      await onExportToGoogle(event);
      setSuccessMsg(`Pushed "${event.title}" to Google Calendar`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to push event');
    }
  };

  // Find local events that haven't been pushed to Google
  const unpushedLocalEvents = localEvents.filter(e => !e.syncedToGoogle && !e.googleEventId);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/10">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Google Calendar Sync Hub
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Two-way synchronization between Harmony Tri-Calendar and your primary Google Calendar
          </p>
        </div>

        {isGoogleConnected ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
            <button
              type="button"
              onClick={onDisconnectGoogle}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Connect Google Calendar
          </button>
        )}
      </div>

      {/* Status Notifications */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Connection Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isGoogleConnected ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-neutral-100 dark:bg-white/10 text-neutral-400 dark:text-neutral-500'
            }`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                Google Calendar Integration
                {isGoogleConnected && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Authorized scope: <code className="font-mono text-blue-600 dark:text-blue-300">calendar.events</code>
              </p>
            </div>
          </div>
        </div>

        {!isGoogleConnected && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-200">
            Click <strong>"Connect Google Calendar"</strong> to link your Google account. This lets you import existing meetings and export your Gregorian, Hijri, and Ethiopian calendar events directly to Google Calendar.
          </div>
        )}
      </div>

      {/* Grid of Google Events and Unsynced Local Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Remote Google Calendar Events */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <DownloadCloud className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Upcoming from Google ({googleEvents.length})
            </h3>
          </div>

          {!isGoogleConnected ? (
            <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 space-y-2">
              <Cloud className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-500">Connect Google Calendar above to load events</p>
            </div>
          ) : googleEvents.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 space-y-2">
              <CalendarIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">No upcoming events found on your Google Calendar</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {googleEvents.map((gEv) => {
                const startStr = gEv.start.dateTime || gEv.start.date || '';
                const dateOnly = startStr.split('T')[0];
                const isAlreadyImported = localEvents.some(l => l.googleEventId === gEv.id);

                return (
                  <div
                    key={gEv.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{gEv.summary}</h4>
                      {isAlreadyImported ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium shrink-0">
                          Imported
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImport(gEv)}
                          className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-300 text-[10px] font-semibold shrink-0 transition-colors"
                        >
                          + Import
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                      <span>{dateOnly}</span>
                      {gEv.start.dateTime && (
                        <span>
                          {new Date(gEv.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Local Events Ready to Push */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Push to Google Calendar ({unpushedLocalEvents.length})
            </h3>
          </div>

          {unpushedLocalEvents.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">All local events are synchronized with Google Calendar</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {unpushedLocalEvents.map((lEv) => (
                <div
                  key={lEv.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{lEv.title}</h4>
                    <button
                      type="button"
                      disabled={!isGoogleConnected}
                      onClick={() => handleExport(lEv)}
                      className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 disabled:opacity-40 text-emerald-600 dark:text-emerald-300 text-[10px] font-semibold shrink-0 transition-colors"
                    >
                      Push Event
                    </button>
                  </div>

                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                    <span>{lEv.gregorianDate}</span>
                    <span>{lEv.allDay ? 'All Day' : `${lEv.startTime || ''} - ${lEv.endTime || ''}`}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
