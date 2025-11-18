import { create } from 'zustand';
import { QuizState, QuizPhase, QuizType, Quote, TriviaItem } from '@/types/quiz.types';
import { Movie } from '@/types/movie.types';

interface QuizStore extends QuizState {
  // Actions
  setQuizType: (type: QuizType) => void;
  setCurrentMovie: (movie: Movie) => void;
  setGeneratedImage: (type: 'main' | 'description', image: string) => void;
  setPhase: (phase: QuizPhase) => void;
  nextKeyword: () => void;
  setQuotes: (quotes: Quote[]) => void;
  nextQuote: () => void;
  setTriviaItems: (items: TriviaItem[]) => void;
  nextTrivia: () => void;
  setUserGuess: (guess: string) => void;
  checkGuess: () => void;
  checkTriviaAnswer: (selectedAnswer: string) => void;
  startQuiz: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  skipToPhase: (phase: QuizPhase) => void;
}

const initialState: QuizState = {
  quizType: null,
  currentMovie: null,
  generatedImages: {},
  phase: 'loading',
  currentKeywordIndex: 0,
  revealedKeywords: [],
  quotes: [],
  currentQuoteIndex: 0,
  triviaItems: [],
  currentTriviaIndex: 0,
  userGuess: null,
  isCorrectGuess: null,
  startTime: null,
  endTime: null,
  score: 0,
  hintsUsed: 0,
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  setQuizType: (type) => {
    set({ quizType: type });
  },

  setCurrentMovie: (movie) => {
    set({ currentMovie: movie });
  },

  setGeneratedImage: (type, image) => {
    set((state) => ({
      generatedImages: {
        ...state.generatedImages,
        [type]: image,
      },
    }));
  },

  setPhase: (phase) => {
    set({ phase });
  },

  nextKeyword: () => {
    set((state) => {
      if (!state.currentMovie) return state;

      const nextIndex = state.currentKeywordIndex + 1;
      const keyword = state.currentMovie.keywords[state.currentKeywordIndex];

      return {
        currentKeywordIndex: nextIndex,
        revealedKeywords: keyword
          ? [...state.revealedKeywords, keyword]
          : state.revealedKeywords,
        hintsUsed: state.hintsUsed + 1,
      };
    });
  },

  setQuotes: (quotes) => {
    set({ quotes });
  },

  nextQuote: () => {
    set((state) => ({
      currentQuoteIndex: state.currentQuoteIndex + 1,
      hintsUsed: state.hintsUsed + 1,
    }));
  },

  setTriviaItems: (items) => {
    set({ triviaItems: items });
  },

  nextTrivia: () => {
    set((state) => ({
      currentTriviaIndex: state.currentTriviaIndex + 1,
    }));
  },

  setUserGuess: (guess) => {
    set({ userGuess: guess });
  },

  checkGuess: () => {
    const state = get();
    if (!state.currentMovie || !state.userGuess) return;

    const normalizedGuess = state.userGuess.toLowerCase().trim();
    const normalizedTitle = state.currentMovie.title.toLowerCase().trim();

    const isCorrect =
      normalizedGuess === normalizedTitle ||
      normalizedGuess.includes(normalizedTitle) ||
      normalizedTitle.includes(normalizedGuess);

    const baseScore = 1000;
    const timeBonus = state.startTime
      ? Math.max(0, 500 - Math.floor((Date.now() - state.startTime) / 1000) * 10)
      : 0;
    const hintPenalty = state.hintsUsed * 50;
    const finalScore = isCorrect ? Math.max(100, baseScore + timeBonus - hintPenalty) : 0;

    set({
      isCorrectGuess: isCorrect,
      score: finalScore,
    });
  },

  checkTriviaAnswer: (selectedAnswer) => {
    const state = get();
    const currentTrivia = state.triviaItems[state.currentTriviaIndex];

    if (!currentTrivia) return;

    const isCorrect = selectedAnswer === currentTrivia.correctAnswer;

    const baseScore = 200; // Lower score per trivia question
    const finalScore = isCorrect ? baseScore : 0;

    set({
      isCorrectGuess: isCorrect,
      score: state.score + finalScore,
    });
  },

  startQuiz: () => {
    set({
      startTime: Date.now(),
      phase: 'image',
    });
  },

  endQuiz: () => {
    set({
      endTime: Date.now(),
      phase: 'results',
    });
  },

  resetQuiz: () => {
    set(initialState);
  },

  skipToPhase: (phase) => {
    set({ phase });
  },
}));
