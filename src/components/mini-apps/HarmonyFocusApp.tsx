/**
 * @file HarmonyFocusApp.tsx
 * @description Wrapper for Focus Studio & Pomodoro mini-app module.
 */

import React from 'react';
import { HarmonyFocusApp as FocusModule } from '../../apps/focus';

export const HarmonyFocusApp: React.FC = () => {
  return <FocusModule />;
};

export default HarmonyFocusApp;
