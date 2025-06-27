const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export async function getAllCategories() {
  const res = await fetch(`${BASE_URL}/category/all`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return await res.json();
}
