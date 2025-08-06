import { ApiResponse } from "@/types/apiResponse.type";
import {
  DeleteFileResponse,
  PostFileRequest,
  PostFileResponse,
} from "@/types/file/fileApi.type";

import instance from "@/apis/instance";

export const postFile = async (
  data: PostFileRequest
): ApiResponse<PostFileResponse> => {
  const response = await instance.post("/files/upload-url", data);
  return response.data;
};

export const deleteFile = async (
  fileId: number
): ApiResponse<DeleteFileResponse> => {
  const response = await instance.delete(`/files/${fileId}/delete`);
  return response.data;
};
