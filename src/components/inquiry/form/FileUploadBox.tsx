import { useRef, useState } from "react";

import clsx from "clsx";

import Upload from "@/assets/svgs/inquiry/upload.svg";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useFakeProgress } from "@/hooks/useFakeProgress";

import FileUploadItem from "./FileUploadItem";

const FileUploadBox = () => {
  const [files, setFiles] = useState<
    {
      id: number;
      name: string;
      size: number;
      uploadedSize: number;
      status: "uploading" | "done";
    }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList).map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      size: file.size,
      uploadedSize: 0,
      status: "uploading" as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const { isDragging, dragEventProps } = useDragAndDrop({
    onDrop: handleFileSelect,
  });

  const handleRemove = (id: number) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  useFakeProgress(files, setFiles);

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
            "px-6 flex gap-4 items-center rounded-[15px] w-fit h-16 border",
            isDragging ? "bg-white border-main" : "bg-white border-gray-20 "
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
              onRemove={() => handleRemove(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;
