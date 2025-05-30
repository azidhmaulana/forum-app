/**
 * Skenario pengujian LeaderBoard:
 * - should call fetchLeaderboards on mount
 * - should render leaderboard items
 * - should display error message when error exists'
 * - should call register action when form is submitted
 */

import React from 'react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from '../leaderboardSlice';
import Leaderboard from '../components/Leaderboard';
import { MemoryRouter } from 'react-router-dom';
import * as leaderboardAction from '../leaderboardAction';

vi.mock('../leaderboardAction', async (importActual) => {
  const actual = await importActual();

  const mockedFetch = vi.fn(() => () => Promise.resolve());

  mockedFetch.pending = { type: 'leaderboard/fetchLeaderboards/pending' };
  mockedFetch.fulfilled = { type: 'leaderboard/fetchLeaderboards/fulfilled' };
  mockedFetch.rejected = { type: 'leaderboard/fetchLeaderboards/rejected' };

  return {
    ...actual,
    fetchLeaderboards: mockedFetch,
  };
});

describe('Leaderboard Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        leaderboard: leaderboardReducer,
      },
      preloadedState: {
        leaderboard: {
          users: [
            {
              user: { id: 'user-1', name: 'Alice' },
              score: 120,
            },
            {
              user: { id: 'user-2', name: 'Bob' },
              score: 95,
            },
          ],
          error: null,
          loading: false,
        },
      },
    });
  });

  it('should call fetchLeaderboards on mount', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Leaderboard />
        </MemoryRouter>
      </Provider>
    );

    expect(leaderboardAction.fetchLeaderboards).toHaveBeenCalledTimes(1);
  });

  it('should render leaderboard items', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Leaderboard />
        </MemoryRouter>
      </Provider>
    );

    const items = screen.getAllByTestId('leaderboard-item');
    expect(items.length).toBe(2);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should display error message when error exists', () => {
    const errorStore = configureStore({
      reducer: {
        leaderboard: leaderboardReducer,
      },
      preloadedState: {
        leaderboard: {
          users: [],
          error: 'Gagal memuat data',
          loading: false,
        },
      },
    });

    render(
      <Provider store={errorStore}>
        <MemoryRouter>
          <Leaderboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Gagal memuat data')).toBeInTheDocument();
  });
});
