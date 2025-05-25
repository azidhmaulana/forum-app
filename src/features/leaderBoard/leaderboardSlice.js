import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLeaderboards } from './services/leaderboardApi';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboard/fetchLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboards = await getLeaderboards();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data leaderboard');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Terjadi kesalahan saat memuat leaderboard';
      });
  },
});

export default leaderboardSlice.reducer;
