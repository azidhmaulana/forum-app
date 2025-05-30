/**
 * Skenario pengujian LoginForm:
 * - should handle email typing correctly
 * - should handle password typing correctly
 * - should call login action when form is submitted
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import LoginForm from '../components/LoginForm';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { renderWithProvider } from '../../../utils/renderWithProvider';
import { act } from 'react';

vi.mock('../authAction', async (importActual) => {
  const actual = await importActual();

  const mockedLogin = vi.fn(() => () => Promise.resolve());

  mockedLogin.pending = actual.login.pending;
  mockedLogin.fulfilled = actual.login.fulfilled;
  mockedLogin.rejected = actual.login.rejected;

  return {
    ...actual,
    login: mockedLogin,
  };
});

import { login } from '../authAction';

describe('LoginForm Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { loading: false, error: null, token: null } },
    });
  });

  it('should handle email typing correctly', async () => {
    renderWithProvider(<LoginForm login={() => {}} />);
    const emailInput = await screen.getByPlaceholderText('email');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'emailtest' } });
    });

    expect(emailInput).toHaveValue('emailtest');
  });

  it('should handle password typing correctly', async () => {
    renderWithProvider(<LoginForm login={() => {}} />);
    const passwordInput = await screen.getByPlaceholderText('Password');

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'passwordtest' } });
    });
    expect(passwordInput).toHaveValue('passwordtest');
  });

  it('should call login action when form is submitted', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { name: 'email', value: 'emailtest@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { name: 'password', value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith({
      email: 'emailtest@example.com',
      password: 'password123',
    });
  });
});
