import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { getTimestamp } from "@/lib/utils";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { useTheme } from "@/contexts/ThemeContext";
import {
  addReplyToComment,
  createReplyCommentChapter,
  dislikeComment,
  likeComment,
} from "@/lib/service/comment.service";
import { CancelIcon, SendIcon } from "@/components/icon/Icons";
import Input from "@/components/ui/input";

interface CommentActionCardProps {
  comment: CommentResponseDTO;
  profileBasic: UserBasicInfo;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  chapterId?: string;
  author: UserBasicInfo;
  originalCommentId: string;
  setRepliesData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setCommentsData?: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}

const CommentActionCard = ({
  comment,
  profileBasic,
  setNumberOfComments,
  numberOfComments,
  chapterId,
  author,
  originalCommentId,
  setRepliesData,
  setCommentsData,
}: CommentActionCardProps) => {
  const { colorScheme } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.likes.length);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  //   const { profile } = useAuth();
  const [newComment, setNewComment] = useState("");
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  useEffect(() => {
    let isMounted = true;
    const checkLike = async () => {
      const userId: string | null = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const isUserLiked = comment.likes.some(
            (like: any) => like === userId
          );
          if (isMounted) {
            setIsLiked(isUserLiked);
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };
    checkLike();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLikeComment = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (token) {
        await likeComment(comment._id, token);
        setIsLiked(!isLiked);
        // if (profileBasic._id !== comment.author._id) {
        //   const params = {
        //     senderId: profileBasic._id,
        //     receiverId: comment.author._id,
        //     type: "like_comment",
        //     commentId: comment._id,
        //     ...(postId && { postId }),
        //     ...(mediaId && { mediaId }),
        //   };
        //   await createNotification(params, token);
        // }
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const handleDislikeComment = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (token) {
        await dislikeComment(comment._id, token);

        setIsLiked(!isLiked);
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const toggleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setNumberOfLikes((prev: any) => prev - 1);
      await handleDislikeComment();
    } else {
      setIsLiked(true);
      setNumberOfLikes((prev: any) => prev + 1);
      await handleLikeComment();
    }
  };

  const handleReplyComment = async () => {
    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!newComment.trim() || !replyingTo) {
      console.warn("Comment cannot be empty or no comment to reply to");
      return;
    }

    try {
      setNewComment("");
      setReplyingTo(null);
      if (chapterId) {
        const newCommentData = await createReplyCommentChapter(
          {
            content: newComment,
            parentId: comment._id,
            originalCommentId: comment._id,
          },
          token,
          chapterId
        );
        if (newCommentData) {
          await addReplyToComment(originalCommentId, newCommentData._id, token);
        }

        const currentTime = new Date();

        const enrichedComment: CommentResponseDTO = {
          ...newCommentData,
          author: {
            _id: profileBasic?._id,
            avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profileBasic?.firstName || "Anonymous",
            lastName: profileBasic?.lastName || "Anonymous",
          },
          createAt: currentTime,
          likes: [],
          parentId: {
            _id: comment?._id,
            avatar:
              comment?.author.avatar || "/assets/images/default-avatar.jpg",
            firstName: comment?.author.firstName || "Anonymous",
            lastName: comment?.author.lastName || "Anonymous",
          },
          originalCommentId: originalCommentId,
        };

        setRepliesData((prev: CommentResponseDTO[]) => [
          enrichedComment,
          ...prev,
        ]);

        comment.replies = [enrichedComment._id, ...(comment.replies || [])];

        if (setCommentsData) {
          setCommentsData((prevComments) =>
            prevComments.map((c) => {
              if (c._id === originalCommentId) {
                return {
                  ...c,
                  replies: [enrichedComment._id, ...(c.replies || [])],
                };
              }
              return c;
            })
          );
        }
      }
      setNumberOfComments(numberOfComments + 1);
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  return (
    <View>
      <View className="flex-row space-x-2">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200],
            fontSize: 12,
          }}
          className="font-mregular"
        >
          {getTimestamp(comment.createAt)}
        </Text>
        <View className="flex-row space-x-1">
          <TouchableOpacity onPress={toggleLike}>
            <Text
              className=" text-xs font-mmedium"
              style={{
                color: isLiked
                  ? colors.primary[100]
                  : colorScheme === "dark"
                  ? colors.dark[100]
                  : colors.light[100],
              }}
            >
              Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              className=" text-xs font-mmedium"
              style={{
                color: isLiked
                  ? colors.primary[100]
                  : colorScheme === "dark"
                  ? colors.dark[100]
                  : colors.light[100],
              }}
            >
              {numberOfLikes}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setReplyingTo(comment._id)}>
          <Text
            className=" text-xs font-mmedium"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
          >
            Reply
          </Text>
        </TouchableOpacity>
      </View>
      {replyingTo === comment._id && (
        <View className="mt-2 flex-row">
          <View className="w-full flex-row items-center px-2">
            <View className="flex-1">
              <Input
                // avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
                placeholder="Write a comment"
                readOnly={false}
                value={newComment}
                onChangeText={setNewComment}
              />
            </View>
            <TouchableOpacity onPress={handleReplyComment}>
              <SendIcon size={27} color={colors.primary[100]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <CancelIcon size={20} color={colors.primary[100]} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default CommentActionCard;
