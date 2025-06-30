// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
// } from "react-native";
// import { useTheme } from "@/contexts/ThemeContext";
// import { colors } from "@/styles/colors";
// import CategoryTab from "@/components/ui/category-tab";
// import { useCallback, useEffect, useState } from "react";
// import { BookResponseDTO } from "@/dtos/BookDTO";
// import { getAllBooks, getLikedBooks } from "@/lib/service/book.service";
// import BookCard from "@/components/card/book/BookCard";
// import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
// import { getAllCategories } from "@/lib/service/category.service";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getReadingProgress } from "@/lib/service/readingProgress.service";
// import LibraryBookCard from "@/components/card/book/LibraryBookCard";

// type BookWithProgress = BookResponseDTO & {
//   totalChapters: number;
//   readingProgress: {
//     chapterId: string;
//     chapterNumber: number;
//     percentage: number;
//     lastReadAt?: Date;
//   } | null;
// };

// const Home = () => {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
//   const [continueBooks, setContinueBooks] = useState<BookWithProgress[]>([]);
//   const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);
//   const textColor = isDark ? colors.dark[100] : colors.light[100];

//   // Load tất cả sách và categories
//   useEffect(() => {
//     let isMounted = true;

//     const fetchBooksAndCategories = async () => {
//       try {
//         const [books, categories] = await Promise.all([
//           getAllBooks(),
//           getAllCategories(),
//         ]);
//         if (isMounted) {
//           setBooksData(books.books);
//           setCategoryData(categories.categories);
//         }
//       } catch (e) {
//         console.error("Failed to load books/categories", e);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     fetchBooksAndCategories();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Load sách đang đọc (tiến độ > 0)
//   useEffect(() => {
//     const fetchContinueReading = async () => {
//       try {
//         const userId = await AsyncStorage.getItem("userId");
//         if (!userId) return;

//         const likedBooks = await getLikedBooks(userId);

//         const booksWithProgress = await Promise.all(
//           likedBooks.map(async (book: any) => {
//             try {
//               const progressRes = await getReadingProgress(book._id, userId);
//               const progress = progressRes?.chapterId ? progressRes : null;

//               const totalChapters = book.totalChapters || 0;
//               const percentage =
//                 progress && totalChapters > 0
//                   ? (progress.chapterNumber / totalChapters) * 100
//                   : 0;

//               return {
//                 ...book,
//                 readingProgress:
//                   percentage > 0 ? { ...progress, percentage } : null,
//               };
//             } catch (err) {
//               return { ...book, readingProgress: null };
//             }
//           })
//         );

//         setContinueBooks(
//           booksWithProgress.filter((book) => book.readingProgress !== null)
//         );
//       } catch (error) {
//         console.error("Failed to load continue reading books:", error);
//       }
//     };

//     fetchContinueReading();
//   }, []);

//   return (
//     <ScrollView
//       className="flex-1 pt-[30px] px-5"
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

//       {continueBooks.length > 0 ? (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingVertical: 8 }}
//         >
//           {continueBooks.map((book, index) => (
//             <LibraryBookCard book={book} />
//           ))}
//         </ScrollView>
//       ) : (
//         <Text style={{ color: textColor }} className="text-sm text-center mb-4">
//           No books in progress.
//         </Text>
//       )}

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

//       {isLoading ? (
//         <Text className="text-center text-sm">Loading books...</Text>
//       ) : (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingVertical: 8, marginBottom: 100 }}
//         >
//           {booksData
//             .filter((book) =>
//               selectedCategory === "All"
//                 ? true
//                 : book.categories.includes(selectedCategory)
//             )
//             .map((book, index) => (
//               <BookCard key={book._id + index} book={book} />
//             ))}
//         </ScrollView>
//       )}
//     </ScrollView>
//   );
// };

// export default Home;

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategoryTab from "@/components/ui/category-tab";
import { useCallback, useEffect, useState } from "react";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { getAllBooks, getLikedBooks } from "@/lib/service/book.service";
import BookCard from "@/components/card/book/BookCard";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { getAllCategories } from "@/lib/service/category.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReadingProgress } from "@/lib/service/readingProgress.service";
import LibraryBookCard from "@/components/card/book/LibraryBookCard";
import { useFocusEffect } from "@react-navigation/native";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
  const [continueBooks, setContinueBooks] = useState<BookWithProgress[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryResponseDTO[]>([]);
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  // Load tất cả sách và categories
  useEffect(() => {
    let isMounted = true;

    const fetchBooksAndCategories = async () => {
      try {
        const [books, categories] = await Promise.all([
          getAllBooks(),
          getAllCategories(),
        ]);
        if (isMounted) {
          setBooksData(books.books);
          setCategoryData(categories.categories);
        }
      } catch (e) {
        console.error("Failed to load books/categories", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBooksAndCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load sách đang đọc mỗi khi quay lại màn hình
  const fetchContinueReading = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

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
              readingProgress:
                percentage > 0 ? { ...progress, percentage } : null,
            };
          } catch (err) {
            return { ...book, totalChapters: 0, readingProgress: null };
          }
        })
      );

      setContinueBooks(
        booksWithProgress.filter((book) => book.readingProgress !== null)
      );
    } catch (error) {
      console.error("Failed to load continue reading books:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchContinueReading();
    }, [fetchContinueReading])
  );

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
        {/* <TouchableOpacity>
          <Text className="text-primary-100 text-[14px] font-mmedium">
            See all
          </Text>
        </TouchableOpacity> */}
      </View>

      {continueBooks.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {continueBooks
            .filter((book) =>
              selectedCategory === "All"
                ? true
                : book.categories.includes(selectedCategory)
            )
            .map((book, index) => (
              <LibraryBookCard key={book._id + index} book={book} />
            ))}
        </ScrollView>
      ) : (
        <Text style={{ color: textColor }} className="text-sm text-center mb-4">
          No books in progress.
        </Text>
      )}

      <View className="flex-row justify-between mb-4">
        <Text
          style={{ color: textColor }}
          className="text-[18px] font-msemibold"
        >
          May you like
        </Text>
        {/* <TouchableOpacity>
          <Text className="text-primary-100 text-[14px] font-mmedium">
            See all
          </Text>
        </TouchableOpacity> */}
      </View>

      {isLoading ? (
        <Text className="text-center text-sm">Loading books...</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8, marginBottom: 100 }}
        >
          {booksData
            .filter((book) =>
              selectedCategory === "All"
                ? true
                : book.categories.includes(selectedCategory)
            )
            .map((book, index) => (
              <BookCard key={book._id + index} book={book} />
            ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default Home;
