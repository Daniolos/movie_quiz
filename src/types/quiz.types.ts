import { Movie } from './movie.types';

export type QuizType = 'keywords' | 'quotes' | 'trivia';

export type QuizPhase = 'loading' | 'image' | 'keywords' | 'quotes' | 'trivia' | 'description' | 'title' | 'results';

export interface GeneratedImages {
  main?: string;
  description?: string;
  keywords?: Record<string, string>;
}

export interface Quote {
  id: string;
  text: string;
  character: string;
}

export interface TriviaItem {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface QuizState {
  quizType: QuizType | null;
  currentMovie: Movie | null;
  generatedImages: GeneratedImages;
  isGeneratingImage: boolean;
  phase: QuizPhase;
  currentKeywordIndex: number;
  revealedKeywords: string[];
  quotes: Quote[];
  currentQuoteIndex: number;
  triviaItems: TriviaItem[];
  currentTriviaIndex: number;
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
