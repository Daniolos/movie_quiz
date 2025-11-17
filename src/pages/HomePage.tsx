import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Button from '@/components/shared/Button';
import { useSettingsStore } from '@/stores/settingsStore';

export default function HomePage() {
  const navigate = useNavigate();
  const hasValidApiKeys = useSettingsStore((state) => state.hasValidApiKeys());

  const handleStartQuiz = () => {
    if (hasValidApiKeys) {
      navigate('/quiz');
    } else {
      navigate('/settings');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-8xl mb-6"
            >
              🎬
            </motion.div>

            <h1 className="text-6xl font-bold mb-6">
              <span className="gradient-text">Movie Quiz</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              Test your movie knowledge with AI-generated images and clues!
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-2">AI-Generated Images</h3>
              <p className="text-gray-400">
                Powered by Google's Gemini, creating unique visual clues
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="text-xl font-semibold mb-2">Progressive Hints</h3>
              <p className="text-gray-400">
                Keywords reveal one by one to help you guess
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-400">
                Adjust difficulty, typing effects, and more
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="text-xl px-12"
            >
              {hasValidApiKeys ? 'Start Quiz' : 'Setup API Keys'}
            </Button>

            {!hasValidApiKeys && (
              <p className="text-sm text-yellow-500">
                ⚠️ You need to configure your API keys in Settings first
              </p>
            )}

            <div className="text-gray-500 text-sm mt-6">
              <p>Requires:</p>
              <ul className="mt-2 space-y-1">
                <li>• TMDb API Key (free)</li>
                <li>• Google Gemini API Key (for images)</li>
              </ul>
              <Link
                to="/settings"
                className="text-primary-400 hover:text-primary-300 transition-colors inline-block mt-2"
              >
                Configure in Settings →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
