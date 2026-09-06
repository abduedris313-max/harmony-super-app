/**
 * @file HarmonyTerminalApp.tsx
 * @description Wrapper for Terminal & Diagnostics mini-app module.
 */

import React from 'react';
import { HarmonyTerminalApp as TerminalModule } from '../../apps/terminal';

export const HarmonyTerminalApp: React.FC = () => {
  return <TerminalModule />;
};

export default HarmonyTerminalApp;
