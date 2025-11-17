import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { movieService } from '@/services/movieService';
import { geminiService } from '@/services/geminiService';

export default function SettingsPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore();
  const { showToast } = useUIStore();

  const [apiKeys, setApiKeys] = useState({
    rapidApi: settings.apiKeys.rapidApi,
    gemini: settings.apiKeys.gemini,
  });

  const [preferences, setPreferences] = useState(settings.preferences);
  const [isValidating, setIsValidating] = useState(false);

  const handleSave = async () => {
    settings.updateApiKeys(apiKeys);
    settings.updatePreferences(preferences);
    showToast('Settings saved successfully!', 'success');
  };

  const handleValidateMovieApi = async () => {
    setIsValidating(true);
    try {
      const isValid = await movieService.validateApiKey(apiKeys.rapidApi);
      if (isValid) {
        showToast('RapidAPI key is valid!', 'success');
        settings.updateApiKeys({ rapidApi: apiKeys.rapidApi });
      } else {
        showToast('Invalid RapidAPI key', 'error');
      }
    } catch (error) {
      showToast('Failed to validate RapidAPI key', 'error');
    }
    setIsValidating(false);
  };

  const handleValidateGeminiApi = async () => {
    setIsValidating(true);
    try {
      const isValid = await geminiService.validateApiKey(apiKeys.gemini);
      if (isValid) {
        showToast('Gemini API key is valid!', 'success');
        settings.updateApiKeys({ gemini: apiKeys.gemini });
      } else {
        showToast('Invalid Gemini API key', 'error');
      }
    } catch (error) {
      showToast('Failed to validate Gemini API key', 'error');
    }
    setIsValidating(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Container className="py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-8">Settings</h1>

          {/* API Keys Section */}
          <div className="glass-dark p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold mb-6">API Configuration</h2>

            <div className="space-y-6">
              {/* RapidAPI Key */}
              <div>
                <Input
                  label="RapidAPI Key (IMDb API)"
                  type="password"
                  value={apiKeys.rapidApi}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, rapidApi: e.target.value })
                  }
                  placeholder="Enter your RapidAPI key"
                  helperText="Get API key from RapidAPI for IMDb API (imdb232.p.rapidapi.com)"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleValidateMovieApi}
                  isLoading={isValidating}
                  className="mt-2"
                >
                  Test Connection
                </Button>
              </div>

              {/* Gemini API Key */}
              <div>
                <Input
                  label="Google Gemini API Key"
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, gemini: e.target.value })
                  }
                  placeholder="Enter your Gemini API key"
                  helperText="Get API key from https://ai.google.dev/"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleValidateGeminiApi}
                  isLoading={isValidating}
                  className="mt-2"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Game Preferences */}
          <div className="glass-dark p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold mb-6">Game Preferences</h2>

            <div className="space-y-6">
              {/* Max Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Keywords: {preferences.maxKeywords}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={preferences.maxKeywords}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      maxKeywords: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Typing Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Typing Speed: {preferences.typingSpeed} chars/sec
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={preferences.typingSpeed}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      typingSpeed: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.enableImages}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        enableImages: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span className="text-gray-300">Enable AI-Generated Images</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.enableTypingEffect}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        enableTypingEffect: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span className="text-gray-300">Enable Typing Animation</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.autoAdvance}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        autoAdvance: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span className="text-gray-300">Auto-advance (don't wait for Enter key)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Cache Management */}
          <div className="glass-dark p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cache Management</h2>
            <p className="text-gray-400 mb-4">
              Movie data is cached in your browser's localStorage permanently.
              This saves API calls when you play the same movies again.
            </p>

            {/* Cache Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-400">
                  {movieService.getCacheStats().totalMovies}
                </div>
                <div className="text-sm text-gray-400">Cached Movies</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-400">
                  {movieService.getCacheStats().totalSizeKB} KB
                </div>
                <div className="text-sm text-gray-400">Storage Used</div>
              </div>
            </div>

            <Button
              variant="danger"
              onClick={() => {
                movieService.clearCache();
                showToast('Cache cleared successfully!', 'success');
                // Force re-render to update stats
                window.location.reload();
              }}
            >
              Clear All Cached Data
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button onClick={handleSave} size="lg">
              Save Settings
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
