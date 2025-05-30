/**
 * Skenario pengujian leaderboardReducer:
 * - should handle fetchLeaderboards.pending
 * - should handle fetchLeaderboards.fulfilled
 * - should handle fetchLeaderboards.rejected'
 */

import { describe, it, expect } from 'vitest';
import leaderboardReducer from '../leaderboardSlice';
import { fetchLeaderboards } from '../leaderboardAction'; // <--- ubah import thunk dari file aksi

describe('leaderboardReducer', () => {
  const initialState = {
    users: [],
    loading: false,
    error: null,
  };

  it('should handle fetchLeaderboards.pending', () => {
    const action = { type: fetchLeaderboards.pending.type };

    const nextState = leaderboardReducer(initialState, action);

    expect(nextState).toEqual({
      users: [],
      loading: true,
      error: null,
    });
  });

  it('should handle fetchLeaderboards.fulfilled', () => {
    const mockUsers = [{ id: 1, name: 'User A' }];
    const action = {
      type: fetchLeaderboards.fulfilled.type,
      payload: mockUsers,
    };

    const nextState = leaderboardReducer(initialState, action);

    expect(nextState).toEqual({
      users: mockUsers,
      loading: false,
      error: null,
    });
  });

  it('should handle fetchLeaderboards.rejected', () => {
    const errorMessage = 'Gagal mengambil data leaderboard';
    const action = {
      type: fetchLeaderboards.rejected.type,
      payload: errorMessage,
    };

    const nextState = leaderboardReducer(initialState, action);

    expect(nextState).toEqual({
      users: [],
      loading: false,
      error: errorMessage,
    });
  });
});
