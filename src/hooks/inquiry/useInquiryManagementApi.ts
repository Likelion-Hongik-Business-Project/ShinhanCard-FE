import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GlobalResponse } from "@/types/apiResponse.type";
import {
  GetLastSentMailTimeResponse,
  PutInquiryAssigneeRequest,
} from "@/types/inquiry/inquiryManagementApi.type";
import { InquiryData } from "@/types/inquiryTypes";

import {
  getLastSentMailTime,
  postInquiryNotify,
  putInquiryAssignee,
  putInquiryNotificationSetting,
} from "@/apis/inquiry/detail/inquiryManagementApi";

// 마지막 메일 전송 시간을 가져오는 훅 - 404 에러를 정상으로 처리
export const useGetLastSentMailTime = (inquiry_id: number) => {
  return useQuery({
    queryKey: ["lastSentMailTime", inquiry_id],
    queryFn: async () => {
      try {
        return await getLastSentMailTime(inquiry_id);
      } catch (error: unknown) {
        // any -> unknown
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!inquiry_id,
    retry: (failureCount, error: unknown) => {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

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
    // 성공 시, 캐시를 직접 수정하여 UI를 즉시 업데이트
    onSuccess: (_, variables) => {
      const queryKey = ["lastSentMailTime", variables.inquiry_id];

      // lastSentMailTime 쿼리의 캐시 데이터를 현재 시간으로 즉시 업데이트
      const newData: GlobalResponse<GetLastSentMailTimeResponse> = {
        is_success: true,
        code: "COMMON200",
        message: "성공",
        result: {
          inquiryId: variables.inquiry_id,
          lastSentTime: new Date().toISOString(),
        },
      };

      queryClient.setQueryData(queryKey, newData);
    },
  });

  // 개인 알림 설정 변경
  const putInquiryNotificationMutation = useMutation({
    mutationFn: ({
      team_id,
      inquiry_id,
      is_notification_enabled,
    }: {
      team_id: number;
      inquiry_id: number;
      is_notification_enabled: boolean;
    }) =>
      putInquiryNotificationSetting(team_id, inquiry_id, {
        is_notification_enabled,
      }),
    onSuccess: (_, variables) => {
      // 문의 상세 정보의 캐시를 직접 업데이트
      const queryKey = ["teamInquiry", variables.team_id, variables.inquiry_id];

      queryClient.setQueryData<GlobalResponse<InquiryData>>(
        queryKey,
        oldData => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              is_notification_enabled: variables.is_notification_enabled,
            },
          };
        }
      );
    },
  });

  return {
    putInquiryAssigneeMutation,
    postInquiryNotifyMutation,
    putInquiryNotificationMutation,
  };
};
