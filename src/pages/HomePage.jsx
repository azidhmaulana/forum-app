import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnProfile } from '../features/auth/services/authApi';
import { FiPlus } from 'react-icons/fi';
import ThreadList from '../features/threads/components/ThreadList';
import { fetchThreads } from '../features/threads/threadsSlice';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  useEffect(() => {
    const fetchThreadsData = async () => {
      const threads = await dispatch(fetchThreads()).unwrap();
      const categoryCount = {};
      threads.forEach((t) => {
        if (t.category in categoryCount) {
          categoryCount[t.category]++;
        } else {
          categoryCount[t.category] = 1;
        }
      });
      const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1]) // sort by count desc
        .slice(0, 5)
        .map(([cat]) => cat);
      setPopularCategories(topCategories);
    };
    fetchThreadsData();
  }, [dispatch]);

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

  }, [dispatch, token, user]);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Kategori populer</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {popularCategories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700"
            >
              #{cat}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-4">Diskusi tersedia</h2>
        <ThreadList />
      </main>

      <Link
        to="/create"
        className="fixed bottom-20 right-4 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
      >
        <FiPlus />
      </Link>
    </div>
  );
};

export default HomePage;
