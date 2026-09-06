/**
 * @file HarmonyCalculatorApp.tsx
 * @description Wrapper for Calculator & Unit Converter mini-app module.
 */

import React from 'react';
import { HarmonyCalculatorApp as CalculatorModule } from '../../apps/calculator';

export const HarmonyCalculatorApp: React.FC = () => {
  return <CalculatorModule />;
};

export default HarmonyCalculatorApp;
