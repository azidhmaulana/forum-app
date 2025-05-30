/**
 * Skenario pengujian authReducer:
 * - should handle login.fulfilled
 * - should handle login.rejected
 * - should handle register.rejected
 * - should handle fetchUserProfile.fulfilled with user
 * - should handle logout
 */

import { describe, it, expect } from 'vitest';
import authReducer, { logout } from '../authSlice';
import { login, register, fetchUserProfile } from '../authAction';

describe('authReducer', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  it('should handle login.fulfilled', () => {
    const payload = { token: 'abc123', user: { id: 'u1', name: 'Test' } };
    const action = { type: login.fulfilled.type, payload };

    const nextState = authReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      token: payload.token,
      user: payload.user,
      loading: false,
    });
  });

  it('should handle login.rejected', () => {
    const action = { type: login.rejected.type, payload: 'Invalid' };

    const nextState = authReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      error: 'Invalid',
      loading: false,
    });
  });

  it('should handle register.rejected', () => {
    const action = { type: register.rejected.type, payload: 'Failed' };

    const nextState = authReducer(initialState, action);

    expect(nextState.error).toBe('Failed');
  });

  it('should handle fetchUserProfile.fulfilled with user', () => {
    const action = {
      type: fetchUserProfile.fulfilled.type,
      payload: { id: 'u1', name: 'Fetched' },
    };

    const nextState = authReducer(initialState, action);

    expect(nextState.user).toEqual(action.payload);
  });

  it('should handle logout', () => {
    const action = logout();

    const prevState = {
      ...initialState,
      user: { id: 'u1', name: 'Test' },
      token: 'abc123',
    };

    const nextState = authReducer(prevState, action);

    expect(nextState.user).toBe(null);
    expect(nextState.token).toBe(null);
  });
});
