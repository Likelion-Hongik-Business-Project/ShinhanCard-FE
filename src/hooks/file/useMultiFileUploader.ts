import { useEffect, useRef, useState } from "react";

import { UploadingFile } from "@/types/file/file.type";

import { useS3UploadFile } from "./useS3UploadFile";

import { deleteFile } from "@/apis/file/fileApi";

const MAX_FILE_COUNT = 6;

export const useMultiFileUploader = (
  files: UploadingFile[],
  fileIds: number[],
  setFileIds: (next: number[]) => void,
  setFiles: React.Dispatch<React.SetStateAction<UploadingFile[]>>
) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useS3UploadFile();

  // 최신 fileIds를 항상 참조하기 위한 ref
  const fileIdsRef = useRef<number[]>(fileIds);
  useEffect(() => {
    fileIdsRef.current = fileIds;
  }, [fileIds]);

  const triggerInput = () => inputRef.current?.click();

  const updateProgress = (id: number, progress: number) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, progress } : f)));
  };

  // ref 기반 안전한 추가/삭제 유틸
  const pushFileId = (id: number) => {
    const base = fileIdsRef.current ?? [];
    if (base.includes(id)) return;
    const next = [...base, id];
    fileIdsRef.current = next;
    setFileIds(next);
  };
  const removeFileId = (id: number) => {
    const base = fileIdsRef.current ?? [];
    const next = base.filter(x => x !== id);
    fileIdsRef.current = next;
    setFileIds(next);
  };

  const handleFileSelect = async (fileList: FileList | null) => {
    if (!fileList) return;

    const filesArray = Array.from(fileList);
    // 현재 카드 수 기준으로 개수 제한
    if (files.length + filesArray.length > MAX_FILE_COUNT) {
      setShowLimitModal(true);
      return;
    }

    // 로컬 아이디 생성 & UI 선반영
    const localIds: number[] = [];
    const newFiles: UploadingFile[] = filesArray.map(file => {
      const id = Date.now() + Math.random();
      localIds.push(id);
      return {
        id,
        file_name: file.name,
        file_size: file.size,
        progress: 0,
        status: "uploading",
        controller: undefined,
      };
    });
    setFiles(prev => [...prev, ...newFiles]);

    await Promise.all(
      filesArray.map((file, idx) => {
        const localId = localIds[idx];
        const controller = new AbortController();
        const signal = controller.signal;

        // AbortController 저장
        setFiles(prev =>
          prev.map(f => (f.id === localId ? { ...f, controller } : f))
        );

        return uploadFile(file, p => updateProgress(localId, p), signal)
          .then(({ file_id }) => {
            if (!file_id) return;

            // UI 완료 반영
            setFiles(prev =>
              prev.map(f =>
                f.id === localId
                  ? {
                      ...f,
                      file_id,
                      progress: 100,
                      status: "done",
                      controller: undefined,
                    }
                  : f
              )
            );

            pushFileId(file_id);
          })
          .catch(err => {
            if (err?.name === "CanceledError") {
              console.log("업로드 취소:", file.name);
            } else {
              console.error("파일 업로드 실패:", err);
            }
            setFiles(prev =>
              prev.map(f =>
                f.id === localId
                  ? { ...f, status: "error", controller: undefined }
                  : f
              )
            );
          });
      })
    );
  };

  const handleRemove = async (localId: number, fileId?: number) => {
    const target = files.find(f => f.id === localId);

    // 업로드 중이면 취소
    if (target?.status === "uploading" && target.controller) {
      target.controller.abort();
    }

    // 서버 삭제 시도 후 상태 갱신
    if (fileId) {
      try {
        await deleteFile(fileId);
      } catch (e) {
        console.error("파일 삭제 실패", e);
        // 정책에 따라 실패 시 그대로 두고 리턴할 수도 있음
      }
      removeFileId(fileId);
    }

    setFiles(prev => prev.filter(f => f.id !== localId));
  };

  return {
    inputRef,
    triggerInput,
    files,
    showLimitModal,
    setShowLimitModal,
    handleFileSelect,
    handleRemove,
  };
};
