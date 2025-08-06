import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GetInquiriesRequest } from "@/types/inquiry/inquiryListApi.type";

import {
  deleteScrapInquiry,
  getInitScrapInquiries,
  getScrapInquiriesByTeam,
  postScrapInquiry,
} from "@/apis/scrap/scrapApi";

export const useScrapApi = () => {
  const queryClient = useQueryClient();

  // 스크랩 추가
  const addScrap = useMutation({
    mutationFn: (inquiryId: number) => postScrapInquiry(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignedInquiries"] });
    },
  });

  // 스크랩 취소
  const removeScrap = useMutation({
    mutationFn: (inquiryId: number) => deleteScrapInquiry(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignedInquiries"] });
    },
  });

  return {
    addScrap,
    removeScrap,
  };
};

export const useInitScrapApi = ({ page = 1 }: GetInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["scrapInquiries", page],
    queryFn: async () => {
      const response = await getInitScrapInquiries(page);
      return response.result;
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export const useScrapByTeamApi = ({
  teamId,
  page = 1,
  status,
  date,
}: {
  teamId: number;
} & GetInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["scrapInquiries", "team", teamId, page, status, date],
    queryFn: async () => {
      const response = await getScrapInquiriesByTeam(
        teamId,
        page,
        status,
        date
      );
      return response.result;
    },
    enabled: !!teamId, // teamId 있을 때만 실행
    staleTime: 1000 * 60,
  });

  return { data, isLoading, isError, error };
};
