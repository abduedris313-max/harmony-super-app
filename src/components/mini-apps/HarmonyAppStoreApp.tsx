/**
 * @file HarmonyAppStoreApp.tsx
 * @description Wrapper for App Store mini app.
 */

import React from 'react';
import { HarmonyAppStoreModule } from '../../apps/store';
import { SystemUser } from '../../types';

interface HarmonyAppStoreAppProps {
  user?: SystemUser | null;
  pinnedAppIds: string[];
  onTogglePinApp: (appId: string) => void;
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const HarmonyAppStoreApp: React.FC<HarmonyAppStoreAppProps> = (props) => {
  return <HarmonyAppStoreModule {...props} />;
};

export default HarmonyAppStoreApp;
