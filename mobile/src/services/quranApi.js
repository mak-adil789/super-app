import axios from 'axios';
import config from '../config/config';

const QURAN_API_BASE = config.QURAN_API_URL;
const BACKEND_API_BASE = `${config.API_URL}/quran`;

export const TRANSLATIONS = {
  english: '131', // Dr. Mustafa Khattab (The Clear Quran)
  urdu: '158',    // Maulana Fateh Muhammad Jalandhari
  hindi: '122',   // Suhel Farooq Khan and Saifur Rahman Nadwi
};

export const fetchChapters = async () => {
  const response = await axios.get(`${QURAN_API_BASE}/chapters?language=en`);
  return response.data.chapters;
};

export const fetchJuzList = async () => {
  const response = await axios.get(`${QURAN_API_BASE}/juzs`);
  return response.data.juzs;
};

export const fetchVerses = async (chapterId, page = 1, translationId = TRANSLATIONS.english) => {
  const response = await axios.get(`${QURAN_API_BASE}/verses/by_chapter/${chapterId}`, {
    params: {
      language: 'en',
      words: true,
      fields: 'text_uthmani',
      translations: translationId,
      per_page: 20,
      page: page
    }
  });
  return response.data;
};

export const fetchVersesByJuz = async (juzId, page = 1, translationId = TRANSLATIONS.english) => {
  const response = await axios.get(`${QURAN_API_BASE}/verses/by_juz/${juzId}`, {
    params: {
      language: 'en',
      words: true,
      fields: 'text_uthmani',
      translations: translationId,
      per_page: 20,
      page: page
    }
  });
  return response.data;
};

// Backend calls (require token)
export const getBackendBookmarks = async (token) => {
  const response = await axios.get(`${BACKEND_API_BASE}/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addBackendBookmark = async (token, surahId, verseId) => {
  const response = await axios.post(`${BACKEND_API_BASE}/bookmarks`,
    { surahId, verseId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteBackendBookmark = async (token, id) => {
  await axios.delete(`${BACKEND_API_BASE}/bookmarks/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateBackendProgress = async (token, lastSurah, lastVerse, percentage) => {
  const response = await axios.post(`${BACKEND_API_BASE}/progress`,
    { lastSurah, lastVerse, percentage },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getBackendProgress = async (token) => {
  const response = await axios.get(`${BACKEND_API_BASE}/progress`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
