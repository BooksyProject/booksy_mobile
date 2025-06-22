import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

interface CircleIconButtonProps {
  icon: (props: { size: number; color: string }) => React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  iconColor?: string;
  iconSize?: number;
}

const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  icon,
  onPress,
  style,
  iconColor,
  iconSize = 20,
}) => {
  const { colorScheme } = useTheme();

  const computedColor =
    iconColor ??
    (colorScheme === "dark" ? colors.dark[200] : colors.light[200]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 48,
          height: 48,
          borderRadius: 100,
          backgroundColor:
            colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {icon({ size: iconSize, color: computedColor })}
    </TouchableOpacity>
  );
};

export default CircleIconButton;
