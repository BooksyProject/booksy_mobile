import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";

const SignIn = () => {
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    ></TouchableWithoutFeedback>
  );
};

export default SignIn;
