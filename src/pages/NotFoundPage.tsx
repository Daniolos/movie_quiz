import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Button from '@/components/shared/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="text-9xl mb-6">🎞️</div>
          <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
          <p className="text-2xl text-gray-400 mb-8">
            This page doesn't exist in our movie database
          </p>
          <Link to="/">
            <Button size="lg">Go Back Home</Button>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}
