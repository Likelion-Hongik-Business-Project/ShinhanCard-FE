import clsx from "clsx";

import Upload from "@/assets/svgs/inquiry/upload.svg";
import Modal from "@/components/common/Modal";
import { useDragAndDrop } from "@/hooks/file/useDragAndDrop";
import { useMultiFileUploader } from "@/hooks/file/useMultiFileUploader";
import type { UploadingFile } from "@/types/file/file.type";

import FileUploadItem from "./FileUploadItem";

interface Props {
  fileIds: number[];
  files: UploadingFile[];
  setFileIds: React.Dispatch<React.SetStateAction<number[]>>;
  setFiles: React.Dispatch<React.SetStateAction<UploadingFile[]>>;
}

const FileUploadBox = ({ setFileIds, files, fileIds, setFiles }: Props) => {
  const {
    inputRef,
    showLimitModal,
    setShowLimitModal,
    triggerInput,
    handleFileSelect,
    handleRemove,
  } = useMultiFileUploader(files, fileIds, setFileIds, setFiles);

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
          onClick={triggerInput}
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

      {fileIds.length > 0 && (
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
              onRemove={() => handleRemove(file.id, file.file_id)}
            />
          ))}
        </div>
      )}

      {showLimitModal && (
        <Modal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          title="파일은 최대 6개까지 첨부 가능합니다."
          buttons={[
            {
              label: "확인",
              type: "blue",
              onClick: () => setShowLimitModal(false),
            },
          ]}
        />
      )}
    </div>
  );
};

export default FileUploadBox;
