// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Modal,
//   SafeAreaView,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import RenderHTML from "react-native-render-html";
// import { useWindowDimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import useReadingProgressManager from "@/hooks/useReadingProgressManager";
// import {
//   getChapterDetail,
//   getChaptersByBook,
// } from "@/lib/service/chapter.service";
// import Pagination from "@/components/ui/Pagination";
// import { useReaderSettings } from "@/contexts/ReaderSettingContext";
// import { WebView } from "react-native-webview";
// import { ArrowIcon, SettingsIcon } from "@/components/icon/Icons";
// import { useTheme } from "@/contexts/ThemeContext";
// import { colors } from "@/styles/colors";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { saveOfflineProgress } from "@/lib/service/readingProgress.service";

// interface ChapterData {
//   _id: string;
//   chapterNumber: number;
//   chapterTitle: string;
//   content: string;
// }

// const IMAGE_BASE_URL = "http://192.168.1.214:3000/";

// const FONT_OPTIONS = [
//   {
//     key: "JosefinSans",
//     name: "Josefin Sans",
//     fontFamily: "JosefinSans-SemiBold",
//   },
//   { key: "Montserrat", name: "Montserrat", fontFamily: "Montserrat-Black" },
//   {
//     key: "Roboto",
//     name: "Roboto",
//     fontFamily: "Roboto-VariableFont_wdth,wght",
//   },
//   {
//     key: "RobotoMono",
//     name: "Roboto Mono",
//     fontFamily: "RobotoMono-VariableFont_wght",
//   },
// ];

// export default function OfflineReader() {
//   const { width } = useWindowDimensions();
//   const router = useRouter();
//   const { bookId, chapter } = useLocalSearchParams();
//   const chapterNumber = Number(chapter || 1);
//   const [chapterTotal, setChapterTotal] = useState<number>(0);

//   const {
//     settings,
//     updateTheme,
//     updateFont,
//     updateFontSize,
//     isLoading: settingsLoading,
//   } = useReaderSettings();
//   const isReaderDark = settings.theme === "dark";
//   const textColor = isReaderDark ? "#F1EEE3" : "#26212A";

//   const { save, updateProgress } = useReadingProgressManager(bookId as string);
//   const [chapterData, setChapterData] = useState<ChapterData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showSettings, setShowSettings] = useState(false);

//   const getCurrentFontFamily = () => {
//     return (
//       FONT_OPTIONS.find((font) => font.key === settings.font)?.fontFamily ||
//       "Roboto-VariableFont_wdth,wght"
//     );
//   };

//   const getThemeStyles = () => {
//     if (settings.theme === "dark") {
//       return {
//         container: "bg-[#26212A]",
//         text: "text-[#F1EEE3]",
//         content: "#F1EEE3",
//         border: "border-[#808080]",
//         modal: "bg-[#252525]",
//         button: "bg-[#F1EEE3]",
//         buttonText: "text-[#26212A]",
//       };
//     }
//     return {
//       container: "bg-[#F1EEE3]",
//       text: "text-[#26212A]",
//       content: "#26212A",
//       border: "border-[#808080]",
//       modal: "bg-white",
//       button: "bg-[#26212A]",
//       buttonText: "text-[#F1EEE3]",
//     };
//   };

//   const themeStyles = getThemeStyles();

//   useEffect(() => {
//     const loadOfflineChapter = async () => {
//       try {
//         setLoading(true);

//         const rawId = Array.isArray(bookId) ? bookId[0] : (bookId as string);
//         const isOffline = rawId.startsWith("offline-");
//         const bookIdOnly = isOffline ? rawId.replace("offline-", "") : rawId;
//         const storageKey = `offline:${bookIdOnly}`;
//         const rawBook = await AsyncStorage.getItem(storageKey);

//         if (!rawBook) {
//           console.warn("⚠️ Book not found in offline storage.");
//           return;
//         }

//         const book = JSON.parse(rawBook);
//         setChapterTotal(book.chapters.length);

//         const chapterFound = book.chapters.find(
//           (c: ChapterData) => c.chapterNumber === chapterNumber
//         );

//         if (!chapterFound) {
//           console.warn("⚠️ Chapter not found.");
//           return;
//         }

//         setChapterData(chapterFound);
//       } catch (error) {
//         console.error("❌ Lỗi khi load dữ liệu offline:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOfflineChapter();
//   }, [bookId, chapterNumber]);

