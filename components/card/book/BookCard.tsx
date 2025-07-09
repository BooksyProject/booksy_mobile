import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Modal,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import BookDetailCard from "./BookDetailCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BookCardProps {
  book: BookResponseDTO;
  onRefresh?: () => void; // 👈 thêm prop
}

const BookCard: React.FC<BookCardProps> = ({ book, onRefresh }) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [isModalVisible, setModalVisible] = useState(false);
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      className="w-[166px] h-[235px] rounded-5 overflow-hidden mr-4"
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: book?.coverImage }}
        className="flex-1 justify-end"
        imageStyle={{ borderRadius: 5 }}
      >
        <View className="h-[60px] justify-center mx-1 my-1">
          {Platform.OS === "ios" ? (
            <BlurView blurType="light" blurAmount={10} style={styles.blur} />
          ) : (
            <View
              style={[
                styles.blur,
                { backgroundColor: "rgba(255,255,255,0.75)" },
              ]}
            />
          )}

          <View className="flex-row items-center justify-between px-3 gap-2">
            <View className="flex-1">
              <Text
                className="text-[16px] text-dark-200 font-semibold max-w-[130px]"
                numberOfLines={1}
              >
                {book.title}
              </Text>
              <Text
                className="text-xs text-primary-100 max-w-[130px]"
                numberOfLines={1}
              >
                {book.author}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Modal hiển thị chi tiết sách */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BookDetailCard
          book={book}
          isCreatedByUser={userId === book.createdBy}
          onClose={(shouldRefresh = false) => {
            setModalVisible(false);
            if (shouldRefresh && onRefresh) {
              onRefresh(); // 👈 reload danh sách sách từ cha
            }
          }}
        />
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3,
  },
});

export default BookCard;
