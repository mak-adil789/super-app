import axios from 'axios';
import config from '../config/config';

const HADITH_API_BASE = config.HADITH_API_URL;
const API_KEY = config.HADITH_API_KEY;

export const fetchDailyHadith = async () => {
  try {
    const response = await axios.get(HADITH_API_BASE, {
      params: {
        apiKey: API_KEY,
        paginate: 1,
        page: Math.floor(Math.random() * 100) + 1
      }
    });

    if (response.data && response.data.hadiths && response.data.hadiths.data.length > 0) {
      const hadith = response.data.hadiths.data[0];
      return {
        text: hadith.hadithEnglish,
        arabic: hadith.hadithArabic,
        narrator: hadith.englishNarrator,
        book: hadith.book.bookName
      };
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Hadith API failed, using fallback:', error.message);
    return {
      text: "The best among you are those who have the best manners and character.",
      arabic: "خياركم أحاسنكم أخلاقا",
      narrator: "Abdullah ibn Amr",
      book: "Sahih Bukhari"
    };
  }
};
