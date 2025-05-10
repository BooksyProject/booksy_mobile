import {
  getReadingProgress,
  saveReadingProgress,
} from "@/lib/service/readingProgress.service";
import { useEffect, useState } from "react";

export default function useReadingProgressManager(bookId?: string) {
  const [progress, setProgress] = useState<null | {
    chapterId: string;
    chapterNumber: number;
    percentage?: number;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    const fetchProgress = async () => {
      try {
        const data = await getReadingProgress(bookId);
        setProgress(data);
      } catch (err) {
        console.error("Failed to load reading progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [bookId]);

  const save = async (data: {
    chapterId: string;
    chapterNumber: number;
    percentage?: number;
  }) => {
    try {
      await saveReadingProgress(bookId!, data);
      setProgress(data);
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  return { progress, loading, save };
}
