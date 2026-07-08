import axios from 'axios';

const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const getNearbyMosques = async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  // Fallback mock data if API key is missing
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    console.warn('Google Maps API key is missing. Returning mock data.');
    const mockMosques = [
      {
        place_id: 'mock_1',
        name: 'Grand Central Mosque',
        vicinity: '123 Peace Ave, Faith City',
        rating: 4.8,
        geometry: {
          location: {
            lat: parseFloat(lat) + 0.005,
            lng: parseFloat(lng) + 0.005,
          },
        },
      },
      {
        place_id: 'mock_2',
        name: 'Neighborhood Masjid',
        vicinity: '456 Community Rd, Faith City',
        rating: 4.5,
        geometry: {
          location: {
            lat: parseFloat(lat) - 0.005,
            lng: parseFloat(lng) - 0.005,
          },
        },
      },
    ];
    return res.status(200).json(mockMosques);
  }

  try {
    const response = await axios.get(GOOGLE_PLACES_URL, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type: 'mosque',
        key: GOOGLE_API_KEY,
      },
    });

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error('Error fetching mosques from Google:', error.message);
    res.status(500).json({ error: 'Failed to fetch mosques' });
  }
};
