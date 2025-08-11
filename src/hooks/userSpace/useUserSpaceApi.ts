import { useQuery } from "@tanstack/react-query";

import { getAssignedInquiriesByUserId } from "@/apis/inquiry/assigned/assignedApi";
import { getMyQuestionsInquiriesByUserId } from "@/apis/inquiry/myQuestions/myQuestionsApi";
import { getOtherProfile } from "@/apis/profile/profileApi";
import { getScrapInquiriesByUserId } from "@/apis/scrap/scrapApi";

export const useUserProfile = (userId: number | null) =>
  useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getOtherProfile(userId!),
    enabled: userId !== null,
  });

export const useSubmittedInquiries = (userId: number) =>
  useQuery({
    queryKey: ["writtenInquiries", userId],
    queryFn: () => getMyQuestionsInquiriesByUserId(userId),
    enabled: !!userId,
  });

export const useAssignedInquiries = (userId: number) =>
  useQuery({
    queryKey: ["assignedInquiries", userId],
    queryFn: () => getAssignedInquiriesByUserId(userId),
    enabled: !!userId,
  });

export const useScrapInquiries = (userId: number) =>
  useQuery({
    queryKey: ["scrapInquiries", userId],
    queryFn: () => getScrapInquiriesByUserId(userId),
    enabled: !!userId,
  });
