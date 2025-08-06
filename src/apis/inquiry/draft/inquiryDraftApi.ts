import { ApiResponse } from "@/types/apiResponse.type";
import {
  DeleteInquiryDraftResponse,
  GetInquiryDraftExistsResponse,
  GetInquiryDraftResponse,
  PostInquiryDraftRequest,
  PostInquiryDraftResponse,
  PutInquiryDraftRequest,
  PutInquiryDraftResponse,
} from "@/types/inquiry/inquiryDraftApi.type";

import instance from "@/apis/instance";

// 문의글 임시 저장 여부 조회
export const getDraftExists = async (
  team_id: number
): ApiResponse<GetInquiryDraftExistsResponse> => {
  const response = await instance.get(
    `/api/teams/${team_id}/inquiries/check-draft`
  );
  return response.data;
};

// 임시 저장 글 조회
export const getInquiryDraft = async (
  team_id: number,
  inquiry_id: number
): ApiResponse<GetInquiryDraftResponse> => {
  const response = await instance.get(
    `/api/teams/${team_id}/inquiries/${inquiry_id}/draft`
  );
  return response.data;
};

// 임시 저장 글 수정
export const putInquiryDraft = async (
  team_id: number,
  inquiry_id: number,
  data: PutInquiryDraftRequest
): ApiResponse<PutInquiryDraftResponse> => {
  const response = await instance.put(
    `/api/teams/${team_id}/inquiries/${inquiry_id}/draft`,
    data
  );
  return response.data;
};

// 임시 저장 글 삭제
export const deleteInquiryDraft = async (
  team_id: number,
  inquiry_id: number
): ApiResponse<DeleteInquiryDraftResponse> => {
  const response = await instance.delete(
    `/api/teams/${team_id}/inquiries/${inquiry_id}/draft`
  );
  return response.data;
};

// 문의글 임시 저장하기
export const postInquiryDraft = async (
  team_id: number,
  data: PostInquiryDraftRequest
): ApiResponse<PostInquiryDraftResponse> => {
  const response = await instance.post(
    `/api/teams/${team_id}/inquiries/drafts`,
    data
  );
  return response.data;
};
