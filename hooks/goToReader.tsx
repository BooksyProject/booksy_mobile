import { useRouter } from "expo-router";

export default function useGoToReader() {
  const router = useRouter();

  return (bookIdOrPath: string, chapterNumber: number = 1) => {
    console.log(bookIdOrPath, "bookIdOrPath");
    if (
      bookIdOrPath.startsWith("offline") ||
      bookIdOrPath.startsWith("file://") ||
      bookIdOrPath.startsWith("/storage/emulated/0")
    ) {
      // Mở chế độ offline
      router.push({
        pathname: "/offline-reader/[offline-reader]",
        params: {
          bookId: String(bookIdOrPath),
          chapter: String(chapterNumber),
        },
      });
    } else {
      // Mở chế độ online
      router.push({
        pathname: "/reader/[bookId]",
        params: {
          bookId: bookIdOrPath,
          chapter: String(chapterNumber),
        },
      });
    }
  };
}
