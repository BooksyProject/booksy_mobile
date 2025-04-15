import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Platform } from "react-native";

const Library = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 4 : 52, // Android: 0, iOS: 12
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
      }}
    ></View>
  );
};

export default Library;
