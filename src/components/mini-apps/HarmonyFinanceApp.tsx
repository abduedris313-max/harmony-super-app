import React from 'react';
import { HarmonyFinanceAppModule } from '../../apps/finance';

export const HarmonyFinanceApp: React.FC<any> = (props) => {
  return <HarmonyFinanceAppModule {...props} />;
};

export default HarmonyFinanceApp;
