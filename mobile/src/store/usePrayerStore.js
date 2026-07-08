import { create } from 'zustand';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { fetchMonthlyPrayerTimes } from '../services/prayerApi';
import { getPrayerTimes, savePrayerTimes, initDb } from '../utils/sqliteDb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Initialize DB
initDb();

const usePrayerStore = create((set, get) => ({
  prayerTimes: null,
  nextPrayer: null,
  calculationMethod: CalculationMethod.MuslimWorldLeague(),
  isLoading: false,
  error: null,

  setMethod: (method) => set({ calculationMethod: method }),

  updatePrayerTimes: async (latitude, longitude) => {
    set({ isLoading: true, error: null });
    const date = new Date();
    const dateKey = dayjs(date).format('YYYY-MM');

    try {
      // 1. Check SQLite for current month
      let monthData = getPrayerTimes(dateKey);

      if (!monthData) {
        // 2. Fetch from API if not in SQLite
        monthData = await fetchMonthlyPrayerTimes(latitude, longitude);
        savePrayerTimes(dateKey, monthData);
      }

      // 3. Get today's times from month data
      const todayStr = dayjs(date).format('DD-MM-YYYY');
      const todayData = monthData.find(d => d.date.gregorian.date === todayStr);

      if (todayData) {
        set({ prayerTimes: todayData.timings, isLoading: false });
        get().calculateNextPrayer();
      } else {
        throw new Error('Could not find prayer times for today');
      }
    } catch (error) {
      console.error('Error updating prayer times:', error);

      // 4. Fallback to local calculation using 'adhan' library
      const coords = new Coordinates(latitude, longitude);
      const adhanTimes = new PrayerTimes(coords, date, get().calculationMethod);

      const formattedTimes = {
        Fajr: dayjs(adhanTimes.fajr).format('HH:mm'),
        Sunrise: dayjs(adhanTimes.sunrise).format('HH:mm'),
        Dhuhr: dayjs(adhanTimes.dhuhr).format('HH:mm'),
        Asr: dayjs(adhanTimes.asr).format('HH:mm'),
        Maghrib: dayjs(adhanTimes.maghrib).format('HH:mm'),
        Isha: dayjs(adhanTimes.isha).format('HH:mm'),
      };

      set({ prayerTimes: formattedTimes, isLoading: false, error: 'Using offline calculation' });
      get().calculateNextPrayer();
    }
  },

  calculateNextPrayer: () => {
    const { prayerTimes } = get();
    if (!prayerTimes) return;

    const now = dayjs();
    const times = Object.entries(prayerTimes)
      .filter(([name]) => name !== 'Sunrise')
      .map(([name, time]) => ({
        name,
        time: dayjs(`${now.format('YYYY-MM-DD')} ${time}`),
      }))
      .sort((a, b) => a.time.diff(b.time));

    let next = times.find(t => t.time.isAfter(now));

    if (!next) {
      // If all prayers passed, next is Fajr tomorrow
      next = { ...times[0], time: times[0].time.add(1, 'day') };
    }

    set({ nextPrayer: next });
  }
}));

export default usePrayerStore;
