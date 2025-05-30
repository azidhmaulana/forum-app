import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import leaderboardReducer from '../features/leaderBoard/leaderboardSlice';

export function renderWithProvider(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        threads: threadsReducer,
        leaderboard: leaderboardReducer,
      },
      preloadedState,
    }),
    route = '/',
  } = {}
) {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <Provider store={store}>{ui}</Provider>
      </MemoryRouter>
    ),
    store,
  };
}
