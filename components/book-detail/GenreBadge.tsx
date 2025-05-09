// components/GenreBadge.tsx
import { Text, View } from "react-native";

export default function GenreBadge({ genre }: { genre: string }) {
  return (
    <View className="bg-gray-200 px-4 py-1 rounded-full self-start">
      <Text className="text-sm font-medium text-gray-800">{genre}</Text>
    </View>
  );
}
