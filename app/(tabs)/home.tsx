import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategoryTab from "@/components/ui/category-tab";
import { useEffect, useState } from "react";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { getAllBooks } from "@/lib/service/book.service";
import BookCard from "@/components/card/book/BookCard";
import CircleIconButton from "@/components/ui/circle-icon-button";
import { BellIcon, LikeIcon } from "@/components/icon/Icons";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { getAllCategories } from "@/lib/service/category.service";

const Home = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);
  const textColor = isDark ? colors.dark[100] : colors.light[100];

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

  useEffect(() => {
    let isMounted = true;

    const loadInitialCategories = async () => {
      try {
        const data = await getAllCategories();
        if (isMounted) {
          setCategoryData(data.categories);
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      className="flex-1 pt-[30px] px-5"
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: isDark ? colors.dark[200] : colors.light[200],
        gap: 5,
      }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="w-full items-end mb-4">
        <CircleIconButton
          icon={LikeIcon}
          onPress={() => console.log("Pressed")}
        />
      </View>

      <View className="mb-6">
        <Text
          className="text-[24px] font-msemibold"
          style={{ color: textColor }}
        >
          Hey,
          <Text className="text-6 font-msemibold text-primary-100"> Huỳnh</Text>
        </Text>
        <Text
          className="text-[24px] font-msemibold"
          style={{ color: textColor }}
        >
          Immerse Yourself In Stories That Come To Life
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
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

      <View className="flex-row justify-between mb-6">
        <Text
          style={{ color: textColor }}
          className="text-[18px] font-msemibold"
        >
          Continue reading
        </Text>
        <TouchableOpacity>
          <Text className="text-primary-100 text-[14px] font-mmedium">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-4">
        <Text
          style={{ color: textColor }}
          className="text-[18px] font-msemibold"
        >
          May you like
        </Text>
        <TouchableOpacity>
          <Text className="text-primary-100 text-[14px] font-mmedium">
            See all
          </Text>
        </TouchableOpacity>
      </View>

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
                <BookCard key={book.title + index} book={book} />
              ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;
