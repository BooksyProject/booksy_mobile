// components/BookDescription.tsx
import { Text, View } from "react-native";

export default function BookDescription({
  description,
}: {
  description: string;
}) {
  return (
    <View className="mt-4 px-4">
      <Text className="text-base text-gray-700 leading-6">{description}</Text>
    </View>
  );
}
