import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-xs cursor-pointer hover:text-gray-900"
    >
      <Icon className="text-lg" />
      {label}
    </button>
  );
};

Button.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
