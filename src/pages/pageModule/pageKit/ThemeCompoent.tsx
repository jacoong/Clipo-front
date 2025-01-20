import React, { ReactNode } from 'react';
import { useTheme } from '../../../customHook/useTheme';

interface ThemeComponentProps {
  children: ReactNode;
}

const ThemeComponent: React.FC<ThemeComponentProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  
  const DarkMode = isDark ? 'bg-customBlack text-customWhite' : 'bg-customWhite text-customBlack';

  return (
    <div className={`${DarkMode} font-medium`}>
      {children}
    </div>
  );
};

export default ThemeComponent;
