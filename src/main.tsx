import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Load settings on app start
import { useSettingsStore } from './stores/settingsStore';
useSettingsStore.getState().loadSettings();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
