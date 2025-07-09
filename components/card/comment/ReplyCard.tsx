import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { colors } from "@/styles/colors";
import CommentActionCard from "./CommentActionCard";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowRightIcon } from "@/components/icon/Icons";
import CommentMenu from "@/components/modal/comment/CommentMenu";

interface ReplyCardProps {
  reply: CommentResponseDTO;
  setRepliesData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  repliesData: CommentResponseDTO[];
  profileBasic: UserBasicInfo;
  commentId: string;
  author: UserBasicInfo;
  chapterId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  textColor: string;
  bgColor: string;
}

const ReplyCard = ({
  reply,
  repliesData,
  setRepliesData,
  commentId,
  profileBasic,
  author,
  chapterId,
  setNumberOfComments,
  numberOfComments,
  setCommentsData,
  textColor,
  bgColor,
}: ReplyCardProps) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  const [isModalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity onLongPress={handleLongPress}>
        <View className="flex-row my-2">
          <Image
            source={{
              uri:
                reply?.author?.avatar ||
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
              {reply?.author?.firstName} {reply?.author?.lastName}{" "}
              {reply?.parentId?._id !== reply?.originalCommentId && (
                <>
                  <View className="">
                    <ArrowRightIcon size={20} color={iconColor} />
                  </View>

                  <Text
                    style={{
                      color: textColor,
                    }}
                    className="font-mmedium text-[16px]"
                  >
                    {reply?.parentId?.firstName || reply?.parentId?.lastName
                      ? `${reply?.parentId?.firstName || ""} ${
                          reply?.parentId?.lastName || ""
                        }`
                      : "Comment was deleted"}
                  </Text>
                </>
              )}
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
                {reply.content}
              </Text>
            </View>

            <CommentActionCard
              comment={reply}
              setNumberOfComments={setNumberOfComments}
              numberOfComments={numberOfComments}
              profileBasic={profileBasic}
              chapterId={chapterId}
              author={author}
              originalCommentId={commentId}
              setRepliesData={setRepliesData}
              textColor={textColor}
              bgColor={bgColor}
            />
          </View>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <CommentMenu
            comment={reply}
            setCommentsData={setRepliesData}
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
    </View>
  );
};

export default ReplyCard;
