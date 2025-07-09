import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { createBook, deleteBook, getMyBook } from "@/lib/service/book.service";
import { getAllCategories } from "@/lib/service/category.service";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import CategorySelect from "@/components/ui/category-select";
import Button from "@/components/ui/button";
import CircleIconButton from "@/components/ui/circle-icon-button";
import { CloseIcon } from "@/components/icon/Icons";
import BookCard from "@/components/card/book/BookCard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function MyBookScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 60) / 2;
  const [categoryOptions, setCategoryOptions] = useState<CategoryResponseDTO[]>(
    []
  );
  const [myBooks, setMyBooks] = useState<any[]>([]);

  const { colorScheme } = useTheme();
  const bgColor = colorScheme === "dark" ? colors.dark[200] : colors.light[200];
  const textColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategoryOptions(data.categories);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    loadCategories();
  }, []);

  const loadMyBooks = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await getMyBook(token);
      console.log(res.books);
      setMyBooks(res.books);
    } catch (err) {
      console.error("❌ Failed to fetch my books:", err);
    }
  };

  useEffect(() => {
    loadMyBooks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMyBooks();
    }, [])
  );

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Bạn chưa đăng nhập");
      return;
    }

    try {
      const response = await createBook(
        {
          title,
          author,
          categories,
          description,
          coverImage,
          fileURL,
          fileType: fileType.toUpperCase(),
        },
        token
      );

      Alert.alert("Tạo sách thành công");
      console.log("✅ Book created:", response.book);

      setModalVisible(false);
      setTitle("");
      setAuthor("");
      setCategories([]);
      setDescription("");
      setCoverImage("");
      setFileURL("");
      setFileType("pdf");

      await loadMyBooks(); // Load lại danh sách sách
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Bạn chưa đăng nhập");
      return;
    }

    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(bookId, token);
              Alert.alert("book deleted");
              await loadMyBooks(); // cập nhật lại danh sách
            } catch (err: any) {
              Alert.alert("Lỗi", err.message || "Book cannot be deleted");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
      <Button
        title="+ Create Book"
        onPress={() => setModalVisible(true)}
        fontColor={
          colorScheme === "dark" ? colors.dark[100] : colors.light[200]
        }
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: bgColor }}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex flex-row justify-between mb-4">
              <Text
                className="text-[24px] mb-5 font-msemibold text-center"
                style={{ color: textColor }}
              >
                Create Book
              </Text>
              <CircleIconButton
                icon={CloseIcon}
                onPress={() => setModalVisible(false)}
              />
            </View>

            {[
              { label: "Title", value: title, setValue: setTitle },
              { label: "Author", value: author, setValue: setAuthor },
              {
                label: "Description",
                value: description,
                setValue: setDescription,
              },
              {
                label: "Cover Image",
                value: coverImage,
                setValue: setCoverImage,
              },
              { label: "File Sách", value: fileURL, setValue: setFileURL },
              { label: "File Type", value: fileType, setValue: setFileType },
            ].map(({ label, value, setValue }) => (
              <View className="relative mb-5" key={label}>
                <View
                  className="absolute left-3 -top-2 px-1 z-10"
                  style={{ backgroundColor: bgColor }}
                >
                  <Text
                    className="text-xs font-mregular"
                    style={{ color: textColor }}
                  >
                    {label} <Text className="text-red-500">*</Text>
                  </Text>
                </View>
                <Input
                  value={value}
                  onChangeText={setValue}
                  placeholder={label}
                  secureTextEntry={false}
                  height={56}
                  fontSize={14}
                  fontFamily="Montserrat-Regular"
                />
              </View>
            ))}

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                  color: textColor,
                }}
              >
                Select categories:
              </Text>
              <CategorySelect
                categories={categoryOptions}
                selectedIds={categories}
                onToggleCategory={(id) => {
                  setCategories((prev) =>
                    prev.includes(id)
                      ? prev.filter((catId) => catId !== id)
                      : [...prev, id]
                  );
                }}
              />
            </View>
          </ScrollView>

          <View
            style={{
              padding: 20,
              borderTopWidth: 1,
              backgroundColor: bgColor,
            }}
          >
            <Button
              title="Create Book"
              onPress={handleSubmit}
              fontColor={
                colorScheme === "dark" ? colors.dark[100] : colors.light[200]
              }
            />
          </View>
        </View>
      </Modal>

      <Text
        style={{ color: textColor, marginBottom: 10 }}
        className="mt-3 font-msemibold text-[18px]"
      >
        My Book
      </Text>

      {/* <ScrollView>
        {!Array.isArray(myBooks) || myBooks.length === 0 ? (
          <Text style={{ textAlign: "center", color: textColor }}>
            Bạn chưa có sách nào.
          </Text>
        ) : (
          myBooks.map((book) => (
            <TouchableOpacity
              key={book._id}
              onLongPress={() => handleDeleteBook(book._id)}
              delayLongPress={600}
            >
              <BookCard book={book} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView> */}
      <FlatList
        data={myBooks}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ gap: 12 }}
        columnWrapperStyle={{ gap: 20, marginBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: textColor }}>
            Bạn chưa có sách nào.
          </Text>
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onLongPress={() => handleDeleteBook(item._id)}
            delayLongPress={600}
            activeOpacity={0.8}
            style={{
              width: itemWidth,
            }}
          >
            <BookCard book={item} onRefresh={loadMyBooks} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
