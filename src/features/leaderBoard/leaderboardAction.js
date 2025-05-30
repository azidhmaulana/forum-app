import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLeaderboards } from './services/leaderboardApi';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboard/fetchLeaderboards',
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(showLoading());
    try {
      const leaderboards = await getLeaderboards();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data leaderboard');
    } finally {
      dispatch(hideLoading());
    }
  }
);
