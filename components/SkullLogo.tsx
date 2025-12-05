import React from 'react';

interface SkullLogoProps {
  size?: number;
  className?: string;
}

export const SkullLogo: React.FC<SkullLogoProps> = ({ size = 48, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Skull Circle */}
      <circle 
        cx="32" 
        cy="28" 
        r="18" 
        fill="currentColor" 
        opacity="0.95"
      />
      
      {/* Left Eye Socket */}
      <ellipse 
        cx="26" 
        cy="26" 
        rx="4" 
        ry="5" 
        fill="#0a0a0a"
      />
      
      {/* Right Eye Socket */}
      <ellipse 
        cx="38" 
        cy="26" 
        rx="4" 
        ry="5" 
        fill="#0a0a0a"
      />
      
      {/* Nasal Cavity */}
      <path 
        d="M 30 32 L 32 35 L 34 32 Z" 
        fill="#0a0a0a"
      />
      
      {/* Jaw Line */}
      <path 
        d="M 20 38 Q 22 42 26 44 L 26 48 L 30 48 L 30 44 L 34 44 L 34 48 L 38 48 L 38 44 Q 42 42 44 38" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Teeth */}
      <line x1="26" y1="44" x2="26" y2="48" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="30" y1="44" x2="30" y2="48" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="34" y1="44" x2="34" y2="48" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="38" y1="44" x2="38" y2="48" stroke="#0a0a0a" strokeWidth="1.5" />
    </svg>
  );
};
