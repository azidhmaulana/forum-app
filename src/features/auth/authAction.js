import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, fetchOwnProfile } from './services/authApi';

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    return await loginAPI(username, password);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      return await registerAPI({ name, email, password });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Register failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    const { token, user } = getState().auth;
    if (user || !token) return null;

    try {
      const fetchedUser = await fetchOwnProfile(token);
      return fetchedUser;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
