// HoverBox.tsx
import React from 'react';

interface HoverBoxProps {
  isDark: boolean;
  className?: string;
  children: React.ReactNode;
}

const TransitionDiv: React.FC<HoverBoxProps> = ({ isDark, className = '', children }) => {
  return (
    <div
      className={`
        ${isDark 
          ? 'bg-customLightBlack hover:bg-hovercustomBlack text-white'
          : 'bg-white hover:bg-gray-100 active:bg-gray-200 text-black'}
        transition-colors duration-200 ease-in-out cursor-pointer
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default TransitionDiv;
