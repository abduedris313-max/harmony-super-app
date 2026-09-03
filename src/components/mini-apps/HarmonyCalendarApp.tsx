import React from 'react';
import { HarmonyCalendarAppModule } from '../../apps/calendar';

export const HarmonyCalendarApp: React.FC<any> = (props) => {
  return <HarmonyCalendarAppModule {...props} />;
};

export default HarmonyCalendarApp;
