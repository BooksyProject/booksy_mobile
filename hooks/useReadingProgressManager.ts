import {
  getReadingProgress,
  saveReadingProgress,
} from "@/lib/service/readingProgress.service";
import { useEffect, useState } from "react";

export default function useReadingProgressManager(
  bookId?: string,
  userId?: string
) {
  const [progress, setProgress] = useState<null | {
    chapterId: string;
    chapterNumber: number;
    percentage?: number;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId || !userId) return;

    const fetchProgress = async () => {
      try {
        const data = await getReadingProgress(bookId, userId);
        console.log(data, "data of progress get");
        setProgress(data);
      } catch (err) {
        console.error("Failed to load reading progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [bookId, progress?.chapterId]);

  const save = async (data: {
    chapterId: string;
    chapterNumber: number;
    percentage?: number;
  }) => {
    try {
      // Save progress to the server
      await saveReadingProgress(bookId!, data);
      // Update local progress state synchronously
      setProgress(data);
      console.log("Saved progress:", data);
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  // Save progress when chapter changes or when navigating
  const updateProgress = (
    chapterId: string,
    chapterNumber: number,
    percentage: number
  ) => {
    const newProgress = { chapterId, chapterNumber, percentage };
    save(newProgress); // Save progress immediately
  };

  return { progress, loading, save, updateProgress };
}
