import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import {
  getChapterDetail,
  getChaptersByBook,
} from "@/lib/service/chapter.service";
import Pagination from "@/components/ui/Pagination";

interface ChapterData {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
}

const IMAGE_BASE_URL = "http://192.168.31.244:3000/"; // 🔁 Cập nhật đúng URL server của bạn

export default function ReaderScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { bookId, chapter } = useLocalSearchParams();
  const chapterNumber = Number(chapter || 1);
  const [chapterTotal, setChapterTotal] = useState<number>(0);

  const { save } = useReadingProgressManager(bookId as string);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch nội dung chương
  useEffect(() => {
    if (!bookId) return;

    const fetchChapter = async () => {
      try {
        setLoading(true);
        const data = await getChapterDetail(String(bookId), chapterNumber);

        // ✅ Replace đường dẫn ảnh tương đối thành tuyệt đối
        const fixedContent = data.content.replace(
          /src="\/([^"]+)"/g,
          `src="${IMAGE_BASE_URL}/$1"`
        );

        console.log(fixedContent);

        setChapterData({
          ...data,
          content: fixedContent,
        });
      } catch (err) {
        console.error("❌ Failed to fetch chapter:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchChapterTotal = async () => {
      try {
        const chapters = await getChaptersByBook(String(bookId));
        setChapterTotal(chapters.length);
      } catch (err) {
        console.error("❌ Failed to fetch chapter list:", err);
      }
    };

    fetchChapter();
    fetchChapterTotal();
  }, [bookId, chapterNumber]);

  // Lưu tiến trình khi rời màn hình
  useEffect(() => {
    return () => {
      if (chapterData?._id) {
        save({
          chapterId: chapterData._id,
          chapterNumber: chapterData.chapterNumber,
          percentage: 100,
        });
      }
    };
  }, [chapterData]);

  const goToChapter = (newChapter: number) => {
    router.replace({
      pathname: "/reader/[bookId]",
      params: {
        bookId: String(bookId),
        chapter: String(newChapter),
      },
    });
  };

  if (loading || !chapterData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-600">Đang tải chương...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Nội dung chương */}
      <ScrollView
        className="flex-1 px-4 py-6"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text className="text-xl font-bold mb-4">
          {chapterData.chapterTitle}
        </Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: chapterData.content }}
          baseStyle={{
            fontSize: 16,
            lineHeight: 28,
            color: "#1f2937",
          }}
          enableExperimentalMarginCollapsing={true}
          defaultTextProps={{ selectable: true }}
        />
      </ScrollView>

      {/* Pagination nút chương */}
      <View className="px-6 border-t border-gray-200 bg-white">
        <Pagination
          currentPage={chapterNumber}
          totalPages={chapterTotal || 1}
          onChange={(newPage) => {
            if (newPage >= 1 && newPage <= chapterTotal) {
              goToChapter(newPage);
            }
          }}
        />
      </View>
    </View>
  );
}
