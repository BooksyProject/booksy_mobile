// components/ChapterListPreview.tsx
import { View, Text, TouchableOpacity } from "react-native";

interface Chapter {
  title: string;
  date: string;
}

interface Props {
  chapters: Chapter[];
  onSeeAll?: () => void;
}

export default function ChapterListPreview({ chapters, onSeeAll }: Props) {
  return (
    <View className="mt-6 px-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-msemibold text-lg">
          {chapters.length} chapters
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text className="text-custom-red font-mregular text-base">
            See all
          </Text>
        </TouchableOpacity>
      </View>
      {chapters.map((ch, index) => (
        <View
          key={index}
          className="flex-row justify-between py-2 border-b border-gray-200"
        >
          <Text className="text-sm font-mregular  text-light-500">
            {ch.title}
          </Text>
          <Text className="text-sm font-mregular text-light-500">
            {ch.date}
          </Text>
        </View>
      ))}
    </View>
  );
}
