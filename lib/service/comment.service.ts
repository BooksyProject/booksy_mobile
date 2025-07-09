import {
  CommentResponseDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from "@/dtos/CommentDTO";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function fetchComments(): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/comment/all`);
    if (!response.ok) {
      throw new Error("Error fetching comments");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
}

export async function getCommentByChapterId(
  chapterId: string
): Promise<CommentResponseDTO[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/comment/get-comments-by-chapterId?chapterId=${chapterId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }

    const data = await res.json();
    return data as CommentResponseDTO[];
  } catch (error) {
    console.error("❌ Error in getCommentByChapterId:", error);
    throw error;
  }
}

export async function createComment(
  params: CreateCommentDTO,
  token: string,
  chapterId: string
): Promise<CommentResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/create-comment?chapterId=${chapterId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating comment");
    }

    const data: CommentResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
}

export async function createReplyCommentChapter(
  params: CreateCommentDTO,
  token: string,
  chapterId: string
): Promise<CommentResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/create-reply-comment-chapter?chapterId=${chapterId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating reply comment");
    }

    const data: CommentResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create reply comment:", error);
    throw error;
  }
}

export async function updateComment(
  params: UpdateCommentDTO,
  commentId: string,
  token: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/update?commentId=${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error updating comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
}

export async function addReplyToComment(
  commentId: string,
  replyId: string,
  token: string
) {
  try {
    const response = await fetch(`${BASE_URL}/comment/add-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ commentId, replyId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error replying comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to reply comment:", error);
    throw error;
  }
}

export async function deleteComment(
  commentId: string,
  chapterId: string,
  token: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/delete?commentId=${commentId}&chapterId=${chapterId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
}

export async function deleteCommentReply(
  commentId: string,
  chapterId: string,
  originalCommentId: string,
  token: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/delete-comment-reply?commentId=${commentId}&originalCommentId=${originalCommentId}&chapterId=${chapterId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting reply");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete reply:", error);
    throw error;
  }
}

export async function likeComment(commentId: string, token: string) {
  try {
    if (!commentId || !token) {
      throw new Error("Comment ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/comment/like?commentId=${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error liking comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like comment:", error);
    throw error;
  }
}

export async function dislikeComment(commentId: string, token: string) {
  try {
    if (!commentId || !token) {
      throw new Error("Comment ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/comment/dislike?commentId=${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error disliking comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to dislike comment:", error);
    throw error;
  }
}

export async function getRepliesByCommentId(commentId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/get-replies?commentId=${commentId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching replies by commentId");
    }
    const data = await response.json();
    console.log("replies", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch replies by commentId:", error);
    throw error;
  }
}

export async function getCommentByCommentId(commentId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/get-comment?commentId=${commentId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching comment by commentId");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch comment by commentId:", error);
    throw error;
  }
}
