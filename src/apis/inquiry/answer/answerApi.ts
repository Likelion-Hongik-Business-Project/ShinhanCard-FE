import { ApiResponse, NoResponse } from "@/types/common/apiResponse.type";
import {
  DeleteAnswerResponse,
  PostAnswerRequest,
  PostAnswerResponse,
  PutAnswerRequest,
  PutAnswerResponse,
} from "@/types/inquiry/answerApi.type";

import instance from "@/apis/instance";

//POST /api/inquiries/{inquiry_id}/answers
//답변 등록
export const postAnswer = async (
  inquiry_id: number,
  data: PostAnswerRequest
): ApiResponse<PostAnswerResponse> => {
  const response = await instance.post<ApiResponse<PostAnswerResponse>>(
    `/api/inquiries/${inquiry_id}/answers`,
    data
  );
  return response.data;
};

//PUT /api/answers/{answer_id}
//@description 답변 수정
export const putAnswer = async (
  answer_id: number,
  data: PutAnswerRequest
): ApiResponse<PutAnswerResponse> => {
  const response = await instance.put<ApiResponse<PutAnswerResponse>>(
    `/api/answers/${answer_id}`,
    data
  );
  return response.data;
};

// DELETE /api/answers/{answer_id}
// @description 답변 삭제
export const deleteAnswer = async (
  answer_id: number
): ApiResponse<DeleteAnswerResponse> => {
  const response = await instance.delete<ApiResponse<DeleteAnswerResponse>>(
    `/api/answers/${answer_id}`
  );
  return response.data;
};

// POST /api/inquiries/{inquiry_id}/confirm
// @description 문의 확인 처리 (답변 등록 대신)
export const postInquiryConfirm = async (
  inquiry_id: number
): ApiResponse<NoResponse> => {
  const response = await instance.post<ApiResponse<NoResponse>>(
    `/api/inquiries/${inquiry_id}/confirm`
  );
  return response.data;
};
