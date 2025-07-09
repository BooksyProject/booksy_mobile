// // app/offline-reader.tsx
// import React from "react";
// import { useLocalSearchParams } from "expo-router";
// import { View, Platform } from "react-native";
// import { WebView } from "react-native-webview";
// import Pdf from "react-native-pdf";

// export default function OfflineReader() {
//   const { filePath } = useLocalSearchParams<{ filePath: string }>();
//   if (!filePath) return null;

//   const decodedPath = decodeURIComponent(filePath);

//   const isEPUB = decodedPath.toLowerCase().endsWith(".epub");
//   const isPDF = decodedPath.toLowerCase().endsWith(".pdf");

//   if (isEPUB) {
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8" />
//         <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
//         <style>
//           html, body { margin: 0; padding: 0; height: 100%; }
//           #viewer { height: 100%; }
//         </style>
//       </head>
//       <body>
//         <div id="viewer"></div>
//         <script>
//           const book = ePub("${decodedPath}");
//           const rendition = book.renderTo("viewer", {
//             width: "100%",
//             height: "100%",
//           });
//           rendition.display();
//         </script>
//       </body>
//       </html>
//     `;

//     return (
//       <View style={{ flex: 1 }}>
//         <WebView
//           originWhitelist={["*"]}
//           source={{ html: htmlContent }}
//           allowFileAccess
//           allowFileAccessFromFileURLs
//         />
//       </View>
//     );
//   }

//   if (isPDF) {
//     return (
//       <View style={{ flex: 1 }}>
//         <Pdf
//           source={{ uri: decodedPath }}
//           style={{ flex: 1 }}
//           trustAllCerts={Platform.OS === "android"}
//           onLoadComplete={(pages) =>
//             console.log(`Tải PDF xong: ${pages} trang`)
//           }
//           onError={(error) => console.log("Lỗi PDF:", error)}
//         />
//       </View>
//     );
//   }

//   return null;
// }

// ReaderScreen.tsx - Phiên bản sử dụng Context

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import {
  getChapterDetail,
  getChaptersByBook,
} from "@/lib/service/chapter.service";
import Pagination from "@/components/ui/Pagination";
import { useReaderSettings } from "@/contexts/ReaderSettingContext";
import { WebView } from "react-native-webview";
import { ArrowIcon, SettingsIcon } from "@/components/icon/Icons";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveOfflineProgress } from "@/lib/service/readingProgress.service";

interface ChapterData {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
}

const IMAGE_BASE_URL = "http://192.168.1.214:3000/";

const FONT_OPTIONS = [
  {
    key: "JosefinSans",
    name: "Josefin Sans",
    fontFamily: "JosefinSans-SemiBold",
  },
  { key: "Montserrat", name: "Montserrat", fontFamily: "Montserrat-Black" },
  {
    key: "Roboto",
    name: "Roboto",
    fontFamily: "Roboto-VariableFont_wdth,wght",
  },
  {
    key: "RobotoMono",
    name: "Roboto Mono",
    fontFamily: "RobotoMono-VariableFont_wght",
  },
];

