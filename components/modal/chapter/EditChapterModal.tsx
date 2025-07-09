// components/modal/chapter/EditChapterModal.tsx
import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ChapterInf } from "@/dtos/ChapterDTO";
import { updateChapter } from "@/lib/service/chapter.service";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircleIconButton from "@/components/ui/circle-icon-button";
import { CloseIcon } from "@/components/icon/Icons";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

interface EditChapterModalProps {
  visible: boolean;
  onClose: () => void;
  chapter: ChapterInf;
  onUpdated: (updatedChapter: ChapterInf) => void;
}

export default function EditChapterModal({
  visible,
  onClose,
  chapter,
  onUpdated,
}: EditChapterModalProps) {
  const [title, setTitle] = useState(chapter.chapterTitle);
  const [content, setContent] = useState(chapter.content || "");
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  useEffect(() => {
    if (visible) {
      setTitle(chapter.chapterTitle);
      setContent(chapter.content || "");
    }
  }, [visible]);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in to update a chapter.");
        return;
      }

      const res = await updateChapter(
        chapter._id,
        { chapterTitle: title, content },
        token
      );
      if (res.status) {
        Alert.alert("Success", "Chapter updated successfully");
        onUpdated({ ...chapter, chapterTitle: title, content });
        onClose();
      } else {
        Alert.alert("Error", res.message || "Failed to update chapter");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Update failed");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 p-4" style={{ backgroundColor: bgColor }}>
        <View className="flex flex-row justify-between mb-4">
          <Text
            className="text-[24px] mb-5 font-msemibold text-center"
            style={{ color: textColor }}
          >
            Create Chapter
          </Text>
          <CircleIconButton icon={CloseIcon} onPress={onClose} />
        </View>
        <View className="relative mb-5">
          <View
            className="absolute left-3 -top-2 px-1 z-10"
            style={{ backgroundColor: bgColor }}
          >
            <Text
              className="text-xs font-mregular"
              style={{ color: textColor }}
            >
              Chapter Title <Text className="text-red-500">*</Text>
            </Text>
          </View>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Chapter Title"
            secureTextEntry={false}
            height={56}
            fontSize={14}
            fontFamily="Montserrat-Regular"
          />
        </View>
        <View className="relative mb-5">
          <View
            className="absolute left-3 -top-2 px-1 z-10"
            style={{ backgroundColor: bgColor }}
          >
            <Text
              className="text-xs font-mregular"
              style={{ color: textColor }}
            >
              Chapter Title <Text className="text-red-500">*</Text>
            </Text>
          </View>
          <Textarea
            value={content}
            onChangeText={setContent}
            placeholder="Nội dung chương..."
            height={500}
            numberOfLines={10}
          />
        </View>
        <View className="flex-row justify-between mt-6">
          <View className="flex-1 ml-2">
            <Button title={"Update chapter"} onPress={handleUpdate} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
