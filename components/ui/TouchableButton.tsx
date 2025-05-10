import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  View,
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";
import React from "react";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";
type Rounded = "sm" | "md" | "lg" | "full";

interface Props {
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  rounded?: Rounded;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  bgColor?: string; // <== thêm dòng này
}

const buttonVariants: Record<Variant, ViewStyle> = {
  solid: { backgroundColor: "#4f46e5" },
  outline: {
    borderWidth: 1,
    borderColor: "#4f46e5",
    backgroundColor: "transparent",
  },
  ghost: { backgroundColor: "transparent" },
};

const textVariants: Record<Variant, TextStyle> = {
  solid: { color: "white" },
  outline: { color: "#4f46e5" },
  ghost: { color: "#4f46e5" },
};

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: 4, paddingHorizontal: 8 },
  md: { paddingVertical: 8, paddingHorizontal: 12 },
  lg: { paddingVertical: 12, paddingHorizontal: 16 },
};

const roundedStyles: Record<Rounded, ViewStyle> = {
  sm: { borderRadius: 4 },
  md: { borderRadius: 8 },
  lg: { borderRadius: 12 },
  full: { borderRadius: 999 },
};

export default function TouchableButton({
  children,
  onPress,
  variant = "solid",
  size = "md",
  rounded = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  bgColor, // <== thêm dòng này
}: Props) {
  const isRoundedFull = rounded === "full";

  const containerStyle: ViewStyle = {
    ...styles.base,
    ...sizeStyles[size],
    ...roundedStyles[rounded],
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(isRoundedFull
      ? {
          width: 40,
          height: 40,
        }
      : {}),
    ...(disabled || loading ? styles.disabled : {}),
  };

  const textStyles: TextStyle = {
    ...styles.textBase,
    ...textVariants[variant],
    ...(disabled || loading ? styles.textDisabled : {}),
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={textStyles.color} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === "left" && (
            <View style={styles.icon}>{icon}</View>
          )}
          {typeof children === "string" ? (
            <Text style={[textStyles, textStyle]}>{children}</Text>
          ) : (
            children
          )}
          {icon && iconPosition === "right" && (
            <View style={styles.icon}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {
    marginHorizontal: 2,
  },
  textBase: {
    fontWeight: "bold",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    color: "#aaa",
  },
});
