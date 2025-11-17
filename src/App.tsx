import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/shared/Toast';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <AppRoutes />
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
