// components/BookDescription.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

export default function BookDescription({
  description,
}: {
  description: string;
}) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];
  return (
    <View className="mt-4 px-4">
      <Text
        className="text-base font-mregular leading-6"
        style={{ color: textColor }}
      >
        {description}
      </Text>
    </View>
  );
}
