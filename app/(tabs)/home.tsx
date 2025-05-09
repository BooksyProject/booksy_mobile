import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const Home = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-lg font-bold text-purple-600 mb-4">
        Chào mừng đến với Booksy
      </Text>

      <Link
        href={{
          pathname: "/book/[id]",
          params: { id: "681e0db975db5dcb5e68ac6a" },
        }}
        asChild
      >
        <TouchableOpacity className="bg-purple-600 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold text-base">Đọc ngay</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Home;
