import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import dayjs from 'dayjs';

const storage = new MMKV();

const mmkvStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

const useTasbeehStore = create(
  persist(
    (set, get) => ({
      count: 0,
      dailyTotal: 0,
      goal: 100,
      lastUpdate: dayjs().format('YYYY-MM-DD'),
      history: {}, // { 'YYYY-MM-DD': count }

      increment: () => {
        const today = dayjs().format('YYYY-MM-DD');
        const state = get();

        // Reset daily total if date changed
        let currentDailyTotal = state.lastUpdate === today ? state.dailyTotal : 0;

        const newCount = state.count + 1;
        const newDailyTotal = currentDailyTotal + 1;

        set({
          count: newCount,
          dailyTotal: newDailyTotal,
          lastUpdate: today,
          history: {
            ...state.history,
            [today]: newDailyTotal,
          },
        });
      },

      resetSession: () => set({ count: 0 }),

      setGoal: (newGoal) => set({ goal: newGoal }),

      checkDateChange: () => {
        const today = dayjs().format('YYYY-MM-DD');
        const state = get();
        if (state.lastUpdate !== today) {
          set({ dailyTotal: 0, lastUpdate: today });
        }
      },
    }),
    {
      name: 'tasbeeh-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

export default useTasbeehStore;
