// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import { useTheme } from "@/contexts/ThemeContext";
// import { colors } from "@/styles/colors";
// import CategoryTab from "@/components/ui/category-tab";
// import { useEffect, useState } from "react";
// import { BookResponseDTO } from "@/dtos/BookDTO";
// import { getAllBooks } from "@/lib/service/book.service";
// import BookCard from "@/components/card/book/BookCard";
// import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
// import { getAllCategories } from "@/lib/service/category.service";

// const Home = () => {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
//   const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);
//   const textColor = isDark ? colors.dark[100] : colors.light[100];

//   useEffect(() => {
//     let isMounted = true;

//     const loadInitialBooks = async () => {
//       try {
//         const data = await getAllBooks();
//         if (isMounted) {
//           setBooksData(data.books);
//         }
//       } catch (e) {
//         console.error("Failed to load books", e);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     loadInitialBooks();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     let isMounted = true;

//     const loadInitialCategories = async () => {
//       try {
//         const data = await getAllCategories();
//         if (isMounted) {
//           setCategoryData(data.categories);
//         }
//       } catch (e) {
//         console.error("Failed to load categories", e);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     loadInitialCategories();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <ScrollView
//       className="flex-1 pt-[60px] px-5"
//       showsVerticalScrollIndicator={false}
//       style={{
//         backgroundColor: isDark ? colors.dark[200] : colors.light[200],
//         gap: 5,
//       }}
//       contentContainerStyle={{ paddingBottom: 24 }}
//     >
//       <View className="mb-6">
//         <Text
//           className="text-[24px] font-msemibold"
//           style={{ color: textColor }}
//         >
//           Hey,
//           <Text className="text-6 font-msemibold text-primary-100"> Huỳnh</Text>
//         </Text>
//         <Text
//           className="text-[24px] font-msemibold"
//           style={{ color: textColor }}
//         >
//           Immerse Yourself In Stories That Come To Life
//         </Text>
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         className="mb-6"
//       >
//         <CategoryTab
//           key="all"
//           title="All"
//           isActive={selectedCategory === "All"}
//           onPress={() => setSelectedCategory("All")}
//         />

//         {categoryData.map((category) => (
//           <CategoryTab
//             key={category._id}
//             title={category.name}
//             isActive={selectedCategory === category._id}
//             onPress={() => setSelectedCategory(category._id)}
//           />
//         ))}
//       </ScrollView>

//       <View className="flex-row justify-between mb-6">
//         <Text
//           style={{ color: textColor }}
//           className="text-[18px] font-msemibold"
//         >
//           Continue reading
//         </Text>
//         <TouchableOpacity>
//           <Text className="text-primary-100 text-[14px] font-mmedium">
//             See all
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View className="flex-row justify-between mb-4">
//         <Text
//           style={{ color: textColor }}
//           className="text-[18px] font-msemibold"
//         >
//           May you like
//         </Text>
//         <TouchableOpacity>
//           <Text className="text-primary-100 text-[14px] font-mmedium">
//             See all
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View>
//         {isLoading ? (
//           <Text className="text-center text-sm">Loading books...</Text>
//         ) : (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingVertical: 8 }}
//           >
//             {booksData
//               .filter((book) =>
//                 selectedCategory === "All"
//                   ? true
//                   : book.categories.includes(selectedCategory)
//               )
//               .map((book, index) => (
//                 <BookCard key={book.title + index} book={book} />
//               ))}
//           </ScrollView>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default Home;
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategoryTab from "@/components/ui/category-tab";
import { useEffect, useState } from "react";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { getAllBooks, getLikedBooks } from "@/lib/service/book.service";
import { getAllCategories } from "@/lib/service/category.service";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import BookCard from "@/components/card/book/BookCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReadingProgress } from "@/lib/service/readingProgress.service";
import LibraryBookCard from "@/components/card/book/LibraryBookCard";

type BookWithProgress = BookResponseDTO & {
  totalChapters: number;
  readingProgress: {
    chapterId: string;
    chapterNumber: number;
    percentage: number;
    lastReadAt?: Date;
  } | null;
};

const Home = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);
  const [continueReadingBooks, setContinueReadingBooks] = useState<
    BookWithProgress[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPercentage = (chapterNumber: number, totalChapters: number) => {
    if (totalChapters === 0) return 0;
    return Math.min((chapterNumber / totalChapters) * 100, 100);
  };

  useEffect(() => {
    let isMounted = true;

    const loadBooks = async () => {
      try {
        const data = await getAllBooks();
        if (isMounted) setBooksData(data.books);
      } catch (e) {
        console.error("Failed to load books", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        if (isMounted) setCategoryData(data.categories);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };

    const loadContinueReading = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

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
              console.error("❌ Error loading reading progress:", err);
              return {
                ...book,
                totalChapters: book.totalChapters || 0,
                readingProgress: null,
              };
            }
          })
        );

        const filtered = booksWithProgress.filter((b) => b.readingProgress);
        if (isMounted) setContinueReadingBooks(filtered);
      } catch (err) {
        console.error("Failed to load continue reading", err);
        Alert.alert("Lỗi", "Không thể tải danh sách đang đọc");
      }
    };

    loadBooks();
    loadCategories();
    loadContinueReading();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      className="flex-1 pt-[60px] px-5"
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: isDark ? colors.dark[200] : colors.light[200],
        gap: 5,
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
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

      {/* ✅ CONTINUE READING */}
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

      {continueReadingBooks.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {continueReadingBooks.map((book) => (
            <LibraryBookCard key={book._id} book={book} />
          ))}
        </ScrollView>
      ) : (
        <Text className="text-sm text-center mb-6" style={{ color: textColor }}>
          You haven't started any books yet.
        </Text>
      )}

      {/* ✅ MAY YOU LIKE */}
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

      <View className="pb-20">
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
              .map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;
