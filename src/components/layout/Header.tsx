import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-dark border-b border-white/10"
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🎬</div>
            <h1 className="text-2xl font-bold gradient-text">Movie Quiz</h1>
          </Link>

          <nav className="flex space-x-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/')
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className={`transition-colors ${
                isActive('/quiz')
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Quiz
            </Link>
            <Link
              to="/settings"
              className={`transition-colors ${
                isActive('/settings')
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
