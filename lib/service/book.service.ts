const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function getBookDetail(bookId: String) {
  const res = await fetch(`${BASE_URL}/book/getDetailBook?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch book detail");
  return await res.json();
}

export async function likeBook(bookId: String, userId: String) {
  const res = await fetch(
    `${BASE_URL}/book/likeBook?bookId=${bookId}&userId=${userId}`
  );
  if (!res.ok) throw new Error("Failed to like book");
  return await res.json();
}
