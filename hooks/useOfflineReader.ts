import { OfflineBook, OfflineChapter } from "@/dtos/BookDTO";
import { OfflineBookService } from "@/lib/service/book.service";
import { useState, useEffect } from "react";

export const useOfflineReader = (bookId: string, chapterNumber: number) => {
  const [book, setBook] = useState<OfflineBook | null>(null);
  const [chapter, setChapter] = useState<OfflineChapter | null>(null);
  const [totalChapters, setTotalChapters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfflineContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin sách
        const bookData = await OfflineBookService.getOfflineBook(bookId);
        if (!bookData) {
          throw new Error("Không tìm thấy sách offline");
        }
        setBook(bookData);

        // Lấy danh sách chapters
        const chapters = await OfflineBookService.getOfflineChapters(bookId);
        setTotalChapters(chapters.length);

        // Lấy chapter cụ thể
        const chapterData = await OfflineBookService.getOfflineChapterDetail(
          bookId,
          chapterNumber
        );
        if (!chapterData) {
          throw new Error(`Không tìm thấy chapter ${chapterNumber}`);
        }
        setChapter(chapterData);
      } catch (err) {
        console.error("Error loading offline content:", err);
        setError(err instanceof Error ? err.message : "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    if (OfflineBookService.isOfflineBook(bookId)) {
      loadOfflineContent();
    } else {
      setLoading(false);
    }
  }, [bookId, chapterNumber]);

  return {
    book,
    chapter,
    totalChapters,
    loading,
    error,
    isOffline: OfflineBookService.isOfflineBook(bookId),
  };
};
