import React, { createContext, useContext, useState, ReactNode } from "react";

type ThemeContextType = {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
};

const defaultValue: ThemeContextType = {
  colorScheme: "light",
  toggleColorScheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultValue);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
