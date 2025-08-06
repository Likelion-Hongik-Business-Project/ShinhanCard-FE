import { useRef, useState } from "react";

import clsx from "clsx";

import Upload from "@/assets/svgs/inquiry/upload.svg";
import { useUploadFile } from "@/hooks/file/useUploadFile";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { UploadFile } from "@/types/file/file.type";

import FileUploadItem from "./FileUploadItem";

import { deleteFile } from "@/apis/file/fileApi";

interface Props {
  teamId: number;
  setFileIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const FileUploadBox = ({ setFileIds }: Props) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const uploadFile = useUploadFile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const updateProgress = (id: number, progress: number) => {
    setFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, progress } : file))
    );
  };

  const handleFileSelect = async (fileList: FileList | null) => {
    if (!fileList) return;

    for (const file of Array.from(fileList)) {
      const localId = Date.now() + Math.random();

      setFiles(prev => [
        ...prev,
        {
          id: localId,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "uploading",
        },
      ]);

      try {
        const { fileId } = await uploadFile(file, percent =>
          updateProgress(localId, percent)
        );

        // 업로드 완료 시 상태 업데이트
        setFiles(prev =>
          prev.map(f =>
            f.id === localId
              ? { ...f, fileId, progress: 100, status: "done" }
              : f
          )
        );

        setFileIds(prev => [...prev, fileId]);
      } catch (err) {
        console.error("파일 업로드 실패", err);
        setFiles(prev =>
          prev.map(f => (f.id === localId ? { ...f, status: "error" } : f))
        );
      }
    }
  };

  const handleRemove = async (localId: number, fileId?: number) => {
    if (fileId) {
      try {
        await deleteFile(fileId);
        setFileIds(prev => prev.filter(id => id !== fileId));
      } catch (e) {
        console.error("삭제 실패", e);
      }
    }

    setFiles(prev => prev.filter(file => file.id !== localId));
  };

  const { isDragging, dragEventProps } = useDragAndDrop({
    onDrop: handleFileSelect,
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        {...dragEventProps}
        className={clsx(
          "bg-gray-10 rounded-lg border-main-dark flex flex-col justify-center items-center gap-4 border border-dashed h-40 py-6 px-4 transition-all",
          isDragging && "bg-main-bright"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={e => handleFileSelect(e.target.files)}
        />

        <button
          onClick={handleClick}
          className={clsx(
            "px-6 flex gap-4 items-center rounded-[15px] w-fit h-16 border cursor-pointer",
            isDragging ? "bg-white border-main" : "bg-white border-gray-20"
          )}
        >
          <Upload className={clsx(isDragging ? "text-main" : "text-gray-60")} />
          <span
            className={clsx(
              "text-heading3",
              isDragging ? "text-main" : "text-gray-80"
            )}
          >
            파일 선택하기
          </span>
        </button>

        <p
          className={clsx(
            "text-body2",
            isDragging ? "text-main" : "text-gray-60"
          )}
        >
          첨부할 파일을 여기에 끌어다 놓거나, 파일 선택하기 버튼을 눌러 직접
          선택해주세요.
        </p>
      </div>

      {files.length > 0 && (
        <div
          className={clsx(
            "grid gap-4 overflow-y-auto scrollbar-hide",
            "max-1680:grid-cols-1",
            "1680:grid-cols-[repeat(3,minmax(412px,1fr))] gap-7"
          )}
        >
          {files.map(file => (
            <FileUploadItem
              key={file.id}
              file={file}
              onRemove={() => handleRemove(file.id, file.fileId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;
