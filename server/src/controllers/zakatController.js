import axios from 'axios';
import { generateZakatPdf } from '../services/pdfGenerator.js';

const GOLD_API_URL = 'https://www.goldapi.io/api/XAU/USD';
const SILVER_API_URL = 'https://www.goldapi.io/api/XAG/USD';
const GOLD_API_KEY = process.env.GOLD_API_KEY;

export const getNisabPrices = async (req, res) => {
  // NISAB: 87.48g Gold or 612.36g Silver
  const NISAB_GOLD_G = 87.48;
  const NISAB_SILVER_G = 612.36;

  try {
    if (!GOLD_API_KEY || GOLD_API_KEY === 'YOUR_GOLD_API_KEY') {
      console.warn('Gold API key missing, using fallback prices');
      const fallbackGold = 65.0; // $65 per gram
      const fallbackSilver = 0.8; // $0.8 per gram
      return res.json({
        gold_per_g: fallbackGold,
        silver_per_g: fallbackSilver,
        nisab_gold: fallbackGold * NISAB_GOLD_G,
        nisab_silver: fallbackSilver * NISAB_SILVER_G,
        is_mock: true
      });
    }

    const [goldRes, silverRes] = await Promise.all([
      axios.get(GOLD_API_URL, { headers: { 'x-access-token': GOLD_API_KEY } }),
      axios.get(SILVER_API_URL, { headers: { 'x-access-token': GOLD_API_KEY } })
    ]);

    const goldPricePerG = goldRes.data.price_gram_24k;
    const silverPricePerG = silverRes.data.price_gram_24k;

    res.json({
      gold_per_g: goldPricePerG,
      silver_per_g: silverPricePerG,
      nisab_gold: goldPricePerG * NISAB_GOLD_G,
      nisab_silver: silverPricePerG * NISAB_SILVER_G,
      is_mock: false
    });
  } catch (error) {
    console.error('Error fetching metal prices:', error.message);
    res.status(500).json({ error: 'Failed to fetch Nisab values' });
  }
};

export const generateReport = async (req, res) => {
  const data = req.body;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=Zakat_Report.pdf');

  try {
    generateZakatPdf(data, res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating report');
  }
};
