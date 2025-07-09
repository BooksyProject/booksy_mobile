import { Alert, Modal, ScrollView, Text, TextInput, View } from "react-native";
import BookHeaderCard from "@/components/card/book/BookHeaderCard";
import BookDescription from "@/components/shared/book/BookDescription";
import ChapterListPreview from "@/components/shared/chapter/ChapterListPreview";
import useReadingProgressManager from "@/hooks/useReadingProgressManager";
import useGoToReader from "@/hooks/goToReader";
import React, { useEffect, useState } from "react";
import { BookDTO, BookResponseDTO } from "@/dtos/BookDTO";
import {
  getBookDetail,
  updateBook,
  UpdateBookParams,
} from "@/lib/service/book.service";
import {
  createChapter,
  getChaptersByBook,
} from "@/lib/service/chapter.service";
import { ChapterInf } from "@/dtos/ChapterDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import Button from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircleIconButton from "@/components/ui/circle-icon-button";
import { CloseIcon } from "@/components/icon/Icons";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import CategorySelect from "@/components/ui/category-select";
import { getAllCategories } from "@/lib/service/category.service";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
interface BookDetailCardProps {
  book: BookResponseDTO;
  isCreatedByUser: boolean;
  onClose: (shouldRefresh?: boolean) => void;
}

