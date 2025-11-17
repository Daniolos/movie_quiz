import { Settings, DEFAULT_SETTINGS } from '@/types/settings.types';
import { QuizHistory } from '@/types/quiz.types';

const STORAGE_KEYS = {
  SETTINGS: 'movie-quiz-settings',
  HISTORY: 'movie-quiz-history',
  STATISTICS: 'movie-quiz-statistics',
} as const;

class StorageService {
  // Settings
  getSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) return DEFAULT_SETTINGS;

      const parsed = JSON.parse(stored);
      // Merge with defaults to handle version updates
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: Settings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  // Quiz History
  getHistory(): QuizHistory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  addHistoryEntry(entry: QuizHistory): void {
    try {
      const history = this.getHistory();
      history.unshift(entry); // Add to beginning

      // Keep only last 50 entries
      const trimmed = history.slice(0, 50);

      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving history entry:', error);
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  // Generic methods
  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  exportData(): string {
    const data = {
      settings: this.getSettings(),
      history: this.getHistory(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);

      if (data.settings) {
        this.saveSettings(data.settings);
      }

      if (data.history) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
