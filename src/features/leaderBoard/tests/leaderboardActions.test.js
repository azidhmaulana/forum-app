/**
 * Skenario pengujian Thunk LeaderBoard:
 * - should dispatch correct actions when fetch is successful
 * - should dispatch correct actions and error when fetch fails
 */

import { describe, it, vi, expect, afterEach } from 'vitest';
import { fetchLeaderboards } from '../leaderboardAction';
import * as leaderboardApi from '../services/leaderboardApi';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

const fakeLeaderboards = [{ user: { id: 'user-1', name: 'User 1' }, score: 100 }];
const fakeError = new Error('Gagal ambil data leaderboard');

describe('fetchLeaderboards thunk', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch correct actions when fetch is successful', async () => {
    vi.spyOn(leaderboardApi, 'getLeaderboards').mockResolvedValue(fakeLeaderboards);
    const dispatch = vi.fn();

    await fetchLeaderboards()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchLeaderboards.fulfilled.type,
        payload: fakeLeaderboards,
      })
    );
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should dispatch correct actions and error when fetch fails', async () => {
    vi.spyOn(leaderboardApi, 'getLeaderboards').mockRejectedValue(fakeError);
    const dispatch = vi.fn();

    await fetchLeaderboards()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchLeaderboards.rejected.type,
        payload: 'Gagal mengambil data leaderboard',
      })
    );
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });
});
