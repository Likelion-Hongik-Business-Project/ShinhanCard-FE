import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { GlobalResponse } from "@/types/common/apiResponse.type";
import {
  PostInquiryRequest,
  PutInquiryRequest,
} from "@/types/inquiry/inquiryApi.type";
import { GetInquiryDetailResponse } from "@/types/inquiry/inquiryDetailApi.type";

import { getInquiryDetail } from "@/apis/inquiry/detail/inquiryDetailApi";
import {
  deleteInquiry,
  postInquiry,
  putInquiry,
} from "@/apis/inquiry/inquiryApi";

type NavigateWithBypass = (to: string, options?: { replace?: boolean }) => void;

export const useInquiryApi = (opts?: {
  navigateWithBypass?: NavigateWithBypass;
  onPutSuccessBeforeNavigate?: () => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postInquiryMutation = useMutation<
    { result: { inquiry_id: number } },
    unknown,
    { teamId: number; data: PostInquiryRequest }
  >({
    mutationFn: ({ teamId, data }) => postInquiry(teamId, data),
  });

  // 문의글 삭제
  const deleteInquiryMutation = useMutation({
    mutationFn: ({
      team_id,
      inquiry_id,
    }: {
      team_id: number;
      inquiry_id: number;
    }) => deleteInquiry(team_id, inquiry_id),
    onSuccess: () => {
      // 삭제 성공 시, 목록 데이터를 새로고침
      queryClient.invalidateQueries({ queryKey: ["teamInquiryList"] });
      // 홈페이지 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  // 문의글 수정
  const putInquiryMutation = useMutation({
    mutationFn: ({
      team_id,
      inquiry_id,
      data,
    }: {
      team_id: number;
      inquiry_id: number;
      data: PutInquiryRequest;
    }) => putInquiry(team_id, inquiry_id, data),
    onSuccess: (_data, vars) => {
      const { team_id, inquiry_id } = vars;
      // 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["teamInquiry"] });
      opts?.onPutSuccessBeforeNavigate?.();
      const to = `/teams/${team_id}/inquiries/${inquiry_id}`;
      // 주입된 내비게이션이 있다면 가드 우회로 실행
      if (opts?.navigateWithBypass) {
        opts.navigateWithBypass(to, { replace: true });
      } else {
        navigate(to, { replace: true });
      }
    },
  });

  const isBlocking =
    postInquiryMutation.isPending || putInquiryMutation.isPending;
  return {
    postInquiryMutation,
    deleteInquiryMutation,
    putInquiryMutation,
    isBlocking,
  };
};

/**
 * @description 문의 상세 정보를 가져오는 useQuery 훅 (기존 버전과 호환)
 * @param {number} team_id
 * @param {number} inquiry_id
 */
export const useGetTeamInquiryDetail = (team_id: number, inquiry_id: number) =>
  useQuery<GlobalResponse<GetInquiryDetailResponse>>({
    queryKey: ["teamInquiry", team_id, inquiry_id],
    queryFn: () => getInquiryDetail(team_id, inquiry_id),
    enabled: !!team_id && !!inquiry_id,
  });
