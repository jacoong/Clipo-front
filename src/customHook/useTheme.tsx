import { useContext } from 'react';
import {ThemeContextType} from '../store/types';
import { ThemeContext } from '../store/ThemeContext';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};


export const useDarkModeCheck = () => {
  const { isDark } = useTheme();

  const darkModeCheck = () => {
      const savedMode = localStorage.getItem('isDarkMode');

      if (savedMode === null) {
          localStorage.setItem('isDarkMode', JSON.stringify(isDark));
          return false; // 기본값으로 다크 모드를 활성화합니다.
      }
      return JSON.parse(savedMode);
  };

  return darkModeCheck();
};
