// components/GenreBadge.tsx
import { Text, View } from "react-native";

export default function GenreBadge({ genre }: { genre: string }) {
  return (
    <View className="bg-transparent border border-black px-4 py-1 h-11 rounded-full self-start flex items-center justify-center">
      <Text className="text-sm font-mmedium text-gray-800">{genre}</Text>
    </View>
  );
}
