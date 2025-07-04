// HoverBox.tsx
import React from 'react';
import { Bg_color_Type_1, Font_color_Type_1} from '../store/ColorAdjustion';
interface HoverBoxProps {
  isDark: boolean;
  className?: string;
  children: React.ReactNode;
}

const TransitionDiv: React.FC<HoverBoxProps> = ({ isDark, className = '', children }) => {
  return (
    <div
      className={`
        ${Bg_color_Type_1(isDark)} ${Font_color_Type_1(isDark)}
        transition-colors duration-200 ease-in-out cursor-pointer
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default TransitionDiv;
