import { useQuery } from "@tanstack/react-query";

import {
  fetchAssignedInquiries,
  fetchScrapInquiries,
  fetchUserProfile,
  fetchWrittenInquiries,
} from "@/apis/userSpace/userSpaceApi";

export const useUserProfile = (userId: number) =>
  useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId).then(res => res.data.result),
  });

export const useAssignedInquiries = (teamId: number) =>
  useQuery({
    queryKey: ["assignedInquiries", teamId],
    queryFn: () => fetchAssignedInquiries(teamId).then(res => res.data.result),
    enabled: !!teamId,
  });

export const useWrittenInquiries = (teamId: number, userId: number) =>
  useQuery({
    queryKey: ["writtenInquiries", teamId, userId],
    queryFn: () =>
      fetchWrittenInquiries(teamId).then(res => {
        const inquiries = res.data.result.inquiries.filter(
          i => i.writer.user_id === userId
        );
        return { ...res.data.result, inquiries };
      }),
    enabled: !!teamId,
  });

export const useScrapInquiries = (userId: number) =>
  useQuery({
    queryKey: ["scrapInquiries", userId],
    queryFn: () => fetchScrapInquiries(userId).then(res => res.data.result),
    enabled: !!userId,
  });
