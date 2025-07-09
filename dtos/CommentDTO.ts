import { UserBasicInfo } from "./UserDTO";

export interface UpdateCommentDTO {
  content: string;
  replies?: string[];
}

export interface CreateCommentDTO {
  content: string;
  replies?: string[];
  parentId?: string;
  originalCommentId?: string;
}

export interface CommentResponseDTO {
  _id: string;
  author: UserBasicInfo;
  content: string;
  replies?: string[];
  likes: string[];
  createAt: Date;
  parentId: UserBasicInfo | null;
  originalCommentId: string | null;
}
