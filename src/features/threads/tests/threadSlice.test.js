/**
 * Skenario pengujian threadsReducer:
 * - should return initial state when given an unknown action
 * - should handle fetchThreads.pending correctly
 * - should handle fetchThreads.fulfilled correctly
 * - should handle createThread.fulfilled by unshifting new thread
 * - should add comment to detail when postComment.fulfilled
 * - should handle voteUpThread.pending (optimistic update)
 */

import { describe, it, expect } from 'vitest';
import threadsReducer from '../threadsSlice';
import { fetchThreads, createThread, postComment, voteUpThread } from '../threadActions';

describe('threadsSlice reducer', () => {
  it('should return initial state when given an unknown action', () => {
    const initialState = {
      items: [],
      detail: null,
      loading: false,
      error: null,
    };
    const nextState = threadsReducer(initialState, { type: 'UNKNOWN' });
    expect(nextState).toEqual(initialState);
  });

  it('should handle fetchThreads.pending correctly', () => {
    const prevState = {
      items: [],
      detail: null,
      loading: false,
      error: 'Some error',
    };
    const action = { type: fetchThreads.pending.type };
    const nextState = threadsReducer(prevState, action);
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should handle fetchThreads.fulfilled correctly', () => {
    const prevState = {
      items: [],
      detail: null,
      loading: true,
      error: null,
    };
    const threads = [{ id: 'thread-1' }, { id: 'thread-2' }];
    const action = {
      type: fetchThreads.fulfilled.type,
      payload: threads,
    };
    const nextState = threadsReducer(prevState, action);
    expect(nextState.items).toEqual(threads);
    expect(nextState.loading).toBe(false);
  });

  it('should handle createThread.fulfilled by unshifting new thread', () => {
    const prevState = {
      items: [{ id: 'thread-1' }],
      detail: null,
      loading: false,
      error: null,
    };
    const newThread = { id: 'thread-2' };
    const action = { type: createThread.fulfilled.type, payload: newThread };
    const nextState = threadsReducer(prevState, action);
    expect(nextState.items[0]).toEqual(newThread);
  });

  it('should add comment to detail when postComment.fulfilled', () => {
    const prevState = {
      items: [],
      detail: {
        id: 'thread-1',
        comments: [],
      },
      loading: false,
      error: null,
    };
    const newComment = { id: 'comment-1', content: 'Hello' };
    const action = { type: postComment.fulfilled.type, payload: newComment };
    const nextState = threadsReducer(prevState, action);
    expect(nextState.detail.comments).toContainEqual(newComment);
  });

  it('should handle voteUpThread.pending (optimistic update)', () => {
    const prevState = {
      items: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: ['user-1'],
        },
      ],
      detail: {
        id: 'thread-1',
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
      loading: false,
      error: null,
    };

    const action = {
      type: voteUpThread.pending.type,
      meta: {
        arg: { id: 'thread-1', userId: 'user-1' },
      },
    };

    const nextState = threadsReducer(prevState, action);
    expect(nextState.items[0].upVotesBy).toContain('user-1');
    expect(nextState.items[0].downVotesBy).not.toContain('user-1');
    expect(nextState.detail.upVotesBy).toContain('user-1');
    expect(nextState.detail.downVotesBy).not.toContain('user-1');
  });
});
