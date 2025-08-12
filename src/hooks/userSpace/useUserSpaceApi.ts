import { useQuery } from "@tanstack/react-query";

import { getAssignedInquiriesByUserId } from "@/apis/inquiry/assigned/assignedApi";
import {
  getInitialUserSpaceResponse,
  getMyQuestionsInquiriesByUserIdAndTeam,
} from "@/apis/inquiry/myQuestions/myQuestionsApi";
import { getOtherProfile } from "@/apis/profile/profileApi";
import { getScrapInquiriesByUserId } from "@/apis/scrap/scrapApi";

export const useUserProfile = (userId: number | null) =>
  useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getOtherProfile(userId!),
    enabled: userId !== null,
  });

// 타인 스페이스 초기 데이터 조회
export const useInitialUserSpace = (userId: number | null) =>
  useQuery({
    queryKey: ["initialUserSpace", userId],
    queryFn: () => getInitialUserSpaceResponse(userId!),
    enabled: !!userId,
  });

// written 탭 팀별 조회
export const useSubmittedInquiries = (
  userId: number,
  teamId: number,
  page = 1,
  status?: string,
  date?: string,
  activeTab?: string
) =>
  useQuery({
    queryKey: ["writtenInquiries", userId, teamId, page, status, date],
    queryFn: () =>
      getMyQuestionsInquiriesByUserIdAndTeam(
        userId,
        teamId,
        page,
        status,
        date
      ),
    enabled: userId > 0 && teamId > 0 && activeTab === "written",
  });

export const useAssignedInquiries = (
  userId: number,
  teamId: number,
  page = 1,
  status?: string,
  date?: string,
  activeTab?: string
) =>
  useQuery({
    queryKey: ["assignedInquiries", userId, teamId, page, status, date],
    queryFn: () =>
      getAssignedInquiriesByUserId(userId, teamId, page, status, date),
    enabled: userId > 0 && teamId > 0 && activeTab === "assigned",
  });

export const useScrapInquiries = (
  userId: number,
  teamId: number,
  page = 1,
  status?: string,
  date?: string,
  activeTab?: string
) =>
  useQuery({
    queryKey: ["scrapInquiries", userId, teamId, page, status, date],
    queryFn: () =>
      getScrapInquiriesByUserId(userId, teamId, page, status, date),
    enabled: userId > 0 && teamId > 0 && activeTab === "scrap",
  });
