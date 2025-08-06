import { useMutation } from "@tanstack/react-query";

import type { ScrapResult } from "@/types/scrap/scrapApi.type";

import { deleteScrap, postScrap } from "@/apis/scrap/scrapApi";

export const useToggleScrap = () => {
  return useMutation<ScrapResult, Error, { id: number; scraped: boolean }>({
    mutationFn: async ({ id, scraped }) => {
      const result = scraped ? await deleteScrap(id) : await postScrap(id);
      return result.result;
    },
  });
};
