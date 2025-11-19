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

      // Sanitize keywords for keywords quiz
      if (quizType === 'keywords') {
        setLoading(true, 'Optimizing keywords...');
        const sanitizedKeywords = await movieService.sanitizeMovieKeywords(
          movie.imdbId || movie.id,
          openRouterService
        );
        // Update the movie with sanitized keywords
        movie.keywords = sanitizedKeywords;
        setCurrentMovie(movie);
      }

      // Load quiz type specific data
      if (quizType === 'quotes') {
        setLoading(true, 'Loading movie quotes...');
        const quotesData = await movieService.getMovieQuotes(movie.imdbId || movie.id);

        // If no quotes available, try to get another movie (retry up to 3 times)
        let retries = 0;
        let currentMovie = movie;
        let currentQuotesData = quotesData;

        while (currentQuotesData.length === 0 && retries < 3) {
          retries++;
          setLoading(true, `Finding a movie with quotes... (attempt ${retries + 1})`);
          currentMovie = await movieService.getRandomMovie();
          currentQuotesData = await movieService.getMovieQuotes(currentMovie.imdbId || currentMovie.id);
        }

        if (currentQuotesData.length === 0) {
          showToast('Could not find a movie with available quotes. Please try again.', 'error');
          navigate('/');
          return;
        }

        // Update the movie if we found a different one
        if (currentMovie.id !== movie.id) {
          setCurrentMovie(currentMovie);
        }

        const quotes: Quote[] = currentQuotesData.map((q) => ({
          id: q.id,
          text: q.text,
          character: q.character,
        }));
        setQuotes(quotes);
      } else if (quizType === 'trivia') {
        setLoading(true, 'Loading movie trivia...');
        const triviaData = await movieService.getMovieTrivia(movie.imdbId || movie.id);

        // Generate trivia items with AI-powered questions (without revealing movie title)
        const triviaItems: TriviaItem[] = [];
        for (const trivia of triviaData.slice(0, 5)) {
          try {
            setLoading(true, `Generating trivia questions... (${triviaItems.length + 1}/5)`);

            const triviaQuestion = await openRouterService.generateTriviaQuestion(
              trivia.text,
              movie.title
            );

            if (triviaQuestion) {
              triviaItems.push({
                id: trivia.id,
                question: triviaQuestion.question,
                correctAnswer: triviaQuestion.correctAnswer,
                options: triviaQuestion.options,
              });
            }
          } catch (error) {
            console.error('Failed to generate trivia question:', error);
          }
        }

        if (triviaItems.length === 0) {
          showToast('Failed to generate trivia questions. Please try again.', 'error');
          navigate('/');
          return;
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
        // Auto-reveal first keyword
        const { nextKeyword } = useQuizStore.getState();
        nextKeyword();
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
