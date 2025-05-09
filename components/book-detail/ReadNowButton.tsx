// components/ReadNowButton.tsx
import { Text, TouchableOpacity } from "react-native";

export default function ReadNowButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mt-6 bg-black px-6 py-4 rounded-lg mx-4 mb-8 items-center"
    >
      <Text className="text-white font-semibold text-base">READ NOW</Text>
    </TouchableOpacity>
  );
}
