import axios from 'axios';

const HADITH_API_BASE = 'https://hadithapi.com/api/hadiths';
const API_KEY = '$2y$10$UaJt1Kly16i7kK1rJ0ZfduJb8nZ8xN6MhXyG0JcKzL3tO7Qy';

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
