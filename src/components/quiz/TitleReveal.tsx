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
      className="space-y-6 text-center max-h-[85vh] overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-5xl mb-2"
      >
        {isCorrectGuess ? '🎉' : '🎬'}
      </motion.div>

      <h2 className="text-3xl font-bold mb-2">
        {isCorrectGuess ? 'Correct! The Movie Was...' : 'The Movie Was...'}
      </h2>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-dark p-6 rounded-xl max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          {enableTypingEffect ? (
            <TypingText text={currentMovie.title} speed={typingSpeed} />
          ) : (
            currentMovie.title
          )}
        </h1>

        <p className="text-lg text-gray-400">({currentMovie.year})</p>
      </motion.div>

      {/* Movie Details and Poster - Side by Side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass p-6 rounded-xl max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie Poster */}
          {currentMovie.posterUrl && (
            <div className="flex-shrink-0 md:w-48">
              <img
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                className="w-full h-auto max-h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              {currentMovie.rating && currentMovie.rating > 0 && (
                <div>
                  <div className="text-xl font-bold text-primary-400">
                    ⭐ {currentMovie.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">IMDb Rating</div>
                </div>
              )}
              {currentMovie.year && (
                <div>
                  <div className="text-xl font-bold text-primary-400">
                    📅 {currentMovie.year}
                  </div>
                  <div className="text-xs text-gray-400">Year</div>
                </div>
              )}
              {currentMovie.genres && currentMovie.genres.length > 0 && (
                <div>
                  <div className="text-xl font-bold text-primary-400">
                    🎭 {currentMovie.genres.slice(0, 2).join(', ')}
                  </div>
                  <div className="text-xs text-gray-400">Genre{currentMovie.genres.length > 1 ? 's' : ''}</div>
                </div>
              )}
              {currentMovie.runtime && currentMovie.runtime > 0 && (
                <div>
                  <div className="text-xl font-bold text-primary-400">
                    ⏱️ {currentMovie.runtime}min
                  </div>
                  <div className="text-xs text-gray-400">Runtime</div>
                </div>
              )}
            </div>

            {/* Plot */}
            {!loading && overview?.plot && (
              <div className="border-t border-gray-700 pt-3">
                <h3 className="text-sm font-semibold mb-1 text-left">Plot</h3>
                <p className="text-gray-300 text-sm leading-relaxed text-left line-clamp-4">
                  {overview.plot}
                </p>
              </div>
            )}

            {/* Certificate */}
            {!loading && overview?.certificate && (
              <div className="text-left">
                <span className="inline-block px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                  Rated: {overview.certificate}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center space-x-4 pt-2"
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
