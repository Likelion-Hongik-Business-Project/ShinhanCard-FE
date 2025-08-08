import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  GetNotificationsRequest,
  GetNotificationsResponse,
} from "@/types/inbox/inboxApi.type";

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

const PAGE_SIZE = 20;

export const useNotificationsInfinite = () => {
  return useInfiniteQuery<GetNotificationsResponse>({
    queryKey: ["notifications", "infinite", PAGE_SIZE],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await getNotifications({
        page: pageParam as number,
        page_size: PAGE_SIZE,
      });
      return response.result;
    },
    getNextPageParam: lastPage => {
      return lastPage.pagination.has_next
        ? lastPage.pagination.page + 1
        : undefined;
    },
    staleTime: 1000 * 60,
  });
};
