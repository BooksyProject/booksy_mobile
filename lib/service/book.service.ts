import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import RNFS from "react-native-fs";
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

export async function getAllBooks() {
  const res = await fetch(`${BASE_URL}/book/all`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return await res.json();
}

// export async function handleDownload(bookId: string) {
//   try {
//     // 1. Hiển thị trạng thái đang tải
//     console.log("📥 Starting download for book:", bookId);

//     // 2. Gọi API download
//     const response = await fetch(
//       `${BASE_URL}/book/downloadBook?bookId=${bookId}`
//     );

//     // 3. Xử lý lỗi HTTP
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error || "Failed to download book");
//     }

//     // 4. Lấy thông tin file từ header
//     const contentDisposition = response.headers.get("Content-Disposition");
//     const contentType = response.headers.get("Content-Type");
//     const fileName = contentDisposition
//       ? decodeURIComponent(
//           contentDisposition.split("filename=")[1].replace(/"/g, "")
//         )
//       : `book_${bookId}.${contentType?.split("/")[1] || "epub"}`;

//     // 5. Tạo blob từ response
//     const blob = await response.blob();
//     console.log("✅ Download completed. File info:", {
//       name: fileName,
//       type: contentType,
//       size: blob.size,
//     });

//     // 6. Tạo URL tạm và kích hoạt tải về
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.setAttribute("download", fileName);
//     document.body.appendChild(link);
//     link.click();

//     // 7. Dọn dẹp
//     setTimeout(() => {
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(downloadUrl);
//     }, 100);

//     return {
//       success: true,
//       fileName,
//       fileType: contentType,
//       fileSize: blob.size,
//     };
//   } catch (error) {
//     console.error("💥 Download failed:", error);
//     throw new Error(
//       error instanceof Error
//         ? error.message
//         : "An unknown error occurred during download"
//     );
//   }
// }

export async function handleDownload(bookId: string) {
  try {
    console.log("📥 Starting download for book:", bookId);

    const downloadUrl = `${BASE_URL}/book/downloadBook?bookId=${bookId}`;
    const fileName = `book_${bookId}.epub`;
    const fileUri = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // Bắt đầu tải file
    const response = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: fileUri,
    }).promise;

    if (response.statusCode === 200) {
      console.log("✅ Download completed. File info:", {
        name: fileName,
        size: response.bytesWritten,
      });

      // Mở hoặc chia sẻ file nếu cần
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/epub+zip",
          dialogTitle: "Download Complete",
        });
      } else {
        Alert.alert("Download Complete", `File saved to: ${fileUri}`);
      }

      return { success: true, filePath: fileUri };
    } else {
      throw new Error("Failed to download book");
    }
  } catch (error) {
    console.error("💥 Download failed:", error);
    Alert.alert("Error", "Failed to download file");
    throw error;
  }
}
