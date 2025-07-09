import { CreateChapterDTO } from "@/dtos/ChapterDTO";

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

export async function createChapter(params: CreateChapterDTO, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/chapter/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create chapter");
    }

    return await res.json();
  } catch (error: any) {
    console.error("❌ createChapterService error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

export async function updateChapter(
  chapterId: string,
  updateData: Partial<CreateChapterDTO>,
  token: string
) {
  try {
    const res = await fetch(`${BASE_URL}/chapter/${chapterId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update chapter");
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("❌ updateChapter error:", error.message);
    throw error;
  }
}

export async function deleteChapter(chapterId: string, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/chapter/${chapterId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete chapter");
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("❌ deleteChapter error:", error.message);
    throw error;
  }
}
