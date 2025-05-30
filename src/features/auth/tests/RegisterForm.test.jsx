/**
 * Skenario pengujian RegisterForm:
 * - should handle name typing correctly
 * - should handle email typing correctly
 * - should handle password typing correctly
 * - should call register action when form is submitted
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import RegisterForm from '../components/RegisterForm';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { act } from 'react';

vi.mock('../authAction', async (importActual) => {
  const actual = await importActual();

  const mockedRegister = vi.fn(
    () => () => Promise.resolve({ meta: { requestStatus: 'fulfilled' } })
  );

  mockedRegister.pending = actual.register?.pending;
  mockedRegister.fulfilled = actual.register?.fulfilled;
  mockedRegister.rejected = actual.register?.rejected;

  return {
    ...actual,
    register: mockedRegister,
  };
});

import { register } from '../authAction';

describe('RegisterForm Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { loading: false, error: null, token: null } },
    });
  });

  it('should handle name typing correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Name');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'nametest' } });
    });

    expect(nameInput).toHaveValue('nametest');
  });

  it('should handle email typing correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'emailtest@example.com' } });
    });

    expect(emailInput).toHaveValue('emailtest@example.com');
  });

  it('should handle password typing correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText('Password');

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call register action when form is submitted', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/name/i), {
        target: { name: 'name', value: 'Test User' },
      });

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { name: 'email', value: 'test@example.com' },
      });

      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { name: 'password', value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
