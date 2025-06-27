import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { useTheme } from "@/contexts/ThemeContext";

interface ButtonProps {
  title: any;
  color?: string;
  onPress?: () => void;
  fontColor?: string;
  outline?: boolean;
  border?: boolean;
  className?: string;
  borderRadius?: number;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color,
  onPress,
  fontColor,
  outline,
  border = false,
  className,
  borderRadius = 0,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
}) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = outline
    ? "transparent"
    : disabled
    ? // ? isDark
      colors.dark[100]
    : colors.light[100];
  // : color ?? colors.primary[100];

  const textColor =
    fontColor ?? (isDark ? colors.dark[200] : colors.light[200]);

  const containerStyle = [
    styles.base,
    styles.defaultContainer,
    {
      borderRadius,
      backgroundColor,
      opacity: disabled ? 0.7 : 1,
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={className}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
          {iconRight && <View style={styles.icon}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  defaultContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 4,
  },
});

export default Button;
