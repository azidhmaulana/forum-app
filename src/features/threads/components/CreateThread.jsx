import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../threadActions';

const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return alert('Judul dan konten wajib diisi');

    try {
      await dispatch(createThread({ title, body, category, token })).unwrap();
      navigate('/');
    } catch (err) {
      alert(`Gagal membuat thread: ${err}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-xl font-bold mb-4">Buat Thread Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Judul"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Kategori (opsional)"
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          placeholder="Konten (HTML diperbolehkan)"
          className="border p-2 rounded h-40"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button type="submit" className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
          Buat Thread
        </button>
      </form>
    </div>
  );
};

export default CreateThread;
