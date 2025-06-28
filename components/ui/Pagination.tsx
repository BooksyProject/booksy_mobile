import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext"; // Đảm bảo bạn đã import useTheme
import { colors } from "@/styles/colors";

interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: Props) {
  const { colorScheme } = useTheme(); // Lấy theme hiện tại

  // Chọn màu icon và background tùy theo theme sáng/tối
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100]; // Sử dụng màu sáng cho dark theme và màu tối cho light theme
  const disabledColor = "#9CA3AF"; // Màu cho trạng thái vô hiệu
  const backgroundColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[300]; // Màu nền tùy theo theme

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: 16,
        borderRadius: 8,
      }}
    >
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onChange(currentPage - 1)}
      >
        <ChevronLeft
          size={24}
          color={currentPage === 1 ? disabledColor : iconColor} // Màu icon khi vô hiệu
        />
      </TouchableOpacity>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onChange(currentPage + 1)}
      >
        <ChevronRight
          size={24}
          color={currentPage === totalPages ? disabledColor : iconColor} // Màu icon khi vô hiệu
        />
      </TouchableOpacity>
    </View>
  );
}
