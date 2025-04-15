import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";

const Search = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return <></>;
};

export default Search;
