// src/theme/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Use system preference or user preference
  const getInitial = () =>
    localStorage.getItem("app-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [theme, setTheme] = useState(getInitial());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
