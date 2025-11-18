export type MovieApiProvider = 'tmdb' | 'rapidapi';
export type Language = 'en' | 'de' | 'es' | 'fr';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface APIKeys {
  gemini: string;
  rapidApi: string; // RapidAPI key for IMDb
  openRouter: string; // OpenRouter API key for AI-generated options
}

export interface GamePreferences {
  language: Language;
  maxKeywords: number;
  typingSpeed: number;
  autoAdvance: boolean;
  enableImages: boolean;
  enableTypingEffect: boolean;
  enableTranslations: boolean;
  imageQuality: 'low' | 'medium' | 'high';
}

export interface MovieSelection {
  genres: string[];
  difficulty: Difficulty;
  excludedMovieIds: string[];
  includeAdult: boolean;
}

export interface Settings {
  apiKeys: APIKeys;
  preferences: GamePreferences;
  movieSelection: MovieSelection;
  version: string;
}

export const DEFAULT_SETTINGS: Settings = {
  apiKeys: {
    gemini: '',
    rapidApi: '',
    openRouter: '',
  },
  preferences: {
    language: 'en',
    maxKeywords: 10,
    typingSpeed: 80,
    autoAdvance: false,
    enableImages: true,
    enableTypingEffect: true,
    enableTranslations: false,
    imageQuality: 'medium',
  },
  movieSelection: {
    genres: [],
    difficulty: 'medium',
    excludedMovieIds: [],
    includeAdult: false,
  },
  version: '2.0.0',
};
