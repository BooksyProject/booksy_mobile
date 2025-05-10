const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function getChapterDetail(bookId: string, chapterNumber: number) {
  const res = await fetch(
    `${BASE_URL}/chapter/detail?bookId=${bookId}&chapterNumber=${chapterNumber}`
  );
  if (!res.ok) throw new Error("Failed to fetch chapter");
  return await res.json();
}

export async function getChaptersByBook(bookId: string) {
  const res = await fetch(`${BASE_URL}/chapter/list?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch chapters");
  return await res.json(); // array of chapters
}
