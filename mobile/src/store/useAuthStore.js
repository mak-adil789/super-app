import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase';

const API_URL = 'http://localhost:3000/api'; // Update with your server URL

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: (user, token) => set({ user, token, isLoading: false }),

  clearAuth: () => set({ user: null, token: null, isLoading: false }),

  syncWithBackend: async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.post(`${API_URL}/users/sync`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ user: response.data, token, isLoading: false });
    } catch (error) {
      console.error('Error syncing with backend:', error);
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
