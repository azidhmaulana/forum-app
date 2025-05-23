import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navBar';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="min-h-screen w-full bg-gray-100">
        <Navbar />
        <main className="flex justify-center w-full items-center py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;