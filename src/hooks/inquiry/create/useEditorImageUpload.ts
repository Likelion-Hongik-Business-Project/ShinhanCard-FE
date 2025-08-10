import { uploadFileToS3 } from "@/utils/s3UploadUtils";

import { getImageFile } from "@/apis/file/fileApi";

export const useEditorImageUpload = () => {
  const uploadImage = async (blob: Blob | File): Promise<string> => {
    const file =
      blob instanceof File
        ? blob
        : new File([blob], "image.png", { type: blob.type });

    // 1. presigned URL 요청
    const { result } = await getImageFile({
      fileName: file.name,
      contentType: file.type || "image/png",
    });

    const { upload_url, preview_url } = result;

    // 2. S3에 실제 업로드
    await uploadFileToS3(upload_url, file, file.type || "image/png");

    // 3. 최종 URL 반환
    return preview_url;
  };

  return uploadImage;
};
