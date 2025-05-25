import axios from 'axios';
import { API_BASE_URL } from '../../../constants';

export const getLeaderboards = async () => {
  const response = await axios.get(`${API_BASE_URL}/leaderboards`);
  return response.data.data.leaderboards;
};
