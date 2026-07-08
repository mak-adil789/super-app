import axios from 'axios';
import { cacheDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';

const BACKEND_API_BASE = 'http://localhost:3000/api/zakat';

export const fetchNisabPrices = async (token) => {
  const response = await axios.get(`${BACKEND_API_BASE}/nisab`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const downloadZakatReport = async (token, data) => {
  const fileUri = `${cacheDirectory}Zakat_Report.pdf`;

  try {
    const response = await axios.post(`${BACKEND_API_BASE}/generate-report`, data, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer'
    });

    const base64 = Buffer.from(response.data).toString('base64');

    await writeAsStringAsync(fileUri, base64, {
      encoding: EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};
