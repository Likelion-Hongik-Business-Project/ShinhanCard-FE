export interface PostFileRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PostFileResponse {
  fileId: number;
  uploadUrl: string;
  fileKey: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface DeleteFileResponse {
  fileId: number;
  fileKey: string;
  fileName: string;
  deleteTime: string;
}
