import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import ThreadList from '../features/threads/components/ThreadList';
import { fetchThreads } from '../features/threads/threadsSlice';
import { Link } from 'react-router-dom';
import { fetchUserProfile } from '../features/auth/authSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const [popularCategories, setPopularCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  const { items: threads } = useSelector((state) => state.threads);
  const filteredThreads = selectedCategory
    ? threads.filter((t) => t.category === selectedCategory)
    : threads;

  useEffect(() => {
    dispatch(fetchThreads()).unwrap().then((threads) => {
      const categoryCount = {};
      threads.forEach((t) => {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
      });
      const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat]) => cat);
      setPopularCategories(topCategories);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <main className="max-w-2xl mx-auto px-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Kategori populer</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {popularCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-2 py-1 text-sm rounded cursor-pointer hover:text-white-900 ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
              }`}
            >
              #{cat}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-4">Diskusi tersedia</h2>
        <ThreadList threads={filteredThreads} />
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