//   useEffect(() => {
//     const loadReadingProgress = async () => {
//       try {
//         const progressKey = `offlineProgress:${bookId}`;
//         const savedProgress = await AsyncStorage.getItem(progressKey);
//         if (savedProgress) {
//           const progress = JSON.parse(savedProgress);
//           console.log("⏳ Tiến trình đọc đã load:", progress);
//           // Có thể dùng để tự động chuyển đến chương đang đọc dở
//         }
//       } catch (error) {
//         console.error("❌ Lỗi khi load tiến trình đọc:", error);
//       }
//     };

//     loadReadingProgress();
//   }, [bookId]);

//   useEffect(() => {
//     return () => {
//       // Lưu tiến trình khi rời khỏi màn hình
//       saveOfflineProgress(bookId as string, chapterNumber, 100);
//     };
//   }, [bookId, chapterNumber]);

//   const goToChapter = async (newChapter: number) => {
//     // Lưu tiến trình hiện tại (100% nếu đã đọc xong chương này)
//     await saveOfflineProgress(bookId as string, chapterNumber, 100);

//     // Chuyển đến chương mới
//     router.replace({
//       pathname: "/offline-reader/[offline-reader]",
//       params: {
//         bookId: String(bookId),
//         chapter: String(newChapter),
//       },
//     });
//   };

//   if (settingsLoading) {
//     return (
//       <View
//         className={`flex-1 justify-center items-center ${themeStyles.container}`}
//       >
//         <ActivityIndicator
//           size="large"
//           color={settings.theme === "dark" ? "#fff" : "#000"}
//         />
//         <Text className={`mt-2 ${themeStyles.text}`}>
//           {settingsLoading ? "Đang tải cài đặt..." : "Đang tải chương..."}
//         </Text>
//       </View>
//     );
//   }

//   console.log(chapter, "chapter in offline");

//   return (
//     <View className={`flex-1 ${themeStyles.container}`}>
//       <SafeAreaView>
//         <View className="flex-row justify-between items-center px-4 py-2">
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className="p-2 rounded-lg"
//           >
//             <ArrowIcon color={textColor} size={27} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setShowSettings(true)}
//             className={`p-2 rounded-lg`}
//           >
//             <SettingsIcon color={textColor} size={27} />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>

//       <ScrollView
//         className="flex-1 px-4 pt-6 pb-40"
//         contentInsetAdjustmentBehavior="automatic"
//       >
//         {chapterData?.content ? (
//           <RenderHTML
//             contentWidth={width}
//             source={{ html: chapterData.content }}
//             baseStyle={{
//               fontSize: settings.fontSize,
//               lineHeight: settings.fontSize * 1.75,
//               color: themeStyles.content,
//               fontFamily: getCurrentFontFamily(),
//             }}
//             enableExperimentalMarginCollapsing={true}
//             defaultTextProps={{
//               style: {
//                 fontFamily: getCurrentFontFamily(),
//               },
//               selectable: true,
//             }}
//           />
//         ) : (
//           <Text className={`text-center ${themeStyles.text}`}>
//             Đang tải nội dung chương...
//           </Text>
//         )}
//       </ScrollView>
//       <View
//         className={`absolute bottom-0 left-0 right-0 border-t px-6 pt-2 ${themeStyles.border} ${themeStyles.container}`}
//       >
//         <Pagination
//           currentPage={chapterNumber}
//           totalPages={chapterTotal || 1}
//           iconColor={textColor}
//           onChange={(newPage) => {
//             if (newPage >= 1 && newPage <= chapterTotal) {
//               goToChapter(newPage);
//             }
//           }}
//         />
//       </View>

