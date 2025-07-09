import AsyncStorage from "@react-native-async-storage/async-storage";
import { DownloadIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import CircleIconButton from "./circle-icon-button";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { downloadBookWithProcessing } from "../card/book/UnifiedReaderScreen";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import {
  getChapterDetail,
  getChaptersByBook,
} from "@/lib/service/chapter.service";

interface BookData {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  likes: number;
  chapters: number;
  views: number;
  categories: CategoryResponseDTO[];
  fileUrl: string;
  description: string;
}

interface Props {
  bookData: BookData;
}

interface ChapterData {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
}

const IMAGE_BASE_URL = "http://192.168.1.214:3000/";

export default function DownloadButton({ bookData }: Props) {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setProgress(0);

      // Tải file PDF (nếu có)
      const result = await downloadBookWithProcessing(
        bookData,
        bookData.fileUrl,
        setProgress
      );

      // Lấy danh sách chương
      const chapters = await getChaptersByBook(String(bookData._id));

      const chapterContents: ChapterData[] = [];

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];

        try {
          const data = await getChapterDetail(
            bookData._id,
            chapter.chapterNumber
          );

          const fixedContent = data.content.replace(
            /src="\/([^"]+)"/g,
            `src="${IMAGE_BASE_URL}/$1"`
          );

          const chapterData: ChapterData = {
            ...data,
            content: fixedContent,
          };

          // Lưu từng chương riêng biệt vào AsyncStorage (nếu cần gọi nhanh từng chương)
          await AsyncStorage.setItem(
            `offline:${bookData._id}:chapter:${chapter.chapterNumber}`,
            JSON.stringify(chapterData)
          );

          // Đưa vào danh sách chapter đầy đủ
          chapterContents.push(chapterData);

          // Cập nhật tiến độ
          setProgress(Math.round(((i + 1) / chapters.length) * 100));
        } catch (err) {
          console.warn(`❌ Lỗi tải chương ${chapter.chapterNumber}:`, err);
        }
      }

      // Tạo dữ liệu sách offline hoàn chỉnh
      const offlineBookData = {
        ...bookData,
        chapters: chapterContents,
        downloadedAt: Date.now(),
        filePath: result.filePath,
      };

      // Lưu sách vào AsyncStorage
      await AsyncStorage.setItem(
        `offline:${bookData._id}`,
        JSON.stringify(offlineBookData)
      );
      console.log(`offline:${bookData._id}`, "offlineBookData");

      alert("📚 Tải xuống và lưu sách offline thành công!");
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert(
        "Tải xuống thất bại: " +
          (error instanceof Error ? error.message : "Lỗi không xác định")
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <CircleIconButton
      icon={DownloadIcon}
      onPress={handleDownload}
      disabled={isDownloading}
      progress={progress}
    />
  );
}
