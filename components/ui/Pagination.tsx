import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

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
  return (
    <View className="flex-row justify-between items-center mt-4">
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onChange(currentPage - 1)}
      >
        <ChevronLeft
          size={24}
          color={currentPage === 1 ? "#9CA3AF" : "black"} // gray-400 : light-500
        />
      </TouchableOpacity>

      <Text className="text-sm font-mregular">{`Page ${currentPage} of ${totalPages}`}</Text>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onChange(currentPage + 1)}
      >
        <ChevronRight
          size={24}
          color={currentPage === totalPages ? "#9CA3AF" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
}
