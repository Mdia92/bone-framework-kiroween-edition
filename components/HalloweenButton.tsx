import { useState, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface SkullParticle {
  id: number;
  x: number;
  y: number;
}

interface HalloweenButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'exorcist' | 'ritual';
  className?: string;
}

export const HalloweenButton: React.FC<HalloweenButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  children,
  icon: Icon,
  variant = 'exorcist',
  className = '',
}) => {
  const [particles, setParticles] = useState<SkullParticle[]>([]);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Get click position relative to button
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Trigger ripple effect
      setRipple({ x, y });
      setTimeout(() => setRipple(null), 600);

      // Create multiple ghost particles (12 instead of 6)
      const newParticles: SkullParticle[] = [];
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: particleIdRef.current++,
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 80,
        });
      }
      setParticles(newParticles);

      // Remove particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 1000);
    }

    onClick();
  };

  const baseClasses = 'halloween-btn relative overflow-hidden font-bold uppercase tracking-wider transition-all duration-300';
  
  const variantClasses = {
    exorcist: 'halloween-btn-exorcist bg-exorcist-red text-white hover:bg-red-700',
    ritual: 'halloween-btn-ritual bg-ritual-teal text-white hover:bg-teal-800',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95';

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {/* Skeleton Hand Ripple Effect */}
      {ripple && (
        <span
          className="skeleton-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      )}

      {/* Ghost Particles */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="skull-particle"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        >
          👻
        </span>
      ))}

      {/* Hover Ghost Icon */}
      <span className="hover-skull">👻</span>

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {Icon && <Icon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />}
        {children}
      </span>
    </button>
  );
};
