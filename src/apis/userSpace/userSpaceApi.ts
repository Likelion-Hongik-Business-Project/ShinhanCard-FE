import {
  ApiResponse,
  InquiryListResponse,
  ProfilePreviewResponse,
  ScrapInquiryResponse,
} from "@/types/userSpace/userSpaceApi.type";

import api from "@/apis/instance";

export const fetchUserProfile = (userId: number) =>
  api.get<ApiResponse<ProfilePreviewResponse>>(
    `/api/profile/preview/${userId}`
  );

export const fetchAssignedInquiries = (teamId: number) =>
  api.get<ApiResponse<InquiryListResponse>>(
    `/api/teams/${teamId}/inquiries?page=1`
  );

export const fetchWrittenInquiries = (teamId: number) =>
  api.get<ApiResponse<InquiryListResponse>>(`/api/teams/${teamId}/inquiries`);

export const fetchScrapInquiries = (userId: number) =>
  api.get<ApiResponse<ScrapInquiryResponse>>(`/api/scrap/${userId}?page=1`);
