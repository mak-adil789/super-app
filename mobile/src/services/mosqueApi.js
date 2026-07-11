import axios from 'axios';
import config from '../config/config';

const BACKEND_API_BASE = `${config.API_URL}/mosques`; // Adjust based on environment

export const fetchNearbyMosques = async (token, lat, lng, radius = 5000) => {
  try {
    const response = await axios.get(`${BACKEND_API_BASE}/nearby`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mosques from backend:', error.message);
    throw error;
  }
};
