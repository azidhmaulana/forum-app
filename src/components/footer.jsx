import React from 'react';
import { FiMessageCircle, FiLogOut } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Footer = (props) => {
  const { handleLogout } = props;

  return (
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
  );
};

Footer.propTypes = {
  handleLogout : PropTypes.func,
};

export default Footer;
