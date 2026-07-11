import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export default {
  API_URL: extra.apiUrl || 'http://localhost:3000/api',
  HADITH_API_URL: extra.hadithApiUrl || 'https://hadithapi.com/api/hadiths',
  HADITH_API_KEY: extra.hadithApiKey || '',
  PRAYER_API_URL: extra.prayerApiUrl || 'https://api.aladhan.com/v1',
  QURAN_API_URL: extra.quranApiUrl || 'https://api.quran.com/api/v4',
};
