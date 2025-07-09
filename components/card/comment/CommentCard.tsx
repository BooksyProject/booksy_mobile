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
import { colors } from "@/styles/colors";
import ReplyCard from "./ReplyCard";
import { UserBasicInfo } from "@/dtos/UserDTO";
import CommentActionCard from "./CommentActionCard";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { getCommentByCommentId } from "@/lib/service/comment.service";

interface CommentCardProps {
  comment: CommentResponseDTO;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  profileBasic: UserBasicInfo;
  author: UserBasicInfo;
  chapterId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
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
                "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
            }}
            className="w-11 h-11 rounded-full"
          />
          <View className="ml-3">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="font-mmedium text-[16px]"
            >
              {comment.author?.firstName} {comment.author?.lastName}
            </Text>
            <View
              className=" rounded-r-[20px] rounded-bl-[20px] px-[15px] py-[10px]  self-start"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[400] : colors.light[400],
              }}
            >
              <Text
                className="text-[16px] font-mregular inline-block"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
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
                />
              </View>
            ))}
          </View>
        )}
        {/* <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <CommentMenu
            comment={comment}
            // commentsData={commentsData}
            setCommentsData={setCommentsData}
            setModalVisible={setModalVisible}
            postId={postId}
            mediaId={mediaId}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            repliesCount={repliesData?.length}
          />
        </Modal> */}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CommentCard;
