import { ArrowIcon } from "@/components/icon/Icons";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface BookDetailCardProps {
  onClose: () => void;
}

const BookDetailCard = ({ onClose }: BookDetailCardProps) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  return (
    <View className="flex-1 bg-black bg-opacity-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200],
          }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          className="flex-1 px-[20px]"
        >
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={onClose} className="mr-4">
              <ArrowIcon size={24} color={iconColor} />
            </TouchableOpacity>
            <Text
              className="text-xl font-semibold"
              style={{ color: iconColor }}
            >
              Book Details
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default BookDetailCard;
