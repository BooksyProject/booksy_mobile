import { ChapterInf } from "@/dtos/ChapterDTO";
import useGoToReader from "@/hooks/goToReader";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import SeeAllChapter from "./SeeAllChapter"; // Import modal

interface Props {
  bookId: string;
  chapters: ChapterInf[];
}

export default function ChapterListPreview({ bookId, chapters }: Props) {
  const goToReader = useGoToReader();
  const [showAll, setShowAll] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = async () => {
    setModalVisible(true); // Mở modal khi nhấn vào See all
  };

  const handleChapterPress = (chapterNumber: number) => {
    goToReader(bookId, chapterNumber);
  };

  const displayedChapters = showAll ? chapters : chapters.slice(0, 10);

  return (
    <View className="mt-6 px-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-msemibold text-lg">
          {chapters.length} chapters
        </Text>
        <TouchableOpacity onPress={openModal}>
          <Text className="text-custom-red font-mregular text-base">
            See all
          </Text>
        </TouchableOpacity>
      </View>

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

      {/* Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SeeAllChapter
          bookId={bookId} // Truyền bookId vào modal
          chapters={chapters} // Truyền chapters vào modal
          onClose={() => setModalVisible(false)} // Đóng modal khi nhấn nút đóng
        />
      </Modal>
    </View>
  );
}
