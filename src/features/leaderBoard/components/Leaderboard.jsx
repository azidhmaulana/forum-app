import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboards } from '../leaderboardSlice';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">
        Klasmen Pengguna Aktif
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between px-2 text-gray-500 text-sm mb-2">
        <span>Pengguna</span>
        <span>Skor</span>
      </div>

      <ul className="space-y-2">
        {users.map((user, index) => {
          const initials = user.user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          const avatarColor = [
            'bg-green-400',
            'bg-blue-500',
            'bg-purple-600',
            'bg-red-500',
            'bg-cyan-500',
            'bg-yellow-300',
            'bg-teal-500',
            'bg-orange-500',
            'bg-indigo-600',
            'bg-violet-500',
          ][index % 10];

          return (
            <li
              key={user.user.id}
              className="flex justify-between items-center bg-white py-2 px-2 rounded border-b"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-sm ${avatarColor}`}
                >
                  {initials}
                </div>
                <span className="text-gray-800 text-sm font-medium">
                  {user.user.name}
                </span>
              </div>
              <span className="text-gray-800 font-semibold">{user.score}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
