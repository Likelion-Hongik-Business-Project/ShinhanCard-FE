import { uploadFileToS3 } from "@/utils/s3UploadUtils";

import { postFile } from "@/apis/file/fileApi";

export const useUploadFile = () => {
  const upload = async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ fileId: number }> => {
    const payload = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const { result } = await postFile(payload);
    const { uploadUrl, fileId, fileType } = result;

    await uploadFileToS3(uploadUrl, file, fileType, onProgress);
    return { fileId };
  };

  return upload;
};
