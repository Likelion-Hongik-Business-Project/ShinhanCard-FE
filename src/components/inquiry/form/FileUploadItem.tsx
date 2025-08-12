import clsx from "clsx";

import Close from "@/assets/svgs/inquiry/close.svg";
import File from "@/assets/svgs/inquiry/file.svg";
import { UploadFile } from "@/types/file/file.type";

import ProgressBar from "./ProgressBar";

interface Props {
  file: UploadFile;
  onRemove: () => void;
}

const formatSize = (size: number) => `${Math.round(size / 1024)} KB`;

const FileUploadItem = ({ file, onRemove }: Props) => {
  const { file_name, file_size, progress, status } = file;

  const isUploading = status === "uploading";
  const isDone = status === "done";

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
              {file_name}
            </span>

            {isUploading ? (
              <div className="flex flex-col gap-2">
                <span className="text-body3 text-gray-50">
                  {`${Math.round(progress)}%`}
                </span>
                <ProgressBar value={progress} />
              </div>
            ) : (
              <span className="text-body3 text-gray-50">
                {formatSize(file_size)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <span
            className={clsx(
              "text-body2",
              isUploading
                ? "text-state-progress-02"
                : isDone
                  ? "text-state-done-02"
                  : "text-red-500"
            )}
          >
            {isUploading ? "업로드 중" : isDone ? "업로드 완료" : "업로드 실패"}
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
