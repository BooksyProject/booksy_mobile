import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import BookHeaderCard from "@/components/book-detail/BookHeaderCard";
import GenreBadge from "@/components/book-detail/GenreBadge";
import BookDescription from "@/components/book-detail/BookDescription";
import ChapterListPreview from "@/components/book-detail/ChapterListPreview";
import ReadNowButton from "@/components/book-detail/ReadNowButton";

export default function BookDetail() {
  const { id } = useLocalSearchParams(); // ✅ Lấy bookId từ URL

  return (
    <ScrollView className="flex-1 bg-white">
      <BookHeaderCard
        title="Moby Dick"
        author="Herman Melville"
        coverImage="http://i.pinimg.com/736x/ee/39/10/ee3910169f5d02918156b4358842a8a1.jpg"
        likes={100}
        chapters={101}
        views={200}
      />
      <GenreBadge genre="Detective" />
      <BookDescription description="Chuyện kỳ lạ xảy ra, là boss mèo cũng không cho bế..." />
      <ChapterListPreview
        chapters={[
          { title: "Chapter 1: Ngày đầu vào cửa", date: "jul 13, 2024" },
          { title: "Chapter 2: Con chim nhà Fitcher", date: "jul 13, 2024" },
          { title: "Chapter 3: Cánh cửa thứ nhất", date: "jul 13, 2024" },
          { title: "Chapter 4: Kẻ thừa ra", date: "jul 13, 2024" },
          { title: "Chapter 5: Miếu thần", date: "jul 13, 2024" },
        ]}
        onSeeAll={() => {}}
      />
      <ReadNowButton
        onPress={() => console.log("Go to reader with bookId:", id)}
      />
    </ScrollView>
  );
}
