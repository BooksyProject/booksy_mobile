import { ChapterInf } from "@/dtos/ChapterDTO";
import useGoToReader from "@/hooks/goToReader";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface Props {
  bookId: string; // Thêm bookId vào Props
  chapters: ChapterInf[];
  onSeeAll?: () => void;
}

export default function ChapterListPreview({
  bookId,
  chapters,
  onSeeAll,
}: Props) {
  const goToReader = useGoToReader(); // Khởi tạo hook
  const [showAll, setShowAll] = useState(false); // State to toggle between showing 5 chapters or all chapters

  const handleChapterPress = (chapterNumber: number) => {
    // Khi bấm vào chương, điều hướng đến màn hình Reader
    goToReader(bookId, chapterNumber);
  };

  const handleSeeAllPress = () => {
    setShowAll(true);
    if (onSeeAll) onSeeAll(); // Call the passed onSeeAll function if it exists
  };

  const displayedChapters = showAll ? chapters : chapters.slice(0, 10); // Show first 5 chapters or all chapters based on the state

  return (
    <View className="mt-6 px-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-msemibold text-lg">
          {chapters.length} chapters
        </Text>
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text className="text-custom-red font-mregular text-base">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      {/* ScrollView to allow scrolling through the chapters */}
      <ScrollView style={{ maxHeight: 300 }}>
        {displayedChapters.map((ch, index) => (
          <View
            key={index}
            className="flex-row justify-between py-2 border-b border-gray-200"
          >
            <TouchableOpacity onPress={() => handleChapterPress(index + 1)}>
              <Text className="text-sm font-mregular text-light-500">
                {ch.chapterTitle}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
