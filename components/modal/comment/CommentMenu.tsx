import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import {
  updateComment,
  deleteComment,
  deleteCommentReply,
} from "@/lib/service/comment.service";
import { UserBasicInfo } from "@/dtos/UserDTO";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface CommentMenuProps {
  comment: CommentResponseDTO;
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chapterId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  repliesCount?: number;
  setParentCommentsData?: React.Dispatch<
    React.SetStateAction<CommentResponseDTO[]>
  >;
  profileBasic: UserBasicInfo;
  textColor: string;
  bgColor: string;
}

const CommentMenu = ({
  comment,
  setCommentsData,
  setModalVisible,
  chapterId,
  setNumberOfComments,
  numberOfComments,
  repliesCount,
  setParentCommentsData,
  profileBasic,
  textColor,
  bgColor,
}: CommentMenuProps) => {
  const [newComment, setNewComment] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditComment = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token || !newComment.trim()) return;

    try {
      const updatedComment = await updateComment(
        { content: newComment },
        comment._id,
        token
      );
      setCommentsData((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? { ...c, content: updatedComment.comment.content }
            : c
        )
      );
      setModalVisible(false);
    } catch (error) {
      console.error("❌ Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      if (comment.originalCommentId === null) {
        if (chapterId) await deleteComment(comment._id, chapterId, token);
        if (repliesCount)
          setNumberOfComments(numberOfComments - (repliesCount + 1));
      } else {
        if (chapterId)
          await deleteCommentReply(
            comment._id,
            chapterId,
            comment.originalCommentId,
            token
          );
        setNumberOfComments((prev) => prev - 1);

        if (setParentCommentsData) {
          setParentCommentsData((prev) =>
            prev.map((c) =>
              c._id === comment.originalCommentId
                ? {
                    ...c,
                    replies:
                      c.replies?.filter((id) => id !== comment._id) || [],
                  }
                : c
            )
          );
        }
      }

      setCommentsData((prev) => prev.filter((c) => c._id !== comment._id));
      setModalVisible(false);
    } catch (error) {
      console.error("❌ Failed to delete comment:", error);
    }
  };

  const isOwner = comment.author._id === profileBasic._id;

  return (
    <View className="flex-1 justify-center items-center">
      <View
        className="rounded-lg p-4 w-3/4 shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        {isEditing ? (
          <>
            <Input
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Update comment..."
            />
            <View className="flex-row mt-4 ml-auto" style={{ gap: 10 }}>
              <View className="w-28">
                <Button
                  title="Save"
                  onPress={handleEditComment}
                  fontColor={bgColor}
                />
              </View>
              <View className="w-28">
                <Button
                  title="Cancel"
                  onPress={() => setIsEditing(false)}
                  fontColor={bgColor}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            {isOwner ? (
              <>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="mb-4"
                >
                  <Text className="text-blue-500 text-sm font-mmedium">
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteComment}
                  className="mb-4"
                >
                  <Text className="text-red-500 text-sm font-mmedium">
                    Delete
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity disabled className="mb-4 opacity-50">
                <Text className="text-yellow-500 text-sm font-mmedium">
                  Report (disabled)
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-2"
            >
              <Text className="text-gray-500 text-sm font-mmedium">Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default CommentMenu;
