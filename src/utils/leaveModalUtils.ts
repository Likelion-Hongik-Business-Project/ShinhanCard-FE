import { UploadFile } from "@/types/file/file.type";

export const mapServerFilesToUploadList = (
  files: Array<{
    file_id: number;
    file_key: string;
    file_name?: string;
    file_size?: number;
  }>
): UploadFile[] =>
  files.map(f => ({
    id: f.file_id,
    file_id: f.file_id,
    file_name:
      f.file_name ?? decodeURIComponent(f.file_key.split("/").pop() ?? "파일"),
    file_size: f.file_size ?? 0,
    progress: 100,
    status: "done",
  }));

// 업로드 전 임시 파일까지 감지하는 시그니처
export const buildFileSig = (list: UploadFile[]) =>
  list.map(
    f =>
      `${f.file_id ?? `tmp:${f.id ?? "n"}`}:${f.file_name ?? ""}:${f.file_size ?? 0}:${f.status}`
  );
