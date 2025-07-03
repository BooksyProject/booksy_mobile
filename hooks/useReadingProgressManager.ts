import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReadingProgress,
  saveReadingProgress,
} from "@/lib/service/readingProgress.service";

interface ReadingProgress {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

export default function useReadingProgressManager(bookId?: string) {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id);
      else console.warn("⚠️ userId not found in AsyncStorage");
    };
    loadUserId();
  }, []);

  // Hàm lấy progress để dùng lại
  const getProgress = async () => {
    if (!bookId || !userId) return null;

    setLoading(true);
    try {
      const result = await getReadingProgress(bookId, userId);
      console.log(result, "resultsss");

      if (result.success && result.data) {
        setProgress(result.data);
        return result.data;
      } else {
        setProgress(null);
        return null;
      }
    } catch (err) {
      console.error("❌ Failed to get progress:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookId || !userId) return;
    getProgress();
  }, [bookId, userId]);

  const save = async (data: ReadingProgress) => {
    if (!bookId || !userId) return;

    try {
      const result = await saveReadingProgress(bookId, data, userId);
      if (result) {
        setProgress(data);
        console.log("✅ Saved progress:", result);
      } else {
        console.warn("⚠️ Save progress failed:", result.message);
      }
    } catch (err) {
      console.error("❌ Failed to save progress:", err);
    }
  };

  const updateProgress = (
    chapterId: string,
    chapterNumber: number,
    percentage: number
  ) => {
    const newProgress = { chapterId, chapterNumber, percentage };
    save(newProgress);
  };

  return { progress, loading, save, updateProgress, getProgress };
}
