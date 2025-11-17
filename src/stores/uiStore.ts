import { create } from 'zustand';

interface UIStore {
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  };

  // Actions
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
  clearError: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  loadingMessage: '',
  error: null,
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },

  setLoading: (loading, message = 'Loading...') => {
    set({ isLoading: loading, loadingMessage: message });
  },

  setError: (error) => {
    set({ error });
  },

  showToast: (message, type = 'info') => {
    set({
      toast: {
        message,
        type,
        visible: true,
      },
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toast: { ...state.toast, visible: false },
      }));
    }, 3000);
  },

  hideToast: () => {
    set((state) => ({
      toast: { ...state.toast, visible: false },
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
