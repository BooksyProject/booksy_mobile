import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import BookDetailCard from "./BookDetailCard";

interface SearchBookCardProps {
  book: BookResponseDTO;
  // onPress?: () => void;
}

const SearchBookCard: React.FC<SearchBookCardProps> = ({ book }) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [isModalVisible, setModalVisible] = useState(false);
  const textColor = isDark ? colors.dark[100] : colors.light[100];
  const openModal = async () => {
    setModalVisible(true);
  };
  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="rounded-xl justify-start items-start shadow flex-row  gap-4"
        activeOpacity={0.9}
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[200] : colors.light[200],
          gap: 5,
        }}
      >
        <Image
          source={{ uri: book?.coverImage }}
          className="w-[70px] h-[100px] rounded-[5px]"
        />
        <View className="flex-1">
          <Text
            className="font-msemibold text-[16px]"
            style={{ color: textColor }}
          >
            {book.title}
          </Text>
          <Text
            className="text-[14px] font-mmedium mt-2"
            style={{ color: textColor }}
          >
            {book.author}
          </Text>
          <Text className="text-[14px] mt-2 font-mmedium text-primary-100">
            {book.views} reads
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BookDetailCard onClose={() => setModalVisible(false)} />
      </Modal>
    </>
  );
};

export default SearchBookCard;
