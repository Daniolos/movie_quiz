import { Movie } from './movie.types';

export type QuizPhase = 'loading' | 'image' | 'keywords' | 'description' | 'title' | 'results';

export interface GeneratedImages {
  main?: string;
  description?: string;
  keywords?: Record<string, string>;
}

export interface QuizState {
  currentMovie: Movie | null;
  generatedImages: GeneratedImages;
  phase: QuizPhase;
  currentKeywordIndex: number;
  revealedKeywords: string[];
  userGuess: string | null;
  isCorrectGuess: boolean | null;
  startTime: number | null;
  endTime: number | null;
  score: number;
  hintsUsed: number;
}

export interface QuizHistory {
  id: string;
  movieId: string;
  movieTitle: string;
  guessed: boolean;
  timeSpent: number;
  hintsUsed: number;
  score: number;
  date: string;
}

export interface QuizStatistics {
  totalGames: number;
  correctGuesses: number;
  averageTime: number;
  totalScore: number;
  favoriteGenres: string[];
}
