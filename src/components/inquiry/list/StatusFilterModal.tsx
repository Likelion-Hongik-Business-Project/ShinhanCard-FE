import { useEffect, useRef } from "react";

import {
  INQUIRY_STATUS_STYLES,
  INQUIRY_STATUSES_WITH_ALL,
} from "@/constants/inquiry";

type Props = {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLLIElement | null>;
};

const StatusFilterModal = ({
  selectedStatus,
  onSelectStatus,
  onClose,
  triggerRef,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 영역과 버튼 둘 다 아닌 경우에만 닫힘
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideModal = modalRef.current?.contains(target);
      const isClickOnTrigger = triggerRef.current?.contains(target);

      if (!isClickInsideModal && !isClickOnTrigger) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute mt-5 left-0 bg-white border border-gray-10 shadow-01 rounded-[5px] w-[146px] py-4 z-50"
    >
      {INQUIRY_STATUSES_WITH_ALL.map(status => {
        const isSelected = selectedStatus === status;
        const isAll = status === "전체";
        const style = INQUIRY_STATUS_STYLES[status];

        return (
          <button
            key={status}
            onClick={() => {
              onSelectStatus(status);
              onClose();
            }}
            className={`w-full transition-colors hover:bg-gray-10 cursor-pointer flex justify-center h-12 py-2 text-body1 rounded-[5px] ${
              isSelected ? "bg-gray-10" : ""
            }`}
          >
            <div className="w-40 justify-center px-4 flex items-center">
              {isAll ? (
                <div className="flex items-center px-3 h-8 rounded-[30px] bg-gray-30 text-white">
                  <span className="text-body1">{status}</span>
                </div>
              ) : (
                <div
                  className={`flex items-center pl-2 pr-3 gap-2 h-8 rounded-[30px] ${style.bg} ${style.text}`}
                >
                  <div className={`rounded-full w-2 h-2 ${style.dot}`} />
                  <span className="text-body1">{status}</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilterModal;
