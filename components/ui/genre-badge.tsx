// components/GenreBadge.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

export default function GenreBadge({ genre }: { genre: string }) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];
  return (
    <View className="bg-transparent border border-[#808080] px-4 py-1 h-11 rounded-full self-start flex items-center justify-center">
      <Text className="text-sm font-mmedium" style={{ color: textColor }}>
        {genre}
      </Text>
    </View>
  );
}
