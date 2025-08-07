import { uploadFileToS3 } from "@/utils/s3UploadUtils";

import { postFile } from "@/apis/file/fileApi";

export const useS3UploadFile = () => {
  const upload = async (
    file: File,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal
  ): Promise<{ fileId: number }> => {
    const payload = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const { result } = await postFile(payload);
    const { uploadUrl, fileId, fileType } = result;

    await uploadFileToS3(uploadUrl, file, fileType, onProgress, signal);

    return { fileId };
  };

  return upload;
};
