import axios from 'axios';
import { API_BASE_URL } from '../../../constants';

export const loginAPI = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return res.data.data;
};

export const registerAPI = async ({ name, email, password }) => {
  const res = await axios.post(`${API_BASE_URL}/register`, {
    name,
    email,
    password,
  });
  return res.data.data;
};

export const fetchOwnProfile = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.user;
};