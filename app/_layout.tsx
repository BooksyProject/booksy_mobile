import { StyleSheet, Text, View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { hideAsync } from "expo-splash-screen";
// import { ThemeProvider } from "@/context/ThemeContext";
// import { AuthProvider } from "@/context/AuthContext";
// import { ChatProvider } from "@/context/ChatContext";
// import { ChatItemProvider } from "@/context/ChatItemContext";

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
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }),
    [fontsLoaded, error];

  if (!fontsLoaded && !error) return null;
  return (
    // <AuthProvider>
    //   <ThemeProvider>
    //     <ChatItemProvider>
    //       <ChatProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="user" options={{ headerShown: false }} /> */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="user" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="chats" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="search" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="message" options={{ headerShown: false }} /> */}
    </Stack>
    //       </ChatProvider>
    //     </ChatItemProvider>
    //   </ThemeProvider>
    // </AuthProvider>
  );
};

export default RootLayout;
