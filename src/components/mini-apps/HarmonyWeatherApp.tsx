/**
 * @file HarmonyWeatherApp.tsx
 * @description Wrapper for Weather mini-app module.
 */

import React from 'react';
import { HarmonyWeatherApp as WeatherModule } from '../../apps/weather';

export const HarmonyWeatherApp: React.FC = () => {
  return <WeatherModule />;
};

export default HarmonyWeatherApp;
