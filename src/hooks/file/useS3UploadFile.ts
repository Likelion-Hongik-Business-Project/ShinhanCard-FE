import { uploadFileToS3 } from "@/utils/s3UploadUtils";

import { postFile } from "@/apis/file/fileApi";

export const useS3UploadFile = () => {
  const upload = async (
    file: File,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal
  ): Promise<{ file_id: number }> => {
    const payload = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const { result } = await postFile(payload);
    const { upload_url, file_id, file_type } = result;

    await uploadFileToS3(upload_url, file, file_type, onProgress, signal);

    return { file_id };
  };

  return upload;
};
