/**
 * Skenario pengujian Thunk Auth:
 * - should dispatch fulfilled when login is successful
 * - should dispatch rejected when login fails
 * - should dispatch fulfilled when register is successful
 * - should dispatch rejected when register fails
 * - should skip fetchUserProfile if user exists
 * - should dispatch rejected when fetchUserProfile fails
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { login, register, fetchUserProfile } from '../authAction';
import * as authApi from '../services/authApi';

const fakeToken = 'fake_token';
const fakeUser = { id: 'user-1', name: 'Test User' };
const fakeResponse = { token: fakeToken, user: fakeUser };
const fakeError = new Error('Gagal');

describe('auth thunk actions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch fulfilled when login is successful', async () => {
    vi.spyOn(authApi, 'loginAPI').mockResolvedValue(fakeResponse);
    const dispatch = vi.fn();

    await login({ email: 'test@mail.com', password: '123456' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: login.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: login.fulfilled.type,
        payload: fakeResponse,
      })
    );
  });

  it('should dispatch rejected when login fails', async () => {
    vi.spyOn(authApi, 'loginAPI').mockRejectedValue(fakeError);
    const dispatch = vi.fn();

    await login({ email: 'test@mail.com', password: '123456' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: login.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: login.rejected.type,
        payload: 'Login failed',
      })
    );
  });

  it('should dispatch fulfilled when register is successful', async () => {
    vi.spyOn(authApi, 'registerAPI').mockResolvedValue({});
    const dispatch = vi.fn();

    await register({ name: 'Test', email: 'test@mail.com', password: '123456' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: register.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: register.fulfilled.type,
        payload: {},
      })
    );
  });

  it('should dispatch rejected when register fails', async () => {
    vi.spyOn(authApi, 'registerAPI').mockRejectedValue(fakeError);
    const dispatch = vi.fn();

    await register({ name: 'Test', email: 'test@mail.com', password: '123456' })(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: register.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: register.rejected.type,
        payload: 'Register failed',
      })
    );
  });

  it('should skip fetchUserProfile if user exists', async () => {
    const dispatch = vi.fn();
    const getState = () => ({ auth: { user: fakeUser, token: fakeToken } });

    const result = await fetchUserProfile()(dispatch, getState, undefined);

    expect(result.type).toBe('auth/fetchUserProfile/fulfilled');
    expect(result.payload).toBe(null);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/fetchUserProfile/pending' })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/fetchUserProfile/fulfilled', payload: null })
    );
  });

  it('should dispatch rejected when fetchUserProfile fails', async () => {
    const spy = vi.spyOn(authApi, 'fetchOwnProfile').mockRejectedValue(fakeError);

    const dispatch = vi.fn();
    const getState = () => ({ auth: { user: null, token: fakeToken } });

    await fetchUserProfile()(dispatch, getState);

    expect(spy).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchUserProfile.pending.type,
      })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchUserProfile.rejected.type,
        payload: fakeError.message,
      })
    );
  });
});
