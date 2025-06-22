import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategoryTab from "@/components/ui/category-tab";
import { useEffect, useState } from "react";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { getAllBooks } from "@/lib/service/book.service";
import BookCard from "@/components/card/book/BookCard";
import CircleIconButton from "@/components/ui/circle-icon-button";
import { BellIcon } from "@/components/icon/Icons";

const categories = ["All", "Detective", "Drama", "Historical"];

const Home = () => {
  const { colorScheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialBooks = async () => {
      try {
        const data = await getAllBooks();
        if (isMounted) {
          setBooksData(data.books);
        }
      } catch (e) {
        console.error("Failed to load books", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      className="flex-1 pt-[30px] px-5"
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[200] : colors.light[200],
      }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Notification Button */}
      <View className="w-full items-end mb-4">
        <CircleIconButton
          icon={BellIcon}
          onPress={() => console.log("Pressed")}
        />
      </View>

      {/* Greeting */}
      <View className="mb-6">
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

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
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

      {/* Book List */}
      <View>
        {isLoading ? (
          <Text className="text-center text-sm">Loading books...</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {booksData
              .filter((book) =>
                selectedCategory === "All"
                  ? true
                  : book.categories.includes(selectedCategory)
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
    </ScrollView>
  );
};

export default Home;
