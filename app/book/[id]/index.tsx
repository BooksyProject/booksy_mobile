import { ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BookHeaderCard from "@/components/book-detail/BookHeaderCard";
import GenreBadge from "@/components/ui/GenreBadge";
import BookDescription from "@/components/book-detail/BookDescription";
import ChapterListPreview from "@/components/book-detail/ChapterListPreview";
import ReadNowButton from "@/components/book-detail/ReadNowButton";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import goToReader from "@/hooks/goToReader";
import useGoToReader from "@/hooks/goToReader";
export default function BookDetail() {
  const { id } = useLocalSearchParams(); // ✅ Lấy bookId từ URL
  const router = useRouter();
  const bookId = "681e0db975db5dcb5e68ac6a";
  const { progress, loading } = useReadingProgressManager(bookId);
  const goToReader = useGoToReader();
  return (
    <ScrollView className="flex-1 bg-book-background">
      <BookHeaderCard
        title="Moby Dick"
        author="Herman Melville"
        coverImage="http://i.pinimg.com/736x/ee/39/10/ee3910169f5d02918156b4358842a8a1.jpg"
        likes={100}
        chapters={101}
        views={200}
      />
      <BookDescription
        description="Chuyện kỳ lạ đầu tiên xảy ra, là boss mèo cưng không cho bế.
Lâm Thu Thạch phát hiện mọi thứ xung quanh không còn bình thường như trước nữa. Sau đó vào một ngày, lúc anh đang mở cánh cửa trong nhà, phát hiện hành lang bình thường đã biến thành dãy hành lang dài lạ hoắc."
      />
      <ChapterListPreview
        chapters={[
          { title: "Chapter 1: Ngày đầu vào cửa", date: "jul 13, 2024" },
          { title: "Chapter 2: Con chim nhà Fitcher", date: "jul 13, 2024" },
          { title: "Chapter 3: Cánh cửa thứ nhất", date: "jul 13, 2024" },
          { title: "Chapter 4: Kẻ thừa ra", date: "jul 13, 2024" },
          { title: "Chapter 5: Miếu thần", date: "jul 13, 2024" },
          { title: "Chapter 1: Ngày đầu vào cửa", date: "jul 13, 2024" },
          { title: "Chapter 2: Con chim nhà Fitcher", date: "jul 13, 2024" },
          { title: "Chapter 3: Cánh cửa thứ nhất", date: "jul 13, 2024" },
          { title: "Chapter 4: Kẻ thừa ra", date: "jul 13, 2024" },
          { title: "Chapter 5: Miếu thần", date: "jul 13, 2024" },
        ]}
        onSeeAll={() => router.push(`/book/${id}/seeAllChapter`)}
      />
      {/* <ReadNowButton
        hasProgress={!!progress}
        onPress={() => goToReader(String(bookId), progress?.chapterNumber || 1)}
      /> */}
      {!loading && (
        <ReadNowButton
          hasProgress={!!progress}
          onPress={() => goToReader(String(id), progress?.chapterNumber || 1)}
        />
      )}
    </ScrollView>
  );
}
