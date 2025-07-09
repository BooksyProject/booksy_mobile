import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface SaveProgressParams {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

export async function getReadingProgress(bookId: string, userId: string) {
  try {
    console.log(bookId, userId, "getReadingProgress bookId");
    const res = await fetch(`${BASE_URL}/progress/${bookId}?userId=${userId}`);
    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.error || "Failed to fetch progress",
      };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error fetching reading progress:", error);
    return {
      success: false,
      message: "An error occurred while fetching progress",
    };
  }
}

export async function saveReadingProgress(
  bookId: string,
  data: SaveProgressParams,
  userId: string
) {
  try {
    const res = await fetch(`${BASE_URL}/progress/${bookId}?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to save progress");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error saving reading progress:", error);
    throw error;
  }
}

export const saveOfflineProgress = async (
  bookId: string,
  chapterNumber: number,
  percentage: number
) => {
  try {
    const progressKey = `offlineProgress:${bookId}`;
    await AsyncStorage.setItem(
      progressKey,
      JSON.stringify({
        lastReadChapter: chapterNumber,
        progressPercentage: percentage,
        updatedAt: new Date().toISOString(),
      })
    );
    console.log("📌 Tiến trình đọc đã được lưu offline");
  } catch (error) {
    console.error("❌ Lỗi khi lưu tiến trình đọc:", error);
  }
};

export const saveOnlineProgress = async (
  bookId: string,
  chapterNumber: number,
  percentage: number
) => {
  try {
    const progressKey = `${bookId}`;
    await AsyncStorage.setItem(
      progressKey,
      JSON.stringify({
        lastReadChapter: chapterNumber,
        progressPercentage: percentage,
        updatedAt: new Date().toISOString(),
      })
    );
    console.log("📌 Tiến trình đọc đã được lưu online");
  } catch (error) {
    console.error("❌ Lỗi khi lưu tiến trình đọc:", error);
  }
};
