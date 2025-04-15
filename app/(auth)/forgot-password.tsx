import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";

const ForgotPassword = () => {
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    ></TouchableWithoutFeedback>
  );
};

export default ForgotPassword;
