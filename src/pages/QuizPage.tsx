import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Loader from '@/components/shared/Loader';
import ImagePhase from '@/components/quiz/ImagePhase';
import KeywordPhase from '@/components/quiz/KeywordPhase';
import QuotesPhase from '@/components/quiz/QuotesPhase';
import TriviaPhase from '@/components/quiz/TriviaPhase';
import DescriptionPhase from '@/components/quiz/DescriptionPhase';
import TitleReveal from '@/components/quiz/TitleReveal';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { movieService } from '@/services/movieService';
import { geminiService } from '@/services/geminiService';
import { openRouterService } from '@/services/openRouterService';
import { Quote, TriviaItem } from '@/types/quiz.types';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    phase,
    quizType,
    setCurrentMovie,
    setGeneratedImage,
    setIsGeneratingImage,
    setQuotes,
    setTriviaItems,
    setPhase,
    startQuiz,
    resetQuiz,
  } = useQuizStore();

  const settings = useSettingsStore();
  const { setLoading, setError, showToast } = useUIStore();

  useEffect(() => {
    initializeQuiz();
    return () => resetQuiz();
  }, []);

  const initializeQuiz = async () => {
    try {
      setLoading(true, 'Loading movie quiz...');
      setPhase('loading');

      // Validate quiz type
      if (!quizType) {
        showToast('Please select a quiz type', 'error');
        navigate('/');
        return;
      }

      // Set API keys
      movieService.setApiKey(settings.apiKeys.rapidApi);
      geminiService.setApiKey(settings.apiKeys.gemini);
      openRouterService.setApiKey(settings.apiKeys.openRouter);

      // Fetch random movie
      setLoading(true, 'Finding a movie...');
      const movie = await movieService.getRandomMovie();
      setCurrentMovie(movie);

      // Load quiz type specific data
      if (quizType === 'quotes') {
        setLoading(true, 'Loading movie quotes...');
        const quotesData = await movieService.getMovieQuotes(movie.imdbId || movie.id);
        const quotes: Quote[] = quotesData.map((q) => ({
          id: q.id,
          text: q.text,
          character: q.character,
        }));
        setQuotes(quotes);
      } else if (quizType === 'trivia') {
        setLoading(true, 'Loading movie trivia...');
        const triviaData = await movieService.getMovieTrivia(movie.imdbId || movie.id);

        // Generate trivia items with AI-powered wrong answers
        const triviaItems: TriviaItem[] = [];
        for (const trivia of triviaData) {
          try {
            setLoading(true, `Generating trivia options... (${triviaItems.length + 1}/${triviaData.length})`);
            const wrongAnswers = await openRouterService.generateWrongAnswers(
              trivia.text,
              movie.title,
              movie.title
            );

            const allOptions = [movie.title, ...wrongAnswers];
            // Shuffle options
            const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

            triviaItems.push({
              id: trivia.id,
              question: trivia.text,
              correctAnswer: movie.title,
              options: shuffledOptions,
            });
          } catch (error) {
            console.error('Failed to generate trivia options:', error);
          }
        }

        setTriviaItems(triviaItems);
      }

      // Generate AI image if enabled (for keywords quiz) - Non-blocking
      if (settings.preferences.enableImages && quizType === 'keywords') {
        setIsGeneratingImage(true);
        // Don't await - let it run in background
        geminiService.generateMovieImage(
          movie.title,
          movie.genres[0] || 'Drama'
        ).then((mainImage) => {
          if (mainImage) {
            setGeneratedImage('main', mainImage);
          }
        }).catch((error) => {
          console.error('Image generation failed:', error);
          showToast('Failed to generate images, continuing without them', 'warning');
        }).finally(() => {
          setIsGeneratingImage(false);
        });
      }

      setLoading(false);

      // Start quiz based on type
      if (quizType === 'keywords') {
        if (settings.preferences.enableImages) {
          startQuiz(); // This sets phase to 'image'
        } else {
          setPhase('keywords');
        }
      } else if (quizType === 'quotes') {
        setPhase('quotes');
      } else if (quizType === 'trivia') {
        setPhase('trivia');
      }
    } catch (error: any) {
      console.error('Quiz initialization failed:', error);
      setError('Failed to load quiz. Please check your API keys.');
      showToast('Failed to load quiz', 'error');
      setTimeout(() => navigate('/settings'), 2000);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'loading':
        return <Loader message="Preparing your movie quiz..." size="lg" />;
      case 'image':
        return <ImagePhase />;
      case 'keywords':
        return <KeywordPhase />;
      case 'quotes':
        return <QuotesPhase />;
      case 'trivia':
        return <TriviaPhase />;
      case 'description':
        return <DescriptionPhase />;
      case 'title':
      case 'results':
        return <TitleReveal />;
      default:
        return <Loader message="Loading..." />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">{renderPhase()}</div>
      </Container>
    </div>
  );
}
