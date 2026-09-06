/**
 * @file HarmonyHabitsApp.tsx
 * @description Wrapper for Habits & Momentum Rings mini-app module.
 */

import React from 'react';
import { HarmonyHabitsApp as HabitsModule } from '../../apps/habits';

export const HarmonyHabitsApp: React.FC = () => {
  return <HabitsModule />;
};

export default HarmonyHabitsApp;
