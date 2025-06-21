import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategoryTab from "@/components/ui/category-tab";
import { useEffect, useState } from "react";
import { BookResponseDTO } from "@/dtos/BookDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllBooks } from "@/lib/service/book.service";
import BookCard from "@/components/card/book/BookCard";
const categories = ["All", "Detective", "Drama", "Historical"];
const Home = () => {
  const { colorScheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
  useEffect(() => {
    let isMounted = true;
    const loadInitialPosts = async () => {
      try {
        const data = await getAllBooks();
        if (!isMounted) return;
        setBooksData(data.books);
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadInitialPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View
      className="flex-1 pt-[30px] px-5"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[200] : colors.light[200],
        flex: 1,
        gap: 24,
      }}
    >
      <View>
        <Text
          className="text-[24px] font-msemibold"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
        >
          Hey,
          <Text className="text-6 font-msemibold text-primary-100"> Huỳnh</Text>
        </Text>
        <Text
          className="text-[24px] font-msemibold"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
        >
          Immerse Yourself In Stories That Come To Life
        </Text>
      </View>

      <ScrollView
        className="space-x-3"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <CategoryTab
            key={category}
            title={category}
            isActive={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>

      <View className="">
        {isLoading ? (
          <Text className="text-center text-sm">Loading books...</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {booksData
              .filter(
                (book) =>
                  selectedCategory === "All"
                    ? true
                    : book.categories.includes(selectedCategory) // nếu `categories` là string[] hoặc ID
              )
              .map((book, index) => (
                <BookCard
                  key={book.title + index}
                  book={book}
                  onPress={() => console.log("Read:", book.title)}
                />
              ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Home;
