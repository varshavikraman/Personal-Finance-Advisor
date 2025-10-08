import React from 'react';

const SavingsIcon = ({ width = "40", height = "40", color = "currentColor" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3h-2z" />
      <path d="M19 10H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z" />
      <path d="M7 15h.01" />
    </svg>
  );
};

export default SavingsIcon;