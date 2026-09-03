/**
 * @file NotificationBanner.tsx
 * @description iOS 18 Dynamic Island / Top Banner notification toast.
 * Shown only when Focus Mode is OFF; suppressed when Focus Mode is ON.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationBannerProps {
  notification: SystemNotification | null;
  onDismiss: () => void;
  isDarkMode?: boolean;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
  isDarkMode = true,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ y: -60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto"
        >
          <div
            className={`flex items-start justify-between p-3.5 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#161b22]/95 text-[#c9d1d9] border-[#30363d] shadow-black/60'
                : 'bg-white/95 text-neutral-800 border-neutral-200/90 shadow-neutral-400/30'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {notification.appName || 'Harmony OS'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">now</span>
                </div>
                <h4
                  className={`text-xs font-semibold truncate mt-0.5 ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {notification.title}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-tight">
                  {notification.message}
                </p>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="ml-2 p-1 rounded-full text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
