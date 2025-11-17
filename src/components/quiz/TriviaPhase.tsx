import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/stores/quizStore';
import Button from '@/components/shared/Button';

export default function TriviaPhase() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const {
    triviaItems,
    currentTriviaIndex,
    currentMovie,
    nextTrivia,
    checkTriviaAnswer,
    setPhase,
  } = useQuizStore();

  const currentTrivia = triviaItems[currentTriviaIndex];
  const hasMoreTrivia = currentTriviaIndex < triviaItems.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    checkTriviaAnswer(selectedAnswer);
    setShowResult(true);
  };

  const handleNextTrivia = () => {
    if (hasMoreTrivia) {
      nextTrivia();
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setPhase('title');
    }
  };

  const handleSkipToTitle = () => {
    setPhase('title');
  };

  if (!currentMovie || triviaItems.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-400">No trivia available for this movie</p>
        <Button onClick={handleSkipToTitle} className="mt-4">
          Skip to Answer
        </Button>
      </div>
    );
  }

  const isCorrectAnswer = (answer: string) => {
    return showResult && answer === currentTrivia.correctAnswer;
  };

  const isWrongAnswer = (answer: string) => {
    return showResult && answer === selectedAnswer && answer !== currentTrivia.correctAnswer;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Trivia Quiz</h2>
        <p className="text-xl text-gray-400">
          Answer questions about the movie!
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Question {currentTriviaIndex + 1} of {triviaItems.length}
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentTriviaIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-6 rounded-xl"
      >
        <div className="flex items-start space-x-4">
          <div className="text-4xl">🧠</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">Question:</h3>
            <p className="text-lg text-gray-200">{currentTrivia.question}</p>
          </div>
        </div>
      </motion.div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {currentTrivia.options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult}
              className={`glass p-4 rounded-xl text-left transition-all duration-300
                ${selectedAnswer === option && !showResult ? 'ring-2 ring-primary-500 bg-primary-500/10' : ''}
                ${isCorrectAnswer(option) ? 'ring-2 ring-green-500 bg-green-500/20' : ''}
                ${isWrongAnswer(option) ? 'ring-2 ring-red-500 bg-red-500/20' : ''}
                ${!showResult ? 'hover:bg-gray-800/50 cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                  ${selectedAnswer === option && !showResult ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300'}
                  ${isCorrectAnswer(option) ? 'bg-green-500 text-white' : ''}
                  ${isWrongAnswer(option) ? 'bg-red-500 text-white' : ''}
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option}</span>
                {isCorrectAnswer(option) && <span className="text-2xl">✓</span>}
                {isWrongAnswer(option) && <span className="text-2xl">✗</span>}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!showResult ? (
          <>
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Submit Answer
            </Button>
            <Button
              variant="secondary"
              onClick={handleSkipToTitle}
            >
              Give Up
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNextTrivia}
            className="flex-1"
          >
            {hasMoreTrivia ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400">
            {Math.round(((currentTriviaIndex + 1) / triviaItems.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentTriviaIndex + 1) / triviaItems.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
