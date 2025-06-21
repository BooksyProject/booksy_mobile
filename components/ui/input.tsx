import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from "react-native";
interface InputProps extends TextInputProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  fontSize?: number;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onSubmitEditing,
  width = "100%",
  height = 40,
  borderRadius = 12,
  borderWidth = 1,
  borderColor,
  backgroundColor,
  fontFamily,
  containerStyle,
  inputStyle,
  fontSize = 14,
  ...rest
}) => {
  const { colorScheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width,
      height,
      backgroundColor:
        backgroundColor ??
        (colorScheme === "dark" ? colors.dark[100] : colors.light[100]),
      borderRadius,
      borderWidth,
      borderColor: borderColor ?? "#ccc",
      paddingHorizontal: 12,
      justifyContent: "center",
    },
    input: {
      color: colorScheme === "dark" ? colors.dark[200] : colors.light[200],
      fontSize: fontSize ?? 14,
      fontFamily: fontFamily ?? "System",
      flex: 1,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
        style={[styles.input, inputStyle]}
        {...rest}
      />
    </View>
  );
};

export default Input;
