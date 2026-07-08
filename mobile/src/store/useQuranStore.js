import { create } from 'zustand';
import * as quranApi from '../services/quranApi';

const useQuranStore = create((set, get) => ({
  chapters: [],
  bookmarks: [],
  progress: null,
  isLoading: false,

  fetchChapters: async () => {
    set({ isLoading: true });
    try {
      const chapters = await quranApi.fetchChapters();
      set({ chapters, isLoading: false });
    } catch (error) {
      console.error('Error fetching chapters:', error);
      set({ isLoading: false });
    }
  },

  syncUserData: async (token) => {
    if (!token) return;
    try {
      const [bookmarks, progress] = await Promise.all([
        quranApi.getBackendBookmarks(token),
        quranApi.getBackendProgress(token),
      ]);
      set({ bookmarks, progress });
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  },

  toggleBookmark: async (token, surahId, verseId) => {
    if (!token) return;
    const { bookmarks } = get();
    const existing = bookmarks.find(b => b.surahId === surahId && b.verseId === verseId);

    try {
      if (existing) {
        await quranApi.deleteBackendBookmark(token, existing.id);
        set({ bookmarks: bookmarks.filter(b => b.id !== existing.id) });
      } else {
        const newBookmark = await quranApi.addBackendBookmark(token, surahId, verseId);
        set({ bookmarks: [newBookmark, ...bookmarks] });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  },

  updateProgress: async (token, lastSurah, lastVerse, totalVerses) => {
    if (!token) return;
    const percentage = (lastVerse / totalVerses) * 100;
    try {
      const progress = await quranApi.updateBackendProgress(token, lastSurah, lastVerse, percentage);
      set({ progress });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }
}));

export default useQuranStore;
