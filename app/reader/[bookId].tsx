import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  InteractionManager,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookmarkIcon, EyeClosed } from "lucide-react-native";

// Hooks
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import { useReaderSettings } from "@/contexts/ReaderSettingContext";

// Services
import {
  getChapterDetail,
  getChaptersByBook,
} from "@/lib/service/chapter.service";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "@/lib/service/book.service";

// Components
import Pagination from "@/components/ui/Pagination";
import { WebView } from "react-native-webview";
import {
  ArrowIcon,
  CloseIcon,
  CommentIcon,
  SendIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/icon/Icons";
import { MessageCircle } from "lucide-react-native";
import {
  createComment,
  getCommentByChapterId,
} from "@/lib/service/comment.service";
import CommentCard from "@/components/card/comment/CommentCard";
import { useAuth } from "@/contexts/AuthContext";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import Input from "@/components/ui/input";
import { useReadingProgress } from "@/contexts/ReadingProgressContext";
import { saveOnlineProgress } from "@/lib/service/readingProgress.service";

// Cache Management
export const chapterCache = new Map<string, ChapterData>();
const bookmarkCache = new Map<string, BookmarkData[]>();
const chapterTotalCache = new Map<string, number>();

interface ChapterData {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
}

interface BookmarkData {
  _id: string;
  chapterId: {
    _id: string;
    chapterNumber: number;
    bookId: string;
  };
  position: number;
  note?: string;
  index: number;
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

const SCROLL_THROTTLE = 16;
const AUTO_SCROLL_DELAY = 500;
const CHUNK_SIZE = 10;

export default function ReaderScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  // Thay đổi cách quản lý refs
  const scrollViewRef = useRef<ScrollView>(null);
  const paragraphRefs = useRef<Record<number, View | null>>({});
  const paragraphPositions = useRef<Record<number, number>>({});

  // Params
  const { bookId, chapter, position, t } = useLocalSearchParams();
  const chapterNumber = Number(chapter || 1);
  const bookmarkPosition = Number(position || 0);

  // State
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [chapterTotal, setChapterTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(1);
  const [layoutHeight, setLayoutHeight] = useState(1);
  const [renderChunks, setRenderChunks] = useState(1); // Progressive rendering
  const [isSaving, setIsSaving] = useState(false);

  // Bookmark states
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // UI states
  const [showSettings, setShowSettings] = useState(false);

  // Hooks  const { profile } = useAuth();
  const [profileBasic, setProfileBasic] = useState<UserBasicInfo | null>(null);

  const [numberOfComments, setNumberOfComments] = useState(0);
  const { colorScheme, toggleColorScheme } = useTheme();
  const {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading: settingsLoading,
  } = useReaderSettings();
  const { updateReadingProgress } = useReadingProgress();

  const { save, updateProgress } = useReadingProgressManager(bookId as string);

  // Memoized values
  const isReaderDark = useMemo(
    () => settings.theme === "dark",
    [settings.theme]
  );
  const textColor = useMemo(
    () => (isReaderDark ? "#F1EEE3" : "#26212A"),
    [isReaderDark]
  );

  const bgColor = isReaderDark ? colors.dark[200] : colors.light[200];
  const [bookComments, setBookComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem("profile");
        if (profileString) {
          const profile = JSON.parse(profileString);

          setProfileBasic({
            _id: profile._id || "",
            avatar: profile.avatar || "",
            firstName: profile.firstName || "Anonymous",
            lastName: profile.lastName || "Anonymous",
          });
        }
      } catch (error) {
        console.error("❌ Failed to load profile from AsyncStorage:", error);
      }
    };

    loadProfile();
  }, []);

  const getCurrentFontFamily = useCallback(() => {
    return (
      FONT_OPTIONS.find((font) => font.key === settings.font)?.fontFamily ||
      "Roboto-VariableFont_wdth,wght"
    );
  }, [settings.font]);

  const getThemeStyles = useCallback(() => {
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
  }, [settings.theme]);

  const themeStyles = useMemo(() => getThemeStyles(), [getThemeStyles]);

  // Optimized paragraphs with lazy processing
  const paragraphs = useMemo(() => {
    if (!chapterData?.content) return [];

    // Simple split first, process later
    const rawParagraphs = chapterData.content.split(/<\/p>\s*/gi);
    return rawParagraphs
      .map((p) => p.trim() + "</p>")
      .filter((p) => p !== "</p>");
  }, [chapterData?.content]);

  // Progressive paragraphs for rendering
  const visibleParagraphs = useMemo(() => {
    const chunkEnd = renderChunks * CHUNK_SIZE;
    return paragraphs.slice(0, chunkEnd);
  }, [paragraphs, renderChunks]);

  // Cache key generators
  const getChapterCacheKey = useCallback(
    (bookId: string, chapterNum: number) => {
      return `${bookId}_${chapterNum}`;
    },
    []
  );

  const getBookmarkCacheKey = useCallback((bookId: string) => {
    return `bookmarks_${bookId}`;
  }, []);

  // Optimized fetch functions with caching
  const fetchChapter = useCallback(async () => {
    if (!bookId) return;

    const cacheKey = getChapterCacheKey(String(bookId), chapterNumber);

    // Check cache first
    if (chapterCache.has(cacheKey)) {
      console.log("📋 Using cached chapter data");
      setChapterData(chapterCache.get(cacheKey)!);
      setLoading(false);
      setContentReady(true);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Fetching chapter from API");

      const data = await getChapterDetail(String(bookId), chapterNumber);

      // Process images in background
      const processedData = {
        ...data,
        content: data.content.replace(
          /src="\/([^"]+)"/g,
          `src="${IMAGE_BASE_URL}/$1"`
        ),
      };
      // Cache the result
      chapterCache.set(cacheKey, processedData);

      setChapterData(processedData);
      setContentReady(true);
    } catch (err) {
      console.error("❌ Failed to fetch chapter:", err);
    } finally {
      setLoading(false);
    }
  }, [bookId, chapterNumber, t, getChapterCacheKey]);

  const fetchChapterTotal = useCallback(async () => {
    if (!bookId) return;

    const cacheKey = `total_${bookId}`;

    // Check cache first
    if (chapterTotalCache.has(cacheKey)) {
      setChapterTotal(chapterTotalCache.get(cacheKey)!);
      return;
    }

    try {
      const chapters = await getChaptersByBook(String(bookId));
      const total = chapters.length;

      // Cache the result
      chapterTotalCache.set(cacheKey, total);
      setChapterTotal(total);
    } catch (err) {
      console.error("❌ Failed to fetch chapter list:", err);
    }
  }, [bookId]);

  const fetchBookmarks = useCallback(async () => {
    if (!bookId) return;

    const cacheKey = getBookmarkCacheKey(String(bookId));

    // Check cache first
    if (bookmarkCache.has(cacheKey)) {
      setBookmarks(bookmarkCache.get(cacheKey)!);
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const bookmarks = await getBookmarks(String(bookId), userId);

      // Cache the result
      bookmarkCache.set(cacheKey, bookmarks);
      setBookmarks(bookmarks);
    } catch (err) {
      console.error("❌ Failed to fetch bookmarks:", err);
    }
  }, [bookId, getBookmarkCacheKey]);

  // Preload adjacent chapters
  const preloadAdjacentChapters = useCallback(async () => {
    if (!bookId) return;

    const preloadChapter = async (chapterNum: number) => {
      const cacheKey = getChapterCacheKey(String(bookId), chapterNum);
      if (chapterCache.has(cacheKey)) return;

      try {
        const data = await getChapterDetail(String(bookId), chapterNum);
        const processedData = {
          ...data,
          content: data.content.replace(
            /src="\/([^"]+)"/g,
            `src="${IMAGE_BASE_URL}/$1"`
          ),
        };
        chapterCache.set(cacheKey, processedData);
        console.log(`📋 Preloaded chapter ${chapterNum}`);
      } catch (err) {
        console.log(`❌ Failed to preload chapter ${chapterNum}`);
      }
    };

    // Preload next and previous chapters
    const promises = [];
    if (chapterNumber > 1) {
      promises.push(preloadChapter(chapterNumber - 1));
    }
    if (chapterNumber < chapterTotal) {
      promises.push(preloadChapter(chapterNumber + 1));
    }

    await Promise.all(promises);
  }, [bookId, chapterNumber, chapterTotal, getChapterCacheKey]);

  const loadMoreChunks = useCallback(() => {
    if (renderChunks * CHUNK_SIZE < paragraphs.length) {
      setRenderChunks((prev) => prev + 1);
    }
  }, [paragraphs.length, renderChunks]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const scrollY = contentOffset.y;
      const totalScrollableHeight =
        contentSize.height - layoutMeasurement.height;

      setContentHeight(contentSize.height);
      setLayoutHeight(layoutMeasurement.height);

      const position =
        totalScrollableHeight > 0 ? scrollY / totalScrollableHeight : 0;
      setScrollPosition(Math.max(0, Math.min(1, position)));

      // Progressive loading trigger
      if (position > 0.8 && renderChunks * CHUNK_SIZE < paragraphs.length) {
        loadMoreChunks();
      }
    },
    [chapterData, loadMoreChunks, paragraphs.length, renderChunks]
  );

  const handleAddBookmark = useCallback(async () => {
    if (!chapterData?._id || !bookId || selectedIndex === null || isSaving)
      return;

    try {
      setIsSaving(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      // Tính toán vị trí chính xác của paragraph
      const paragraphPosition = paragraphPositions.current[selectedIndex] || 0;
      const relativePosition =
        contentHeight > 0 ? paragraphPosition / contentHeight : scrollPosition;

      await addBookmark(
        String(bookId),
        chapterData._id,
        relativePosition,
        userId,
        bookmarkNote,
        selectedIndex
      );

      const cacheKey = getBookmarkCacheKey(String(bookId));
      const updated = await getBookmarks(String(bookId), userId);
      bookmarkCache.set(cacheKey, updated);

      setBookmarks(updated);
      setBookmarkNote("");
      setShowBookmarkModal(false);
      setSelectedIndex(null);
    } catch (err) {
      console.error("❌ Failed to add bookmark:", err);
    } finally {
      setIsSaving(false);
    }
  }, [
    chapterData,
    bookId,
    selectedIndex,
    scrollPosition,
    bookmarkNote,
    contentHeight,
    getBookmarkCacheKey,
    isSaving,
  ]);

  const handleRemoveBookmark = useCallback(
    async (bookmark: BookmarkData) => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        await removeBookmark(
          bookmark.chapterId.bookId,
          bookmark.chapterId._id,
          bookmark.position,
          userId
        );

        const cacheKey = getBookmarkCacheKey(String(bookId));
        const updatedBookmarks = await getBookmarks(String(bookId), userId);
        bookmarkCache.set(cacheKey, updatedBookmarks);

        setBookmarks(updatedBookmarks);
      } catch (err) {
        console.error("❌ Failed to remove bookmark:", err);
      }
    },
    [bookId, getBookmarkCacheKey]
  );

  const navigateToBookmark = useCallback(
    (bookmark: BookmarkData) => {
      setShowBookmarksList(false);

      if (chapterData && chapterData._id === bookmark.chapterId._id) {
        // Nếu đang ở cùng chapter, scroll đến vị trí bookmark
        const scrollY =
          contentHeight > layoutHeight
            ? bookmark.position * (contentHeight - layoutHeight)
            : 0;

        scrollViewRef.current?.scrollTo({
          y: Math.max(0, scrollY),
          animated: true,
        });
      } else {
        // Nếu khác chapter, chuyển đến chapter đó
        router.replace({
          pathname: "/reader/[bookId]",
          params: {
            bookId: String(bookmark.chapterId.bookId),
            chapter: String(bookmark.chapterId.chapterNumber),
            position: String(bookmark.position),
          },
        });
      }
    },
    [chapterData, contentHeight, layoutHeight, router]
  );

  const goToChapter = useCallback(
    async (newChapter: number) => {
      if (chapterData) {
        await saveOnlineProgress(bookId as string, newChapter, 100);
        save({
          chapterId: chapterData._id,
          chapterNumber: newChapter,
          percentage: 100,
        });

        updateReadingProgress({
          bookId: String(bookId),
          chapterId: chapterData._id,
          chapterNumber: newChapter,
          percentage: 100,
          lastReadAt: new Date(),
        });
      }
      router.replace({
        pathname: "/reader/[bookId]",
        params: { bookId: String(bookId), chapter: String(newChapter) },
      });
    },
    [chapterData, updateProgress, router, bookId]
  );

  const handleLongPress = useCallback((index: number) => {
    setSelectedIndex(index);
    setShowBookmarkModal(true);
  }, []);

  const handleOpenComments = async () => {
    if (!chapterData || !chapterData._id) return;

    try {
      const data = await getCommentByChapterId(chapterData._id);
      setBookComments(data);
      setNumberOfComments(data.length); // Cập nhật số lượng
      setShowComments(true);
    } catch (error) {
      console.error("❌ Lỗi khi mở modal và fetch comment:", error);
    }
  };

  const handleSendComment = async () => {
    const token: string | null = await AsyncStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!comment.trim()) {
      console.warn("Comment cannot be empty");
      return;
    }
    if (!chapterData?._id) return;
    try {
      const newCommentData = await createComment(
        { content: comment },
        token,
        chapterData?._id
      );

      const currentTime = new Date();
      const enrichedComment: CommentResponseDTO = {
        ...newCommentData,
        author: {
          _id: profileBasic?._id || "",
          avatar:
            profileBasic?.avatar ||
            "https://i.pinimg.com/736x/9a/00/82/9a0082d8f710e7b626a114657ec5b781.jpg",
          firstName: profileBasic?.firstName || "Anonymous",
          lastName: profileBasic?.lastName || "Anonymous",
        },
        createAt: currentTime,
        likes: [],
      };
      setBookComments((prev: any) => [enrichedComment, ...prev]);

      setNumberOfComments(numberOfComments + 1);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchChapter();

      InteractionManager.runAfterInteractions(() => {
        fetchChapterTotal();
        fetchBookmarks();
      });
    };

    loadData();
  }, [fetchChapter, fetchChapterTotal, fetchBookmarks]);

  // Preload adjacent chapters after main content is ready
  useEffect(() => {
    if (contentReady && chapterTotal > 0) {
      InteractionManager.runAfterInteractions(() => {
        preloadAdjacentChapters();
      });
    }
  }, [contentReady, chapterTotal, preloadAdjacentChapters]);

  // Auto-scroll optimization
  useEffect(() => {
    if (bookmarkPosition > 0 && chapterData && contentReady) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (scrollViewRef.current) {
            const scrollY = bookmarkPosition * 2500; // Simplified calculation
            scrollViewRef.current.scrollTo({ y: scrollY, animated: true });
          }
        }, AUTO_SCROLL_DELAY);
      });
    }
  }, [bookmarkPosition, chapterData, contentReady]);

  // useEffect(() => {
  //   if (!chapterData?._id) return;

  //   const saveProgress = async () => {
  //     await AsyncStorage.setItem(
  //       "lastReadChapter",
  //       JSON.stringify(chapterData)
  //     );
  //   };

  //   saveProgress();
  // }, [chapterData]);

  // Hàm để lưu vị trí của mỗi paragraph
  const onParagraphLayout = useCallback((index: number, event: any) => {
    const { y } = event.nativeEvent.layout;
    paragraphPositions.current[index] = y;
  }, []);

  // Render functions
  const renderParagraph = useCallback(
    ({ html, index }: { html: string; index: number }) => {
      const isBookmarked = bookmarks.some(
        (b) => b.index === index && b.chapterId._id === chapterData?._id
      );

      return (
        <View
          key={index}
          ref={(ref) => {
            paragraphRefs.current[index] = ref;
          }}
          onLayout={(event) => onParagraphLayout(index, event)}
          style={{
            backgroundColor: isBookmarked ? "#e1cf2c" : "transparent",
            paddingVertical: 4,
            marginBottom: 6,
            borderRadius: 4,
          }}
        >
          <TouchableOpacity
            onLongPress={() => handleLongPress(index)}
            activeOpacity={0.9}
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
              defaultTextProps={{ selectable: true }}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [
      bookmarks,
      chapterData,
      handleLongPress,
      width,
      settings.fontSize,
      themeStyles.content,
      getCurrentFontFamily,
      onParagraphLayout,
    ]
  );

  useEffect(() => {
    if (
      bookmarkPosition > 0 &&
      chapterData &&
      contentReady &&
      contentHeight > 0
    ) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (scrollViewRef.current) {
            const scrollY =
              contentHeight > layoutHeight
                ? bookmarkPosition * (contentHeight - layoutHeight)
                : 0;

            scrollViewRef.current.scrollTo({
              y: Math.max(0, scrollY),
              animated: true,
            });
          }
        }, AUTO_SCROLL_DELAY);
      });
    }
  }, [
    bookmarkPosition,
    chapterData,
    contentReady,
    contentHeight,
    layoutHeight,
  ]);

  const renderBookmarkItem = useCallback(
    ({ item }: { item: BookmarkData }) => (
      <TouchableOpacity
        className="p-3 border-b flex-row items-center justify-between"
        onPress={() => navigateToBookmark(item)}
      >
        <View className="flex-1">
          <Text className={`font-bold ${themeStyles.text}`}>
            Page {item.chapterId.chapterNumber}
          </Text>

          {item.note && (
            <Text className={`mt-1 text-sm ${themeStyles.text}`}>
              "{item.note}"
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleRemoveBookmark(item);
          }}
          className="p-2"
        >
          <TrashIcon color={textColor} size={18} />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [navigateToBookmark, handleRemoveBookmark, themeStyles.text, textColor]
  );

  const renderFontOption = useCallback(
    (font: (typeof FONT_OPTIONS)[0]) => (
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
            settings.font === font.key ? "text-blue-500" : "text-gray-500"
          }`}
          style={{ fontFamily: font.fontFamily }}
        >
          Sample text with this font
        </Text>
      </TouchableOpacity>
    ),
    [settings.font, updateFont, themeStyles.button, themeStyles.buttonText]
  );

  // Loading state - Show immediately when chapter data is ready
  if (loading && !chapterData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text className={`mt-2 ${themeStyles.text}`}>Đang tải chương...</Text>
      </View>
    );
  }

  // Settings loading can be non-blocking
  if (settingsLoading || !chapterData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text className={`mt-2 ${themeStyles.text}`}>Đang tải cài đặt...</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${themeStyles.container}`}>
      <SafeAreaView>
        <View className="flex-row justify-between items-center px-4 py-2">
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

      <TouchableOpacity
        onPress={handleOpenComments}
        className="absolute bottom-36 right-4 z-50 bg-white dark:bg-black p-3 rounded-full shadow"
      >
        <CommentIcon color={textColor} size={27} />
      </TouchableOpacity>

      <ScrollView
        className="flex-1 px-4 pt-6 pb-40"
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={SCROLL_THROTTLE}
        contentInsetAdjustmentBehavior="automatic"
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setContentHeight(contentHeight);
        }}
        removeClippedSubviews={true}
      >
        {/* Progressive rendering với cải thiện */}
        {visibleParagraphs.map((html, index) =>
          renderParagraph({ html, index })
        )}

        {/* Loading indicator for more content */}
        {renderChunks * CHUNK_SIZE < paragraphs.length && (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" color={textColor} />
            <Text className={`mt-2 text-sm ${themeStyles.text}`}>
              Đang tải thêm nội dung...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bookmark Modal */}
      <Modal
        visible={showBookmarkModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookmarkModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-4/5 p-4 rounded-lg ${themeStyles.modal}`}>
            <Text className={`text-lg font-bold mb-4 ${themeStyles.text}`}>
              Thêm Bookmark
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
                <Text className={themeStyles.text}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddBookmark}
                disabled={isSaving}
                className={`px-4 py-2 rounded ${themeStyles.button} ${
                  isSaving ? "opacity-50" : ""
                }`}
              >
                <Text className={themeStyles.buttonText}>
                  {isSaving ? "Đang lưu..." : "Lưu"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bookmarks List */}
      {showBookmarksList && (
        <View
          className={`absolute top-0 bottom-0 right-0 w-3/4 ${themeStyles.modal}`}
        >
          <View className="flex-row justify-between items-center p-4 border-b">
            <Text className={`text-lg font-bold ${themeStyles.text}`}>
              Bookmarks
            </Text>
            <TouchableOpacity onPress={() => setShowBookmarksList(false)}>
              <CloseIcon color={textColor} size={24} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[...bookmarks].sort(
              (a, b) => a.chapterId.chapterNumber - b.chapterId.chapterNumber
            )}
            keyExtractor={(item) => item._id}
            renderItem={renderBookmarkItem}
            getItemLayout={(data, index) => ({
              length: 80,
              offset: 80 * index,
              index,
            })}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </View>
      )}

      {/* Pagination */}
      <View
        className={`absolute bottom-0 left-0 right-0 border-t px-6 pt-2 ${themeStyles.border} ${themeStyles.container}`}
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
        visible={showComments}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowComments(false)}
      >
        <SafeAreaView
          className="flex-1 px-4 pt-6 "
          style={{ backgroundColor: bgColor }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-mbold " style={{ color: textColor }}>
              Comments
            </Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            {bookComments.length === 0 ? (
              <Text className="text-center text-gray-500">No comment yet.</Text>
            ) : (
              bookComments.map(
                (comment) =>
                  comment.parentId === null && (
                    <View key={comment._id}>
                      {profileBasic && (
                        <CommentCard
                          comment={comment}
                          commentsData={bookComments}
                          setCommentsData={setBookComments}
                          author={comment.author}
                          chapterId={chapterData._id}
                          profileBasic={profileBasic}
                          setNumberOfComments={setNumberOfComments}
                          numberOfComments={numberOfComments}
                          textColor={textColor}
                          bgColor={bgColor}
                        />
                      )}
                    </View>
                  )
              )
            )}
          </ScrollView>
          <View
            className="absolute bottom-0 left-0 right-0 px-2 py-2"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[200] : colors.light[200],
            }}
          >
            <View className="w-full flex-row items-center space-x-2">
              <View className="flex-1">
                <Input
                  // avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
                  placeholder="Write a comment"
                  readOnly={false}
                  value={comment}
                  onChangeText={setComment}
                />
              </View>
              <TouchableOpacity onPress={handleSendComment}>
                <SendIcon size={27} color={colors.primary[100]} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showComments}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowComments(false)}
      >
        <SafeAreaView
          className="flex-1 px-4 pt-6 "
          style={{ backgroundColor: bgColor }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-mbold " style={{ color: textColor }}>
              Comments
            </Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            {bookComments.length === 0 ? (
              <Text className="text-center text-gray-500">No comment yet.</Text>
            ) : (
              bookComments.map(
                (comment) =>
                  comment.parentId === null && (
                    <View key={comment._id}>
                      {profileBasic && (
                        <CommentCard
                          comment={comment}
                          commentsData={bookComments}
                          setCommentsData={setBookComments}
                          author={comment.author}
                          chapterId={chapterData._id}
                          profileBasic={profileBasic}
                          setNumberOfComments={setNumberOfComments}
                          numberOfComments={numberOfComments}
                          textColor={textColor}
                          bgColor={bgColor}
                        />
                      )}
                    </View>
                  )
              )
            )}
          </ScrollView>
          <View
            className="absolute bottom-0 left-0 right-0 px-2 py-2"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[200] : colors.light[200],
            }}
          >
            <View className="w-full flex-row items-center space-x-2">
              <View className="flex-1">
                <Input
                  // avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
                  placeholder="Write a comment"
                  readOnly={false}
                  value={comment}
                  onChangeText={setComment}
                />
              </View>
              <TouchableOpacity onPress={handleSendComment}>
                <SendIcon size={27} color={colors.primary[100]} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`${themeStyles.modal} rounded-t-3xl p-6 max-h-96`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-mbold ${themeStyles.text}`}>
                Setting
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Display Mode */}
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
              {/* Font Size */}
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
                      color={isReaderDark ? "#26212A" : "#F1EEE3"}
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
                      color={isReaderDark ? "#26212A" : "#F1EEE3"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Font Family */}
              <View>
                <Text
                  className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
                >
                  Font family
                </Text>
                <View className="space-y-2" style={{ gap: 10 }}>
                  {FONT_OPTIONS.map(renderFontOption)}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
