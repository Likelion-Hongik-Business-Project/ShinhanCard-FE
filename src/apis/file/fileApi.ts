import { ApiResponse } from "@/types/common/apiResponse.type";
import {
  DeleteFileResponse,
  GetFileDownloadUrlResponse,
  GetImageFileRequest,
  GetImageFileResponse,
  PostFileRequest,
  PostFileResponse,
} from "@/types/file/fileApi.type";

import instance from "@/apis/instance";

export const postFile = async (
  data: PostFileRequest
): ApiResponse<PostFileResponse> => {
  const response = await instance.post("/api/files/upload-url", data);
  return response.data;
};

export const deleteFile = async (
  fileId: number
): ApiResponse<DeleteFileResponse> => {
  const response = await instance.delete(`/api/files/${fileId}/delete`);
  return response.data;
};

export const getImageFile = async (
  data: GetImageFileRequest
): ApiResponse<GetImageFileResponse> => {
  const response = await instance.get("/api/files/images/upload-url", {
    params: {
      fileName: data.fileName,
      contentType: data.contentType,
    },
  });
  return response.data;
};

export const getFileDownloadUrl = async (
  fileId: number
): ApiResponse<GetFileDownloadUrlResponse> => {
  const response = await instance.get(`/api/files/${fileId}/download-url`);
  return response.data;
};
