import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { openBrowserAsync } from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { OfflineBook, OfflineChapter } from "@/dtos/BookDTO";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const PREPARE_OFFLINE_READING_REQUEST =
  "PREPARE_OFFLINE_READING_REQUEST";
export const PREPARE_OFFLINE_READING_SUCCESS =
  "PREPARE_OFFLINE_READING_SUCCESS";
export const PREPARE_OFFLINE_READING_FAILURE =
  "PREPARE_OFFLINE_READING_FAILURE";

export const DOWNLOAD_BOOK_PROGRESS = "DOWNLOAD_BOOK_PROGRESS";
export const DOWNLOAD_BOOK_COMPLETE = "DOWNLOAD_BOOK_COMPLETE";
export const DOWNLOAD_BOOK_FAILURE = "DOWNLOAD_BOOK_FAILURE";

export const FETCH_DOWNLOADED_BOOKS_REQUEST = "FETCH_DOWNLOADED_BOOKS_REQUEST";
export const FETCH_DOWNLOADED_BOOKS_SUCCESS = "FETCH_DOWNLOADED_BOOKS_SUCCESS";
export const FETCH_DOWNLOADED_BOOKS_FAILURE = "FETCH_DOWNLOADED_BOOKS_FAILURE";

export async function getBookDetail(bookId: String) {
  const res = await fetch(`${BASE_URL}/book/getDetailBook?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch book detail");
  return await res.json();
}

export async function likeBook(bookId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/book/likeBook`, {
    method: "POST", // Sử dụng POST thay vì GET
    headers: {
      "Content-Type": "application/json", // Gửi dữ liệu dưới dạng JSON
    },
    body: JSON.stringify({
      bookId, // Truyền bookId vào body
      userId, // Truyền userId vào body
    }),
  });

  // Kiểm tra nếu phản hồi không ok
  if (!res.ok) throw new Error("Failed to like book");

  // Trả về kết quả JSON từ response
  return await res.json();
}

export async function unlikeBook(bookId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/book/unlikeBook`, {
    method: "POST", // Sử dụng POST thay vì GET
    headers: {
      "Content-Type": "application/json", // Gửi dữ liệu dưới dạng JSON
    },
    body: JSON.stringify({
      bookId, // Truyền bookId vào body
      userId, // Truyền userId vào body
    }),
  });

  // Kiểm tra nếu phản hồi không ok
  if (!res.ok) throw new Error("Failed to like book");

  // Trả về kết quả JSON từ response
  return await res.json();
}

export async function getAllBooks() {
  const res = await fetch(`${BASE_URL}/book/all`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return await res.json();
}

export async function getLikedBooks(userId: String) {
  const res = await fetch(`${BASE_URL}/book/getLikedBooks?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch liked books");
  return await res.json();
}

