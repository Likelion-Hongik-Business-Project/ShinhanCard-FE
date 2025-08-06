import { useMutation } from "@tanstack/react-query";

import {
  PostCommentRequest,
  PutCommentRequest,
} from "@/types/comment/commentApi";

import { postComments, putComments } from "@/apis/comment/commentApi";

export const useCommentApi = (followupId: number) => {
  const postCommentsMutation = useMutation({
    mutationFn: (data: PostCommentRequest) => postComments(followupId, data),
  });

  const putCommentsMutation = useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: PutCommentRequest;
    }) => putComments(followupId, commentId, data),
  });

  return {
    postCommentsMutation,
    putCommentsMutation,
  };
};
