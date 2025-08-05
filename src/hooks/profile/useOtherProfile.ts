import { useQuery } from "@tanstack/react-query";

import { getOtherProfile } from "@/apis/profile/profileApi";

export const useOtherProfile = (id: number) => {
  return useQuery({
    queryKey: ["otherProfile", id],
    queryFn: async () => {
      const response = await getOtherProfile(id);
      return response;
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};
