import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  GetInquiriesRequest,
  Pagination,
  TeamItem,
  TInquiryBase,
} from "@/types/inquiry/inquiryListApi.type";

import {
  deleteScrapInquiry,
  getInitScrapInquiries,
  getScrapInquiriesByTeam,
  postScrapInquiry,
} from "@/apis/scrap/scrapApi";

type InquiriesResponseWithBase<T extends TInquiryBase = TInquiryBase> = {
  inquiries: T[];
  pagination: Pagination;
  total_count?: number;
  selected_team?: TeamItem;
  teams?: TeamItem[];
};

export const useScrapApi = () => {
  const queryClient = useQueryClient();

  // 주어진 query key 캐시에서 특정 inquiry_id를 가진 항목을 찾아 반환
  const findInquiryInCache = (
    key: unknown[],
    inquiryId: number
  ): TInquiryBase | undefined => {
    const data = queryClient.getQueryData<InquiriesResponseWithBase>(key);
    return data?.inquiries.find(i => i.inquiry_id === inquiryId);
  };

  // 모든 "inquiries" 관련 캐시에서 특정 inquiry의 is_scraped 필드 값을 수정
  const updateScrapField = (inquiryId: number, isScraped: boolean) => {
    const queries = queryClient
      .getQueryCache()
      .findAll({ queryKey: ["inquiries"] }); // "inquiries"로 시작하는 모든 쿼리 키 (ex. 내 담당 문의, 스크랩 내역, 내가 쓴 문의)

    queries.forEach(q => {
      const data = queryClient.getQueryData<InquiriesResponseWithBase>(
        q.queryKey
      );
      if (!data?.inquiries) return;

      // 해당 inquiry_id와 일치하는 항목의 is_scraped 값을 변경
      const updated: InquiriesResponseWithBase = {
        ...data,
        inquiries: data.inquiries.map(item =>
          item.inquiry_id === inquiryId
            ? { ...item, is_scraped: isScraped }
            : item
        ),
      };
      // 변경된 데이터로 캐시 업데이트
      queryClient.setQueryData(q.queryKey, updated);
    });
  };

  /**
   * 스크랩 추가 mutation
   * - 서버에 스크랩 요청
   * - 로컬 캐시 업데이트 및 스크랩 목록(init)에 추가
   */
  const addScrap = useMutation({
    mutationFn: (inquiryId: number) => postScrapInquiry(inquiryId),

    // 낙관적 업데이트
    onMutate: async inquiryId => {
      // 모든 inquiries 관련 쿼리 중단 (데이터 무결성 보호 - 충돌 방지)
      await queryClient.cancelQueries({ queryKey: ["inquiries"] });

      // 해당 항목의 is_scraped = true 로 변경
      updateScrapField(inquiryId, true);

      // 스크랩 목록(init)에 추가
      const found = findInquiryInCache(
        ["inquiries", "assigned", "init", 1],
        inquiryId
      );
      if (found) {
        queryClient.setQueryData<InquiriesResponseWithBase>(
          ["inquiries", "scrap", "init", 1],
          old => ({
            ...old!,
            inquiries: [found, ...(old?.inquiries ?? [])],
          })
        );
      }
    },

    onError: () => {},

    // 성공 여부 관계없이 모든 inquiries 캐시 무효화
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });

  /**
   * 스크랩 제거 mutation
   * - 서버에 스크랩 취소 요청
   * - 로컬 캐시 업데이트 및 스크랩 목록(init)에서 제거
   */
  const removeScrap = useMutation({
    mutationFn: (inquiryId: number) => deleteScrapInquiry(inquiryId),

    // 낙관적 업데이트
    onMutate: async inquiryId => {
      // 모든 inquiries 관련 쿼리 중단 (데이터 무결성 보호 - 충돌 방지)
      await queryClient.cancelQueries({ queryKey: ["inquiries"] });

      // 해당 항목의 is_scraped = false 로 변경
      updateScrapField(inquiryId, false);

      // 스크랩 목록(init)에서 제거
      queryClient.setQueryData<InquiriesResponseWithBase>(
        ["inquiries", "scrap", "init", 1],
        old => ({
          ...old!,
          inquiries:
            old?.inquiries.filter(item => item.inquiry_id !== inquiryId) ?? [],
        })
      );
    },

    onError: () => {},

    // 성공 여부 관계없이 모든 inquiries 캐시 무효화
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });

  return { addScrap, removeScrap };
};

export const useInitScrapApi = ({ page = 1 }: GetInquiriesRequest) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inquiries", "scrap", "init", page],
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
    queryKey: ["inquiries", "scrap", "team", teamId, page, status, date],
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
