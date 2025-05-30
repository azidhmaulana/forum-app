import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const isLoading = useSelector((state) => state.threads.loading);
  const isLoadingLeaderBoard = useSelector((state) => state.leaderboard.loading);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    if (isLoading || isLoadingLeaderBoard) {
      setShowBar(true);
    } else {
      const timer = setTimeout(() => setShowBar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isLoadingLeaderBoard]);

  return (
    <nav>
      <header className="bg-gray-800 text-white p-4 shadow sticky top-0 z-50">
        <h1 className="text-xl font-semibold">FORUM APP</h1>
      </header>
      {showBar && (
        <div className="relative h-[6px] w-full overflow-hidden bg-gray-200">
          <div
            className={`absolute left-0 top-0 h-full bg-red-500 transition-all duration-700 ${
              isLoading || isLoadingLeaderBoard ? 'w-full' : 'w-0'
            }`}
          ></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
