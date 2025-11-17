import { motion } from 'framer-motion';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import TypingText from '@/components/shared/TypingText';
import Button from '@/components/shared/Button';

export default function DescriptionPhase() {
  const { currentMovie, generatedImages, skipToPhase } = useQuizStore();
  const { enableTypingEffect, typingSpeed, enableImages } = useSettingsStore(
    (state) => state.preferences
  );

  if (!currentMovie) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Movie Description</h2>
        <p className="text-gray-400">Here's what the movie is about</p>
      </div>

      {/* Generated Image */}
      {enableImages && generatedImages.description && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <img
            src={generatedImages.description}
            alt="Movie scene"
            className="w-full rounded-xl shadow-2xl"
          />
        </motion.div>
      )}

      {/* Description Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-8 rounded-xl max-w-3xl mx-auto"
      >
        <p className="text-xl leading-relaxed text-gray-300">
          {enableTypingEffect ? (
            <TypingText
              text={currentMovie.description}
              speed={typingSpeed * 2}
            />
          ) : (
            currentMovie.description
          )}
        </p>
      </motion.div>

      {/* Action */}
      <div className="flex justify-center">
        <Button onClick={() => skipToPhase('title')} size="lg">
          Reveal Movie Title
        </Button>
      </div>
    </motion.div>
  );
}
