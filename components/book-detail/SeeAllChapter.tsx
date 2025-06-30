import { ChapterInf } from "@/dtos/ChapterDTO";
import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Pagination from "@/components/ui/Pagination";
import useGoToReader from "@/hooks/goToReader";
import { colors } from "@/styles/colors";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "../ui/button";

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
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [page, setPage] = useState(1);
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const totalPages = Math.ceil(chapters.length / PAGE_SIZE);
  const currentChapters = chapters.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleChapterPress = (chapterNumber: number) => {
    goToReader(bookId, chapterNumber);
  };

  return (
    <View className="flex-1 bg-opacity-50 bg-black justify-center items-center">
      <View
        className="w-[100%] h-full  p-4"
        style={{ backgroundColor: bgColor }}
      >
        <ScrollView className="mb-4">
          {currentChapters.map((ch, index) => (
            <View
              key={index}
              className="flex-row justify-between py-2 border-b border-gray-200"
            >
              <TouchableOpacity onPress={() => handleChapterPress(index + 1)}>
                <Text
                  className="text-base font-mregular"
                  style={{ color: textColor }}
                >
                  {ch.chapterTitle}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View className="mt-6">
          <Button title="Close" onPress={onClose} outline={false} />
        </View>
      </View>
    </View>
  );
};

export default SeeAllChapter;
