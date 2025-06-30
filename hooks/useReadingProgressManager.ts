// // import {
// //   getReadingProgress,
// //   saveReadingProgress,
// // } from "@/lib/service/readingProgress.service";
// // import { useEffect, useState } from "react";
// // interface ReadingProgress {
// //   chapterId: string;
// //   chapterNumber: number;
// //   percentage?: number;
// // }
// // export default function useReadingProgressManager(bookId?: string) {
// //   const [progress, setProgress] = useState<null | {
// //     chapterId: string;
// //     chapterNumber: number;
// //     percentage?: number;
// //   }>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (!bookId) return;

// //     const fetchProgress = async () => {
// //       try {
// //         const data = await getReadingProgress(bookId);
// //         console.log(data, "data of progress get");
// //         setProgress(data);
// //       } catch (err) {
// //         console.error("Failed to load reading progress:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProgress();
// //   }, [bookId, progress?.chapterId]);

// //   const save = async (data: {
// //     chapterId: string;
// //     chapterNumber: number;
// //     percentage?: number;
// //   }) => {
// //     try {
// //       // Save progress to the server
// //       await saveReadingProgress(bookId!, data);
// //       // Update local progress state synchronously
// //       setProgress(data);
// //       console.log("Saved progress:", data);
// //     } catch (err) {
// //       console.error("Error saving progress:", err);
// //     }
// //   };

// //   // Save progress when chapter changes or when navigating
// //   const updateProgress = (
// //     chapterId: string,
// //     chapterNumber: number,
// //     percentage: number
// //   ) => {
// //     const newProgress = { chapterId, chapterNumber, percentage };
// //     save(newProgress); // Save progress immediately
// //   };

// //   return { progress, loading, save, updateProgress };
// // }

// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   getReadingProgress,
//   saveReadingProgress,
// } from "@/lib/service/readingProgress.service";

// interface ReadingProgress {
//   chapterId: string;
//   chapterNumber: number;
//   percentage?: number;
// }

// export default function useReadingProgressManager(bookId?: string) {
//   const [progress, setProgress] = useState<ReadingProgress | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);

//   // Load userId từ AsyncStorage 1 lần
//   useEffect(() => {
//     AsyncStorage.getItem("userId").then((id) => {
//       if (id) setUserId(id);
//       else console.warn("⚠️ userId not found in AsyncStorage");
//     });
//   }, []);

//   // Fetch progress khi có bookId và userId
//   useEffect(() => {
//     if (!bookId || !userId) return;

//     const fetchProgress = async () => {
//       try {
//         const data = await getReadingProgress(bookId, userId);
//         if (data) {
//           setProgress(data);
//           console.log("📖 Loaded progress:", data);
//         } else {
//           console.log("ℹ️ No existing progress");
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch progress:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProgress();
//   }, [bookId, userId]);

//   const save = async (data: ReadingProgress) => {
//     if (!bookId || !userId) return;

//     try {
//       await saveReadingProgress(bookId, { ...data, userId });
//       setProgress(data);
//       console.log("✅ Saved progress:", data);
//     } catch (err) {
//       console.error("❌ Failed to save progress:", err);
//     }
//   };

//   const updateProgress = (
//     chapterId: string,
//     chapterNumber: number,
//     percentage: number
//   ) => {
//     const newProgress = { chapterId, chapterNumber, percentage };
//     save(newProgress);
//   };

//   return { progress, loading, save, updateProgress };
// }

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReadingProgress,
  saveReadingProgress,
} from "@/lib/service/readingProgress.service";

interface ReadingProgress {
  chapterId: string;
  chapterNumber: number;
  percentage?: number;
}

export default function useReadingProgressManager(bookId?: string) {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      if (id) setUserId(id);
      else console.warn("⚠️ userId not found in AsyncStorage");
    });
  }, []);

  // Hàm lấy progress để dùng lại
  const getProgress = async () => {
    if (!bookId || !userId) return null;

    try {
      const data = await getReadingProgress(bookId, userId);
      if (data) {
        setProgress(data);
        return data;
      }
    } catch (err) {
      console.error("❌ Failed to get progress:", err);
    }
    return null;
  };

  useEffect(() => {
    if (!bookId || !userId) return;

    const fetchProgress = async () => {
      setLoading(true);
      await getProgress();
      setLoading(false);
    };

    fetchProgress();
  }, [bookId, userId]);

  const save = async (data: ReadingProgress) => {
    if (!bookId || !userId) return;

    try {
      await saveReadingProgress(bookId, { ...data, userId });
      setProgress(data);
      console.log("✅ Saved progress:", data);
    } catch (err) {
      console.error("❌ Failed to save progress:", err);
    }
  };

  const updateProgress = (
    chapterId: string,
    chapterNumber: number,
    percentage: number
  ) => {
    const newProgress = { chapterId, chapterNumber, percentage };
    save(newProgress);
  };

  return { progress, loading, save, updateProgress, getProgress };
}
