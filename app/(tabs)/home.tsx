import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const Home = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return <></>;
};

export default Home;
