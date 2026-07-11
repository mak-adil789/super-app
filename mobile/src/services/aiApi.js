import axios from 'axios';
import config from '../config/config';

const BACKEND_API_BASE = `${config.API_URL}/ai`;

export const sendChatMessage = async (token, history, message) => {
  try {
    const response = await axios.post(`${BACKEND_API_BASE}/chat`,
      { history, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.response;
  } catch (error) {
    console.error('Error in sendChatMessage:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const uploadTimetableImage = async (token, base64Image) => {
  try {
    const response = await axios.post(`${BACKEND_API_BASE}/ocr`,
      { image: base64Image },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error in uploadTimetableImage:', error.response?.data?.error || error.message);
    throw error;
  }
};
