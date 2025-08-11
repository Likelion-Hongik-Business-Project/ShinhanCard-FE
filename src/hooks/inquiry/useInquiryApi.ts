import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { GlobalResponse } from "@/types/apiResponse.type";
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

export const useInquiryApi = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 문의글 등록
  const postInquiryMutation = useMutation<
    { result: { inquiry_id: number } },
    unknown, // Error
    { teamId: number; data: PostInquiryRequest }
  >({
    mutationFn: ({ teamId, data }) => postInquiry(teamId, data),

    onSuccess: (res, variables) => {
      const inquiryId = res.result.inquiry_id;
      const teamId = variables.teamId;
      navigate(`/teams/${teamId}/inquiries/${inquiryId}`);
    },
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
      // 수정 성공 시, 해당 문의글 상세 정보 새로고침
      // team_id를 알 수 없으므로, 모든 상세글 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["teamInquiry"] });
      navigate(`/teams/${team_id}/inquiries/${inquiry_id}`, { replace: true });
    },
  });

  return { postInquiryMutation, deleteInquiryMutation, putInquiryMutation };
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
