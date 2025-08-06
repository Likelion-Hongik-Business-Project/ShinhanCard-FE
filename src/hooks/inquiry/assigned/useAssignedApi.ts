import { useQuery } from "@tanstack/react-query";

import { GetInitAssignedInquiriesRequest } from "@/types/inquiry/inquiryListApi.type";

import {
  getAssignedInquiriesByTeam,
  getInitAssignedInquiries,
} from "@/apis/inquiry/assigned/assignedApi";

export const useInitAssignedApi = ({
  page = 1,
  status,
  date,
}: GetInitAssignedInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assignedInquiries", page, status, date],
    queryFn: async () => {
      const response = await getInitAssignedInquiries(page, status, date);
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

export const useAssignedByTeamApi = ({
  teamId,
  page = 1,
  status,
  date,
}: {
  teamId: number;
} & GetInitAssignedInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assignedInquiries", "team", teamId, page, status, date],
    queryFn: async () => {
      const response = await getAssignedInquiriesByTeam(
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