//       <Modal
//         visible={showSettings}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowSettings(false)}
//       >
//         <View
//           className="flex-1 justify-end bg-black/50defaultTextProps={{
//     style: {
//       fontFamily: getCurrentFontFamily(), // Ép font vào mọi Text bên trong
//     },
//     selectable: true,
//   }}"
//         >
//           <View className={`${themeStyles.modal} rounded-t-3xl p-6 max-h-96`}>
//             <View className="flex-row justify-between items-center mb-6">
//               <Text className={`text-xl font-mbold ${themeStyles.text}`}>
//                 Setting
//               </Text>
//               <TouchableOpacity onPress={() => setShowSettings(false)}>
//                 <Ionicons
//                   name="close"
//                   size={24}
//                   color={settings.theme === "dark" ? "#F1EEE3" : "#26212A"}
//                 />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View className="mb-6">
//                 <Text
//                   className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
//                 >
//                   Display mode
//                 </Text>
//                 <View className="flex-row space-x-3" style={{ gap: 8 }}>
//                   <TouchableOpacity
//                     onPress={() => updateTheme("light")}
//                     className={`flex-1 p-3 rounded-lg border-2 ${
//                       settings.theme === "light"
//                         ? "border-blue-500 bg-blue-50"
//                         : `border-gray-300 ${themeStyles.button}`
//                     }`}
//                   >
//                     <View className="flex-row items-center justify-center">
//                       <Ionicons
//                         name="sunny-outline"
//                         size={20}
//                         color="#f59e0b"
//                       />
//                       <Text
//                         className={`ml-2 font-mmedium ${
//                           settings.theme === "light"
//                             ? "text-blue-600"
//                             : themeStyles.buttonText
//                         }`}
//                       >
//                         Light
//                       </Text>
//                     </View>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     onPress={() => updateTheme("dark")}
//                     className={`flex-1 p-3 rounded-lg border-2 ${
//                       settings.theme === "dark"
//                         ? "border-blue-500 bg-blue-900"
//                         : `border-gray-300 ${themeStyles.button}`
//                     }`}
//                   >
//                     <View className="flex-row items-center justify-center">
//                       <Ionicons name="moon-outline" size={20} color="#6366f1" />
//                       <Text
//                         className={`ml-2 font-mmedium ${
//                           settings.theme === "dark"
//                             ? "text-blue-400"
//                             : themeStyles.buttonText
//                         }`}
//                       >
//                         Dark
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <View className="mb-6">
//                 <Text
//                   className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
//                 >
//                   Font size
//                 </Text>
//                 <View className="flex-row items-center justify-between">
//                   <TouchableOpacity
//                     onPress={() =>
//                       settings.fontSize > 12 &&
//                       updateFontSize(settings.fontSize - 2)
//                     }
//                     className={`p-2 rounded-lg ${themeStyles.button}`}
//                     disabled={settings.fontSize <= 12}
//                   >
//                     <Ionicons
//                       name="remove"
//                       size={20}
//                       color={settings.theme === "dark" ? "#26212A" : "#F1EEE3"}
//                     />
//                   </TouchableOpacity>

//                   <Text className={`mx-4 font-mmedium ${themeStyles.text}`}>
//                     {settings.fontSize}px
//                   </Text>

//                   <TouchableOpacity
//                     onPress={() =>
//                       settings.fontSize < 24 &&
//                       updateFontSize(settings.fontSize + 2)
//                     }
//                     className={`p-2 rounded-lg ${themeStyles.button}`}
//                     disabled={settings.fontSize >= 24}
//                   >
//                     <Ionicons
//                       name="add"
//                       size={20}
//                       color={settings.theme === "dark" ? "#26212A" : "#F1EEE3"}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <View>
//                 <Text
//                   className={`text-lg font-msemibold mb-3 ${themeStyles.text}`}
//                 >
//                   Font family
//                 </Text>
//                 <View className="space-y-2" style={{ gap: 10 }}>
//                   {FONT_OPTIONS.map((font) => (
//                     <TouchableOpacity
//                       key={font.key}
//                       onPress={() => updateFont(font.key as any)}
//                       className={`p-3 rounded-lg border ${
//                         settings.font === font.key
//                           ? "border-blue-500 bg-blue-50"
//                           : `border-gray-300 ${themeStyles.button}`
//                       }`}
//                     >
//                       <Text
//                         className={`font-medium ${
//                           settings.font === font.key
//                             ? "text-blue-600"
//                             : themeStyles.buttonText
//                         }`}
//                         style={{ fontFamily: font.fontFamily }}
//                       >
//                         {font.name}
//                       </Text>
//                       <Text
//                         className={`text-sm mt-1 ${
//                           settings.font === font.key
//                             ? "text-blue-500"
//                             : "text-gray-500"
//                         }`}
//                         style={{ fontFamily: font.fontFamily }}
//                       >
//                         Sample text with this font
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  InteractionManager,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import { useReaderSettings } from "@/contexts/ReaderSettingContext";
import {
  ArrowIcon,
  SettingsIcon,
  TrashIcon,
  CloseIcon,
  CommentIcon,
} from "@/components/icon/Icons";
import Pagination from "@/components/ui/Pagination";
import { colors } from "@/styles/colors";
import { saveOfflineProgress } from "@/lib/service/readingProgress.service";
import { BookmarkIcon } from "lucide-react-native";

// Cache Management
const chapterCache = new Map<string, ChapterData>();
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

interface UserBasicInfo {
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
}

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

