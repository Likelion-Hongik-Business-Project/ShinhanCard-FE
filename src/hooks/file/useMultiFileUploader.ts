import { useRef, useState } from "react";

import { UploadFile } from "@/types/file/file.type";

import { useS3UploadFile } from "./useS3UploadFile";

import { deleteFile } from "@/apis/file/fileApi";

const MAX_FILE_COUNT = 6;

export const useMultiFileUploader = (
  setFileIds: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useS3UploadFile();

  const triggerInput = () => inputRef.current?.click();

  const updateProgress = (id: number, progress: number) => {
    setFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, progress } : file))
    );
  };

  const handleFileSelect = async (fileList: FileList | null) => {
    if (!fileList) return;
    const filesArray = Array.from(fileList);

    if (files.length + filesArray.length > MAX_FILE_COUNT) {
      setShowLimitModal(true);
      return;
    }

    const localIds: number[] = [];
    const newFiles: UploadFile[] = filesArray.map(file => {
      const id = Date.now() + Math.random();
      localIds.push(id);
      return {
        id,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      };
    });

    setFiles(prev => [...prev, ...newFiles]);

    await Promise.all(
      filesArray.map((file, index) => {
        const localId = localIds[index];
        return uploadFile(file, percent => updateProgress(localId, percent))
          .then(({ fileId }) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === localId
                  ? { ...f, fileId, progress: 100, status: "done" }
                  : f
              )
            );
            setFileIds(prev => [...prev, fileId]);
          })
          .catch(err => {
            console.error("파일 업로드 실패", err);
            setFiles(prev =>
              prev.map(f => (f.id === localId ? { ...f, status: "error" } : f))
            );
          });
      })
    );
  };

  const handleRemove = async (localId: number, fileId?: number) => {
    if (fileId) {
      try {
        await deleteFile(fileId);
        setFileIds(prev => prev.filter(id => id !== fileId));
      } catch (e) {
        console.error("파일 삭제 실패", e);
      }
    }
    setFiles(prev => prev.filter(file => file.id !== localId));
  };

  return {
    inputRef,
    files,
    showLimitModal,
    setShowLimitModal,
    triggerInput,
    handleFileSelect,
    handleRemove,
  };
};
