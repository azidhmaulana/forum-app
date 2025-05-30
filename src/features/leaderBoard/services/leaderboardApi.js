import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getLeaderboards = async () => {
  const response = await axios.get(`${API_BASE_URL}/leaderboards`);
  return response.data.data.leaderboards;
};
