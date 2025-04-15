import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../styles/colors";
import { useRouter } from "expo-router";

const SignUp = () => {
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    ></TouchableWithoutFeedback>
  );
};

export default SignUp;
