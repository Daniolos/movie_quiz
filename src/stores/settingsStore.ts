import { create } from 'zustand';
import { Settings, DEFAULT_SETTINGS } from '@/types/settings.types';
import { storageService } from '@/services/storageService';

interface SettingsStore extends Settings {
  // Actions
  updateApiKeys: (keys: Partial<Settings['apiKeys']>) => void;
  updatePreferences: (prefs: Partial<Settings['preferences']>) => void;
  updateMovieSelection: (selection: Partial<Settings['movieSelection']>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  hasValidApiKeys: () => boolean;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,

  updateApiKeys: (keys) => {
    set((state) => {
      const newState = {
        ...state,
        apiKeys: { ...state.apiKeys, ...keys },
      };
      storageService.saveSettings(newState);
      return newState;
    });
  },

  updatePreferences: (prefs) => {
    set((state) => {
      const newState = {
        ...state,
        preferences: { ...state.preferences, ...prefs },
      };
      storageService.saveSettings(newState);
      return newState;
    });
  },

  updateMovieSelection: (selection) => {
    set((state) => {
      const newState = {
        ...state,
        movieSelection: { ...state.movieSelection, ...selection },
      };
      storageService.saveSettings(newState);
      return newState;
    });
  },

  resetSettings: () => {
    set(DEFAULT_SETTINGS);
    storageService.saveSettings(DEFAULT_SETTINGS);
  },

  loadSettings: () => {
    const settings = storageService.getSettings();
    set(settings);
  },

  hasValidApiKeys: () => {
    const state = get();
    return !!(state.apiKeys.movieApiKey &&
              (state.preferences.enableImages ? state.apiKeys.gemini : true));
  },
}));
