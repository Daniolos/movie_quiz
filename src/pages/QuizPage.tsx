import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Loader from '@/components/shared/Loader';
import ImagePhase from '@/components/quiz/ImagePhase';
import KeywordPhase from '@/components/quiz/KeywordPhase';
import DescriptionPhase from '@/components/quiz/DescriptionPhase';
import TitleReveal from '@/components/quiz/TitleReveal';
import { useQuizStore } from '@/stores/quizStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { movieService } from '@/services/movieService';
import { geminiService } from '@/services/geminiService';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    phase,
    setCurrentMovie,
    setGeneratedImage,
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

      // Set API keys
      movieService.setApiKey(settings.apiKeys.rapidApi);
      geminiService.setApiKey(settings.apiKeys.gemini);

      // Fetch random movie
      setLoading(true, 'Finding a movie...');
      const movie = await movieService.getRandomMovie();
      setCurrentMovie(movie);

      // Generate AI image if enabled
      if (settings.preferences.enableImages) {
        try {
          setLoading(true, 'Generating AI image...');
          const mainImage = await geminiService.generateMovieImage(
            movie.title,
            movie.genres[0] || 'Drama'
          );
          if (mainImage) {
            setGeneratedImage('main', mainImage);
          }
        } catch (error) {
          console.error('Image generation failed:', error);
          showToast('Failed to generate images, continuing without them', 'warning');
        }
      }

      setLoading(false);

      // Start with image phase if images enabled, otherwise skip to keywords
      if (settings.preferences.enableImages) {
        startQuiz(); // This sets phase to 'image'
      } else {
        setPhase('keywords'); // Skip directly to keywords
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
