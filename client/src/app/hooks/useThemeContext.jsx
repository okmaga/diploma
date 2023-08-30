import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import localStorageService from "../services/localStorage.service";
const ThemeContext = React.createContext();

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
const ThemeContextProvider = ({ children }) => {
  const currentMode = localStorageService.getMode();
  console.log(currentMode);
  const [mode, setMode] = useState(currentMode ?? "light");

  const toggleMode = () => {
    setMode(prev => prev === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const savedMode = localStorageService.getMode();
    localStorageService.saveMode(savedMode === "dark" ? "light" : "dark");
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }} >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
export default ThemeContextProvider;