export default function OfflineReader() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { bookId, chapter } = useLocalSearchParams();
  const chapterNumber = Number(chapter || 1);
  const [chapterTotal, setChapterTotal] = useState<number>(0);

  const {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading: settingsLoading,
  } = useReaderSettings();
  const isReaderDark = settings.theme === "dark";
  const textColor = isReaderDark ? "#F1EEE3" : "#26212A";

  const { save, updateProgress } = useReadingProgressManager(bookId as string);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const getCurrentFontFamily = () => {
    return (
      FONT_OPTIONS.find((font) => font.key === settings.font)?.fontFamily ||
      "Roboto-VariableFont_wdth,wght"
    );
  };

  const getThemeStyles = () => {
    if (settings.theme === "dark") {
      return {
        container: "bg-[#26212A]",
        text: "text-[#F1EEE3]",
        content: "#F1EEE3",
        border: "border-[#808080]",
        modal: "bg-[#252525]",
        button: "bg-[#F1EEE3]",
        buttonText: "text-[#26212A]",
      };
    }
    return {
      container: "bg-[#F1EEE3]",
      text: "text-[#26212A]",
      content: "#26212A",
      border: "border-[#808080]",
      modal: "bg-white",
      button: "bg-[#26212A]",
      buttonText: "text-[#F1EEE3]",
    };
  };

  const themeStyles = getThemeStyles();
  useEffect(() => {
    const loadOfflineChapter = async () => {
      try {
        setLoading(true);
        const rawId = Array.isArray(bookId) ? bookId[0] : bookId;
        const isOffline = rawId.startsWith("offline");
        const idOnly = isOffline ? rawId.replace(/^offline[: ]?/, "") : rawId;

        const key = isOffline ? `offline:${idOnly}` : idOnly;
        const rawBook = await AsyncStorage.getItem(key);

        if (!rawBook) {
          console.warn("📦 Book not found in offline storage!");
          return;
        }

        const book = JSON.parse(rawBook);
        setChapterTotal(book.chapters.length);

        const chapter = book.chapters.find(
          (c: ChapterData) => c.chapterNumber === chapterNumber
        );

        if (!chapter) {
          console.warn("📦 Chapter not found in offline book data!");
          return;
        }

        setChapterData(chapter);
      } catch (error) {
        console.error("❌ Lỗi khi load dữ liệu sách offline:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineChapter();
  }, [bookId, chapterNumber]);

  useEffect(() => {
    const loadReadingProgress = async () => {
      try {
        const progressKey = `offlineProgress:${bookId}`;
        const savedProgress = await AsyncStorage.getItem(progressKey);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          console.log("⏳ Tiến trình đọc đã load:", progress);
          // Có thể dùng để tự động chuyển đến chương đang đọc dở
        }
      } catch (error) {
        console.error("❌ Lỗi khi load tiến trình đọc:", error);
      }
    };

    loadReadingProgress();
  }, [bookId]);

  useEffect(() => {
    return () => {
      // Lưu tiến trình khi rời khỏi màn hình
      saveOfflineProgress(bookId as string, chapterNumber, 100);
    };
  }, [bookId, chapterNumber]);

  const goToChapter = async (newChapter: number) => {
    // Lưu tiến trình hiện tại (100% nếu đã đọc xong chương này)
    await saveOfflineProgress(bookId as string, chapterNumber, 100);

    // Chuyển đến chương mới
    router.replace({
      pathname: "/offline-reader/[offline-reader]",
      params: {
        bookId: String(bookId),
        chapter: String(newChapter),
      },
    });
  };

  if (settingsLoading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator
          size="large"
          color={settings.theme === "dark" ? "#fff" : "#000"}
        />
        <Text className={`mt-2 ${themeStyles.text}`}>
          {settingsLoading ? "Đang tải cài đặt..." : "Đang tải chương..."}
        </Text>
      </View>
    );
  }

  console.log(chapter, "chapter in offline");

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
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            className={`p-2 rounded-lg`}
          >
            <SettingsIcon color={textColor} size={27} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-4 pt-6 pb-40"
        contentInsetAdjustmentBehavior="automatic"
      >
        {chapterData?.content ? (
          <RenderHTML
            contentWidth={width}
            source={{ html: chapterData.content }}
            baseStyle={{
              fontSize: settings.fontSize,
              lineHeight: settings.fontSize * 1.75,
              color: themeStyles.content,
              fontFamily: getCurrentFontFamily(),
            }}
            enableExperimentalMarginCollapsing={true}
            defaultTextProps={{
              style: {
                fontFamily: getCurrentFontFamily(),
              },
              selectable: true,
            }}
          />
        ) : (
          <Text className={`text-center ${themeStyles.text}`}>
            Đang tải nội dung chương...
          </Text>
        )}
      </ScrollView>
      <View
        className={`absolute bottom-0 left-0 right-0 border-t px-6 pt-2 pb-16 ${themeStyles.border} ${themeStyles.container}`}
      >
        <Pagination
          currentPage={chapterNumber}
          totalPages={chapterTotal || 1}
          iconColor={textColor}
          onChange={(newPage) => {
            if (newPage >= 1 && newPage <= chapterTotal) {
              goToChapter(newPage);
            }
          }}
        />
      </View>

      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View
          className="flex-1 justify-end bg-black/50defaultTextProps={{
    style: {
      fontFamily: getCurrentFontFamily(), // Ép font vào mọi Text bên trong
    },
    selectable: true,
  }}"
        >
          <View className={`${themeStyles.modal} rounded-t-3xl p-6 max-h-96`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-mbold ${themeStyles.text}`}>
                Setting
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={settings.theme === "dark" ? "#F1EEE3" : "#26212A"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Text
                  className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
                >
                  Display mode
                </Text>
                <View className="flex-row space-x-3" style={{ gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => updateTheme("light")}
                    className={`flex-1 p-3 rounded-lg border-2 ${
                      settings.theme === "light"
                        ? "border-blue-500 bg-blue-50"
                        : `border-gray-300 ${themeStyles.button}`
                    }`}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons
                        name="sunny-outline"
                        size={20}
                        color="#f59e0b"
                      />
                      <Text
                        className={`ml-2 font-mmedium ${
                          settings.theme === "light"
                            ? "text-blue-600"
                            : themeStyles.buttonText
                        }`}
                      >
                        Light
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => updateTheme("dark")}
                    className={`flex-1 p-3 rounded-lg border-2 ${
                      settings.theme === "dark"
                        ? "border-blue-500 bg-blue-900"
                        : `border-gray-300 ${themeStyles.button}`
                    }`}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="moon-outline" size={20} color="#6366f1" />
                      <Text
                        className={`ml-2 font-mmedium ${
                          settings.theme === "dark"
                            ? "text-blue-400"
                            : themeStyles.buttonText
                        }`}
                      >
                        Dark
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-6">
                <Text
                  className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
                >
                  Font size
                </Text>
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity
                    onPress={() =>
                      settings.fontSize > 12 &&
                      updateFontSize(settings.fontSize - 2)
                    }
                    className={`p-2 rounded-lg ${themeStyles.button}`}
                    disabled={settings.fontSize <= 12}
                  >
                    <Ionicons
                      name="remove"
                      size={20}
                      color={settings.theme === "dark" ? "#26212A" : "#F1EEE3"}
                    />
                  </TouchableOpacity>

                  <Text className={`mx-4 font-mmedium ${themeStyles.text}`}>
                    {settings.fontSize}px
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      settings.fontSize < 24 &&
                      updateFontSize(settings.fontSize + 2)
                    }
                    className={`p-2 rounded-lg ${themeStyles.button}`}
                    disabled={settings.fontSize >= 24}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={settings.theme === "dark" ? "#26212A" : "#F1EEE3"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text
                  className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
                >
                  Font family
                </Text>
                <View className="space-y-2" style={{ gap: 10 }}>
                  {FONT_OPTIONS.map((font) => (
                    <TouchableOpacity
                      key={font.key}
                      onPress={() => updateFont(font.key as any)}
                      className={`p-3 rounded-lg border ${
                        settings.font === font.key
                          ? "border-blue-500 bg-blue-50"
                          : `border-gray-300 ${themeStyles.button}`
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          settings.font === font.key
                            ? "text-blue-600"
                            : themeStyles.buttonText
                        }`}
                        style={{ fontFamily: font.fontFamily }}
                      >
                        {font.name}
                      </Text>
                      <Text
                        className={`text-sm mt-1 ${
                          settings.font === font.key
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                        style={{ fontFamily: font.fontFamily }}
                      >
                        Sample text with this font
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
