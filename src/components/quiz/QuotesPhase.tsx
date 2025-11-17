import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TypingText from '@/components/shared/TypingText';

export default function QuotesPhase() {
  const [guess, setGuess] = useState('');
  const {
    quotes,
    currentQuoteIndex,
    currentMovie,
    nextQuote,
    setUserGuess,
    checkGuess,
    setPhase,
  } = useQuizStore();

  const { enableTypingEffect, typingSpeed } = useSettingsStore(
    (state) => state.preferences
  );

  const revealedQuotes = quotes.slice(0, currentQuoteIndex + 1);
  const hasMoreQuotes = currentQuoteIndex < quotes.length - 1;

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    setUserGuess(guess);
    checkGuess();
    setPhase('title');
  };

  const handleNextQuote = () => {
    if (hasMoreQuotes) {
      nextQuote();
    }
  };

  const handleSkipToTitle = () => {
    setPhase('title');
  };

  if (!currentMovie || quotes.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-400">No quotes available for this movie</p>
        <Button onClick={handleSkipToTitle} className="mt-4">
          Skip to Answer
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Quote Quiz</h2>
        <p className="text-xl text-gray-400">
          Can you guess the movie from these quotes?
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Quote {currentQuoteIndex + 1} of {quotes.length}
        </div>
      </div>

      {/* Revealed Quotes */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {revealedQuotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark p-6 rounded-xl"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">💬</div>
                <div className="flex-1">
                  <blockquote className="text-lg md:text-xl text-gray-200 italic mb-2">
                    {enableTypingEffect && index === currentQuoteIndex ? (
                      <TypingText text={`"${quote.text}"`} speed={typingSpeed} />
                    ) : (
                      `"${quote.text}"`
                    )}
                  </blockquote>
                  <p className="text-sm text-gray-400">— {quote.character}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Guess Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-xl"
      >
        <form onSubmit={handleSubmitGuess} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What movie is this from?
            </label>
            <Input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter movie title..."
              className="w-full"
              autoFocus
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="flex-1" disabled={!guess.trim()}>
              Submit Guess
            </Button>

            {hasMoreQuotes && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleNextQuote}
                className="flex-1"
              >
                Show Next Quote
              </Button>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={handleSkipToTitle}
            >
              Give Up
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Progress Bar */}
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400">
            {Math.round(((currentQuoteIndex + 1) / quotes.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuoteIndex + 1) / quotes.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
