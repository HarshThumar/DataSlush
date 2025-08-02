import React from 'react';

const Logo = ({ className = "w-8 h-8", showText = true }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo SVG */}
      <div className="relative">
        <svg 
          viewBox="0 0 40 40" 
          className="w-8 h-8"
          fill="none"
        >
          {/* Dark Blue "D" */}
          <path
            d="M8 8h12c4 0 8 4 8 8s-4 8-8 8H8V8z"
            fill="#1e293b"
          />
          
          {/* Vibrant Orange "S" */}
          <path
            d="M12 12c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8z"
            fill="#F28D35"
          />
          
          {/* Teal Circles */}
          <circle cx="16" cy="14" r="2" fill="#0d9488" />
          <circle cx="16" cy="26" r="2" fill="#0d9488" />
        </svg>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <span className="text-xl font-bold text-gray-900">
          DataSlush
        </span>
      )}
    </div>
  );
};

export default Logo; 