import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { openBrowserAsync } from "expo-web-browser";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function getBookDetail(bookId: String) {
  const res = await fetch(`${BASE_URL}/book/getDetailBook?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch book detail");
  return await res.json();
}

export async function likeBook(bookId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/book/likeBook`, {
    method: "POST", // Sử dụng POST thay vì GET
    headers: {
      "Content-Type": "application/json", // Gửi dữ liệu dưới dạng JSON
    },
    body: JSON.stringify({
      bookId, // Truyền bookId vào body
      userId, // Truyền userId vào body
    }),
  });

  // Kiểm tra nếu phản hồi không ok
  if (!res.ok) throw new Error("Failed to like book");

  // Trả về kết quả JSON từ response
  return await res.json();
}

export async function getMyBook(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/book/my-books`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch your books");
    }

    return await res.json(); // { success: true, data: [...] }
  } catch (error: any) {
    console.error("❌ getMyBook error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

interface CreateBookParams {
  title: string;
  author: string;
  categories: string[];
  description: string;
  coverImage: string;
  fileURL: string;
  fileType: string;
}

export async function createBook(params: CreateBookParams, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/book/createBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create book");
    }

    return await res.json(); // { message, data }
  } catch (error: any) {
    console.error("❌ createBook error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

export async function deleteBook(bookId: string, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/book/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete book");
    }

    return await res.json(); // { message: "Book deleted successfully" }
  } catch (error: any) {
    console.error("❌ deleteBook error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

export interface UpdateBookParams {
  title?: string;
  author?: string;
  categories?: string[];
  description?: string;
  coverImage?: string;
  fileURL?: string;
  fileType?: string;
}

export async function updateBook(
  bookId: string,
  updateData: UpdateBookParams,
  token: string
) {
  try {
    const res = await fetch(`${BASE_URL}/book/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update book");
    }

    return await res.json(); // { message, book }
  } catch (error: any) {
    console.error("❌ updateBook error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

export async function unlikeBook(bookId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/book/unlikeBook`, {
    method: "POST", // Sử dụng POST thay vì GET
    headers: {
      "Content-Type": "application/json", // Gửi dữ liệu dưới dạng JSON
    },
    body: JSON.stringify({
      bookId, // Truyền bookId vào body
      userId, // Truyền userId vào body
    }),
  });

  // Kiểm tra nếu phản hồi không ok
  if (!res.ok) throw new Error("Failed to like book");

  // Trả về kết quả JSON từ response
  return await res.json();
}

export async function getAllBooks() {
  const res = await fetch(`${BASE_URL}/book/all`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return await res.json();
}

export async function downloadBook(bookId: string) {
  try {
    console.log("da vao day");
    const response = await fetch(
      `${BASE_URL}/book/downloadBook?bookId=${bookId}`
    );

    if (!response.ok) {
      throw new Error("Failed to download book");
    }

    // Convert the ArrayBuffer to a Base64 string
    const arrayBuffer = await response.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);

    const fileUri = FileSystem.documentDirectory + "downloadedBook.pdf";

    // Write the Base64 string to the file
    await FileSystem.writeAsStringAsync(fileUri, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Book downloaded to:", fileUri);
  } catch (error) {
    console.error("Download error:", error);
  }
}

// Helper function to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: any) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export async function getLikedBooks(userId: String) {
  const res = await fetch(`${BASE_URL}/book/getLikedBooks?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch liked books");
  return await res.json();
}
