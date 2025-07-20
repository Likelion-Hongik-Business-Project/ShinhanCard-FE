import clsx from "clsx";

import Close from "@/assets/svgs/inquiry/close.svg";
import File from "@/assets/svgs/inquiry/file.svg";

import ProgressBar from "./ProgressBar";

interface FileUploadItemProps {
  file: {
    id: number;
    name: string;
    size: number;
    uploadedSize: number;
    status: "uploading" | "done";
  };
  onRemove: () => void;
}

const formatSize = (size: number) => `${Math.round(size / 1024)} KB`;

const FileUploadItem = ({ file, onRemove }: FileUploadItemProps) => {
  const { name, size, uploadedSize, status } = file;
  const isUploading = status === "uploading";
  const progress = (uploadedSize / size) * 100;

  return (
    <div className="flex w-full 1680:w-103 px-6 py-4 border rounded-lg border-gray-40 gap-4 justify-between h-fit">
      <div className="flex justify-between items-center w-full gap-4">
        <div className="flex items-center gap-2">
          <File />
          <div className="flex flex-col gap-1">
            <span
              className={clsx(
                "text-body2-b text-gray-80 truncate",
                isUploading ? "max-w-[184px]" : "max-w-[166px]"
              )}
            >
              {name}
            </span>

            {isUploading ? (
              <div className="flex flex-col gap-2">
                <span className="text-body3 text-gray-50">
                  {`${formatSize(uploadedSize)} / ${formatSize(size)}`}
                </span>
                <ProgressBar value={progress} />
              </div>
            ) : (
              <span className="text-body3 text-gray-50">
                {formatSize(size)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <span
            className={clsx(
              "text-body2",
              isUploading ? "text-state-progress-02" : "text-state-done-02"
            )}
          >
            {isUploading ? "업로드 중" : "업로드 완료"}
          </span>

          <button onClick={onRemove} className="cursor-pointer">
            <Close className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadItem;
