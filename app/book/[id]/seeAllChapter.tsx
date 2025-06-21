import ChapterListPreview from "@/components/book-detail/ChapterListPreview";
import Pagination from "@/components/ui/Pagination";
import { BookDTO } from "@/dtos/BookDTO";
import { ChapterInf } from "@/dtos/ChapterDTO";
import useGoToReader from "@/hooks/goToReader";
import { getBookDetail } from "@/lib/service/book.service";
import { getChaptersByBook } from "@/lib/service/chapter.service";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const PAGE_SIZE = 22;

export default function SeeAllChapterScreen() {
  const [page, setPage] = useState(1);
  const [bookDetail, setBookDetail] = useState<BookDTO | null>(null);
  const [chapters, setChapters] = useState<ChapterInf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams();

  // Ensure that id is a string and fallback to the first value if it's an array
  const bookId = Array.isArray(id) ? id[0] : id;
  const goToReader = useGoToReader(); // Khởi tạo hook

  const handleChapterPress = (chapterNumber: number) => {
    // Khi bấm vào chương, điều hướng đến màn hình Reader
    goToReader(bookId, chapterNumber);
  };

  // Pagination setup
  const totalPages = Math.ceil(chapters.length / PAGE_SIZE);
  const currentChapters = chapters.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch both book and chapters concurrently
        const [bookData, chaptersData] = await Promise.all([
          getBookDetail(bookId),
          getChaptersByBook(bookId),
        ]);

        console.log("Book detail:", bookData);
        console.log("Chapters:", chaptersData);

        // Set the book data if successful
        if (bookData.success) {
          setBookDetail(bookData.data);
        }

        // Set chapters data if it's an array
        if (Array.isArray(chaptersData)) {
          setChapters(chaptersData);
        }
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]); // Only re-run the effect if bookId changes

  // Handle loading state
  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-book-background">
        <Text className="text-center mt-10 text-white">Loading...</Text>
      </ScrollView>
    );
  }

  // Handle error state
  if (!bookDetail) {
    return (
      <ScrollView className="flex-1 bg-book-background">
        <Text className="text-center mt-10 text-white">Book not found</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-book-background p-4">
      <Text className="text-xl font-mbold mb-4">{bookDetail.title}</Text>

      {chapters.map((ch, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-200"
        >
          <TouchableOpacity onPress={() => handleChapterPress(index + 1)}>
            <Text className="text-sm font-mregular text-light-500">
              {ch.chapterTitle}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <View className="mb-20">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </View>
    </ScrollView>
  );
}
