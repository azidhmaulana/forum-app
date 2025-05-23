// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnProfile } from '../features/auth/services/authApi';
import { logout } from '../features/auth/authSlice';
import { FiThumbsUp, FiMessageCircle, FiPlus, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user && token) {
          const fetchedUser = await fetchOwnProfile(token);
          dispatch({ type: 'auth/login/fulfilled', payload: { token, user: fetchedUser } });
        }
      } catch (err) {
        console.error('Gagal memuat profil:', err);
        dispatch(logout());
      }
    };
    getProfile();

    // Simulasi data thread
    setThreads([
      {
        id: '1',
        category: 'redux',
        title: 'Bagaimana pengalamanmu belajar Redux?',
        body: 'Coba ceritakan dong, gimana pengalaman kalian belajar Redux di Dicoding?',
        createdAt: '721 hari lalu',
        ownerName: 'Dimas Saputra',
        upVotes: 1,
        downVotes: 0,
        comments: 1,
      },
      {
        id: '2',
        category: 'perkenalan',
        title: 'Halo! Selamat datang dan silakan perkenalkan diri kamu',
        body: 'Bagaimana kabarmu? Semoga baik-baik saja ya...',
        createdAt: '721 hari lalu',
        ownerName: 'Dicoding',
        upVotes: 1,
        downVotes: 0,
        comments: 1,
      },
    ]);
  }, [dispatch, token, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Kategori populer</h2>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700">#redux</span>
          <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700">#perkenalan</span>
        </div>

        <h2 className="text-lg font-semibold mb-4">Diskusi tersedia</h2>
        {threads.map((thread) => (
          <div key={thread.id} className="border-t pt-4 pb-6 mb-6">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              #{thread.category}
            </span>
            <h3 className="text-blue-700 font-semibold mt-1 text-lg cursor-pointer">
              {thread.title}
            </h3>
            <p className="text-sm text-gray-800 mt-1 line-clamp-2">{thread.body}</p>
            <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <FiThumbsUp /> {thread.upVotes}
              </div>
              <div className="flex items-center gap-1">
                <FiMessageCircle /> {thread.comments}
              </div>
              <span>{thread.createdAt}</span>
              <span>
                Dibuat oleh <strong>{thread.ownerName}</strong>
              </span>
            </div>
          </div>
        ))}
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t shadow-md py-2 px-4 flex justify-around">
        <button className="flex flex-col items-center text-xs">
          <FiMessageCircle className="text-lg" />
          Threads
        </button>
        <button className="flex flex-col items-center text-xs">
          <FiLogOut className="text-lg" />
          Leaderboards
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center text-xs cursor-pointer hover:text-gray-900">
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </footer>

      <button className="fixed bottom-20 right-4 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
        <FiPlus />
      </button>
    </div>
  );
};

export default HomePage;
