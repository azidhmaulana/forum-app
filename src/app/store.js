import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import leaderboardReducer from '../features/leaderBoard/leaderboardSlice';
import { loadingBarMiddleware, loadingBarReducer } from 'react-redux-loading-bar';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    leaderboard : leaderboardReducer,
    loadingBar : loadingBarReducer
  },
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loadingBarMiddleware())
});
