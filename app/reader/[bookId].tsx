// ReaderScreen.tsx - Phiên bản sử dụng Context
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  TextInput,
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
import {
  AddIcon,
  ArrowIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/icon/Icons";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "@/lib/service/book.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookmarkDTO } from "@/dtos/BookDTO";
import { BookmarkIcon, EyeClosed } from "lucide-react-native";

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
export default function ReaderScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { bookId, chapter, position } = useLocalSearchParams(); // Thêm position param
  const chapterNumber = Number(chapter || 1);
  const bookmarkPosition = Number(position || 0); // Lấy vị trí từ params
  const [chapterTotal, setChapterTotal] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [showBookmarksList, setShowBookmarksList] = useState(false);

  const {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading: settingsLoading,
  } = useReaderSettings();
  const isReaderDark = settings.theme === "dark";
  const textColor = isReaderDark ? "#F1EEE3" : "#26212A";
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const { save, updateProgress } = useReadingProgressManager(bookId as string);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentHeight, setContentHeight] = useState(1);
  const [layoutHeight, setLayoutHeight] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedText, setSelectedText] = useState({
    index: null, // index của paragraph
    text: "", // nội dung được chọn
    start: 0, // vị trí bắt đầu trong paragraph
    end: 0, // vị trí kết thúc trong paragraph
  });
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

    const fetchBookmarks = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;
        const bookmarks = await getBookmarks(String(bookId), userId);
        setBookmarks(bookmarks);
      } catch (err) {
        console.error("❌ Failed to fetch bookmarks:", err);
      }
    };

    fetchChapter();
    fetchChapterTotal();
    fetchBookmarks();
  }, [bookId, chapterNumber]);

  // Effect để scroll đến vị trí bookmark khi có position từ params - fix
  useEffect(() => {
    if (bookmarkPosition > 0 && chapterData && !loading) {
      console.log("🎯 Auto-scroll effect triggered:", bookmarkPosition);

      // Chờ một chút để content render xong
      setTimeout(() => {
        if (scrollViewRef.current) {
          // Cách 1: Sử dụng giá trị ước tính
          const estimatedContentHeight = 3000; // Ước tính content cao 3000px
          const scrollY = bookmarkPosition * estimatedContentHeight;

          console.log("🎯 Auto-scroll estimated:", {
            position: bookmarkPosition,
            estimatedHeight: estimatedContentHeight,
            scrollY,
          });

          scrollViewRef.current.scrollTo({
            y: scrollY,
            animated: true,
          });
        }
      }, 1000);

      // Thử lại sau 2 giây với giá trị khác
      setTimeout(() => {
        if (scrollViewRef.current) {
          const alternativeScrollY = bookmarkPosition * 2500;
          console.log("🔄 Auto-scroll retry:", alternativeScrollY);

          scrollViewRef.current.scrollTo({
            y: alternativeScrollY,
            animated: true,
          });
        }
      }, 2000);
    }
  }, [bookmarkPosition, chapterData, loading]);

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

  // Hàm xử lý thêm bookmark
  const handleAddBookmark = async () => {
    try {
      if (!chapterData?._id || !bookId || selectedIndex === null) return;
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      await addBookmark(
        String(bookId),
        chapterData._id,
        scrollPosition,
        userId,
        bookmarkNote,
        selectedIndex
      );

      const updated = await getBookmarks(String(bookId), userId);

      console.log(updated, "add ok");
      setBookmarks(updated);
      setBookmarkNote("");
      setShowBookmarkModal(false);
      setSelectedIndex(null);
    } catch (err) {
      console.error("❌ Failed to add bookmark:", err);
    }
  };

  // Hàm xử lý xóa bookmark
  const handleRemoveBookmark = async (bookmark: any) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;
      await removeBookmark(
        bookmark.chapterId.bookId,
        bookmark.chapterId._id,
        bookmark.position,
        userId
      );

      const updatedBookmarks = await getBookmarks(String(bookId), userId);
      setBookmarks(updatedBookmarks);
    } catch (err) {
      console.error("❌ Failed to remove bookmark:", err);
    }
  };

  // Hàm xử lý khi scroll thay đổi - FIX: Tính toán chính xác hơn
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const totalScrollableHeight = contentSize.height - layoutMeasurement.height;

    // Cập nhật content height và layout height
    setContentHeight(contentSize.height);
    setLayoutHeight(layoutMeasurement.height);

    // Tính toán vị trí scroll (0-1)
    const position =
      totalScrollableHeight > 0 ? scrollY / totalScrollableHeight : 0;
    setScrollPosition(Math.max(0, Math.min(1, position))); // Đảm bảo trong khoảng 0-1

    // Cập nhật tiến độ đọc
    if (chapterData?._id) {
      updateProgress(
        chapterData._id,
        chapterData.chapterNumber,
        position * 100
      );
    }
  };

  // Hàm điều hướng đến bookmark - fix cho trường hợp contentHeight = 0
  const navigateToBookmark = (bookmark: any) => {
    setShowBookmarksList(false);

    if (chapterData && chapterData._id === bookmark.chapterId._id) {
      // Scroll đến vị trí trong chương hiện tại
      console.log("📍 Scrolling to:", bookmark.position);

      const scrollY =
        contentHeight > layoutHeight
          ? bookmark.position * (contentHeight - layoutHeight)
          : 0;

      scrollViewRef.current?.scrollTo({ y: scrollY, animated: true });
    } else {
      // Điều hướng đến chương khác và truyền position
      router.replace({
        pathname: "/reader/[bookId]",
        params: {
          bookId: String(bookmark.chapterId.bookId),
          chapter: String(bookmark.chapterId.chapterNumber),
          position: String(bookmark.position),
        },
      });
    }
  };

  const paragraphs = useMemo(() => {
    if (!chapterData?.content) return [];
    return chapterData.content
      .split(/<\/p>\s*/gi)
      .map((p) => p.trim() + "</p>")
      .filter((p) => p !== "</p>");
  }, [chapterData]);

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
      <SafeAreaView>
        <View className="flex-row justify-between items-center px-4 py-2 mt-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-lg"
          >
            <ArrowIcon color={textColor} size={27} />
          </TouchableOpacity>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowBookmarksList(true)}
              className="p-2 mr-2 rounded-lg"
            >
              <BookmarkIcon color={textColor} size={27} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              className="p-2 rounded-lg"
            >
              <SettingsIcon color={textColor} size={27} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-4 pt-6 pb-40"
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setContentHeight(contentHeight);
        }}
      >
        {paragraphs.map((html, index) => {
          const isBookmarked = bookmarks.some((b) => b.index === index);

          return (
            <TouchableOpacity
              key={index}
              onLongPress={() => {
                setSelectedIndex(index);
                setShowBookmarkModal(true);
              }}
              activeOpacity={0.9}
              style={{
                backgroundColor: isBookmarked ? "#e1cf2c" : "transparent",
                paddingVertical: 4,
                marginBottom: 6,
                borderRadius: 4,
              }}
            >
              <RenderHTML
                contentWidth={width}
                source={{ html }}
                baseStyle={{
                  fontSize: settings.fontSize,
                  lineHeight: settings.fontSize * 1.75,
                  color: themeStyles.content,
                  fontFamily: getCurrentFontFamily(),
                }}
                defaultTextProps={{
                  selectable: true,
                  // selectable: false, // bỏ hoàn toàn nếu cần block context menu
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Nút thêm bookmark */}
      <TouchableOpacity
        onPress={() => setShowBookmarkModal(true)}
        className={`absolute right-4 bottom-36 p-3 rounded-full ${themeStyles.button}`}
      >
        <PlusIcon />
      </TouchableOpacity>

      {/* Modal thêm bookmark */}
      <Modal
        visible={showBookmarkModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookmarkModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-4/5 p-4 rounded-lg ${themeStyles.modal}`}>
            <Text className={`text-lg font-bold mb-4 ${themeStyles.text}`}>
              Thêm Bookmark tại {Math.round(scrollPosition * 100)}%
            </Text>
            <TextInput
              placeholder="Ghi chú (tuỳ chọn)"
              value={bookmarkNote}
              onChangeText={setBookmarkNote}
              className={`p-2 border rounded mb-4 ${themeStyles.border} ${themeStyles.text}`}
              placeholderTextColor={themeStyles.content + "80"}
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setShowBookmarkModal(false)}
                className="px-4 py-2 mr-2"
              >
                <Text className={`${themeStyles.text}`}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddBookmark}
                className={`px-4 py-2 rounded ${themeStyles.button}`}
              >
                <Text className={`${themeStyles.buttonText}`}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Panel danh sách bookmark */}
      {showBookmarksList && (
        <View
          className={`absolute top-0 bottom-0 right-0 w-3/4 ${themeStyles.modal}`}
        >
          <View className="flex-row justify-between items-center p-4 border-b">
            <Text className={`text-lg font-bold ${themeStyles.text}`}>
              Bookmarks
            </Text>
            <TouchableOpacity onPress={() => setShowBookmarksList(false)}>
              <EyeClosed color={textColor} size={24} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-3 border-b"
                onPress={() => navigateToBookmark(item)}
              >
                <Text className={`font-bold ${themeStyles.text}`}>
                  Chương {item.chapterId.chapterNumber}:{" "}
                  {Math.round(item.position * 100)}%
                </Text>
                {item.note && (
                  <Text className={`mt-1 ${themeStyles.text}`}>
                    {item.note}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => handleRemoveBookmark(item)}
                  className="absolute right-2 top-2"
                >
                  <TrashIcon color={textColor} size={18} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Giữ nguyên phần Pagination và Settings Modal */}
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
