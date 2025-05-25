import React from 'react';
import { FiMessageCircle, FiLogOut } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Footer = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 w-full bg-white border-t shadow-md py-2 px-4 flex justify-around">
      <Button
        icon={FiMessageCircle}
        label="Threads"
        onClick={() => navigate('/')}
      />
      <Button
        icon={FiLogOut}
        label="Leaderboards"
        onClick={() => navigate('/leaderboards')}
      />
      <Button
        icon={FiLogOut}
        label="Logout"
        onClick={handleLogout}
      />
    </footer>
  );
};

Footer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Footer;
