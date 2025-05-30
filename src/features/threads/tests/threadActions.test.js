/**
 * Skenario pengujian thread thunk:
 * - should dispatch fulfilled action with threads data when API call is successful
 * - should dispatch rejected action when API call fails'
 * - should dispatch fulfilled when API call is successful'
 * - should dispatch rejected when API call fails'
 */

import { describe, it, expect, vi } from 'vitest';
import { fetchThreads, postComment } from '../threadActions';
import * as api from '../services/threadsApi';

describe('fetchThreads async thunk', () => {
  it('should dispatch fulfilled action with threads data when API call is successful', async () => {
    const fakeThreads = [{ id: 'thread-1' }, { id: 'thread-2' }];
    vi.spyOn(api, 'getAllThreadsWithUser').mockResolvedValue(fakeThreads);

    const dispatch = vi.fn();
    const thunkAPI = { dispatch, rejectWithValue: vi.fn() };
    const result = await fetchThreads()(dispatch, thunkAPI, {});

    expect(result.type).toBe('threads/fetchThreads/fulfilled');
    expect(result.payload).toEqual(fakeThreads);
    expect(api.getAllThreadsWithUser).toHaveBeenCalled();
  });

  it('should dispatch rejected action when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.spyOn(api, 'getAllThreadsWithUser').mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const dispatch = vi.fn();
    const rejectWithValue = vi.fn().mockImplementation((msg) => msg);
    const thunkAPI = { dispatch, rejectWithValue };
    const result = await fetchThreads()(dispatch, thunkAPI, {});

    expect(result.type).toBe('threads/fetchThreads/rejected');
    expect(result.payload).toBe(errorMessage);
    expect(result.type).toBe('threads/fetchThreads/rejected');
    expect(result.payload).toBe(errorMessage);
  });

  it('should dispatch fulfilled when API call is successful', async () => {
    const fakeComment = { id: 'comment-1', content: 'Hello' };

    vi.spyOn(api, 'postComment').mockResolvedValue(fakeComment);

    const dispatch = vi.fn();
    const thunkAPI = { rejectWithValue: vi.fn() };

    const result = await postComment({
      threadId: 'thread-1',
      content: 'Hello',
      token: 'abc123',
    })(dispatch, thunkAPI, {});

    expect(result.type).toBe('threads/postComment/fulfilled');
    expect(result.payload).toEqual(fakeComment);
    expect(api.postComment).toHaveBeenCalledWith({
      threadId: 'thread-1',
      content: 'Hello',
      token: 'abc123',
    });
  });

  it('should dispatch rejected when API call fails', async () => {
    const errorMessage = 'Gagal mengirim komentar';

    vi.spyOn(api, 'postComment').mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const dispatch = vi.fn();
    const rejectWithValue = vi.fn().mockImplementation((msg) => msg);
    const thunkAPI = { rejectWithValue };

    const result = await postComment({
      threadId: 'thread-1',
      content: 'Hello',
      token: 'abc123',
    })(dispatch, thunkAPI, {});

    expect(result.type).toBe('threads/postComment/rejected');
    expect(result.payload).toBe(errorMessage);
    expect(result.type).toBe('threads/postComment/rejected');
    expect(result.payload).toBe(errorMessage);
  });
});
