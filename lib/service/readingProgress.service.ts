// lib/services/readingProgress.service.ts
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface SaveProgressParams {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

export async function getReadingProgress(bookId: string) {
  try {
    const res = await fetch(`${BASE_URL}/progress/${bookId}`);
    if (!res.ok) {
      return { success: false, message: "Failed to fetch progress" }; // Trả về thông báo lỗi mà không ném ra
    }
    return await res.json();
  } catch (error) {
    // Không báo lỗi ra màn hình, chỉ log vào console nếu cần
    console.error("Error fetching reading progress:", error);
    return {
      success: false,
      message: "An error occurred while fetching progress",
    }; // Trả về kết quả mặc định
  }
}

export async function saveReadingProgress(
  bookId: string,
  data: SaveProgressParams
) {
  const res = await fetch(`${BASE_URL}/progress/${bookId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save progress");
  return await res.json();
}
