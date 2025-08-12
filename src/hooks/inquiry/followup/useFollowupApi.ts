import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  PostFollowupsRequest,
  PutFollowupsRequest,
} from "@/types/followup/followupApi";

import { postFollowups, putFollowups } from "@/apis/followup/followupApi";

export const useFollowupApi = (teamId: number, inquiryId: number) => {
  const qc = useQueryClient();
  const detailKey = ["teamInquiry", teamId, inquiryId] as const;

  const postFollowupsMutation = useMutation({
    mutationFn: (data: PostFollowupsRequest) => postFollowups(inquiryId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: detailKey, refetchType: "active" });
    },
  });

  const putFollowupsMutation = useMutation({
    mutationFn: ({
      followupId,
      data,
    }: {
      followupId: number;
      data: PutFollowupsRequest;
    }) => putFollowups(followupId, data),
    onSuccess: () => {
      console.log("invalidate", detailKey, qc.getQueryState(detailKey));
      qc.invalidateQueries({ queryKey: detailKey, refetchType: "active" });
    },
  });

  return { postFollowupsMutation, putFollowupsMutation };
};
