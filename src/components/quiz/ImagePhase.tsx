import { motion } from 'framer-motion';
import { useQuizStore } from '@/stores/quizStore';
import Button from '@/components/shared/Button';

export default function ImagePhase() {
  const { generatedImages, skipToPhase, isGeneratingImage } = useQuizStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">What Movie is This?</h2>
        <p className="text-xl text-gray-400">
          Study this AI-generated image for clues
        </p>
      </div>

      {/* Generated Image */}
      {generatedImages.main ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          className="max-w-4xl mx-auto"
        >
          <img
            src={generatedImages.main}
            alt="Movie clue"
            className="w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl"
          />
        </motion.div>
      ) : isGeneratingImage ? (
        <div className="max-w-4xl mx-auto aspect-video bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
           <div className="text-gray-600 font-medium">Generating AI Image...</div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
          <p className="text-gray-500 text-xl">Image generation disabled or failed</p>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-center space-x-4">
        <Button onClick={() => skipToPhase('keywords')} size="lg">
          Show Keywords
        </Button>
      </div>
    </motion.div>
  );
}
