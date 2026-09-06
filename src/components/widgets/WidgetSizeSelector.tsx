/**
 * @file WidgetSizeSelector.tsx
 * @description Compact segmented size control pill [S | M | L] for resizable Home Screen widgets.
 */

import React from 'react';
import { WidgetSize } from './types';
import { soundManager } from '../../lib/soundManager';
import { triggerHaptic } from '../../utils/haptics';

interface WidgetSizeSelectorProps {
  size: WidgetSize;
  onResize?: (size: WidgetSize) => void;
  isDarkMode?: boolean;
}

export const WidgetSizeSelector: React.FC<WidgetSizeSelectorProps> = ({
  size,
  onResize,
  isDarkMode = true,
}) => {
  if (!onResize) return null;

  const sizes: { id: WidgetSize; label: string; tooltip: string }[] = [
    { id: 'small', label: 'S', tooltip: 'Small (Compact 1×1)' },
    { id: 'medium', label: 'M', tooltip: 'Medium (Wide 2×1)' },
    { id: 'large', label: 'L', tooltip: 'Large (Full 2×2)' },
  ];

  return (
    <div 
      className={`inline-flex items-center rounded-full p-0.5 border ${
        isDarkMode 
          ? 'bg-[#0d1117]/80 border-[#30363d]/80' 
          : 'bg-neutral-100/90 border-neutral-200'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {sizes.map((s) => {
        const isActive = size === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playHapticClick();
              triggerHaptic('selection');
              onResize(s.id);
            }}
            title={s.tooltip}
            className={`px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDarkMode
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
};
