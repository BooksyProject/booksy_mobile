import { ChapterInf } from "@/dtos/ChapterDTO";
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import Pagination from "@/components/ui/Pagination";
import useGoToReader from "@/hooks/goToReader";
import { colors } from "@/styles/colors";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "../../ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteChapter } from "@/lib/service/chapter.service";
import { PenIcon, TrashIcon } from "@/components/icon/Icons";
import EditChapterModal from "./EditChapterModal";

const PAGE_SIZE = 22;

interface SeeAllChapterProps {
  bookId: string;
  chapters: ChapterInf[];
  onClose: () => void;
  isCreatedByUser?: boolean;
  onDeleted?: (chapterId: string) => void;
  setChapters?: React.Dispatch<React.SetStateAction<ChapterInf[]>>; // ✅ optional updater
}

const SeeAllChapter: React.FC<SeeAllChapterProps> = ({
  bookId,
  chapters,
  onClose,
  isCreatedByUser,
  onDeleted,
  setChapters,
}) => {
  const goToReader = useGoToReader();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [page, setPage] = useState(1);
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const [editChapter, setEditChapter] = useState<ChapterInf | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const totalPages = Math.ceil(chapters.length / PAGE_SIZE);
  const currentChapters = chapters.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleChapterPress = (chapterNumber: number) => {
    goToReader(bookId, chapterNumber);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this chapter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteChapter(chapterId, token);
              if (res?.success) {
                Alert.alert("Chapter deleted");
                onDeleted?.(chapterId);
                setChapters?.((prev) =>
                  prev.filter((ch) => ch._id !== chapterId)
                );
              } else {
                Alert.alert("Delete failed", res.message);
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete chapter");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (chapter: ChapterInf) => {
    setEditChapter(chapter);
    setEditModalVisible(true);
  };

  return (
    <View className="flex-1 bg-opacity-50 bg-black justify-center items-center">
      <View
        className="w-[100%] h-full p-4"
        style={{ backgroundColor: bgColor }}
      >
        <ScrollView className="mb-4">
          {currentChapters.map((ch) => (
            <View
              key={ch._id}
              className="flex-row justify-between items-center py-2 border-b border-gray-200"
            >
              <TouchableOpacity
                onPress={() => handleChapterPress(ch.chapterNumber)}
              >
                <Text
                  className="text-base font-mregular"
                  style={{ color: textColor }}
                >
                  {ch.chapterTitle}
                </Text>
              </TouchableOpacity>

              {isCreatedByUser && (
                <View className="flex-row space-x-2">
                  <TouchableOpacity onPress={() => openEditModal(ch)}>
                    <PenIcon color={textColor} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="ml-2"
                    onPress={() => handleDeleteChapter(ch._id)}
                  >
                    <TrashIcon color={textColor} size={26} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* {totalPages > 1 && (
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        )} */}

        <View className="mt-6">
          <Button title="Close" onPress={onClose} />
        </View>

        {editChapter && (
          <EditChapterModal
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            chapter={editChapter}
            onUpdated={(updated) => {
              setChapters?.((prev) =>
                prev.map((ch) => (ch._id === updated._id ? updated : ch))
              );
              setEditModalVisible(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SeeAllChapter;
