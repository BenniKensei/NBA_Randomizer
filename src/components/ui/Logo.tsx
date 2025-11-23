import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <Image
      src="/logo.png"
      alt="NBA Randomizer Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
};
