import DownloadIcon from "@/assets/svgs/inquiry/detail/file-download.svg";
import File from "@/assets/svgs/inquiry/file.svg";
import { UploadFile } from "@/types/file/file.type";

interface Props {
  file: UploadFile;
  onRemove: () => void;
}

const formatSize = (size: number) => `${Math.round(size / 1024)} KB`;

const FileDownloadBox = ({ file }: Props) => {
  const { name, size } = file;

  return (
    <div className="flex w-full 1680:w-103 px-6 py-4 border rounded-lg border-gray-40 gap-4 justify-between h-fit">
      <div className="flex justify-between items-center w-full gap-4">
        <div className="flex items-center gap-2">
          <File />
          <div className="flex flex-col gap-1">
            <span className="text-body2-b text-gray-80 truncate">{name}</span>

            <span className="text-body3 text-gray-50">{formatSize(size)}</span>
          </div>
        </div>
        <button className="cursor-pointer">
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
};

export default FileDownloadBox;
