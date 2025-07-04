import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OfflineProgress {
  [bookId: string]: {
    chapterId: string;
    chapterNumber: number;
    percentage: number;
    lastReadAt: number;
  };
}

export const useReadingProgressOffline = (bookId: string) => {
  const [progress, setProgress] = useState<OfflineProgress[string] | null>(
    null
  );
  const PROGRESS_KEY = "offlineReadingProgress";

  useEffect(() => {
    loadProgress();
  }, [bookId]);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      const allProgress: OfflineProgress = stored ? JSON.parse(stored) : {};
      setProgress(allProgress[bookId] || null);
    } catch (error) {
      console.error("Error loading offline progress:", error);
    }
  };

  const saveProgress = async (
    chapterId: string,
    chapterNumber: number,
    percentage: number
  ) => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      const allProgress: OfflineProgress = stored ? JSON.parse(stored) : {};

      allProgress[bookId] = {
        chapterId,
        chapterNumber,
        percentage,
        lastReadAt: Date.now(),
      };

      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
      setProgress(allProgress[bookId]);
    } catch (error) {
      console.error("Error saving offline progress:", error);
    }
  };

  const updateProgress = (
    chapterId: string,
    chapterNumber: number,
    percentage: number
  ) => {
    saveProgress(chapterId, chapterNumber, percentage);
  };

  return {
    progress,
    saveProgress,
    updateProgress,
  };
};
