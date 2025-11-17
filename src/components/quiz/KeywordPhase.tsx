import { motion } from 'framer-motion';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import TypingText from '@/components/shared/TypingText';
import Button from '@/components/shared/Button';

export default function KeywordPhase() {
  const { revealedKeywords, nextKeyword, currentKeywordIndex, currentMovie, skipToPhase } =
    useQuizStore();
  const { maxKeywords, typingSpeed, enableTypingEffect } =
    useSettingsStore((state) => state.preferences);

  if (!currentMovie) return null;

  const hasMoreKeywords = currentKeywordIndex < Math.min(currentMovie.keywords.length, maxKeywords);

  const handleNext = () => {
    if (hasMoreKeywords) {
      nextKeyword();
    } else {
      skipToPhase('description');
    }
  };

  const handleSkip = () => {
    skipToPhase('description');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Keyword Hints ({revealedKeywords.length}/{Math.min(currentMovie.keywords.length, maxKeywords)})
        </h2>
        <p className="text-gray-400">
          Can you guess the movie from these keywords?
        </p>
      </div>

      {/* Revealed Keywords */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {revealedKeywords.map((keyword, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-4 rounded-lg text-center"
          >
            {enableTypingEffect ? (
              <TypingText
                text={keyword}
                speed={typingSpeed}
                className="text-lg font-semibold text-primary-400"
              />
            ) : (
              <span className="text-lg font-semibold text-primary-400">{keyword}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        {hasMoreKeywords ? (
          <>
            <Button onClick={handleNext} size="lg">
              Show Next Keyword
            </Button>
            <Button onClick={handleSkip} variant="secondary" size="lg">
              Skip to Description
            </Button>
          </>
        ) : (
          <Button onClick={handleSkip} size="lg">
            Show Description
          </Button>
        )}
      </div>
    </div>
  );
}
