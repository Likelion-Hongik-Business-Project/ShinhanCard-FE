import { ApiResponse } from "@/types/apiResponse.type";
import {
  PostCommentRequest,
  PostCommentResponse,
  PutCommentRequest,
  PutCommentResponse,
} from "@/types/comment/commentApi";

import instance from "@/apis/instance";

export const postComments = async (
  followupId: number,
  data: PostCommentRequest
): ApiResponse<PostCommentResponse> => {
  const response = await instance.post(
    `/api/followups/${followupId}/comments`,
    data
  );
  return response.data;
};

export const putComments = async (
  commentId: number,
  data: PutCommentRequest
): ApiResponse<PutCommentResponse> => {
  const response = await instance.put(`/api/comments/${commentId}`, data);
  return response.data;
};
