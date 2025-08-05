import axios from "axios";

export const uploadFileToS3 = async (
  uploadUrl: string,
  file: File,
  fileType: string,
  onProgress?: (percent: number) => void
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": fileType,
    },
    onUploadProgress: e => {
      if (!e.total || !onProgress) return;
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });
};
