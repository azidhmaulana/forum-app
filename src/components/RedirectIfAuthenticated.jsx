import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RedirectIfAuthenticated = ({ children }) =>{
  const { token } = useSelector((state) => state.auth);
  if (token) return <Navigate to="/" replace />;
  return children;
};

RedirectIfAuthenticated.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RedirectIfAuthenticated;