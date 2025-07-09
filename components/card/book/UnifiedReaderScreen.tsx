import React from "react";
import { useLocalSearchParams } from "expo-router";
import OfflineReaderScreen from "./OfflineReaderScreen";
import { OfflineBook } from "@/dtos/BookDTO";
import { saveFile } from "@/lib/utils";
import { OfflineBookService } from "@/lib/service/book.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import ReaderScreen gốc của bạn
// import ReaderScreen from './ReaderScreen';

const UnifiedReaderScreen: React.FC = () => {
  const { bookId } = useLocalSearchParams();

  // Kiểm tra xem có phải sách offline không
  const isOffline = OfflineBookService.isOfflineBook(bookId as string);

  if (isOffline) {
    return <OfflineReaderScreen />;
  }

  // Return ReaderScreen online gốc
  // return <ReaderScreen />;
  return null; // Thay thế bằng ReaderScreen gốc
};

export default UnifiedReaderScreen;

// utils/downloadManager.ts
// Cập nhật hàm download để tự động parse nội dung

export const downloadBookWithProcessing = async (
  bookData: any,
  fileUrl: string,
  onProgress?: (progress: number) => void
) => {
  try {
    // Download file (sử dụng hàm saveFile hiện có)
    const result = await saveFile({
      fileUrl,
      onProgress: (progress, downloadedBytes, totalBytes) => {
        onProgress?.(progress);
        console.log(`Download progress: ${progress}%`);
      },
    });

    // Tạo offline book
    const offlineBook = {
      ...bookData,
      _id: `offline ${bookData._id}`,
      filePath: result.filePath,
      downloadedAt: Date.now(),
    };
    // 3. Ghi vào AsyncStorage
    const stored = await AsyncStorage.getItem("offlineBooks");
    const offlineBooks = stored ? JSON.parse(stored) : [];

    const alreadyExists = offlineBooks.some(
      (b: any) => b.filePath === offlineBook.filePath
    );

    if (!alreadyExists) {
      offlineBooks.push(offlineBook);
      await AsyncStorage.setItem("offlineBooks", JSON.stringify(offlineBooks));
    }

    console.log("✅ Processed offline book:", offlineBook);
    return offlineBook;
  } catch (error) {
    console.error("Download with processing failed:", error);
    throw error;
  }
};