const BookDetailCard: React.FC<BookDetailCardProps> = ({
  book,
  isCreatedByUser,
  onClose,
}) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const bookId = book?._id;
  const textColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const { progress, loading } = useReadingProgressManager(bookId);
  const goToReader = useGoToReader();

  const [bookDetail, setBookDetail] = useState<BookDTO | null>(null);
  const [chapters, setChapters] = useState<ChapterInf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryResponseDTO[]>(
    []
  );
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategoryOptions(data.categories);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
      }
    };

    loadCategories();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editFileURL, setEditFileURL] = useState("");
  const [editFileType, setEditFileType] = useState("");
  const [editCategories, setEditCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bookData, chaptersData] = await Promise.all([
          getBookDetail(bookId),
          getChaptersByBook(bookId),
        ]);
        if (bookData.success) {
          setBookDetail(bookData.data);
        }

        console.log("chaptersData", chaptersData);
        if (chaptersData && Array.isArray(chaptersData)) {
          setChapters(chaptersData);
        }
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  const handleCreateChapter = async () => {
    const token = await AsyncStorage.getItem("token");
    // console.log(token);
    if (!token) return;
    if (!bookId || !chapterTitle || !chapterContent || !token) return;

    try {
      setIsSubmitting(true);
      const result = await createChapter(
        {
          bookId,
          chapterTitle,
          content: chapterContent,
        },
        token
      );

      if (result?.status) {
        setChapters((prev) => [...prev, result]); // cập nhật danh sách chương mới
        setShowModal(false);
        setChapterTitle("");
        setChapterContent("");
      } else {
        console.error("❌ Tạo chương thất bại:", result?.message);
      }
    } catch (error) {
      console.error("❌ Lỗi tạo chương:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookDetail) {
    return (
      <ScrollView className="flex-1 bg-book-background">
        <Text className="text-center mt-10 text-white">Book not found</Text>
      </ScrollView>
    );
  }

  const handleUpdateBook = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token || !bookId) return;

    try {
      const updatedData: UpdateBookParams = {
        title: editTitle,
        author: editAuthor,
        categories: editCategories,
        description: editDescription,
        coverImage: editCoverImage,
        fileURL: editFileURL,
        fileType: editFileType,
      };

      const response = await updateBook(bookId, updatedData, token);

      Alert.alert("Book updated successfully");
      setShowEditModal(false);

      // ✅ gọi callback với true để thông báo cần reload
      onClose(true);
    } catch (error: any) {
      Alert.alert("Failed to update book", error.message);
    }
  };

  return (
    <ScrollView className="flex-1 h-full" style={{ backgroundColor: bgColor }}>
      <BookHeaderCard
        _id={bookDetail._id}
        title={bookDetail.title}
        author={bookDetail.author}
        coverImage={bookDetail.coverImage}
        categories={bookDetail.categories}
        likes={bookDetail.likes}
        chapters={chapters.length}
        views={bookDetail.views}
        fileURL={bookDetail.fileURL}
        onClose={onClose}
        onEdit={() => {
          setEditTitle(bookDetail.title);
          setEditAuthor(bookDetail.author);
          setEditDescription(bookDetail.description);
          setEditCoverImage(bookDetail.coverImage);
          setEditFileURL(bookDetail.fileURL);
          setEditFileType(bookDetail.fileType);
          setEditCategories(bookDetail.categories.map((c) => c._id));
          setShowEditModal(true);
        }}
      />

      <BookDescription description={bookDetail.description} />

      <ChapterListPreview
        bookId={bookDetail._id}
        chapters={chapters}
        isCreatedByUser={isCreatedByUser}
        setChapters={setChapters}
        onDeleted={(deletedId) => {
          setChapters((prev) => prev.filter((ch) => ch._id !== deletedId));
        }}
      />
      {isCreatedByUser && (
        <View className="mx-safe-or-3 mb-8">
          <Button title="+ Add chapter" onPress={() => setShowModal(true)} />
        </View>
      )}
      {!isCreatedByUser && (
        <View className="mt-6 mx-safe-or-3 mb-14">
          <Button
            title={progress ? "Continue Reading" : "Start Reading"}
            onPress={() => goToReader(bookId, progress?.chapterNumber || 1)}
            outline={!!progress}
          />
        </View>
      )}
      <Modal
        visible={showModal}
        animationType="slide"
        style={{ backgroundColor: bgColor }}
      >
        <View
          className="flex-1 px-4 pt-10"
          style={{ backgroundColor: bgColor }}
        >
          <View className="flex flex-row justify-between mb-4">
            <Text
              className="text-[24px] mb-5 font-msemibold text-center"
              style={{ color: textColor }}
            >
              Create Chapter
            </Text>
            <CircleIconButton
              icon={CloseIcon}
              onPress={() => setShowModal(false)}
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
            <Input
              value={chapterTitle}
              onChangeText={setChapterTitle}
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
                Chapter Content <Text className="text-red-500">*</Text>
              </Text>
            </View>
            <Textarea
              value={chapterContent}
              onChangeText={setChapterContent}
              placeholder="Nội dung chương..."
              height={500}
              numberOfLines={10}
            />
          </View>

          <View className="flex-row justify-between mt-6">
            <View className="flex-1 ml-2">
              <Button
                title={isSubmitting ? "Creating" : "Create chapter"}
                onPress={handleCreateChapter}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEditModal} animationType="slide">
        <ScrollView style={{ flex: 1, backgroundColor: bgColor, padding: 20 }}>
          <View className="flex flex-row justify-between mb-4">
            <Text
              className="text-[24px] font-msemibold"
              style={{ color: textColor }}
            >
              Edit Book
            </Text>
            <CircleIconButton
              icon={CloseIcon}
              onPress={() => setShowEditModal(false)}
            />
          </View>

          {/* Input fields */}
          {[
            { label: "Title", value: editTitle, setValue: setEditTitle },
            { label: "Author", value: editAuthor, setValue: setEditAuthor },
            {
              label: "Description",
              value: editDescription,
              setValue: setEditDescription,
            },
            {
              label: "Cover Image",
              value: editCoverImage,
              setValue: setEditCoverImage,
            },
            { label: "File URL", value: editFileURL, setValue: setEditFileURL },
            {
              label: "File Type",
              value: editFileType,
              setValue: setEditFileType,
            },
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

          {/* Category chọn lại */}
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 6,
              color: textColor,
              marginTop: 10,
            }}
          >
            Select Categories:
          </Text>
          <CategorySelect
            categories={categoryOptions}
            selectedIds={editCategories}
            onToggleCategory={(id) => {
              setEditCategories((prev) =>
                prev.includes(id)
                  ? prev.filter((catId) => catId !== id)
                  : [...prev, id]
              );
            }}
          />

          <View className="mt-6">
            <Button
              title="Update Book"
              onPress={handleUpdateBook}
              fontColor={bgColor}
            />
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default BookDetailCard;
