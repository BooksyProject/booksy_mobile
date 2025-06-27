import { ChapterInf } from "@/dtos/ChapterDTO";
import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Pagination from "@/components/ui/Pagination";
import useGoToReader from "@/hooks/goToReader";

const PAGE_SIZE = 22;

interface SeeAllChapterProps {
  bookId: string;
  chapters: ChapterInf[];
  onClose: () => void;
}

const SeeAllChapter: React.FC<SeeAllChapterProps> = ({
  bookId,
  chapters,
  onClose,
}) => {
  const goToReader = useGoToReader();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(chapters.length / PAGE_SIZE);
  const currentChapters = chapters.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleChapterPress = (chapterNumber: number) => {
    goToReader(bookId, chapterNumber);
  };

  return (
    <View className="flex-1 bg-opacity-70 bg-black justify-center items-center">
      <View className="w-[90%] h-full bg-white rounded-lg p-4">
        <ScrollView className="mb-4">
          {currentChapters.map((ch, index) => (
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />

        <TouchableOpacity
          onPress={onClose}
          className="mt-4 bg-gray-500 p-2 rounded-full"
        >
          <Text className="text-white text-center">Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SeeAllChapter;
