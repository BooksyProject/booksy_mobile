// import { useTheme } from "@/contexts/ThemeContext";
// import { colors } from "@/styles/colors";
// import React from "react";
// import {
//   ActivityIndicator,
//   StyleProp,
//   Text,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from "react-native";

// interface CircleIconButtonProps {
//   icon: (props: { size: number; color: string }) => React.ReactNode;
//   onPress?: () => void;
//   style?: ViewStyle;
//   iconColor?: string;
//   iconSize?: number;
// }

// const CircleIconButton: React.FC<CircleIconButtonProps> = ({
//   icon,
//   onPress,
//   style,
//   iconColor,
//   iconSize = 20,
// }) => {
//   const { colorScheme } = useTheme();

//   const computedColor =
//     iconColor ??
//     (colorScheme === "dark" ? colors.dark[200] : colors.light[200]);

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={[
//         {
//           width: 48,
//           height: 48,
//           borderRadius: 100,
//           backgroundColor:
//             colorScheme === "dark" ? colors.dark[100] : colors.light[100],
//           alignItems: "center",
//           justifyContent: "center",
//         },
//         style,
//       ]}
//     >
//       {icon({ size: iconSize, color: computedColor })}
//     </TouchableOpacity>
//   );
// };

// export default CircleIconButton;
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import React from "react";
import {
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  StyleProp,
  View,
  Text,
} from "react-native";

interface CircleIconButtonProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
  disabled?: boolean;
  isLoading?: boolean;
  progress?: number;
  size?: number;
}

const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  icon: Icon, // Đổi tên thành chữ in hoa để biểu thị đây là React component
  onPress,
  style,
  iconColor,
  iconSize = 20,
  disabled = false,
  isLoading = false,
  progress = 0,
  size = 48,
}) => {
  const { colorScheme } = useTheme();

  const computedColor =
    iconColor ??
    (colorScheme === "dark" ? colors.dark[200] : colors.light[200]);

  const bgColor = colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const disabledColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: disabled ? disabledColor : bgColor,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled || isLoading ? 0.7 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        progress > 0 ? (
          <View
            style={{
              width: iconSize,
              height: iconSize,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: computedColor,
                fontSize: iconSize * 0.4,
                fontWeight: "bold",
              }}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        ) : (
          <ActivityIndicator size="small" color={computedColor} />
        )
      ) : (
        <Icon
          size={iconSize}
          color={disabled ? disabledColor : computedColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default CircleIconButton;
