import { useS3UploadFile } from "../file/useS3UploadFile";

export const useEditorImageUpload = () => {
  const uploadFile = useS3UploadFile();

  const uploadImage = async (blob: Blob | File): Promise<string> => {
    const file =
      blob instanceof File
        ? blob
        : new File([blob], "image.png", { type: blob.type });

    const { fileId } = await uploadFile(file);
    const imageUrl = `https://shinhanstorage.s3.ap-northeast-2.amazonaws.com/attachments/${fileId}`;
    return imageUrl;
  };

  return uploadImage;
};
