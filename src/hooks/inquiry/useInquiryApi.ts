import { useQuery } from "@tanstack/react-query";

import { GlobalResponse } from "@/types/apiResponse.type";
import { GetInquiryDetailResponse } from "@/types/inquiry/inquiryDetailApi.type";

import { getInquiryDetail } from "@/apis/inquiry/detail/inquiryDetailApi";

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
