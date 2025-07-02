import React, { useState, useCallback } from "react";
import { View, ScrollView, Platform, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategoryTab from "@/components/ui/category-tab";
import { getLikedBooks } from "@/lib/service/book.service";
import { getAllCategories } from "@/lib/service/category.service";
import { getReadingProgress } from "@/lib/service/readingProgress.service";
import LibraryBookCard from "@/components/card/book/LibraryBookCard";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";

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
  const [refreshing, setRefreshing] = useState(false); // Dự phòng nếu sau này cần pull-to-refresh

  const getPercentage = (chapterNumber: number, totalChapters: number) => {
    if (totalChapters === 0) return 0;
    return Math.min((chapterNumber / totalChapters) * 100, 100);
  };

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
            const res = await getReadingProgress(book._id, userId);
            const progress = res.success ? res.data : null;
            const totalChapters = book.totalChapters || 0;
            const percentage = progress
              ? getPercentage(progress.chapterNumber, totalChapters)
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
            return {
              ...book,
              totalChapters: book.totalChapters || 0,
              readingProgress: null,
            };
          }
        })
      );
      console.log(booksWithProgress, "booksWithProgress");
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

  const loadAllData = useCallback(() => {
    fetchBookmarks();
    fetchCategories();
  }, [fetchBookmarks, fetchCategories]);

  useFocusEffect(loadAllData);

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
            .map((book) => (
              <View style={styles.gridItem} key={book._id}>
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
