import { useMutation } from "@tanstack/react-query";

import {
  PostFollowupsRequest,
  PutFollowupsRequest,
} from "@/types/followup/followupApi";

import { postFollowups, putFollowups } from "@/apis/followup/followupApi";

export const useFollowupApi = (inquiryId: number) => {
  const postFollowupsMutation = useMutation({
    mutationFn: (data: PostFollowupsRequest) => postFollowups(inquiryId, data),
  });

  const putFollowupsMutation = useMutation({
    mutationFn: ({
      followupId,
      data,
    }: {
      followupId: number;
      data: PutFollowupsRequest;
    }) => putFollowups(inquiryId, followupId, data),
  });

  return {
    postFollowupsMutation,
    putFollowupsMutation,
  };
};
