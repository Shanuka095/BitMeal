import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Default to 'light' or check localStorage
  const [theme, setTheme] = useState(localStorage.getItem('bitmeal_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('bitmeal_theme', theme);
    
    // Apply theme classes to the body with a smooth transition
    // NEW: Added 'transition-colors duration-500 ease-in-out'
    document.body.className = `transition-colors duration-500 ease-in-out ${
      theme === 'dark' ? 'bg-[#111] text-white' : 'bg-[#f8f9fa] text-gray-900'
    }`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};