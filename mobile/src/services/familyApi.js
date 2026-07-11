import axios from 'axios';

const BACKEND_API_BASE = 'http://localhost:3000/api/family';

export const createFamily = async (token, name) => {
  const response = await axios.post(`${BACKEND_API_BASE}/create`, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const joinFamily = async (token, inviteCode) => {
  const response = await axios.post(`${BACKEND_API_BASE}/join`, { inviteCode }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchFamilyData = async (token) => {
  const response = await axios.get(`${BACKEND_API_BASE}/data`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const leaveFamily = async (token) => {
  const response = await axios.post(`${BACKEND_API_BASE}/leave`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
