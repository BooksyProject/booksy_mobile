import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface CategoryTabProps {
  title: string;
  isActive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  title,
  isActive = false,
  onPress,
  style,
}) => {
  const { colorScheme } = useTheme();

  const tabStyles = [
    styles.tab,
    {
      backgroundColor: isActive ? colors.primary[100] : "transparent",
      borderColor: isActive
        ? "transparent"
        : colorScheme === "dark"
        ? "#F1EEE3"
        : "#26212A",
    },
    style,
  ];

  const textStyles = [
    styles.tabText,
    {
      color: isActive
        ? "#FFFFFF"
        : colorScheme === "dark"
        ? "#F1EEE3"
        : "#26212A",
    },
  ];

  return (
    <TouchableOpacity style={tabStyles} onPress={onPress} activeOpacity={0.8}>
      <Text style={textStyles} className="font-mmedium">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
  tabText: {
    fontSize: 14,
  },
});

export default CategoryTab;
