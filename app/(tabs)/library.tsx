import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import LibraryBookCard from "@/components/card/book/LibraryBookCard";
import CategoryTab from "@/components/ui/category-tab";
import { getLikedBooks } from "@/lib/service/book.service";
import { getAllCategories } from "@/lib/service/category.service";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { getReadingProgress } from "@/lib/service/readingProgress.service";

type BookWithProgress = BookResponseDTO & {
  totalChapters: number;
  readingProgress: {
    chapterId: string;
    chapterNumber: number;
    percentage: number;
    lastReadAt?: Date;
  } | null;
};

const Library = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [booksData, setBooksData] = useState<BookWithProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);

  const fetchBookmarks = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.warn("⚠️ No userId found in storage");
        return;
      }

      const likedBooks = await getLikedBooks(userId);

      const booksWithProgress = await Promise.all(
        likedBooks.map(async (book: any) => {
          try {
            const progressRes = await getReadingProgress(book._id, userId);
            const progress = progressRes?.chapterId ? progressRes : null;

            const totalChapters = book.totalChapters || 0;
            const percentage =
              progress && totalChapters > 0
                ? (progress.chapterNumber / totalChapters) * 100
                : 0;

            return {
              ...book,
              totalChapters,
              readingProgress: progress ? { ...progress, percentage } : null,
            };
          } catch (err) {
            console.error(
              "❌ Error fetching progress for book:",
              book._id,
              err
            );
            return { ...book, totalChapters: 0, readingProgress: null };
          }
        })
      );

      setBooksData(booksWithProgress);
    } catch (error) {
      console.error("❌ Error fetching bookmarks:", error);
      Alert.alert("Có lỗi xảy ra", "Không thể tải danh sách sách yêu thích.");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAllCategories();
      setCategoryData(data.categories);
    } catch (error) {
      console.error("❌ Failed to load categories:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
      fetchCategories();
    }, [fetchBookmarks, fetchCategories])
  );

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

        <View style={styles.gridContainer}>
          {booksData
            .filter((book) =>
              selectedCategory === "All"
                ? true
                : book.categories.includes(selectedCategory)
            )
            .map((book, index) => (
              <View style={styles.gridItem} key={book.title + index}>
                <LibraryBookCard book={book} />
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
