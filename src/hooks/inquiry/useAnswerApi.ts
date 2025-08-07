import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PostAnswerRequest,
  PutAnswerRequest,
} from "@/types/inquiry/answerApi.type";

import {
  deleteAnswer,
  postAnswer,
  postInquiryConfirm,
  putAnswer,
} from "@/apis/inquiry/answer/answerApi";

export const useAnswerApi = (team_id?: number) => {
  const queryClient = useQueryClient();

  // 답변 작성
  const postAnswerMutation = useMutation({
    mutationFn: ({
      inquiry_id,
      data,
    }: {
      inquiry_id: number;
      data: PostAnswerRequest;
    }) => postAnswer(inquiry_id, data),
    onSuccess: (_, variables) => {
      if (team_id) {
        queryClient.invalidateQueries({
          queryKey: ["teamInquiry", team_id, variables.inquiry_id],
        });
      }
    },
  });

  // 답변 수정
  const putAnswerMutation = useMutation({
    mutationFn: ({
      answer_id,
      data,
    }: {
      answer_id: number;
      data: PutAnswerRequest;
    }) => putAnswer(answer_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamInquiry"],
      });
    },
  });

  // 답변 삭제
  const deleteAnswerMutation = useMutation({
    mutationFn: ({ answer_id }: { answer_id: number }) =>
      deleteAnswer(answer_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamInquiry"],
      });
    },
  });

  // 문의 확인 처리
  const postInquiryConfirmMutation = useMutation({
    mutationFn: ({ inquiry_id }: { inquiry_id: number }) =>
      postInquiryConfirm(inquiry_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamInquiry"],
      });
    },
  });

  return {
    postAnswerMutation,
    putAnswerMutation,
    deleteAnswerMutation,
    postInquiryConfirmMutation,
  };
};
