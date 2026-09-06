/**
 * @file main.tsx
 * @description Root entry point for the Harmony App Store Developer Console.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './App';
import '../src/index.css';

const rootElement = document.getElementById('admin-root');
if (!rootElement) {
  throw new Error('Failed to find #admin-root element for Harmony App Store Developer Console.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
