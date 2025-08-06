import { useQuery } from "@tanstack/react-query";

import { GetInitAssignedInquiriesRequest } from "@/types/inquiry/inquiryListApi.type";

import { getInitAssignedInquiries } from "@/apis/inquiry/assigned/assignedApi";

export const useAssignedApi = ({
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
