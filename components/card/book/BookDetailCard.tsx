import { ScrollView, Text, View } from "react-native";
import BookHeaderCard from "@/components/card/book/BookHeaderCard";
import BookDescription from "@/components/shared/book/BookDescription";
import ChapterListPreview from "@/components/shared/chapter/ChapterListPreview";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import useGoToReader from "@/hooks/goToReader";
import React, { useEffect, useState } from "react";
import { BookDTO, BookResponseDTO } from "@/dtos/BookDTO";
import { getBookDetail } from "@/lib/service/book.service";
import { getChaptersByBook } from "@/lib/service/chapter.service";
import { ChapterInf } from "@/dtos/ChapterDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import Button from "@/components/ui/button";
interface BookDetailCardProps {
  book: BookResponseDTO;
  onClose: () => void;
}

const BookDetailCard: React.FC<BookDetailCardProps> = ({ book, onClose }) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const bookId = book?._id;

  const { progress, loading } = useReadingProgressManager(bookId);
  const goToReader = useGoToReader();

  const [bookDetail, setBookDetail] = useState<BookDTO | null>(null);
  const [chapters, setChapters] = useState<ChapterInf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bookData, chaptersData] = await Promise.all([
          getBookDetail(bookId),
          getChaptersByBook(bookId),
        ]);
        if (bookData.success) {
          setBookDetail(bookData.data);
        }

        if (chaptersData && Array.isArray(chaptersData)) {
          setChapters(chaptersData);
        }
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  // if (isLoading) {
  //   return (
  //     <ScrollView className="flex-1 bg-book-background">
  //       <Text className="text-center mt-10 text-white">Loading...</Text>
  //     </ScrollView>
  //   );
  // }

  if (!bookDetail) {
    return (
      <ScrollView className="flex-1 bg-book-background">
        <Text className="text-center mt-10 text-white">Book not found</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 h-full" style={{ backgroundColor: bgColor }}>
      <BookHeaderCard
        _id={bookDetail._id}
        title={bookDetail.title}
        author={bookDetail.author}
        coverImage={bookDetail.coverImage}
        categories={bookDetail.categories}
        likes={bookDetail.likes}
        chapters={chapters.length}
        views={bookDetail.views}
        fileURL={bookDetail.fileURL}
        onClose={onClose}
      />

      <BookDescription description={bookDetail.description} />

      <ChapterListPreview bookId={bookDetail._id} chapters={chapters} />
      {/* {!loading && (
        <View className="mt-6 mx-safe-or-3 mb-14">
          <Button
            title={progress ? "Continue Reading" : "Start Reading"}
            onPress={() => goToReader(bookId, progress?.chapterNumber || 1)}
            outline={!!progress}
          />
        </View>
      )} */}
      <View className="mt-6 mx-safe-or-3 mb-14">
        <Button
          title={progress ? "Continue Reading" : "Start Reading"}
          onPress={() => goToReader(bookId, progress?.chapterNumber || 1)}
          outline={!!progress}
        />
      </View>
    </ScrollView>
  );
};

export default BookDetailCard;
