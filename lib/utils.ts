// timeUtils.js
import { Platform } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";

import { unzip } from "react-native-zip-archive";

interface SaveFileOptions {
  fileUrl: string;
  onProgress: (
    progress: number,
    downloadedBytes: number,
    totalBytes: number
  ) => void;
}

export const getTimeAgo = (time: any) => {
  const now = Date.now(); // Lấy thời gian hiện tại dưới dạng mili giây
  const messageTime = new Date(time).getTime();

  // Kiểm tra xem messageTime có hợp lệ không
  if (isNaN(messageTime)) {
    return "Thời gian không hợp lệ";
  }

  const seconds = Math.floor((now - messageTime) / 1000);

  let interval = Math.floor(seconds / 31536000); // Số giây trong một năm
  if (interval >= 1)
    return interval === 1 ? "1 năm trước" : `${interval} năm trước`;

  interval = Math.floor(seconds / 2592000); // Số giây trong một tháng
  if (interval >= 1)
    return interval === 1 ? "1 tháng trước" : `${interval} tháng trước`;

  interval = Math.floor(seconds / 86400); // Số giây trong một ngày
  if (interval >= 1)
    return interval === 1 ? "1 ngày trước" : `${interval} ngày trước`;

  interval = Math.floor(seconds / 3600); // Số giây trong một giờ
  if (interval >= 1)
    return interval === 1 ? "1 giờ trước" : `${interval} giờ trước`;

  interval = Math.floor(seconds / 60); // Số giây trong một phút
  if (interval >= 1)
    return interval === 1 ? "1 phút trước" : `${interval} phút trước`;

  return "Vừa mới đây"; // Khi tin nhắn vừa mới được gửi
};

export const getTimestamp = (createdAt: string | Date): string => {
  const now = new Date();

  const createdAtDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  if (isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt date");
  }

  const seconds = Math.floor((now.getTime() - createdAtDate.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000); // years

  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1
      ? `${interval} minute ago`
      : `${interval} minutes ago`;
  }

  // seconds
  return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
};

export const getFileFormat = (mimeType: string, fileName: string): string => {
  // Lấy định dạng từ MIME type
  const inferredFormat = mimeType.split("/")[1]; // Lấy phần sau dấu "/"

  // Kiểm tra nếu định dạng từ MIME type là hợp lệ
  if (inferredFormat && /^[a-zA-Z0-9]+$/.test(inferredFormat)) {
    return inferredFormat; // Nếu hợp lệ, trả về định dạng
  }

  // Fallback: Lấy đuôi file từ fileName
  const fileExtension = fileName.split(".").pop();
  if (fileExtension && /^[a-zA-Z0-9]+$/.test(fileExtension)) {
    return fileExtension; // Nếu đuôi file hợp lệ, trả về đuôi file
  }

  // Trả về "unknown" nếu không xác định được
  return "unknown";
};

export const timeSinceMessage = (timestamp: Date | string) => {
  const now = new Date();
  const messageTimestamp = new Date(timestamp);
  const diffInMs = now.getTime() - messageTimestamp.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays} ngày`;
  if (diffInHours > 0) return `${diffInHours} giờ`;
  if (diffInMinutes > 0) return `${diffInMinutes} phút`;
  return `${diffInSeconds} giây`;
};

export const generateRandomNumberString = (length: number) => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);

    return result;
  }
};

// Định nghĩa interface thống nhất
interface ProgressCallback {
  (progress: number, downloadedBytes: number, totalBytes: number): void;
}

interface SaveFileOptions {
  fileUrl: string;
  onPgr?: ProgressCallback; // Optional callback
}

interface SaveFileResult {
  filePath: string;
  fileSize: number;
}
export const saveFile = async (
  options: SaveFileOptions
): Promise<SaveFileResult> => {
  const { fileUrl, onProgress } = options;

  try {
    // 1. Tạo thư mục nếu chưa tồn tại
    const dirs = ReactNativeBlobUtil.fs.dirs;
    const downloadDir =
      Platform.OS === "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    const bookDir = `${downloadDir}/Books`;

    const exists = await ReactNativeBlobUtil.fs.exists(bookDir);
    if (!exists) {
      await ReactNativeBlobUtil.fs.mkdir(bookDir);
    }

    // 2. Tải file
    const fileName = fileUrl.split("/").pop() || `book_${Date.now()}`;
    const filePath = `${bookDir}/${fileName}`;

    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      path: filePath,
    })
      .fetch("GET", fileUrl)
      .progress((received, total) => {
        const progress = Math.floor((Number(received) / Number(total)) * 100);
        onProgress?.(progress, Number(received), Number(total));
      });

    // 3. Nếu là EPUB thì unzip
    if (/\.epub$/i.test(fileName)) {
      const unzipPath = `${bookDir}/${fileName.replace(/\.epub$/i, "")}`;
      await unzip(response.path(), unzipPath);
      const fileInfo = await ReactNativeBlobUtil.fs.stat(unzipPath);
      return {
        filePath: unzipPath,
        fileSize: Number(fileInfo.size),
      };
    }

    // 4. Trả kết quả cho các định dạng khác
    const fileInfo = await ReactNativeBlobUtil.fs.stat(response.path());
    return {
      filePath: response.path(),
      fileSize: Number(fileInfo.size),
    };
  } catch (error) {
    console.error("Save file error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to save file"
    );
  }
};
