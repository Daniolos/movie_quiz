import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import TypingText from '@/components/shared/TypingText';
import Button from '@/components/shared/Button';
import { movieService } from '@/services/movieService';

export default function TitleReveal() {
  const navigate = useNavigate();
  const { currentMovie, resetQuiz, isCorrectGuess } = useQuizStore();
  const { enableTypingEffect, typingSpeed } = useSettingsStore(
    (state) => state.preferences
  );

  const [overview, setOverview] = useState<{
    plot: string;
    certificate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isCorrectGuess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#38bdf8', '#ffffff'], // Primary colors
      });
    }
  }, [isCorrectGuess]);

  useEffect(() => {
    if (currentMovie) {
      fetchOverview();
    }
  }, [currentMovie]);

  const fetchOverview = async () => {
    if (!currentMovie) return;

    try {
      setLoading(true);
      const data = await movieService.getMovieOverview(currentMovie.imdbId || currentMovie.id);
      setOverview({
        plot: data.plot,
        certificate: data.certificate,
      });
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {isCorrectGuess ? '🎉' : '🎬'}
      </motion.div>

      <h2 className="text-4xl font-bold mb-4">
        {isCorrectGuess ? 'Correct! The Movie Was...' : 'The Movie Was...'}
      </h2>

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
            className="w-full max-h-[50vh] object-contain rounded-xl shadow-2xl"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {currentMovie.rating ? currentMovie.rating.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">IMDb Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {currentMovie.year || 'N/A'}
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

        {/* Plot */}
        {!loading && overview?.plot && (
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-2">Plot</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{overview.plot}</p>
          </div>
        )}

        {/* Certificate */}
        {!loading && overview?.certificate && (
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
              Rated: {overview.certificate}
            </span>
          </div>
        )}
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
