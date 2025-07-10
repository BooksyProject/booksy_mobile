// import { useRouter } from "expo-router";

// export default function useGoToReader() {
//   const router = useRouter();

//   return (bookIdOrPath: string, chapterNumber: number = 1) => {
//     console.log(bookIdOrPath, "bookIdOrPath");
//     if (
//       bookIdOrPath.startsWith("offline") ||
//       bookIdOrPath.startsWith("file://") ||
//       bookIdOrPath.startsWith("/storage/emulated/0")
//     ) {
//       // Mở chế độ offline
//       router.push({
//         pathname: "/offline-reader/[offline-reader]",
//         params: {
//           bookId: String(bookIdOrPath),
//           chapter: String(chapterNumber),
//         },
//       });
//     } else {
//       // Mở chế độ online
//       router.push({
//         pathname: "/reader/[bookId]",
//         params: {
//           bookId: bookIdOrPath,
//           chapter: String(chapterNumber),
//         },
//       });
//     }
//   };
// }
import { useRouter } from "expo-router";

export default function useGoToReader() {
  const router = useRouter();

  return (bookIdOrPath: string, chapterNumber: number = 1) => {
    const forceReloadKey = Date.now(); // hoặc dùng Math.random() cũng được

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
      // Mở chế độ online — thêm `t` để force reload
      router.push({
        pathname: "/reader/[bookId]",
        params: {
          bookId: bookIdOrPath,
          chapter: String(chapterNumber),
          t: String(forceReloadKey), // 👈 Thêm t để ép ReaderScreen gọi lại useEffect
        },
      });
    }
  };
}
