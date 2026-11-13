import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './index.css';

if (typeof window !== 'undefined') {
  registerSW({
    immediate: true,
    onOfflineReady() {
      // App shell precached for offline launch
    },
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
