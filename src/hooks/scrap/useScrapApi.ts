import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteScrap, postScrap } from "@/apis/scrap/scrapApi";

export const useScrapApi = (team_id?: number, inquiry_id?: number) => {
  // team_id와 inquiry_id를 인자로 받습니다.
  const queryClient = useQueryClient();

  const postScrapMutation = useMutation({
    mutationFn: ({ inquiry_id }: { inquiry_id: number }) =>
      postScrap(inquiry_id),
    onSuccess: () => {
      if (team_id && inquiry_id) {
        queryClient.invalidateQueries({
          queryKey: ["teamInquiry", team_id, inquiry_id],
        });
      } else {
        // ID가 없다면 넓은 범위로 무효화
        queryClient.invalidateQueries({ queryKey: ["teamInquiry"] });
      }
      queryClient.invalidateQueries({ queryKey: ["scrap"] });
    },
  });

  // deleteScrapMutation도 동일하게 수정
  const deleteScrapMutation = useMutation({
    mutationFn: ({ inquiry_id }: { inquiry_id: number }) =>
      deleteScrap(inquiry_id),
    onSuccess: () => {
      if (team_id && inquiry_id) {
        queryClient.invalidateQueries({
          queryKey: ["teamInquiry", team_id, inquiry_id],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["teamInquiry"] });
      }
      queryClient.invalidateQueries({ queryKey: ["scrap"] });
    },
  });

  return { postScrapMutation, deleteScrapMutation };
};
