import { useQuery } from "@tanstack/react-query";

import { GetInquiriesRequest } from "@/types/inquiry/inquiryListApi.type";

import {
  getInitMyQuestionsInquiries,
  getMyQuestionsInquiriesByTeam,
} from "@/apis/inquiry/myQuestions/myQuestionsApi";

export const useInitMyQuestionsApi = ({ page = 1 }: GetInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myQuestionsInquiries", page],
    queryFn: async () => {
      const response = await getInitMyQuestionsInquiries(page);
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

export const useMyQuestionsByTeamApi = ({
  teamId,
  page = 1,
  status,
  date,
}: {
  teamId: number;
} & GetInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myQuestionsInquiries", "team", teamId, page, status, date],
    queryFn: async () => {
      const response = await getMyQuestionsInquiriesByTeam(
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
