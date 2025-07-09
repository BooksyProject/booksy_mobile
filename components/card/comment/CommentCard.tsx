import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ReplyCard from "./ReplyCard";
import { UserBasicInfo } from "@/dtos/UserDTO";
import CommentActionCard from "./CommentActionCard";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { getCommentByCommentId } from "@/lib/service/comment.service";
import CommentMenu from "@/components/modal/comment/CommentMenu";

interface CommentCardProps {
  comment: CommentResponseDTO;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  profileBasic: UserBasicInfo;
  author: UserBasicInfo;
  chapterId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  textColor: string;
  bgColor: string;
}
const CommentCard = ({
  comment,
  commentsData,
  setCommentsData,
  profileBasic,
  author,
  chapterId,
  setNumberOfComments,
  numberOfComments,
  textColor,
  bgColor,
}: CommentCardProps) => {
  const { colorScheme } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesData, setRepliesData] = useState<CommentResponseDTO[]>([]);

  const toggleShowReplies = async () => {
    const nextShow = !showReplies;
    setShowReplies(nextShow);

    if (
      nextShow &&
      Array.isArray(comment.replies) &&
      comment.replies.length > 0
    ) {
      try {
        const detailsComments: CommentResponseDTO[] = await Promise.all(
          comment.replies.map(async (replyId: string) => {
            return await getCommentByCommentId(replyId);
          })
        );
        setRepliesData(detailsComments);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
  };

  const handleLongPress = () => {
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableOpacity onLongPress={handleLongPress}>
        <View className="flex-row my-2">
          <Image
            source={{
              uri:
                comment.author?.avatar ||
                "https://i.pinimg.com/736x/9a/00/82/9a0082d8f710e7b626a114657ec5b781.jpg",
            }}
            className="w-11 h-11 rounded-full"
          />
          <View className="ml-3">
            <Text
              style={{
                color: textColor,
              }}
              className="font-mmedium text-[16px]"
            >
              {comment.author?.firstName} {comment.author?.lastName}
            </Text>
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                alignSelf: "flex-start",
                backgroundColor: bgColor,
                borderColor: "#CCCCCC",
                borderWidth: 1,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                overflow: "hidden", // 👈 Thêm dòng này để Android render đúng border radius
              }}
            >
              <Text
                className="text-[16px] font-mregular inline-block"
                style={{
                  color: textColor,
                }}
              >
                {comment.content}
              </Text>
            </View>

            <CommentActionCard
              comment={comment}
              setNumberOfComments={setNumberOfComments}
              numberOfComments={numberOfComments}
              profileBasic={profileBasic}
              chapterId={chapterId}
              author={author}
              originalCommentId={comment._id}
              setRepliesData={setRepliesData}
              textColor={textColor} // 👈 thêm dòng này
              bgColor={bgColor}
            />
            {comment.replies && comment.replies?.length > 0 && (
              <TouchableOpacity onPress={toggleShowReplies}>
                <Text className="text-primary-100 text-sm mt-2 font-mmedium">
                  {showReplies
                    ? "Hide replies"
                    : `${comment.replies?.length} replies`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {showReplies && Array.isArray(repliesData) && (
          <View className="my-2 ml-10">
            {repliesData.map((reply: any) => (
              <View key={reply._id}>
                <ReplyCard
                  reply={reply}
                  repliesData={repliesData}
                  setRepliesData={setRepliesData}
                  commentId={comment._id}
                  profileBasic={profileBasic}
                  author={author}
                  chapterId={chapterId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
                  setCommentsData={setCommentsData}
                  textColor={textColor}
                  bgColor={bgColor}
                />
              </View>
            ))}
          </View>
        )}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <CommentMenu
            comment={comment}
            setCommentsData={setCommentsData}
            setModalVisible={setModalVisible}
            chapterId={chapterId}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            repliesCount={repliesData?.length}
            profileBasic={profileBasic}
            textColor={textColor}
            bgColor={bgColor}
          />
        </Modal>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CommentCard;
