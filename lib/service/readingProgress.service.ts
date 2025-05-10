// lib/services/readingProgress.service.ts
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface SaveProgressParams {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

export async function getReadingProgress(bookId: string) {
  console.log(`${BASE_URL}/progress/${bookId}`);
  const res = await fetch(`${BASE_URL}/progress/${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return await res.json();
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
