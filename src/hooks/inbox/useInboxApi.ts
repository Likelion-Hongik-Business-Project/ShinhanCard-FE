import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  GetNotificationsRequest,
  GetNotificationsResponse,
  PatchArchiveNotificationRequest,
  PatchReadNotificationRequest,
} from "@/types/inbox/inboxApi.type";

import {
  getArchivedNotifications,
  getNotifications,
  patchArchiveNotification,
  patchReadNotification,
} from "@/apis/inbox/inboxApi";

type Opt = { enabled?: boolean };

// 수신함 조회
export const useNotificationsApi = (
  { page, page_size }: GetNotificationsRequest,
  opt: Opt = {}
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const response = await getNotifications({ page, page_size });
      return response.result;
    },
    staleTime: 1000 * 60,
    enabled: opt.enabled ?? true,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

// 보관함 조회
export const useArchivedNotificationsApi = (
  { page, page_size }: GetNotificationsRequest,
  opt: Opt = {}
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", "archive", page],
    queryFn: async () => {
      const response = await getArchivedNotifications({ page, page_size });
      return response.result;
    },
    staleTime: 1000 * 60,
    enabled: opt.enabled ?? true,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

// TODO: 무한스크롤 로직 다시
const PAGE_SIZE = 20;

// export const useNotificationsInfinite = () => {
//   return useInfiniteQuery<GetNotificationsResponse>({
//     queryKey: ["notifications", "infinite", PAGE_SIZE],
//     initialPageParam: 0,
//     queryFn: async ({ pageParam }) => {
//       const response = await getNotifications({
//         page: pageParam as number,
//         page_size: PAGE_SIZE,
//       });
//       return response.result;
//     },
//     getNextPageParam: lastPage => {
//       return lastPage.pagination.has_next
//         ? lastPage.pagination.page + 1
//         : undefined;
//     },
//     staleTime: 1000 * 60,
//   });
// };

export const useNotificationsInfinite = () => {
  return useInfiniteQuery<
    GetNotificationsResponse,
    Error,
    GetNotificationsResponse,
    readonly ["notifications", "infinite", number],
    number
  >({
    queryKey: ["notifications", "infinite", PAGE_SIZE] as const,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { result } = await getNotifications({
        page: pageParam,
        page_size: PAGE_SIZE,
      });
      return result;
    },
    getNextPageParam: last =>
      last.pagination.has_next ? last.pagination.page + 1 : undefined,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useArchivedNotificationsInfinite = () => {
  return useInfiniteQuery<
    GetNotificationsResponse,
    Error,
    GetNotificationsResponse,
    readonly ["notifications", "archive", "infinite", number],
    number
  >({
    queryKey: ["notifications", "archive", "infinite", PAGE_SIZE] as const,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { result } = await getArchivedNotifications({
        page: pageParam,
        page_size: PAGE_SIZE,
      });
      return result;
    },
    getNextPageParam: last =>
      last.pagination.has_next ? last.pagination.page + 1 : undefined,
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 보관 상태 변경
export const usePatchArchiveNotificationApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: PatchArchiveNotificationRequest) =>
      patchArchiveNotification(vars),

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false,
      });
    },
  });
};

export const usePatchReadNotificationApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: PatchReadNotificationRequest) =>
      patchReadNotification(vars),

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false,
      });
    },
  });
};
