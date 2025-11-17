import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import { useSettingsStore } from '@/stores/settingsStore';
import { useQuizStore } from '@/stores/quizStore';
import { QuizType } from '@/types/quiz.types';

export default function HomePage() {
  const navigate = useNavigate();
  const hasValidApiKeys = useSettingsStore((state) => state.hasValidApiKeys());
  const setQuizType = useQuizStore((state) => state.setQuizType);

  const handleQuizTypeSelect = (type: QuizType) => {
    if (hasValidApiKeys) {
      setQuizType(type);
      navigate('/quiz');
    } else {
      navigate('/settings');
    }
  };

  const quizTypes = [
    {
      type: 'keywords' as QuizType,
      icon: '🔑',
      title: 'Keywords Quiz',
      description: 'Guess the movie from revealing keywords',
      features: ['AI-Generated Images', 'Progressive Hints', 'Keyword Clues'],
      color: 'from-blue-500/20 to-purple-500/20',
    },
    {
      type: 'quotes' as QuizType,
      icon: '💬',
      title: 'Quotes Quiz',
      description: 'Identify movies from memorable quotes',
      features: ['Iconic Dialogue', 'Character Quotes', 'Multiple Hints'],
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      type: 'trivia' as QuizType,
      icon: '🧠',
      title: 'Trivia Quiz',
      description: 'Test your knowledge with movie trivia',
      features: ['Multiple Choice', 'Fun Facts', 'AI-Powered Questions'],
      color: 'from-orange-500/20 to-red-500/20',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <Container className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-7xl mb-4"
            >
              🎬
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Movie Quiz</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-2">
              Choose your quiz mode and test your movie knowledge!
            </p>

            {!hasValidApiKeys && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <p className="text-sm text-yellow-500 mb-2">
                  ⚠️ Configure your API keys first to start playing
                </p>
                <Link
                  to="/settings"
                  className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                >
                  Go to Settings →
                </Link>
              </motion.div>
            )}
          </div>

          {/* Quiz Type Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {quizTypes.map((quiz, index) => (
              <motion.div
                key={quiz.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleQuizTypeSelect(quiz.type)}
                className={`glass bg-gradient-to-br ${quiz.color} p-6 rounded-xl cursor-pointer
                  hover:scale-105 transition-transform duration-300 hover:shadow-2xl
                  border border-gray-700/50 hover:border-primary-500/50`}
              >
                <div className="text-5xl mb-4">{quiz.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
                <p className="text-gray-400 mb-4 min-h-[48px]">{quiz.description}</p>

                <div className="space-y-2">
                  {quiz.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <span className="text-primary-400 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <span className="text-primary-400 font-semibold hover:text-primary-300">
                    Play Now →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="glass p-6 rounded-xl text-center"
          >
            <h3 className="text-lg font-semibold mb-3">Powered By</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="text-primary-400 mr-1">•</span>
                IMDb via RapidAPI
              </div>
              <div className="flex items-center">
                <span className="text-primary-400 mr-1">•</span>
                Google Gemini AI
              </div>
              <div className="flex items-center">
                <span className="text-primary-400 mr-1">•</span>
                OpenRouter AI
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
