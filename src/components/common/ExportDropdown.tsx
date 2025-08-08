import { useRef, useState } from "react";

import Upload from "@/assets/svgs/common/upload.svg";
import Button from "@/components/common/Button";
import { useOutsideClick } from "@/hooks/useOutsideClick";

type ExportOption = "filtered" | "all";

type Props = {
  onExport: (option: ExportOption) => void;
};

const ExportDropdown = ({ onExport }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<ExportOption>("filtered");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useOutsideClick([dropdownRef, buttonRef], () => setIsOpen(false));

  const handleExportClick = () => {
    onExport(selected);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div ref={buttonRef}>
        <Button onClick={() => setIsOpen(prev => !prev)}>
          <Upload />
          <span className="text-gray-80 text-heading3">Export</span>
        </Button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 shadow-[0_4px_8px_0_rgba(0,0,0,0.25)] flex flex-col gap-6 z-20 mt-[14px] w-[417px] h-[268px] rounded-[15px] p-10 bg-white"
        >
          <div className="text-heading3-b text-black">Export to Excel</div>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 text-main accent-main"
                checked={selected === "filtered"}
                onChange={() => setSelected("filtered")}
              />
              <span className="text-body2 text-black">
                현재 필터링대로 Export 하기
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 text-main accent-main"
                checked={selected === "all"}
                onChange={() => setSelected("all")}
              />
              <span className="text-body2 text-black">
                모든 문의 Export 하기
              </span>
            </label>
          </div>
          <Button
            onClick={handleExportClick}
            buttonType="blue"
            className="w-full h-[52px] !rounded-[8px]"
          >
            Export
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
