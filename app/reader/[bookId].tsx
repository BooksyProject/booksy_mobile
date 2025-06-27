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

interface ChapterData {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
}

const IMAGE_BASE_URL = "http://192.168.1.219:3000/";

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

export default function ReaderScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { bookId, chapter } = useLocalSearchParams();
  const chapterNumber = Number(chapter || 1);
  const [chapterTotal, setChapterTotal] = useState<number>(0);

  // Sử dụng Context thay vì local state
  const {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading: settingsLoading,
  } = useReaderSettings();

  const { save, updateProgress } = useReadingProgressManager(bookId as string);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Get current font family
  const getCurrentFontFamily = () => {
    return (
      FONT_OPTIONS.find((font) => font.key === settings.font)?.fontFamily ||
      "Roboto-VariableFont_wdth,wght"
    );
  };

  // Theme styles
  const getThemeStyles = () => {
    if (settings.theme === "dark") {
      return {
        container: "bg-gray-900",
        text: "text-gray-100",
        content: "#e5e7eb",
        border: "border-gray-700",
        modal: "bg-gray-800",
        button: "bg-gray-700",
        buttonText: "text-gray-200",
      };
    }
    return {
      container: "bg-white",
      text: "text-gray-900",
      content: "#1f2937",
      border: "border-gray-200",
      modal: "bg-white",
      button: "bg-gray-100",
      buttonText: "text-gray-800",
    };
  };

  const themeStyles = getThemeStyles();

  // Fetch nội dung chương
  useEffect(() => {
    if (!bookId) return;

    const fetchChapter = async () => {
      try {
        setLoading(true);
        const data = await getChapterDetail(String(bookId), chapterNumber);

        const fixedContent = data.content.replace(
          /src="\/([^"]+)"/g,
          `src="${IMAGE_BASE_URL}/$1"`
        );

        setChapterData({
          ...data,
          content: fixedContent,
        });
      } catch (err) {
        console.error("❌ Failed to fetch chapter:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchChapterTotal = async () => {
      try {
        const chapters = await getChaptersByBook(String(bookId));
        setChapterTotal(chapters.length);
      } catch (err) {
        console.error("❌ Failed to fetch chapter list:", err);
      }
    };

    fetchChapter();
    fetchChapterTotal();
  }, [bookId, chapterNumber]);

  // Lưu tiến trình
  useEffect(() => {
    if (!chapterData?._id) return;

    const saveProgress = () => {
      save({
        chapterId: chapterData._id,
        chapterNumber: chapterData.chapterNumber,
        percentage: 100,
      });
    };

    saveProgress();

    return () => {
      saveProgress();
    };
  }, [chapterData]);

  const goToChapter = (newChapter: number) => {
    if (chapterData?._id) {
      updateProgress(chapterData._id, chapterData.chapterNumber, 100);
    }
    router.replace({
      pathname: "/reader/[bookId]",
      params: {
        bookId: String(bookId),
        chapter: String(newChapter),
      },
    });
  };

  // Show loading while settings are being loaded
  if (loading || !chapterData || settingsLoading) {
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
  return (
    <View className={`flex-1 ${themeStyles.container}`}>
      {/* Header với nút settings */}
      <SafeAreaView>
        <View className="flex-row justify-end items-center px-4 py-2 mt-10">
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            className={`p-2 rounded-lg`}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={settings.theme === "dark" ? "white" : "none"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Nội dung chương */}
      <ScrollView
        className="flex-1 px-4 py-6"
        contentInsetAdjustmentBehavior="automatic"
      >
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
              fontFamily: getCurrentFontFamily(), // Ép font vào mọi Text bên trong
            },
            selectable: true,
          }}
        />
        <View
          className={`h-20 px-6 pt-2 mb-10 border-t ${themeStyles.border} ${themeStyles.container}`}
        >
          <Pagination
            currentPage={chapterNumber}
            totalPages={chapterTotal || 1}
            onChange={(newPage) => {
              if (newPage >= 1 && newPage <= chapterTotal) {
                goToChapter(newPage);
              }
            }}
          />
        </View>
      </ScrollView>

      {/* Settings Modal */}
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
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-bold ${themeStyles.text}`}>
                Cài đặt đọc
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={settings.theme === "dark" ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Theme Selection */}
              <View className="mb-6">
                <Text
                  className={`text-lg font-semibold mb-3 ${themeStyles.text}`}
                >
                  Chế độ hiển thị
                </Text>
                <View className="flex-row space-x-3">
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
                        className={`ml-2 font-medium ${
                          settings.theme === "light"
                            ? "text-blue-600"
                            : themeStyles.buttonText
                        }`}
                      >
                        Sáng
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
                        className={`ml-2 font-medium ${
                          settings.theme === "dark"
                            ? "text-blue-400"
                            : themeStyles.buttonText
                        }`}
                      >
                        Tối
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Font Size */}
              <View className="mb-6">
                <Text
                  className={`text-lg font-semibold mb-3 ${themeStyles.text}`}
                >
                  Kích thước chữ
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
                      color={settings.theme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>

                  <Text className={`mx-4 ${themeStyles.text}`}>
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
                      color={settings.theme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Font Selection */}
              <View>
                <Text
                  className={`text-lg font-semibold mb-3 ${themeStyles.text}`}
                >
                  Phông chữ
                </Text>
                <View className="space-y-2">
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
                        Mẫu văn bản với phông chữ này
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
