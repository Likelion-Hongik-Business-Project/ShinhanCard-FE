export type UploadFileStatus = "uploading" | "done" | "error";

export interface UploadFile {
  id: number; // 로컬에서 쓰는 식별자
  file_id?: number; // 서버에서 받은 ID
  name: string;
  size: number;
  progress: number;
  status: UploadFileStatus;
}

export type UploadingFile = UploadFile & {
  controller?: AbortController;
};

export interface InquiryFile {
  file_id: number;
  file_key: string;
  file_name: string;
  file_size: number;
}
