import { Text, TouchableOpacity } from "react-native";

interface ReadNowButtonProps {
  onPress: () => void;
  hasProgress?: boolean; // ✅ thêm prop để kiểm tra tiến trình
}

export default function ReadNowButton({
  onPress,
  hasProgress,
}: ReadNowButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mt-6 bg-black px-6 py-4 rounded-lg mx-4 mb-8 items-center"
    >
      <Text className="text-white font-semibold text-base">
        {hasProgress ? "ĐỌC TIẾP" : "ĐỌC NGAY"}
      </Text>
    </TouchableOpacity>
  );
}
