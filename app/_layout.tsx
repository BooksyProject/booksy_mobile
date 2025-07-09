import { StyleSheet, Text, View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "@/global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReaderSettingsProvider } from "@/contexts/ReaderSettingContext";
import { LibraryProvider } from "@/contexts/LibaryContext";

SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
    "JosefinSans-SemiBold": require("../assets/fonts/JosefinSans-SemiBold.ttf"),
    "Roboto-VariableFont_wdth,wght": require("../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
    "RobotoMono-VariableFont_wght": require("../assets/fonts/RobotoMono-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }),
    [fontsLoaded, error];

  if (!fontsLoaded && !error) return null;
  return (
    <AuthProvider>
      <ThemeProvider>
        <LibraryProvider>
          <ReaderSettingsProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              {/* <Stack.Screen name="user" options={{ headerShown: false }} /> */}
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="user" options={{ headerShown: false }} /> */}
              {/* <Stack.Screen name="chats" options={{ headerShown: false }} /> */}
              {/* <Stack.Screen name="search" options={{ headerShown: false }} /> */}
              <Stack.Screen
                name="reader/[bookId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="offline-reader/[offline-reader]"
                options={{ headerShown: false }}
              />
            </Stack>
          </ReaderSettingsProvider>
        </LibraryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default RootLayout;
