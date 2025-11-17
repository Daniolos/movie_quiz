import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import TypingText from '@/components/shared/TypingText';
import Button from '@/components/shared/Button';

export default function TitleReveal() {
  const navigate = useNavigate();
  const { currentMovie, resetQuiz } = useQuizStore();
  const { enableTypingEffect, typingSpeed } = useSettingsStore(
    (state) => state.preferences
  );

  if (!currentMovie) return null;

  const handlePlayAgain = () => {
    resetQuiz();
    navigate(0); // Reload the quiz page
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>

      <h2 className="text-4xl font-bold mb-4">The Movie Was...</h2>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-dark p-8 rounded-xl max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">
          {enableTypingEffect ? (
            <TypingText text={currentMovie.title} speed={typingSpeed} />
          ) : (
            currentMovie.title
          )}
        </h1>

        <p className="text-xl text-gray-400">({currentMovie.year})</p>
      </motion.div>

      {/* Movie Poster */}
      {currentMovie.posterUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-md mx-auto"
        >
          <img
            src={currentMovie.posterUrl}
            alt={currentMovie.title}
            className="w-full rounded-xl shadow-2xl"
          />
        </motion.div>
      )}

      {/* Movie Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="glass p-6 rounded-xl max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {currentMovie.rating ? currentMovie.rating.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">IMDb Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {currentMovie.year}
            </div>
            <div className="text-sm text-gray-400">Year</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {currentMovie.genres && currentMovie.genres.length > 0 ? currentMovie.genres[0] : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Genre</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {currentMovie.runtime ? `${currentMovie.runtime}min` : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Runtime</div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center space-x-4"
      >
        <Button onClick={handlePlayAgain} size="lg">
          Play Again
        </Button>
        <Button onClick={() => navigate('/')} variant="secondary" size="lg">
          Back to Home
        </Button>
      </motion.div>
    </motion.div>
  );
}
