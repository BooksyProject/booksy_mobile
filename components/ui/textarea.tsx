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

interface TextareaProps extends TextInputProps {
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

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChangeText,
  placeholder,
  width = "100%",
  height = 150,
  borderRadius = 12,
  borderWidth = 1,
  borderColor,
  backgroundColor,
  fontFamily,
  containerStyle,
  inputStyle,
  fontSize = 14,
  numberOfLines = 6,
  ...rest
}) => {
  const { colorScheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width,
      height,
      backgroundColor:
        backgroundColor ??
        (colorScheme === "dark" ? colors.dark[200] : colors.light[200]),
      borderRadius,
      borderWidth,
      borderColor: borderColor ?? "#ccc",
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    input: {
      color: colorScheme === "dark" ? colors.dark[100] : colors.light[100],
      fontSize,
      textAlignVertical: "top", // bắt đầu nhập từ trên xuống
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
        multiline
        numberOfLines={numberOfLines}
        style={[styles.input, inputStyle]}
        className="font-mregular"
        {...rest}
      />
    </View>
  );
};

export default Textarea;