// Hàm chuẩn bị tải sách offline
export async function prepareOfflineBook(bookId: string, userId: string) {
  try {
    const res = await fetch(`${BASE_URL}/book/prepareOffline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId, // Truyền bookId vào body
        userId, // Truyền userId vào body
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to prepare offline book");
    }

    return await res.json();
  } catch (error) {
    console.error("Error preparing offline book:", error);
    throw error;
  }
}

// Hàm cập nhật tiến độ tải
export async function updateDownloadProgress(
  downloadId: string,
  progress: number,
  status: "DOWNLOADING" | "COMPLETED" | "FAILED",
  downloadSize?: number
) {
  try {
    const res = await fetch(
      `${BASE_URL}/book/progress?downloadId=${downloadId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress, status, downloadSize }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update download progress");
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating download progress:", error);
    throw error;
  }
}

// Hàm lấy danh sách sách đã tải
export async function getDownloadedBooks(userId: string) {
  try {
    const res = await fetch(`${BASE_URL}/user/download?userId=${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch downloaded books");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching downloaded books:", error);
    throw error;
  }
}

// Hàm xóa sách đã tải
export async function deleteDownloadedBook(userId: string, bookId: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/user/deleteDownload?userId=${userId}&&bookId=${bookId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete downloaded book");
    }

    return await res.json();
  } catch (error) {
    console.error("Error deleting downloaded book:", error);
    throw error;
  }
}

// Hàm tải file sách và lưu trữ cục bộ
export async function downloadBookFile(
  fileUrl: string,
  bookId: string,
  userId: string,
  onProgress?: (progress: number) => void
) {
  let downloadId: string | undefined;

  try {
    // 1. Chuẩn bị tải offline
    const prepareResult = await prepareOfflineBook(bookId, userId);

    if (prepareResult.status === "ALREADY_DOWNLOADED") {
      return {
        status: "ALREADY_DOWNLOADED",
        filePath: prepareResult.downloadRecord.localPath,
      };
    }

    downloadId = prepareResult.downloadRecord._id;
    if (!downloadId) {
      throw new Error("Download ID is missing");
    }
    // 2. Tải file từ URL
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      FileSystem.documentDirectory + `${bookId}_${Date.now()}`,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        onProgress?.(progress * 100);

        // Cập nhật tiến độ lên server mỗi 10%
        if (Math.floor(progress * 100) % 10 === 0) {
          updateDownloadProgress(
            downloadId!,
            Math.floor(progress * 100),
            "DOWNLOADING",
            downloadProgress.totalBytesExpectedToWrite
          );
        }
      }
    );

    const { uri } = await downloadResumable.downloadAsync();

    // 3. Lấy thông tin file và kiểm tra size
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error("Downloaded file not found");
    }

    // 4. Cập nhật trạng thái hoàn thành
    await updateDownloadProgress(downloadId, 100, "COMPLETED", fileInfo.size);

    return {
      status: "DOWNLOADED",
      filePath: uri,
    };
  } catch (error) {
    console.error("Download failed:", error);

    // Xử lý error an toàn
    let errorMessage = "Download failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Cập nhật trạng thái lỗi nếu có downloadId
    if (downloadId) {
      await updateDownloadProgress(downloadId, 0, "FAILED");
    }

    throw new Error(errorMessage);
  }
}

// Hàm đồng bộ tiến độ đọc offline
export async function syncReadingProgress(progressData: {
  userId: string;
  bookId: string;
  chapterId: string;
  chapterNumber: number;
  currentPosition: number;
  totalProgress: number;
  readingTime: number;
}) {
  try {
    const res = await fetch(`${BASE_URL}/progress/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressData),
    });

    if (!res.ok) {
      throw new Error("Failed to sync reading progress");
    }

    return await res.json();
  } catch (error) {
    console.error("Error syncing reading progress:", error);
    throw error;
  }
}

