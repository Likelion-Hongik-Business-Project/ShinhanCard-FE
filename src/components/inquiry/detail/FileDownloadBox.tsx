import DownloadIcon from "@/assets/svgs/inquiry/detail/file-download.svg";
import File from "@/assets/svgs/inquiry/file.svg";
import { useFileDownload } from "@/hooks/file/useFileDownloadApi";
import { UploadFile } from "@/types/file/file.type";

interface Props {
  file: UploadFile;
  onRemove: () => void;
}

const formatSize = (size: number) => `${Math.round(size / 1024)} KB`;

const FileDownloadBox = ({ file }: Props) => {
  const { id, file_name, file_size } = file;
  const { downloading, download } = useFileDownload();

  const handleDownload = () => download(id as number, file_name);

  return (
    <div className="flex w-full 1680:w-103 px-6 py-4 border rounded-lg border-gray-40 gap-4 justify-between h-fit">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <File className="shrink-0" />

        <div className="flex flex-col gap-1 min-w-0">
          <span
            className="text-body2-b text-gray-80 truncate block"
            title={file_name}
          >
            {file_name}
          </span>
          <span className="text-body3 text-gray-50">
            {formatSize(file_size)}
          </span>
        </div>
      </div>

      <button
        className="cursor-pointer shrink-0 disabled:opacity-60"
        onClick={handleDownload}
        disabled={downloading}
        aria-busy={downloading}
        aria-label="파일 다운로드"
        title={downloading ? "다운로드 중..." : "다운로드"}
      >
        <DownloadIcon />
      </button>
    </div>
  );
};

export default FileDownloadBox;
