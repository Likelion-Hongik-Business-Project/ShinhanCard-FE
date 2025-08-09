export interface PostFileRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PostFileResponse {
  file_id: number;
  upload_url: string;
  file_key: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface DeleteFileResponse {
  file_id: number;
  file_key: string;
  file_name: string;
  delete_time: string;
}

export interface GetImageFileRequest {
  fileName: string;
  contentType: string;
}

export interface GetImageFileResponse {
  upload_url: string;
  file_key: string;
  file_name: string;
  file_type: string;
  preview_url: string;
}
