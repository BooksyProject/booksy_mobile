import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import BookCard from "@/components/card/book/BookCard";
import CategoryTab from "@/components/ui/category-tab";
import { getLikedBooks } from "@/lib/service/book.service";
import { getAllCategories } from "@/lib/service/category.service";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { BookResponseDTO } from "@/dtos/BookDTO";

const Library = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const likedBooks = await getLikedBooks(userId || "");
        setBooksData(likedBooks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        Alert.alert("Có lỗi xảy ra", "Không thể tải danh sách sách yêu thích.");
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategoryData(data.categories);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchBookmarks();
    fetchCategories();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.dark[200] : colors.light[200],
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          <CategoryTab
            key="all"
            title="All"
            isActive={selectedCategory === "All"}
            onPress={() => setSelectedCategory("All")}
          />

          {categoryData.map((category) => (
            <CategoryTab
              key={category._id}
              title={category.name}
              isActive={selectedCategory === category._id}
              onPress={() => setSelectedCategory(category._id)}
            />
          ))}
        </ScrollView>

        {/* Danh sách sách yêu thích */}
        <View style={styles.gridContainer}>
          {booksData
            .filter((book) =>
              selectedCategory === "All"
                ? true
                : book.categories.includes(selectedCategory)
            )
            .map((book, index) => (
              <View style={styles.gridItem} key={book.title + index}>
                <BookCard book={book} />
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
    paddingTop: Platform.OS === "android" ? 50 : 52,
    paddingHorizontal: Platform.OS === "android" ? 10 : 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 10,
  },
});

export default Library;
