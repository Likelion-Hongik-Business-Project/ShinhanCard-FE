import { useQuery } from "@tanstack/react-query";

import { GetNotificationsRequest } from "@/types/inbox/inboxApi.type";

import { getNotifications } from "@/apis/inbox/inboxApi";

export const useNotificationsApi = ({
  page,
  page_size,
}: GetNotificationsRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const response = await getNotifications({ page, page_size });
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
