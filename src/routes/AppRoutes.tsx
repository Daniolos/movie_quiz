import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import QuizPage from '@/pages/QuizPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { useSettingsStore } from '@/stores/settingsStore';

function AppRoutes() {
  const hasValidApiKeys = useSettingsStore((state) => state.hasValidApiKeys());

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/quiz"
        element={hasValidApiKeys ? <QuizPage /> : <Navigate to="/settings" />}
      />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
