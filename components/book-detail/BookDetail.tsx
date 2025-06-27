import { Modal, ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BookHeaderCard from "@/components/book-detail/BookHeaderCard";
import GenreBadge from "@/components/ui/GenreBadge";
import BookDescription from "@/components/book-detail/BookDescription";
import ChapterListPreview from "@/components/book-detail/ChapterListPreview";
import ReadNowButton from "@/components/book-detail/ReadNowButton";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import useGoToReader from "@/hooks/goToReader";
import React, { useEffect, useState } from "react";
import { BookDTO, BookResponseDTO } from "@/dtos/BookDTO";
import { getBookDetail } from "@/lib/service/book.service";
import { getChaptersByBook } from "@/lib/service/chapter.service";
import { ChapterInf } from "@/dtos/ChapterDTO";
import SeeAllChapter from "./SeeAllChapter";

interface BookDetailCardProps {
  book: BookResponseDTO;
  onClose: () => void;
}

const BookDetailCard: React.FC<BookDetailCardProps> = ({ book, onClose }) => {
  //   const { id } = useLocalSearchParams();
  const router = useRouter();

  const bookId = book._id;

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

        // ✅ Fetch cả 2 cùng lúc
        const [bookData, chaptersData] = await Promise.all([
          getBookDetail(bookId),
          getChaptersByBook(bookId),
        ]);

        console.log("Book detail:", bookData);
        console.log("Chapters:", chaptersData);

        // ✅ Set data đúng cách
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

  // ✅ Loading state
  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-book-background">
        <Text className="text-center mt-10 text-white">Loading...</Text>
      </ScrollView>
    );
  }

  // ✅ Error state
  if (!bookDetail) {
    return (
      <ScrollView className="flex-1 bg-book-background">
        <Text className="text-center mt-10 text-white">Book not found</Text>
      </ScrollView>
    );
  }

  console.log(progress, "read now");

  return (
    <ScrollView className="flex-1 bg-book-background">
      <BookHeaderCard
        _id={bookDetail._id}
        title={bookDetail.title}
        author={bookDetail.author}
        coverImage={bookDetail.coverImage}
        categories={bookDetail.categories}
        likes={bookDetail.likes}
        chapters={chapters.length} // ✅ Dùng chapters.length thay vì bookDetail.chapters
        views={bookDetail.views}
        fileURL={bookDetail.fileURL}
      />

      <BookDescription description={bookDetail.description} />

      <ChapterListPreview bookId={bookDetail._id} chapters={chapters} />

      {!loading && (
        <ReadNowButton
          hasProgress={!!progress}
          onPress={() => goToReader(bookId, progress?.chapterNumber || 1)}
        />
      )}
    </ScrollView>
  );
};

export default BookDetailCard;
