import { useS3UploadFile } from "@/hooks/file/useS3UploadFile";

export const useEditorImageUpload = () => {
  const uploadFile = useS3UploadFile();

  const uploadImage = async (blob: Blob | File): Promise<string> => {
    const file =
      blob instanceof File
        ? blob
        : new File([blob], "image.png", { type: blob.type });

    const { fileUrl } = await uploadFile(file);
    return fileUrl;
  };

  return uploadImage;
};
