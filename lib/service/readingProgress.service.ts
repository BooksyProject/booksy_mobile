const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface SaveProgressParams {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

export async function getReadingProgress(bookId: string, userId: string) {
  try {
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
