// import React, { createContext, useContext, useState, ReactNode } from "react";

// type ThemeContextType = {
//   colorScheme: "light" | "dark";
//   toggleColorScheme: () => void;
// };

// const defaultValue: ThemeContextType = {
//   colorScheme: "light",
//   toggleColorScheme: () => {},
// };

// const ThemeContext = createContext<ThemeContextType>(defaultValue);

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//   const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

//   const toggleColorScheme = () => {
//     setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSettingByUserId } from "@/lib/service/setting.service";

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

  useEffect(() => {
    const initTheme = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const setting = await getSettingByUserId(userId); // Gọi API lấy setting
        if (setting?.Theme === true) {
          setColorScheme("dark");
        } else {
          setColorScheme("light");
        }
      } catch (err) {
        console.error("⚠️ Lỗi lấy theme từ setting:", err);
      }
    };

    initTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
