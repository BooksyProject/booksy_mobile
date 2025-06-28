import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import BookCard from "@/components/card/book/BookCard";
import { BookDTO, BookResponseDTO } from "@/dtos/BookDTO";
import { getLikedBooks } from "@/lib/service/book.service";

const Library = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const [booksData, setBooksData] = useState([]); // Dữ liệu sách yêu thích
  const [selectedCategory, setSelectedCategory] = useState("All"); // Chọn thể loại sách

  useEffect(() => {
    // Hàm để lấy các sách yêu thích từ AsyncStorage
    const fetchBookmarks = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        // Lọc bỏ giá trị null và set dữ liệu sách yêu thích vào state
        const likedBooks = await getLikedBooks(
          userId || "6858324823a912623fc86675"
        );
        setBooksData(likedBooks); // Cập nhật danh sách sách yêu thích
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        Alert.alert("Có lỗi xảy ra", "Không thể tải danh sách sách yêu thích.");
      }
    };

    fetchBookmarks(); // Gọi hàm để lấy các sách yêu thích
  }, []);

  console.log(booksData, "booksData");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[100], // Chọn màu theo chế độ sáng/tối
        },
      ]}
    >
      <ScrollView>
        <View style={styles.gridContainer}>
          {booksData
            .filter((book: any) =>
              selectedCategory === "All"
                ? true
                : book.categories.includes(selectedCategory)
            )
            .map((book: any, index) => (
              <View style={styles.gridItem} key={book.title + index}>
                <BookCard book={book} />{" "}
                {/* Component hiển thị thông tin sách */}
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: Platform.OS === "android" ? 50 : 52, // Android: 50, iOS: 52
    paddingHorizontal: Platform.OS === "android" ? 10 : 20, // Android: 10, iOS: 20
  },
  gridContainer: {
    flexDirection: "row", // Hiển thị các item theo hàng ngang
    flexWrap: "wrap", // Cho phép các item tràn xuống dòng tiếp theo
    justifyContent: "space-between", // Giãn đều các item trong dòng
  },
  gridItem: {
    width: "48%", // Mỗi item chiếm 48% chiều rộng của container (2 cột)
    marginBottom: 10, // Khoảng cách giữa các item theo chiều dọc
  },
});

export default Library;
