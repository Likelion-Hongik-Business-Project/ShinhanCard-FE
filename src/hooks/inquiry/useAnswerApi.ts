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
    onSuccess: (response, variables) => {
      const { inquiry_id } = variables;

      // API 응답이 완전한 답변 객체를 반환하지 않으므로 쿼리 무효화 사용
      if (team_id) {
        queryClient.invalidateQueries({
          queryKey: ["teamInquiry", team_id, inquiry_id],
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
    onSuccess: (_, variables) => {
      const { answer_id } = variables;

      // 모든 teamInquiry 쿼리에서 해당 답변 제거
      queryClient.setQueriesData<GlobalResponse<InquiryData>>(
        { queryKey: ["teamInquiry"] },
        oldData => {
          if (!oldData) return oldData;

          const updatedAnswers = oldData.result.answers.answers.filter(
            answer => answer.answer_id !== answer_id
          );

          return {
            ...oldData,
            result: {
              ...oldData.result,
              answers: {
                count: updatedAnswers.length,
                answers: updatedAnswers,
              },
            },
          };
        }
      );

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
        const updatedAssignees = previousData.result.assignees.map(assignee =>
          assignee.user_id === currentUserId
            ? { ...assignee, is_checked: true }
            : assignee
        );

        const newData = {
          ...previousData,
          result: {
            ...previousData.result,
            assignees: updatedAssignees,
            confirmed_assignees_count:
              previousData.result.confirmed_assignees_count + 1,
          },
        };
        queryClient.setQueryData(queryKey, newData);
      }

      // 상태 변경을 위해 추가로 쿼리 무효화 (서버에서 최신 상태 가져오기)
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["teamInquiry", team_id, inquiry_id],
        });
      }, 100);

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
