import { View, Text, Image, Alert, Share, Platform } from "react-native";
import {
  Heart,
  Share2,
  Bell,
  ExternalLink,
  DownloadIcon,
} from "lucide-react-native";
import TouchableButton from "@/components/ui/TouchableButton";
import GenreBadge from "../ui/GenreBadge";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadBook, likeBook, unlikeBook } from "@/lib/service/book.service";

interface Props {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  likes: number;
  chapters: number;
  views: number;
  categories: CategoryResponseDTO[];
  fileURL: string; // "../../../public/book/hemingway-in-our-time.epub"
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
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
    checkNotificationStatus();
  }, []);

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

      // Kiểm tra trạng thái yêu thích và gọi hàm tương ứng
      if (newBookmarkStatus) {
        // Nếu là yêu thích (mới đánh dấu), gọi hàm likeBook
        await likeBook(_id, "6858324823a912623fc86675");
      } else {
        // Nếu là bỏ yêu thích (mới bỏ dấu), gọi hàm unlikeBook
        await unlikeBook(_id, "6858324823a912623fc86675");
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
      <View className="bg-book-detail w-full relative rounded-2xl px-4 pt-6 pb-4">
        {/* Nút Bell + Share */}
        <View className="flex flex-row justify-between mb-4">
          <TouchableButton
            onPress={handleBellPress}
            size="sm"
            rounded="full"
            variant="solid"
            bgColor={isNotificationEnabled ? "#EF4444" : "#1E293B"}
            icon={
              <Bell
                color="white"
                size={20}
                fill={isNotificationEnabled ? "white" : "none"}
              />
            }
          />

          <View className="flex flex-row gap-2">
            {/* Nút Share với tùy chọn */}
            <TouchableButton
              onPress={handleQuickShare}
              size="sm"
              rounded="full"
              variant="solid"
              bgColor="#1E293B"
              icon={<Share2 color="white" size={20} />}
            />
          </View>
          <View className="flex flex-row gap-2">
            {/* Nút download với tùy chọn */}
            <TouchableButton
              onPress={() => downloadBook(_id)}
              size="sm"
              rounded="full"
              variant="solid"
              bgColor="#1E293B"
              icon={<DownloadIcon color="white" size={20} />}
            />
          </View>
        </View>

        {/* Ảnh bìa + tiêu đề + tác giả */}
        <View className="items-center pb-4">
          <Image
            source={{ uri: coverImage }}
            className="w-36 h-48 rounded-md mb-2"
            resizeMode="cover"
          />
          <View className="flex-row justify-between w-full px-8 py-4">
            <View className="flex-1 pr-4">
              <Text className="text-white text-xl font-mbold" numberOfLines={2}>
                {title}
              </Text>
              <Text className="text-white text-sm font-mregular mb-1">
                {author}
              </Text>
              <Text className="text-white text-xs font-mregular opacity-60">
                {fileURL.split("/").pop()}
              </Text>
            </View>

            <TouchableButton
              onPress={handleHeartPress}
              size="sm"
              rounded="full"
              variant="solid"
              bgColor={isBookmarked ? "#EF4444" : "#1E293B"}
              icon={
                <Heart
                  color="white"
                  size={20}
                  fill={isBookmarked ? "white" : "none"}
                />
              }
            />
          </View>
        </View>

        {/* Stats: Likes, Chapters, Views */}
        <View className="absolute -bottom-10 left-0 right-0 px-4">
          <View className="bg-black rounded-3xl h-20 flex-row justify-between items-center w-full">
            <StatItem label="Likes" value={likes} />
            <StatItem label="Chapters" value={chapters} />
            <StatItem label="Views" value={views} />
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

function StatItem({ label, value }: { label: string; value: number }) {
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
    <View className="items-center px-8">
      <Text className="text-white font-mbold text-lg">
        {formatNumber(value)}
      </Text>
      <Text className="text-white font-mregular text-sm opacity-80">
        {label}
      </Text>
    </View>
  );
}