// Hàm mở sách đã tải
export async function openDownloadedBook(filePath: string, fileType: string) {
  try {
    if (fileType === "PDF") {
      // Đối với PDF, sử dụng WebView hoặc trình xem PDF
      await openBrowserAsync(`file://${filePath}`);
    } else if (fileType === "EPUB") {
      // Đối với EPUB, cần tích hợp trình đọc EPUB
      Alert.alert(
        "Mở EPUB",
        "Ứng dụng sẽ mở sách EPUB trong trình đọc chuyên dụng"
      );
      // Thực tế cần tích hợp với thư viện đọc EPUB
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error opening downloaded book:", error);
    throw error;
  }
}

export const useOfflineBooks = () => {
  const [offlineBooks, setOfflineBooks] = useState([]);

  useEffect(() => {
    const loadOfflineBooks = async () => {
      try {
        const stored = await AsyncStorage.getItem("offlineBooks");
        const parsed = stored ? JSON.parse(stored) : [];
        setOfflineBooks(parsed);
      } catch (error) {
        console.error("Lỗi khi load sách offline:", error);
      }
    };

    loadOfflineBooks();
  }, []);

  return offlineBooks;
};

export class OfflineBookService {
  private static readonly OFFLINE_BOOKS_KEY = "offlineBooks";
  private static readonly OFFLINE_CHAPTERS_KEY = "offlineChapters";
  private static readonly OFFLINE_PROGRESS_KEY = "offlineReadingProgress";
  // Lấy tất cả sách offline
  static async getOfflineBooks(): Promise<OfflineBook[]> {
    try {
      const stored = await AsyncStorage.getItem(this.OFFLINE_BOOKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting offline books:", error);
      return [];
    }
  }

  // Lấy sách offline theo ID
  static async getOfflineBook(bookId: string): Promise<OfflineBook | null> {
    try {
      const books = await this.getOfflineBooks();
      return books.find((book) => book._id === bookId) || null;
    } catch (error) {
      console.error("Error getting offline book:", error);
      return null;
    }
  }

  // Lưu sách offline
  static async saveOfflineBook(book: OfflineBook): Promise<void> {
    try {
      const books = await this.getOfflineBooks();
      const existingIndex = books.findIndex((b) => b._id === book._id);

      if (existingIndex >= 0) {
        books[existingIndex] = book;
      } else {
        books.push(book);
      }

      await AsyncStorage.setItem(this.OFFLINE_BOOKS_KEY, JSON.stringify(books));
    } catch (error) {
      console.error("Error saving offline book:", error);
      throw error;
    }
  }

  // Xóa sách offline
  static async deleteOfflineBook(bookId: string): Promise<void> {
    try {
      const books = await this.getOfflineBooks();
      const filteredBooks = books.filter((book) => book._id !== bookId);
      await AsyncStorage.setItem(
        this.OFFLINE_BOOKS_KEY,
        JSON.stringify(filteredBooks)
      );

      // Xóa luôn các chapters của sách này
      await this.deleteOfflineChapters(bookId);
    } catch (error) {
      console.error("Error deleting offline book:", error);
      throw error;
    }
  }

  // Parse nội dung từ file (giả sử file là HTML hoặc text)
  static async parseBookContent(filePath: string): Promise<OfflineChapter[]> {
    try {
      const content = await FileSystem.readAsStringAsync(filePath);

      // Giả sử file có định dạng HTML với các chapter được phân tách bằng h2 hoặc h3
      // Bạn có thể tùy chỉnh logic parse này tùy theo định dạng file của bạn
      const chapters = this.parseChaptersFromHTML(content);
      return chapters;
    } catch (error) {
      console.error("Error parsing book content:", error);
      return [];
    }
  }

  // Parse chapters từ HTML content
  private static parseChaptersFromHTML(htmlContent: string): OfflineChapter[] {
    const chapters: OfflineChapter[] = [];

    // Regex để tìm các chapter (tùy chỉnh theo format file của bạn)
    const chapterRegex = /<h[2-3][^>]*>([^<]+)<\/h[2-3]>(.*?)(?=<h[2-3]|$)/gis;
    let match;
    let chapterNumber = 1;

    while ((match = chapterRegex.exec(htmlContent)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();

      chapters.push({
        _id: `offline-chapter-${chapterNumber}`,
        chapterNumber,
        chapterTitle: title,
        content,
        bookId: "", // Sẽ được set sau
      });

      chapterNumber++;
    }

    // Nếu không tìm thấy chapter nào, coi toàn bộ content là 1 chapter
    if (chapters.length === 0) {
      chapters.push({
        _id: "offline-chapter-1",
        chapterNumber: 1,
        chapterTitle: "Chapter 1",
        content: htmlContent,
        bookId: "",
      });
    }

    return chapters;
  }

  // Lưu chapters offline
  static async saveOfflineChapters(
    bookId: string,
    chapters: OfflineChapter[]
  ): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.OFFLINE_CHAPTERS_KEY);
      const allChapters = stored ? JSON.parse(stored) : {};

      // Gán bookId cho các chapters
      const chaptersWithBookId = chapters.map((chapter) => ({
        ...chapter,
        bookId,
      }));

      allChapters[bookId] = chaptersWithBookId;
      await AsyncStorage.setItem(
        this.OFFLINE_CHAPTERS_KEY,
        JSON.stringify(allChapters)
      );
    } catch (error) {
      console.error("Error saving offline chapters:", error);
      throw error;
    }
  }

  // Lấy chapters offline theo bookId
  static async getOfflineChapters(bookId: string): Promise<OfflineChapter[]> {
    try {
      const stored = await AsyncStorage.getItem(this.OFFLINE_CHAPTERS_KEY);
      const allChapters = stored ? JSON.parse(stored) : {};
      return allChapters[bookId] || [];
    } catch (error) {
      console.error("Error getting offline chapters:", error);
      return [];
    }
  }

  // Lấy chapter cụ thể
  static async getOfflineChapterDetail(
    bookId: string,
    chapterNumber: number
  ): Promise<OfflineChapter | null> {
    try {
      const chapters = await this.getOfflineChapters(bookId);
      return (
        chapters.find((chapter) => chapter.chapterNumber === chapterNumber) ||
        null
      );
    } catch (error) {
      console.error("Error getting offline chapter detail:", error);
      return null;
    }
  }

  static async getOfflineBookSize(bookId: string): Promise<number> {
    try {
      const book = await this.getOfflineBook(bookId);
      if (!book?.filePath) return 0;

      const fileInfo = await FileSystem.getInfoAsync(book.filePath);
      return fileInfo.exists ? fileInfo.size || 0 : 0;
    } catch (error) {
      console.error("❌ Lỗi khi lấy kích thước file:", error);
      return 0;
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Lấy tổng kích thước tất cả sách offline
  static async getTotalOfflineSize(): Promise<number> {
    try {
      const books = await this.getOfflineBooks();
      let totalSize = 0;

      for (const book of books) {
        if (book.filePath) {
          const fileInfo = await FileSystem.getInfoAsync(book.filePath);
          if (fileInfo.exists) {
            totalSize += fileInfo.size || 0;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error("❌ Lỗi khi tính tổng kích thước:", error);
      return 0;
    }
  }

  static async deleteAllOfflineBooks(): Promise<void> {
    try {
      const books = await this.getOfflineBooks();

      // Xóa tất cả file vật lý
      for (const book of books) {
        if (book.filePath) {
          const fileExists = await FileSystem.getInfoAsync(book.filePath);
          if (fileExists.exists) {
            await FileSystem.deleteAsync(book.filePath);
          }
        }
      }

      // Xóa tất cả dữ liệu AsyncStorage
      await AsyncStorage.removeItem(this.OFFLINE_BOOKS_KEY);
      await AsyncStorage.removeItem(this.OFFLINE_CHAPTERS_KEY);
      await AsyncStorage.removeItem(this.OFFLINE_PROGRESS_KEY);

      console.log("✅ Đã xóa tất cả sách offline");
    } catch (error) {
      console.error("❌ Lỗi khi xóa tất cả sách offline:", error);
      throw error;
    }
  }

  // Xóa chapters offline
  static async deleteOfflineChapters(bookId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.OFFLINE_CHAPTERS_KEY);
      const allChapters = stored ? JSON.parse(stored) : {};
      delete allChapters[bookId];
      await AsyncStorage.setItem(
        this.OFFLINE_CHAPTERS_KEY,
        JSON.stringify(allChapters)
      );
    } catch (error) {
      console.error("Error deleting offline chapters:", error);
      throw error;
    }
  }

  // Kiểm tra xem sách có phải offline không
  static isOfflineBook(bookId: string): boolean {
    return bookId.startsWith("offline-");
  }

  // Process file sau khi download
  static async processDownloadedBook(book: OfflineBook): Promise<void> {
    try {
      // Parse nội dung từ file
      const chapters = await this.parseBookContent(book.filePath);

      // Lưu chapters vào AsyncStorage
      await this.saveOfflineChapters(book._id, chapters);

      // Cập nhật book với số chapter
      const updatedBook = {
        ...book,
        chapters: chapters.length,
      };

      await this.saveOfflineBook(updatedBook);

      console.log(
        `✅ Processed offline book: ${book.title} with ${chapters.length} chapters`
      );
    } catch (error) {
      console.error("Error processing downloaded book:", error);
      throw error;
    }
  }
}
