import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { useTheme } from "@/contexts/ThemeContext";
import useGoToReader from "@/hooks/goToReader";
import { OfflineBookService } from "@/lib/service/book.service";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLibrary } from "@/contexts/LibaryContext";
import { useReadingProgress } from "@/contexts/ReadingProgressContext";

interface LibraryBookCardProps {
  book: any & {
    totalChapters?: number;
    readingProgress?: {
      chapterId: string;
      chapterNumber: number;
      percentage: number;
      lastReadAt?: Date;
    } | null;
    filePath?: string;
  };
  isOffline?: boolean;
  onBookDeleted?: (bookId: string) => void; // Callback khi xóa sách
}

const LibraryBookCard: React.FC<LibraryBookCardProps> = ({
  book,
  isOffline = false,
  onBookDeleted,
}) => {
  const { colorScheme } = useTheme();
  const goToReader = useGoToReader();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileSize, setFileSize] = useState<string>("");
  const { removeBookFromLibrary } = useLibrary();
  const { readingProgress } = useReadingProgress();
  // Kiểm tra xem có phải sách offline không
  const isOfflineBook =
    isOffline || !!book.filePath || OfflineBookService.isOfflineBook(book._id);
  const progress = book.readingProgress?.percentage || 0;

  // Load file size khi mở modal
  const loadFileSize = async () => {
    if (isOfflineBook) {
      const size = await OfflineBookService.getOfflineBookSize(book._id);
      setFileSize(OfflineBookService.formatFileSize(size));
    }
  };

  const handleOpenReader = async () => {
    // Kiểm tra xem có phải sách offline không (dựa vào book._id hoặc book.source)
    const isOffline =
      book._id.startsWith("offline") || book.source === "offline";

    if (isOffline) {
      try {
        // Load tiến trình từ AsyncStorage cho sách offline
        const progressKey = `offlineProgress:${book._id}`;
        const savedProgress = await AsyncStorage.getItem(progressKey);

        let chapterToRead = 1; // Mặc định là chương 1

        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          chapterToRead = progress.lastReadChapter || 1;
          console.log("📖 Đã load tiến trình đọc offline:", progress);
        }

        // Mở reader offline
        goToReader(`${book._id}`, chapterToRead);
      } catch (error) {
        console.error("❌ Lỗi khi load tiến trình offline:", error);
        // Fallback: mở chương 1 nếu có lỗi
        goToReader(`offline:${book._id}`, 1);
      }
    } else {
      // Xử lý bình thường cho sách online
      const progressKey = `${book._id}`;
      const savedProgress = await AsyncStorage.getItem(progressKey);
      let chapterToRead = 1; // Mặc định là chương 1

      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        chapterToRead = progress.lastReadChapter || 1;
        console.log("📖 Đã load tiến trình đọc offline:", progress);
      } else {
        chapterToRead = readingProgress?.chapterNumber || 1;
      }

      goToReader(book._id, chapterToRead);
    }
  };

  const handleLongPress = () => {
    if (isOfflineBook) {
      loadFileSize();
      setShowDeleteModal(true);
    }
  };

  const handleDeleteBook = async () => {
    try {
      setIsDeleting(true);
      // await OfflineBookService.deleteOfflineBook(book._id);
      removeBookFromLibrary(book._id.replace("offline-", ""));
      setShowDeleteModal(false);
      onBookDeleted?.(book._id);
      Alert.alert("Thành công", "Đã xóa sách khỏi thiết bị!");
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Lỗi", "Không thể xóa sách. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getProgressColor = () => {
    if (isOfflineBook) {
      return "#4CAF50"; // Xanh lá cho offline
    }
    return "#B33A3A"; // Đỏ cho online
  };

  const getStatusText = () => {
    if (isOfflineBook) {
      return "📥 Đã tải về";
    }
    return "";
  };

  const getStatusColor = () => {
    if (isOfflineBook) {
      return "#4CAF50";
    }
    return "#2196F3";
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenReader}
        onLongPress={handleLongPress}
        className="w-[166px] h-[235px] rounded-5 overflow-hidden mr-4"
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: book?.coverImage }}
          className="flex-1 justify-end"
          imageStyle={{ borderRadius: 5 }}
        >
          <View className="h-[70px] justify-center mx-1 my-1">
            {Platform.OS === "ios" ? (
              <BlurView blurType="light" blurAmount={10} style={styles.blur} />
            ) : (
              <View
                style={[
                  styles.blur,
                  { backgroundColor: "rgba(255,255,255,0.75)" },
                ]}
              />
            )}

            <View className="flex-row items-center justify-between px-3 gap-2">
              <View className="flex-1">
                <Text
                  className="text-[16px] text-dark-200 font-semibold max-w-[130px]"
                  numberOfLines={1}
                >
                  {book.title}
                </Text>
                <Text
                  className="text-xs text-primary-100 max-w-[130px]"
                  numberOfLines={1}
                >
                  {book.author}
                </Text>

                {/* Status indicator */}
                <Text
                  style={{
                    fontSize: 10,
                    color: getStatusColor(),
                    fontWeight: "bold",
                    marginTop: 2,
                  }}
                >
                  {getStatusText()}
                </Text>

                {/* Progress bar */}
                {book.readingProgress && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.round(progress)}%`,
                            backgroundColor: getProgressColor(),
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.progressText,
                        { color: getProgressColor() },
                      ]}
                    >
                      {Math.round(progress)}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <View className="items-center mb-4">
              <Ionicons name="trash-outline" size={48} color="#FF5252" />
              <Text className="text-lg font-bold text-gray-800 mt-2">
                Xóa sách đã tải về
              </Text>
            </View>

            <Text className="text-gray-600 text-center mb-2">
              Bạn có chắc chắn muốn xóa sách này khỏi thiết bị?
            </Text>

            <View className="bg-gray-50 rounded-lg p-3 mb-4">
              <Text className="font-semibold text-gray-800">{book.title}</Text>
              <Text className="text-sm text-gray-600">
                Tác giả: {book.author}
              </Text>
              {fileSize && (
                <Text className="text-sm text-gray-600">
                  Kích thước: {fileSize}
                </Text>
              )}
            </View>

            <Text className="text-sm text-red-600 text-center mb-4">
              ⚠️ Thao tác này không thể hoàn tác
            </Text>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 rounded-lg py-3"
                disabled={isDeleting}
              >
                <Text className="text-center text-gray-700 font-semibold">
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteBook}
                className="flex-1 bg-red-500 rounded-lg py-3"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-white font-semibold">
                    Xóa
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3,
  },
  progressContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e5e5",
    borderRadius: 3,
    marginRight: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default LibraryBookCard;
