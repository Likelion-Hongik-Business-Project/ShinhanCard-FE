import { uploadFileToS3 } from "@/utils/s3UploadUtils";

import { postFile } from "@/apis/file/fileApi";

export const useS3UploadFile = () => {
  const upload = async (
    file: File,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal
  ): Promise<{
    fileId: number;
    fileKey: string;
    fileUrl: string;
  }> => {
    const payload = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const { result } = await postFile(payload);
    const { uploadUrl, fileId, fileType, fileKey } = result;

    await uploadFileToS3(uploadUrl, file, fileType, onProgress, signal);

    const fileUrl = `https://shinhanstorage.s3.ap-northeast-2.amazonaws.com/attachments/${fileKey}`;

    return { fileId, fileKey, fileUrl };
  };

  return upload;
};
