import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteScrapInquiry, postScrapInquiry } from "@/apis/scrap/scrapApi";

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
