import Pagination from "@/components/ui/Pagination";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";

const allChapters = Array.from({ length: 101 }).map((_, i) => ({
  title: `Chapter ${i + 1}: Tiêu đề chương`,
  date: "Jul 13, 2024",
}));

const PAGE_SIZE = 22;

export default function SeeAllChapterScreen() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allChapters.length / PAGE_SIZE);
  const { id } = useLocalSearchParams();
  const currentChapters = allChapters.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <ScrollView className="flex-1 bg-book-background p-4 ">
      <Text className="text-xl font-mbold mb-4">All Chapters of Book {id}</Text>

      {currentChapters.map((chapter, index) => (
        <View key={index} className="flex-row justify-between py-2">
          <Text className="text-base font-mregular text-light-500">
            {chapter.title}
          </Text>
          <Text className="text-sm font-mregular text-light-500">
            {chapter.date}
          </Text>
        </View>
      ))}
      <View className="mb-10">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </View>
    </ScrollView>
  );
}
