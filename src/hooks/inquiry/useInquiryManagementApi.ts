import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PutInquiryAssigneeRequest } from "@/types/inquiry/inquiryManagementApi.type";

import {
  postInquiryNotify,
  putInquiryAssignee,
} from "@/apis/inquiry/detail/inquiryManagementApi";

export const useInquiryManagementApi = () => {
  const queryClient = useQueryClient();

  // 담당자 수정
  const putInquiryAssigneeMutation = useMutation({
    mutationFn: ({
      team_id,
      inquiry_id,
      data,
    }: {
      team_id: number;
      inquiry_id: number;
      data: PutInquiryAssigneeRequest;
    }) => putInquiryAssignee(team_id, inquiry_id, data),
    onSuccess: (_, variables) => {
      // 문의 상세 정보 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ["teamInquiry", variables.team_id, variables.inquiry_id],
      });
    },
  });

  // 알림 메일 발송
  const postInquiryNotifyMutation = useMutation({
    mutationFn: ({ inquiry_id }: { inquiry_id: number }) =>
      postInquiryNotify(inquiry_id),
    // 성공 시 특별한 처리가 필요하다면 onSuccess 추가 가능
  });

  return {
    putInquiryAssigneeMutation,
    postInquiryNotifyMutation,
  };
};
