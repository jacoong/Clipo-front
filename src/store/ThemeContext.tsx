import React, { createContext, useContext, useState, ReactNode,useEffect } from "react";
import { ThemeContextType } from "./types";
import { darkModeCheck } from "../Module/darkModeCheck";
// 1. ThemeContext의 타입 정의

// 2. 초기값 설정 (optional)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. 커스텀 훅 정의

// 4. ThemeProvider 컴포넌트 정의
interface ThemeProviderProps {
  children: ReactNode; // children의 타입을 ReactNode로 정의
}


export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    const value = !isDark;
    setIsDark(value);
    localStorage.setItem('isDarkMode', JSON.stringify(value));
  }


  useEffect(()=>{
    const isDarkMode = darkModeCheck();
    setIsDark(isDarkMode)
  },[])


  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};