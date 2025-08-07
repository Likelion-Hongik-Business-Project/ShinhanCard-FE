import { useScrapApi } from "@/hooks/scrap/useScrapApi";

export const useScrap = () => {
  const { addScrap, removeScrap } = useScrapApi();

  const scrapInquiry = async (inquiryId: number) => {
    try {
      const response = await addScrap.mutateAsync(inquiryId);
      return response.result;
    } catch (error) {
      throw new Error(`스크랩 추가 오류: ${error}`);
    }
  };

  const unscrapInquiry = async (inquiryId: number) => {
    try {
      const response = await removeScrap.mutateAsync(inquiryId);
      return response.result;
    } catch (error) {
      throw new Error(`스크랩 취소 오류: ${error}`);
    }
  };

  return {
    scrapInquiry,
    unscrapInquiry,
    isScrapLoading: addScrap.isPending || removeScrap.isPending,
  };
};
