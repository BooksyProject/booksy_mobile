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
import {
  ArrowIcon,
  CommentIcon,
  SendIcon,
  SettingsIcon,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "@/components/ui/input";

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
  const { bookId, chapter } = useLocalSearchParams();
  const chapterNumber = Number(chapter || 1);
  const [chapterTotal, setChapterTotal] = useState<number>(0);
  const { profile } = useAuth();
  const [profileBasic, setProfileBasic] = useState<UserBasicInfo | null>(null);
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

  const [numberOfComments, setNumberOfComments] = useState(0);
  const { colorScheme, toggleColorScheme } = useTheme();
  const {
    settings,
    updateTheme,
    updateFont,
    updateFontSize,
    isLoading: settingsLoading,
  } = useReaderSettings();
  const isReaderDark = settings.theme === "dark";
  const textColor = isReaderDark ? "#F1EEE3" : "#26212A";
  const bgColor = isReaderDark ? colors.dark[200] : colors.light[200];

  const { save, updateProgress } = useReadingProgressManager(bookId as string);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [bookComments, setBookComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const handleOpenComments = async () => {
    if (!chapterData?._id) return;
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

        console.log(data, "dataaaaaaaaaaaaaaa");

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

          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            className={`p-2 rounded-lg`}
          >
            <SettingsIcon color={textColor} size={27} />
          </TouchableOpacity>
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
