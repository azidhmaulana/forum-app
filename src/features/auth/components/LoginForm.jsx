import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../authAction';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        id="email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="email"
        className="border px-3 py-2 w-full mb-3 rounded"
        required
      />
      <input
        id="password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="border px-3 py-2 w-full mb-3 rounded"
        required
      />
      <button
        data-testid="login-btn"
        type="submit"
        className="bg-gray-800 text-white px-4 py-2 w-full rounded"
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
      <p className="text-sm mt-4 text-center">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-600 underline">
          Daftar di sini.
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
