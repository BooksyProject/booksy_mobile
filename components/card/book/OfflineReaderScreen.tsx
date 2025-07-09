import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { ArrowIcon } from "@/components/icon/Icons";
import Pagination from "@/components/ui/Pagination";
import { useReaderSettings } from "@/contexts/ReaderSettingContext";
import { useOfflineReader } from "@/hooks/useOfflineReader";

const OfflineReaderScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { bookId, chapter } = useLocalSearchParams();
  const chapterNumber = Number(chapter || 1);

  const { settings } = useReaderSettings();
  const {
    book,
    chapter: chapterData,
    totalChapters,
    loading,
    error,
    isOffline,
  } = useOfflineReader(bookId as string, chapterNumber);

  const isReaderDark = settings.theme === "dark";
  const textColor = isReaderDark ? "#F1EEE3" : "#26212A";

  const getThemeStyles = () => {
    if (settings.theme === "dark") {
      return {
        container: "bg-[#26212A]",
        text: "text-[#F1EEE3]",
        content: "#F1EEE3",
        border: "border-[#808080]",
      };
    }
    return {
      container: "bg-[#F1EEE3]",
      text: "text-[#26212A]",
      content: "#26212A",
      border: "border-[#808080]",
    };
  };

  const themeStyles = getThemeStyles();

  const goToChapter = (newChapter: number) => {
    if (newChapter >= 1 && newChapter <= totalChapters) {
      router.replace({
        pathname: "/reader/[bookId]",
        params: {
          bookId: String(bookId),
          chapter: String(newChapter),
        },
      });
    }
  };

  if (loading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text className={`mt-2 ${themeStyles.text}`}>
          Đang tải nội dung offline...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <Text className={`text-red-500 text-center px-4`}>{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 p-2 bg-blue-500 rounded-lg"
        >
          <Text className="text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!book || !chapterData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <Text className={`${themeStyles.text}`}>Không tìm thấy nội dung</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${themeStyles.container}`}>
      <SafeAreaView>
        <View className="flex-row justify-between items-center px-4 py-2 mt-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-lg"
          >
            <ArrowIcon color={textColor} size={27} />
          </TouchableOpacity>
          <View className="flex-1 mx-4">
            <Text
              className={`${themeStyles.text} text-center font-semibold`}
              numberOfLines={1}
            >
              {book.title}
            </Text>
            <Text
              className={`${themeStyles.text} text-center text-sm opacity-70`}
            >
              📥 Đọc offline
            </Text>
          </View>
          <View className="w-8" />
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-4 pt-6 pb-40"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mb-6">
          <Text className={`text-xl font-bold ${themeStyles.text} mb-2`}>
            {chapterData.chapterTitle}
          </Text>
          <Text className={`text-sm opacity-70 ${themeStyles.text}`}>
            Chapter {chapterData.chapterNumber} / {totalChapters}
          </Text>
        </View>

        <RenderHTML
          contentWidth={width}
          source={{ html: chapterData.content }}
          baseStyle={{
            fontSize: settings.fontSize,
            lineHeight: settings.fontSize * 1.75,
            color: themeStyles.content,
            fontFamily: "Roboto-VariableFont_wdth,wght",
          }}
          enableExperimentalMarginCollapsing={true}
          defaultTextProps={{
            selectable: true,
          }}
        />
      </ScrollView>

      <View
        className={`absolute bottom-0 left-0 right-0 border-t px-6 pt-2 pb-16 ${themeStyles.border} ${themeStyles.container}`}
      >
        <Pagination
          currentPage={chapterNumber}
          totalPages={totalChapters}
          iconColor={textColor}
          onChange={goToChapter}
        />
      </View>
    </View>
  );
};

export default OfflineReaderScreen;
