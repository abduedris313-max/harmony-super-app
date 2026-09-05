import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for offline functionality and Stale-While-Revalidate caching
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(
      (registration) => {
        console.log('[Harmony SW] ServiceWorker registered with scope:', registration.scope);
      },
      (err) => {
        console.warn('[Harmony SW] ServiceWorker registration failed:', err);
      }
    );
  });
} else if ('serviceWorker' in navigator) {
  // Always register in dev/preview environment if supported
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(
      (registration) => {
        console.log('[Harmony SW] Dev ServiceWorker registered with scope:', registration.scope);
      },
      (err) => {
        console.warn('[Harmony SW] Dev ServiceWorker registration failed:', err);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

