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

const getHijriMonth = (date = new Date()) => {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      month: 'numeric',
    }).formatToParts(date);
    const month = parts.find((p) => p.type === 'month').value;
    return parseInt(month);
  } catch (error) {
    console.warn('Intl Hijri calculation not supported, defaulting to 1:', error);
    return 1;
  }
};

const useRamadanStore = create(
  persist(
    (set, get) => ({
      isRamadanMode: false,
      forceRamadanMode: false,
      checklists: {},

      toggleForceMode: () => {
        const newVal = !get().forceRamadanMode;
        set({ forceRamadanMode: newVal });
        get().checkRamadanStatus();
      },

      checkRamadanStatus: () => {
        const month = getHijriMonth();
        const isRamadan = month === 9 || get().forceRamadanMode;
        set({ isRamadanMode: isRamadan });
      },

      updateChecklist: (key, value) => {
        const today = dayjs().format('YYYY-MM-DD');
        const state = get();
        const currentDayData = state.checklists[today] || {
          taraweeh: false,
          charity: false,
          quran: 0,
          prayers: [false, false, false, false, false]
        };

        set({
          checklists: {
            ...state.checklists,
            [today]: { ...currentDayData, [key]: value }
          }
        });
      },

      togglePrayer: (index) => {
        const today = dayjs().format('YYYY-MM-DD');
        const state = get();
        const currentDayData = state.checklists[today] || {
          taraweeh: false,
          charity: false,
          quran: 0,
          prayers: [false, false, false, false, false]
        };

        const newPrayers = [...currentDayData.prayers];
        newPrayers[index] = !newPrayers[index];

        set({
          checklists: {
            ...state.checklists,
            [today]: { ...currentDayData, prayers: newPrayers }
          }
        });
      }
    }),
    {
      name: 'ramadan-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

export default useRamadanStore;