export default function OfflineReader() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const paragraphRefs = useRef<Record<number, View | null>>({});
  const paragraphPositions = useRef<Record<number, number>>({});

  // Params
  const { bookId, chapter, position } = useLocalSearchParams();
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
  const [renderChunks, setRenderChunks] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Bookmark states
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // UI states
  const [showSettings, setShowSettings] = useState(false);
  const [profileBasic, setProfileBasic] = useState<UserBasicInfo | null>(null);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [bookComments, setBookComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  // Hooks

  const {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading: settingsLoading,
  } = useReaderSettings();

  // Memoized values
  const isReaderDark = useMemo(
    () => settings.theme === "dark",
    [settings.theme]
  );
  const textColor = useMemo(
    () => (isReaderDark ? "#F1EEE3" : "#26212A"),
    [isReaderDark]
  );

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

  // Load profile from AsyncStorage
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
        console.error("❌ Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  // Load offline chapter data
  useEffect(() => {
    const loadOfflineChapter = async () => {
      try {
        setLoading(true);

        const rawId = Array.isArray(bookId) ? bookId[0] : (bookId as string);
        const isOffline = rawId.startsWith("offline-");
        const bookIdOnly = isOffline ? rawId.replace("offline-", "") : rawId;
        const storageKey = `offline:${bookIdOnly}`;
        const rawBook = await AsyncStorage.getItem(storageKey);

        if (!rawBook) {
          console.warn("⚠️ Book not found in offline storage.");
          return;
        }

        const book = JSON.parse(rawBook);
        setChapterTotal(book.chapters.length);

        const chapterFound = book.chapters.find(
          (c: ChapterData) => c.chapterNumber === chapterNumber
        );

        if (!chapterFound) {
          console.warn("⚠️ Chapter not found.");
          return;
        }

        setChapterData(chapterFound);
        setContentReady(true);
      } catch (error) {
        console.error("❌ Error loading offline data:", error);
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
          console.log("⏳ Loaded reading progress:", progress);
          // Có thể sử dụng để tự động chuyển đến chương đang đọc dở
        }
      } catch (error) {
        console.error("❌ Error loading reading progress:", error);
      }
    };

    loadReadingProgress();
  }, [bookId]);

  // Load bookmarks from AsyncStorage
  const loadBookmarks = useCallback(async () => {
    if (!bookId) return;

    try {
      const bookmarksKey = `offlineBookmarks:${bookId}`;
      const savedBookmarks = await AsyncStorage.getItem(bookmarksKey);
      if (savedBookmarks) {
        const bookmarksData = JSON.parse(savedBookmarks);
        setBookmarks(bookmarksData);
      }
    } catch (error) {
      console.error("❌ Error loading bookmarks:", error);
    }
  }, [bookId]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Save progress when leaving the screen
  useEffect(() => {
    return () => {
      if (chapterData) {
        saveOfflineProgress(bookId as string, chapterNumber, 100);
      }
    };
  }, [bookId, chapterNumber, chapterData]);

  // Paragraph processing
  const paragraphs = useMemo(() => {
    if (!chapterData?.content) return [];
    const rawParagraphs = chapterData.content.split(/<\/p>\s*/gi);
    return rawParagraphs
      .map((p) => p.trim() + "</p>")
      .filter((p) => p !== "</p>");
  }, [chapterData?.content]);

  const visibleParagraphs = useMemo(() => {
    const chunkEnd = renderChunks * CHUNK_SIZE;
    return paragraphs.slice(0, chunkEnd);
  }, [paragraphs, renderChunks]);

  // Navigation functions
  const goToChapter = useCallback(
    async (newChapter: number) => {
      if (chapterData) {
        // Thay thế save bằng saveOfflineProgress
        await saveOfflineProgress(bookId as string, chapterNumber, 100);
      }

      router.replace({
        pathname: "/offline-reader/[offline-reader]",
        params: {
          bookId: String(bookId),
          chapter: String(newChapter),
        },
      });
    },
    [bookId, chapterNumber, chapterData, router]
  );

  // Scroll handling
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

      if (position > 0.8 && renderChunks * CHUNK_SIZE < paragraphs.length) {
        setRenderChunks((prev) => prev + 1);
      }

      if (chapterData) {
        // Thay thế updateProgress bằng saveOfflineProgress
        saveOfflineProgress(
          bookId as string,
          chapterData.chapterNumber,
          position * 100
        );
      }
    },
    [chapterData, paragraphs.length, renderChunks, bookId]
  );

  // Bookmark functions
  const handleLongPress = useCallback((index: number) => {
    setSelectedIndex(index);
    setShowBookmarkModal(true);
  }, []);

  const handleAddBookmark = useCallback(async () => {
    if (!chapterData || !bookId || selectedIndex === null || isSaving) return;

    try {
      setIsSaving(true);

      const newBookmark: BookmarkData = {
        _id: Date.now().toString(),
        chapterId: {
          _id: chapterData._id,
          chapterNumber: chapterData.chapterNumber,
          bookId: bookId as string,
        },
        position: scrollPosition,
        note: bookmarkNote,
        index: selectedIndex,
      };

      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);

      // Save to AsyncStorage
      const bookmarksKey = `offlineBookmarks:${bookId}`;
      await AsyncStorage.setItem(
        bookmarksKey,
        JSON.stringify(updatedBookmarks)
      );

      setBookmarkNote("");
      setShowBookmarkModal(false);
      setSelectedIndex(null);
    } catch (error) {
      console.error("❌ Error adding bookmark:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    bookId,
    bookmarks,
    chapterData,
    scrollPosition,
    selectedIndex,
    bookmarkNote,
    isSaving,
  ]);

  const handleRemoveBookmark = useCallback(
    async (bookmark: BookmarkData) => {
      try {
        const updatedBookmarks = bookmarks.filter(
          (b) => b._id !== bookmark._id
        );
        setBookmarks(updatedBookmarks);

        const bookmarksKey = `offlineBookmarks:${bookId}`;
        await AsyncStorage.setItem(
          bookmarksKey,
          JSON.stringify(updatedBookmarks)
        );
      } catch (error) {
        console.error("❌ Error removing bookmark:", error);
      }
    },
    [bookId, bookmarks]
  );

  const navigateToBookmark = useCallback(
    (bookmark: BookmarkData) => {
      setShowBookmarksList(false);

      if (chapterData && chapterData._id === bookmark.chapterId._id) {
        const scrollY =
          contentHeight > layoutHeight
            ? bookmark.position * (contentHeight - layoutHeight)
            : 0;

        scrollViewRef.current?.scrollTo({
          y: Math.max(0, scrollY),
          animated: true,
        });
      } else {
        router.replace({
          pathname: "/offline-reader/[offline-reader]",
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

  // Auto-scroll to bookmark position
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

  // Paragraph layout handling
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
            backgroundColor: isBookmarked
              ? "rgba(225, 207, 44, 0.3)"
              : "transparent",
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

  // Loading state
  if (loading && !chapterData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text className={`mt-2 ${themeStyles.text}`}>Loading chapter...</Text>
      </View>
    );
  }

  if (settingsLoading || !chapterData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text className={`mt-2 ${themeStyles.text}`}>Loading settings...</Text>
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

          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => setShowBookmarksList(true)}
              className="p-2 rounded-lg"
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
        scrollEventThrottle={SCROLL_THROTTLE}
        contentInsetAdjustmentBehavior="automatic"
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setContentHeight(contentHeight);
        }}
        removeClippedSubviews={true}
      >
        {visibleParagraphs.map((html, index) =>
          renderParagraph({ html, index })
        )}

        {renderChunks * CHUNK_SIZE < paragraphs.length && (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" color={textColor} />
            <Text className={`mt-2 text-sm ${themeStyles.text}`}>
              Loading more content...
            </Text>
          </View>
        )}
      </ScrollView>

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
              Add Bookmark
            </Text>
            <TextInput
              placeholder="Note (optional)"
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
                <Text className={themeStyles.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddBookmark}
                disabled={isSaving}
                className={`px-4 py-2 rounded ${themeStyles.button} ${
                  isSaving ? "opacity-50" : ""
                }`}
              >
                <Text className={themeStyles.buttonText}>
                  {isSaving ? "Saving..." : "Save"}
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
            ListEmptyComponent={
              <View className="p-4 items-center">
                <Text className={themeStyles.text}>No bookmarks yet</Text>
              </View>
            }
          />
        </View>
      )}

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
              <Text className={`text-xl font-bold ${themeStyles.text}`}>
                Settings
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
                  className={`text-lg font-semibold mb-3 ${themeStyles.text}`}
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
                        className={`ml-2 font-medium ${
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
                        className={`ml-2 font-medium ${
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
                  className={`text-lg font-semibold mb-3 ${themeStyles.text}`}
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

                  <Text className={`mx-4 font-medium ${themeStyles.text}`}>
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
                  className={`text-lg font-semibold mb-3 ${themeStyles.text}`}
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
