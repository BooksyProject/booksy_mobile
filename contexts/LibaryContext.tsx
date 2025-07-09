import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OfflineBook {
  _id: string;
  title: string;
  coverImage: string;
  downloadedAt: number;
  [key: string]: any;
}

interface LibraryContextType {
  offlineBooks: OfflineBook[];
  refreshLibrary: () => Promise<void>;
  addBookToLibrary: (book: OfflineBook) => void;
  removeBookFromLibrary: (book: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }
  return context;
};

export const LibraryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [offlineBooks, setOfflineBooks] = useState<OfflineBook[]>([]);

  const refreshLibrary = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const bookKeys = allKeys.filter(
      (k) => k.startsWith("offline:") && !k.includes("chapter")
    );

    const bookItems = await AsyncStorage.multiGet(bookKeys);
    const books = bookItems
      .map(([, value]) => {
        try {
          return value ? JSON.parse(value) : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as OfflineBook[];

    // Sort theo thời gian tải gần nhất
    books.sort((a, b) => b.downloadedAt - a.downloadedAt);

    setOfflineBooks(books);
  };

  const addBookToLibrary = (book: OfflineBook) => {
    setOfflineBooks((prev) => {
      const exists = prev.find((b) => b._id === book._id);
      if (exists) return prev; // không thêm nếu đã có
      return [book, ...prev];
    });
  };

  const removeBookFromLibrary = async (bookId: string) => {
    try {
      // Xoá sách chính
      await AsyncStorage.removeItem(`offline:${bookId}`);

      // Lấy tất cả keys chương để xoá
      const allKeys = await AsyncStorage.getAllKeys();
      const chapterKeys = allKeys.filter((k) =>
        k.startsWith(`offline:${bookId}:chapter:`)
      );
      await AsyncStorage.multiRemove(chapterKeys);

      // Cập nhật lại state
      setOfflineBooks((prev) =>
        prev.filter((b) => b._id !== `offline-${bookId}`)
      );
    } catch (error) {
      console.error("❌ Lỗi khi xoá sách offline:", error);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        offlineBooks,
        refreshLibrary,
        addBookToLibrary,
        removeBookFromLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
