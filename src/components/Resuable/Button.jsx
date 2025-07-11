import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, bgColor = 'bg-blue-600', textColor = 'text-white', children }) => {
  const baseClasses = `py-2 px-4 rounded ${bgColor} ${textColor} transition duration-300`;

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} inline-block`}>
        {children}
      </Link>
    );
  } else {
    return (
      <button className={baseClasses}>
        {children}
      </button>
    );
  }
};

export default Button;
