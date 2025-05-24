import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const MainLayout = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <main className="p-4">
        <Outlet />
      </main>
      <Footer handleLogout={handleLogout}></Footer>
    </div>
  );
};

export default MainLayout;