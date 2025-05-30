import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../authAction';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border px-3 py-2 w-full mb-3 rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border px-3 py-2 w-full mb-3 rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border px-3 py-2 w-full mb-3 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 w-full rounded"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
      <p className="text-sm mt-4 text-center">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Masuk di sini.
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
