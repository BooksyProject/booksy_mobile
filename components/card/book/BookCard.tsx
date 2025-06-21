import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BookResponseDTO } from "@/dtos/BookDTO";

interface BookCardProps {
  book: BookResponseDTO;
  onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <View className="w-[180px] mr-4">
      <ImageBackground
        source={{ uri: book?.coverImage }}
        style={{ borderRadius: 12 }}
        imageStyle={{ borderRadius: 12 }}
        className="h-[260px] w-full overflow-hidden justify-end"
      >
        <View className="bg-white/90 px-3 py-2 rounded-b-xl flex-row justify-between items-center">
          <View>
            <Text className="text-[14px] font-semibold text-[#26212A]">
              {book.title}
            </Text>
            <Text className="text-xs text-[#92898A]">{book.author}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color="#26212A" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <TouchableOpacity
        onPress={onPress}
        className="bg-[#26212A] mt-3 py-2 rounded-xl items-center"
      >
        <Text className="text-white font-bold">READ NOW</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookCard;
