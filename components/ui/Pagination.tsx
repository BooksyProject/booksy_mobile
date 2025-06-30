import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface Props {
  currentPage: number;
  totalPages: number;
  iconColor: string;
  onChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  iconColor,
  onChange,
}: Props) {
  const disabledColor = "#9CA3AF";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: 16,
        backgroundColor: "transparent",
        borderRadius: 8,
      }}
    >
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onChange(currentPage - 1)}
      >
        <ChevronLeft
          size={24}
          color={currentPage === 1 ? disabledColor : iconColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onChange(currentPage + 1)}
      >
        <ChevronRight
          size={24}
          color={currentPage === totalPages ? disabledColor : iconColor}
        />
      </TouchableOpacity>
    </View>
  );
}
