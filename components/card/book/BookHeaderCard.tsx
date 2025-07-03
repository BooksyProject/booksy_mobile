import {
  View,
  Text,
  Image,
  Alert,
  Share,
  Platform,
  TouchableOpacity,
} from "react-native";
import GenreBadge from "../../ui/genre-badge";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadBook, likeBook, unlikeBook } from "@/lib/service/book.service";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import { ArrowIcon, DownloadIcon, LikeIcon, ShareIcon } from "../../icon/Icons";
import CircleIconButton from "../../ui/circle-icon-button";
interface StatItemProps {
  label: string;
  value: number;
  textColor?: string;
}
interface Props {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  likes: number;
  chapters: number;
  views: number;
  categories: CategoryResponseDTO[];
  fileURL: string;
  onClose: () => void;
}

export default function BookHeaderCard({
  _id,
  title,
  author,
  coverImage,
  likes,
  chapters,
  views,
  categories,
  fileURL,
  onClose,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
    checkNotificationStatus();
  }, []);

  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const checkBookmarkStatus = async () => {
    try {
      const bookmarked = await AsyncStorage.getItem(`bookmark_${title}`);
      setIsBookmarked(bookmarked === "true");
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const notificationEnabled = await AsyncStorage.getItem(
        `notification_${title}`
      );
      setIsNotificationEnabled(notificationEnabled === "true");
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const generateShareText = () => {
    const fileName = fileURL.split("/").pop() || "book.epub";
    const categories_text = categories.map((cat) => `#${cat.name}`).join(" ");

    return `📚 "${title}" - ${author}

${categories_text}

📊 Stats:
• ❤️ ${formatNumber(likes)} likes
• 📖 ${chapters} chapters  
• 👁️ ${formatNumber(views)} views

Một cuốn sách tuyệt vời! Tải ngay app của chúng tôi để đọc.

#BookRecommendation #Reading #${fileName.replace(".epub", "")}`;
  };

  const handleQuickShare = async () => {
    try {
      const result = await Share.share({
        message: generateShareText(),
        title: `${title} - ${author}`,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert("Thành công", "Đã chia sẻ sách!");
        trackShareAction();
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Lỗi", "Không thể chia sẻ sách");
    }
  };

  const handleBellPress = async () => {
    try {
      const newNotificationStatus = !isNotificationEnabled;
      await AsyncStorage.setItem(
        `notification_${title}`,
        newNotificationStatus.toString()
      );
      setIsNotificationEnabled(newNotificationStatus);

      Alert.alert(
        newNotificationStatus ? "Đã bật thông báo" : "Đã tắt thông báo",
        newNotificationStatus
          ? "Bạn sẽ nhận được thông báo khi có chương mới!"
          : "Đã tắt thông báo cho cuốn sách này"
      );
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  };

  const handleHeartPress = async () => {
    try {
      // Đảo trạng thái bookmark
      const newBookmarkStatus = !isBookmarked;

      // Lưu trạng thái mới vào AsyncStorage
      await AsyncStorage.setItem(
        `bookmark_${title}`,
        newBookmarkStatus.toString()
      );

      setIsBookmarked(newBookmarkStatus);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      // Kiểm tra trạng thái yêu thích và gọi hàm tương ứng
      if (newBookmarkStatus) {
        // Nếu là yêu thích (mới đánh dấu), gọi hàm likeBook
        await likeBook(_id, userId);
      } else {
        // Nếu là bỏ yêu thích (mới bỏ dấu), gọi hàm unlikeBook
        await unlikeBook(_id, userId);
      }

      // Hiển thị thông báo cho người dùng
      Alert.alert(
        newBookmarkStatus ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích",
        newBookmarkStatus
          ? "Sách đã được thêm vào danh sách yêu thích!"
          : "Đã xóa sách khỏi danh sách yêu thích"
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Alert.alert("Có lỗi xảy ra", "Không thể thay đổi trạng thái yêu thích.");
    }
  };

  const trackShareAction = async () => {
    try {
      const currentShares = await AsyncStorage.getItem(`shares_${title}`);
      const shareCount = currentShares ? parseInt(currentShares) + 1 : 1;
      await AsyncStorage.setItem(`shares_${title}`, shareCount.toString());
    } catch (error) {
      console.error("Error tracking share:", error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      <View className="bg-primary-100 w-full relative rounded-2xl px-4 pt-6 pb-4">
        <View className="flex flex-row justify-between mb-4">
          <CircleIconButton icon={ArrowIcon} onPress={onClose} />
          <CircleIconButton icon={ShareIcon} onPress={handleQuickShare} />
        </View>

        <View className="items-center pb-4">
          <Image
            source={{ uri: coverImage }}
            className="w-36 h-48 rounded-md mb-2"
            resizeMode="cover"
          />
          <View className="flex-row justify-between w-full px-8 py-4">
            <View className="flex-1 pr-4">
              <Text
                className=" text-xl font-mbold text-dark-100"
                numberOfLines={2}
              >
                {title}
              </Text>
              <Text className="text-dark-100 text-sm font-mregular mb-1">
                {author}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleHeartPress}
              style={[
                {
                  width: 48,
                  height: 48,
                  borderRadius: 100,
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                },
              ]}
            >
              <LikeIcon size={27} color={bgColor} filled={isBookmarked} />
            </TouchableOpacity>
            {/* <CircleIconButton
              icon={DownloadIcon}
              onPress={() => downloadBook(_id)}
            /> */}
          </View>
        </View>

        {/* Stats: Likes, Chapters, Views */}
        <View className="absolute -bottom-10 left-0 right-0 px-4">
          <View
            className=" rounded-3xl h-20 flex-row justify-between items-center w-full"
            style={{ backgroundColor: textColor }}
          >
            <StatItem label="Likes" value={likes} textColor={bgColor} />
            <StatItem label="Chapters" value={chapters} textColor={bgColor} />
            <StatItem label="Views" value={views} textColor={bgColor} />
          </View>
        </View>
      </View>

      <View className="mt-14 w-full px-4 flex-row flex-wrap justify-center gap-2">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <GenreBadge key={category._id} genre={category.name} />
          ))
        ) : (
          <Text className="text-gray-500">Không có thể loại nào</Text>
        )}
      </View>
    </>
  );
}

function StatItem({ label, value, textColor = "#FFFFFF" }: StatItemProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <View className="items-center px-8">
      <Text className="font-mbold text-lg" style={{ color: textColor }}>
        {formatNumber(value)}
      </Text>
      <Text
        className="font-mregular text-sm opacity-80"
        style={{ color: textColor }}
      >
        {label}
      </Text>
    </View>
  );
}
