// // lib/services/readingProgress.service.ts
// const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// interface SaveProgressParams {
//   chapterId: string;
//   chapterNumber: number;
//   percentage?: number;
// }

// export async function getReadingProgress(bookId: string) {
//   try {
//     const res = await fetch(`${BASE_URL}/progress/${bookId}`);
//     if (!res.ok) {
//       return { success: false, message: "Failed to fetch progress" }; // Trả về thông báo lỗi mà không ném ra
//     }
//     return await res.json();
//   } catch (error) {
//     // Không báo lỗi ra màn hình, chỉ log vào console nếu cần
//     console.error("Error fetching reading progress:", error);
//     return {
//       success: false,
//       message: "An error occurred while fetching progress",
//     }; // Trả về kết quả mặc định
//   }
// }

// export async function saveReadingProgress(
//   bookId: string,
//   data: SaveProgressParams
// ) {
//   const res = await fetch(`${BASE_URL}/progress/${bookId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Failed to save progress");
//   return await res.json();
// }
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface SaveProgressParams {
  userId: string;
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

interface ReadingProgressResponse {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
  lastReadAt?: string;
}

// ✅ GET: lấy tiến trình đọc theo `bookId` và `userId`
export async function getReadingProgress(
  bookId: string,
  userId: string
): Promise<ReadingProgressResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/progress/${bookId}?userId=${userId}`);
    if (!res.ok) {
      console.warn("Failed to fetch reading progress:", await res.text());
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching reading progress:", error);
    return null;
  }
}

// ✅ POST: lưu tiến trình đọc
export async function saveReadingProgress(
  bookId: string,
  data: SaveProgressParams
): Promise<{
  message: string;
  progress: ReadingProgressResponse;
}> {
  try {
    const res = await fetch(
      `${BASE_URL}/progress/${bookId}?userId=${data.userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: data.chapterId,
          chapterNumber: data.chapterNumber,
          percentage: data.percentage,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Failed to save reading progress:", errorText);
      throw new Error("Failed to save progress");
    }

    return await res.json();
  } catch (err) {
    console.error("❌ Error saving reading progress:", err);
    throw err;
  }
}
