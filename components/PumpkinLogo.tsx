import React from 'react';

interface PumpkinLogoProps {
  size?: number;
  className?: string;
}

export const PumpkinLogo: React.FC<PumpkinLogoProps> = ({ size = 48, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stem */}
      <path 
        d="M 30 8 Q 32 4 34 8 L 34 14 L 30 14 Z" 
        fill="#2d5016"
      />
      
      {/* Pumpkin Body - Main Circle */}
      <ellipse 
        cx="32" 
        cy="36" 
        rx="22" 
        ry="20" 
        fill="#ff6b1a"
      />
      
      {/* Pumpkin Ridges */}
      <ellipse 
        cx="20" 
        cy="36" 
        rx="6" 
        ry="18" 
        fill="#ff8533"
        opacity="0.7"
      />
      <ellipse 
        cx="32" 
        cy="36" 
        rx="6" 
        ry="20" 
        fill="#ff8533"
        opacity="0.7"
      />
      <ellipse 
        cx="44" 
        cy="36" 
        rx="6" 
        ry="18" 
        fill="#ff8533"
        opacity="0.7"
      />
      
      {/* Left Eye - Triangle */}
      <path 
        d="M 22 30 L 18 36 L 26 36 Z" 
        fill="#1a1a1a"
      />
      
      {/* Right Eye - Triangle */}
      <path 
        d="M 42 30 L 38 36 L 46 36 Z" 
        fill="#1a1a1a"
      />
      
      {/* Nose - Small Triangle */}
      <path 
        d="M 32 38 L 30 42 L 34 42 Z" 
        fill="#1a1a1a"
      />
      
      {/* Mouth - Jagged Smile */}
      <path 
        d="M 20 44 L 24 48 L 28 44 L 32 48 L 36 44 L 40 48 L 44 44" 
        stroke="#1a1a1a" 
        strokeWidth="2.5" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner Glow */}
      <ellipse 
        cx="32" 
        cy="36" 
        rx="18" 
        ry="16" 
        fill="url(#pumpkinGlow)"
        opacity="0.3"
      />
      
      <defs>
        <radialGradient id="pumpkinGlow">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#ff6b1a" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};
