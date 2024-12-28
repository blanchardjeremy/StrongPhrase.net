import React, { useState } from 'react';
import { FaSyncAlt } from "react-icons/fa";

const SpinButton = ({ onClick, className = "", children }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-primary text-base md:text-xl text-white ${className}`}
    >
      <FaSyncAlt className={`inline-block transition-transform ${isSpinning ? 'animate-spin' : ''}`} /> {children}
    </button>
  );
};

export default SpinButton; 