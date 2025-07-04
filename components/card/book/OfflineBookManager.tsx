// components/OfflineBookManager.tsx - Component quản lý sách offline
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OfflineBookService } from "@/lib/service/book.service";
import LibraryBookCard from "./LibraryBookCard";

const OfflineBookManager: React.FC = () => {
  const [offlineBooks, setOfflineBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSize, setTotalSize] = useState<string>("");

  useEffect(() => {
    loadOfflineBooks();
  }, []);

  const loadOfflineBooks = async () => {
    try {
      setLoading(true);
      const books = await OfflineBookService.getOfflineBooks();
      setOfflineBooks(books);

      const size = await OfflineBookService.getTotalOfflineSize();
      setTotalSize(OfflineBookService.formatFileSize(size));
    } catch (error) {
      console.error("Error loading offline books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOfflineBooks();
    setRefreshing(false);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Xóa tất cả sách offline",
      `Bạn có chắc chắn muốn xóa tất cả ${offlineBooks.length} sách đã tải về?\n\nTổng dung lượng: ${totalSize}`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tất cả",
          style: "destructive",
          onPress: async () => {
            try {
              await OfflineBookService.deleteAllOfflineBooks();
              setOfflineBooks([]);
              setTotalSize("0 B");
              Alert.alert("Thành công", "Đã xóa tất cả sách offline!");
            } catch (error) {
              Alert.alert(
                "Lỗi",
                "Không thể xóa tất cả sách. Vui lòng thử lại."
              );
            }
          },
        },
      ]
    );
  };

  const handleBookDeleted = (bookId: string) => {
    setOfflineBooks((prev) => prev.filter((book) => book._id !== bookId));
    loadOfflineBooks(); // Refresh để update tổng dung lượng
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Đang tải danh sách sách offline...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 py-3 bg-gray-50 border-b">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-bold">Sách đã tải về</Text>
            <Text className="text-sm text-gray-600">
              {offlineBooks.length} sách • {totalSize}
            </Text>
          </View>
          {offlineBooks.length > 0 && (
            <TouchableOpacity
              onPress={handleDeleteAll}
              className="bg-red-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={offlineBooks}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <LibraryBookCard
            book={item}
            isOffline={true}
            onBookDeleted={handleBookDeleted}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="download-outline" size={64} color="#ccc" />
            <Text className="text-gray-500 mt-4 text-center">
              Chưa có sách nào được tải về
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default OfflineBookManager;
