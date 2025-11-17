import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';

export default function Toast() {
  const { toast, hideToast } = useUIStore();

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600',
  };

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={`${colors[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}
          >
            <span className="text-2xl">{icons[toast.type]}</span>
            <p className="flex-1">{toast.message}</p>
            <button
              onClick={hideToast}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
