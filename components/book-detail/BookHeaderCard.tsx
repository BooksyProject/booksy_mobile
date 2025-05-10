import { View, Text, Image } from "react-native";
import { Heart, Share2, Bell } from "lucide-react-native";
import TouchableButton from "@/components/ui/TouchableButton";
import GenreBadge from "../ui/GenreBadge";

interface Props {
  title: string;
  author: string;
  coverImage: string;
  likes: number;
  chapters: number;
  views: number;
}

export default function BookHeaderCard({
  title,
  author,
  coverImage,
  likes,
  chapters,
  views,
}: Props) {
  return (
    <>
      <View className="bg-book-detail w-full relative rounded-2xl px-4 pt-6 pb-4">
        {/* Nút Heart + Share */}
        <View className="flex flex-row justify-between mb-4">
          <TouchableButton
            size="sm"
            rounded="full"
            variant="solid"
            bgColor="#1E293B" // dùng màu tùy chọn
            icon={<Bell color="white" size={20} />}
          />
          <TouchableButton
            size="sm"
            rounded="full"
            variant="solid"
            bgColor="#1E293B" // dùng màu tùy chọn
            icon={<Share2 color="white" size={20} />}
          />
        </View>

        {/* Ảnh bìa + tiêu đề + tác giả */}
        <View className="items-center pb-4">
          <Image
            source={{ uri: coverImage }}
            className="w-36 h-48 rounded-md mb-2"
          />
          <View className="flex-row justify-between w-full px-8 py-4">
            <View>
              <Text className="text-white text-xl font-mbold">{title}</Text>
              <Text className="text-white text-sm font-mregular mb-3">
                {author}
              </Text>
            </View>

            <TouchableButton
              size="sm"
              rounded="full"
              variant="solid"
              bgColor="#1E293B" // dùng màu tùy chọn
              icon={<Heart color="white" size={20} />}
            />
          </View>

          {/* Stats: Likes, Chapters, Views */}
        </View>
        <View className="absolute -bottom-10 left-0 right-0 px-4">
          <View className="bg-black rounded-3xl h-20  flex-row justify-between items-center w-full">
            <StatItem label="Likes" value={likes} />
            <StatItem label="Chapters" value={chapters} />
            <StatItem label="Views" value={views} />
          </View>
        </View>
      </View>
      <View className="mt-14 w-full px-4 flex-row justify-center gap-4 ">
        <GenreBadge genre="Detective" />
        <GenreBadge genre="Detective" />
      </View>
    </>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center px-8">
      <Text className="text-white font-mregular text-base">{value}</Text>
      <Text className="text-white font-mregular text-base">{label}</Text>
    </View>
  );
}
