// import { ChapterInf } from "@/dtos/ChapterDTO";
// import useGoToReader from "@/hooks/goToReader";
// import { useState } from "react";
// import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
// import SeeAllChapter from "../../modal/chapter/SeeAllChapter"; // Import modal
// import { useTheme } from "@/contexts/ThemeContext";
// import { colors } from "@/styles/colors";

// interface Props {
//   bookId: string;
//   chapters: ChapterInf[];
// }

// export default function ChapterListPreview({ bookId, chapters }: Props) {
//   const goToReader = useGoToReader();
//   const [showAll, setShowAll] = useState(false);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";
//   const [page, setPage] = useState(1);
//   const bgColor = isDark ? colors.dark[200] : colors.light[200];
//   const textColor = isDark ? colors.dark[100] : colors.light[100];
//   const openModal = async () => {
//     setModalVisible(true); // Mở modal khi nhấn vào See all
//   };

//   const handleChapterPress = (chapterNumber: number) => {
//     goToReader(bookId, chapterNumber);
//   };

//   const displayedChapters = showAll ? chapters : chapters.slice(0, 10);

//   return (
//     <View className="mt-6 px-4">
//       <View className="flex-row justify-between mb-2">
//         <Text className="font-msemibold text-lg" style={{ color: textColor }}>
//           {chapters.length} chapters
//         </Text>
//         <TouchableOpacity onPress={openModal}>
//           <Text className="text-primary-100 font-mregular text-base">
//             See all
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={{ maxHeight: 300 }}>
//         {displayedChapters.map((ch, index) => (
//           <View
//             key={index}
//             className="flex-row justify-between py-2 border-b border-[#808080]"
//           >
//             <TouchableOpacity onPress={() => handleChapterPress(index + 1)}>
//               <Text
//                 className="text-base font-mregular "
//                 style={{ color: textColor }}
//               >
//                 {ch.chapterTitle}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Modal */}
//       <Modal
//         transparent={true}
//         animationType="slide"
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <SeeAllChapter
//           bookId={bookId} // Truyền bookId vào modal
//           chapters={chapters} // Truyền chapters vào modal
//           onClose={() => setModalVisible(false)} // Đóng modal khi nhấn nút đóng
//         />
//       </Modal>
//     </View>
//   );
// }
import { ChapterInf } from "@/dtos/ChapterDTO";
import useGoToReader from "@/hooks/goToReader";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import SeeAllChapter from "../../modal/chapter/SeeAllChapter";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import { deleteChapter } from "@/lib/service/chapter.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PenIcon, TrashIcon } from "@/components/icon/Icons";
import CircleIconButton from "@/components/ui/circle-icon-button";
import EditChapterModal from "@/components/modal/chapter/EditChapterModal";

interface Props {
  bookId: string;
  chapters: ChapterInf[];
  isCreatedByUser: boolean;
  setChapters: React.Dispatch<React.SetStateAction<ChapterInf[]>>; // ✅ thêm
  onDeleted?: (chapterId: string) => void;
}

export default function ChapterListPreview({
  bookId,
  chapters,
  isCreatedByUser,
  setChapters,
  onDeleted,
}: Props) {
  const goToReader = useGoToReader();
  const [showAll, setShowAll] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];
  const [editChapter, setEditChapter] = useState<ChapterInf | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const openEditModal = (chapter: ChapterInf) => {
    console.log(chapter);
    setEditChapter(chapter);
    setEditModalVisible(true);
  };

  const openModal = async () => {
    setModalVisible(true);
  };

  const handleChapterPress = (chapterNumber: number) => {
    goToReader(bookId, chapterNumber);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    Alert.alert("Confirm Delete", "Do you want to delete this chapter?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await deleteChapter(chapterId, token);
            if (res?.success) {
              Alert.alert("Chapter deleted");
              if (onDeleted) onDeleted(chapterId);
            } else {
              Alert.alert("Failed to delete chapter", res.message);
            }
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete chapter");
          }
        },
      },
    ]);
  };

  const displayedChapters = showAll ? chapters : chapters.slice(0, 10);

  return (
    <View className="mt-6 px-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-msemibold text-lg" style={{ color: textColor }}>
          {chapters.length} chapters
        </Text>
        <TouchableOpacity onPress={openModal}>
          <Text className="text-primary-100 font-mregular text-base">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ maxHeight: 300 }}>
        {displayedChapters.map((ch, index) => (
          <View
            key={ch._id}
            className="flex-row justify-between items-center py-2 border-b border-[#808080]"
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

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SeeAllChapter
          bookId={bookId}
          chapters={chapters}
          onClose={() => setModalVisible(false)}
          isCreatedByUser={isCreatedByUser}
          onDeleted={(deletedId) =>
            setChapters((prev) => prev.filter((ch) => ch._id !== deletedId))
          }
          setChapters={setChapters}
        />
      </Modal>

      {editChapter && (
        <EditChapterModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          chapter={editChapter}
          onUpdated={(updated) =>
            setChapters((prev) =>
              prev.map((ch) => (ch._id === updated._id ? updated : ch))
            )
          }
        />
      )}
    </View>
  );
}
