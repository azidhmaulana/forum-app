import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import ProtectedRoute from './components/ProtectedRoute';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/create" element={<CreateThreadPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <RegisterPage />
              </RedirectIfAuthenticated>
            }
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
