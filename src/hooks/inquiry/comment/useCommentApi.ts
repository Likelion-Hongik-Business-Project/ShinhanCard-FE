import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PostCommentRequest,
  PutCommentRequest,
} from "@/types/comment/commentApi";

import { postComments, putComments } from "@/apis/comment/commentApi";

export const useCommentApi = (followupId: number) => {
  const qc = useQueryClient();

  const postCommentsMutation = useMutation({
    mutationFn: (data: PostCommentRequest) => postComments(followupId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teamInquiry"] });
    },
  });

  const putCommentsMutation = useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: PutCommentRequest;
    }) => putComments(commentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teamInquiry"] });
    },
  });

  return {
    postCommentsMutation,
    putCommentsMutation,
  };
};
