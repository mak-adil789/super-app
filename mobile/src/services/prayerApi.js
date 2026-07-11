import axios from 'axios';
import config from '../config/config';

const ALADHAN_API_BASE = config.PRAYER_API_URL;

export const fetchMonthlyPrayerTimes = async (latitude, longitude, method = 2) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const response = await axios.get(`${ALADHAN_API_BASE}/calendar/${year}/${month}`, {
      params: {
        latitude,
        longitude,
        method,
      },
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    throw new Error('Failed to fetch prayer times from AlAdhan API');
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};
