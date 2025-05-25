import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import leaderboardReducer from '../features/leaderBoard/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    leaderboard : leaderboardReducer
  },
});
