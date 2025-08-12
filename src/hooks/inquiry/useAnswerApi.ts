import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMyProfile } from "@/hooks/profile/useProfileApi";
import { GlobalResponse } from "@/types/common/apiResponse.type";
import {
  PostAnswerRequest,
  PutAnswerRequest,
} from "@/types/inquiry/answerApi.type";
import { InquiryData } from "@/types/inquiryTypes";

import {
  deleteAnswer,
  postAnswer,
  postInquiryConfirm,
  putAnswer,
} from "@/apis/inquiry/answer/answerApi";

export const useAnswerApi = (team_id?: number) => {
  const queryClient = useQueryClient();
  const { data: myProfileResponse } = useMyProfile();
  const currentUserId = myProfileResponse?.result.id;

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
      // 홈페이지 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  const putAnswerMutation = useMutation({
    mutationFn: ({
      answer_id,
      data,
    }: {
      answer_id: number;
      data: PutAnswerRequest;
    }) => putAnswer(answer_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamInquiry"] });
      // 홈페이지 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: ({ answer_id }: { answer_id: number }) =>
      deleteAnswer(answer_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamInquiry"] });
      // 홈페이지 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  const postInquiryConfirmMutation = useMutation({
    mutationFn: ({ inquiry_id }: { inquiry_id: number }) =>
      postInquiryConfirm(inquiry_id),
    onSuccess: (_, variables) => {
      const { inquiry_id } = variables;
      const queryKey = ["teamInquiry", team_id, inquiry_id];

      // 캐시를 직접 수정하여 즉시 UI 업데이트
      const previousData =
        queryClient.getQueryData<GlobalResponse<InquiryData>>(queryKey);

      if (previousData) {
        const newData = {
          ...previousData,
          result: {
            ...previousData.result,
            assignees: previousData.result.assignees.map(assignee =>
              assignee.user_id === currentUserId
                ? { ...assignee, is_checked: true }
                : assignee
            ),
            confirmed_assignees_count:
              previousData.result.confirmed_assignees_count + 1,
          },
        };
        queryClient.setQueryData(queryKey, newData);
      }

      // 홈페이지 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  return {
    postAnswerMutation,
    putAnswerMutation,
    deleteAnswerMutation,
    postInquiryConfirmMutation,
  };
};
