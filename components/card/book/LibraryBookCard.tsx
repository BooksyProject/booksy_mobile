import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import useGoToReader from "@/hooks/goToReader";

interface LibraryBookCardProps {
  book: BookResponseDTO & {
    totalChapters: number;
    readingProgress?: {
      chapterId: string;
      chapterNumber: number;
      percentage: number;
      lastReadAt?: Date;
    } | null;
  };
}

const LibraryBookCard: React.FC<LibraryBookCardProps> = ({ book }) => {
  const { colorScheme } = useTheme();
  const goToReader = useGoToReader();

  const handleOpenReader = () => {
    const chapterToRead = book.readingProgress?.chapterNumber || 1;
    goToReader(book._id, chapterToRead);
  };

  const progress = book.readingProgress?.percentage || 0;

  return (
    <TouchableOpacity
      onPress={handleOpenReader}
      className="w-[166px] h-[235px] rounded-5 overflow-hidden mr-4"
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: book?.coverImage }}
        className="flex-1 justify-end"
        imageStyle={{ borderRadius: 5 }}
      >
        <View className="h-[60px] justify-center mx-1 my-1">
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

              {/* Custom progress bar */}
              {book.readingProgress && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.round(progress)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
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
    backgroundColor: "#B33A3A",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#B33A3A",
    fontWeight: "bold",
  },
});

export default LibraryBookCard;
