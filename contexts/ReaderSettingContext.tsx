// context/ReaderSettingsContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "light" | "dark";
export type FontType = "JosefinSans" | "Montserrat" | "Roboto" | "RobotoMono";

interface ReaderSettings {
  theme: ThemeType;
  font: FontType;
  fontSize: number;
}

interface ReaderSettingsContextType {
  settings: ReaderSettings;
  updateTheme: (theme: ThemeType) => Promise<void>;
  updateFont: (font: FontType) => Promise<void>;
  updateFontSize: (size: number) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: ReaderSettings = {
  theme: "light",
  font: "Roboto",
  fontSize: 16,
};

const ReaderSettingsContext = createContext<
  ReaderSettingsContextType | undefined
>(undefined);

interface ReaderSettingsProviderProps {
  children: ReactNode;
}

export const ReaderSettingsProvider: React.FC<ReaderSettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage when app starts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedTheme, savedFont, savedFontSize] = await Promise.all([
          AsyncStorage.getItem("readerTheme"),
          AsyncStorage.getItem("readerFont"),
          AsyncStorage.getItem("readerFontSize"),
        ]);

        setSettings({
          theme: (savedTheme as ThemeType) || defaultSettings.theme,
          font: (savedFont as FontType) || defaultSettings.font,
          fontSize: savedFontSize
            ? parseInt(savedFontSize)
            : defaultSettings.fontSize,
        });
      } catch (error) {
        console.error("Error loading reader settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateTheme = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem("readerTheme", theme);
      setSettings((prev) => ({ ...prev, theme }));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const updateFont = async (font: FontType) => {
    try {
      await AsyncStorage.setItem("readerFont", font);
      setSettings((prev) => ({ ...prev, font }));
    } catch (error) {
      console.error("Error saving font:", error);
    }
  };

  const updateFontSize = async (fontSize: number) => {
    try {
      await AsyncStorage.setItem("readerFontSize", fontSize.toString());
      setSettings((prev) => ({ ...prev, fontSize }));
    } catch (error) {
      console.error("Error saving font size:", error);
    }
  };

  const value: ReaderSettingsContextType = {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading,
  };

  return (
    <ReaderSettingsContext.Provider value={value}>
      {children}
    </ReaderSettingsContext.Provider>
  );
};

export const useReaderSettings = () => {
  const context = useContext(ReaderSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useReaderSettings must be used within a ReaderSettingsProvider"
    );
  }
  return context;
};
