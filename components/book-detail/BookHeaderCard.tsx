// components/BookHeaderCard.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Heart, Share2 } from "lucide-react-native";

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
    <View className="bg-red-400 w-full flex flex-col rounded-b-3xl px-4 pt-6 pb-4">
      <View className="flex flex-row justify-between mb-4">
        <TouchableOpacity>
          <Heart color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Share2 color="white" />
        </TouchableOpacity>
      </View>
      <View className="items-center">
        <Image
          source={{ uri: coverImage }}
          className="w-36 h-48 rounded-md mb-2"
        />
        <Text className="text-white text-xl font-semibold">{title}</Text>
        <Text className="text-white text-sm mb-3">{author}</Text>
        <View className="bg-black/20 rounded-xl px-4 py-2 flex-row justify-between w-full">
          <StatItem label="Likes" value={likes} />
          <StatItem label="Chapters" value={chapters} />
          <StatItem label="Views" value={views} />
        </View>
      </View>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center">
      <Text className="text-white font-bold text-base">{value}</Text>
      <Text className="text-white text-xs">{label}</Text>
    </View>
  );
}
