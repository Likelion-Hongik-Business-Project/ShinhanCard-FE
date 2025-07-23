import { useEffect, useRef } from "react";

import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";

const STATUSES = ["전체", "확인 전", "확인 중", "답변 완료"];

type Props = {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onClose: () => void;
  clickedButton: boolean;
  setClickedButton: (value: boolean) => void;
};

const StatusFilterModal = ({
  selectedStatus,
  onSelectStatus,
  onClose,
  clickedButton,
  setClickedButton,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (clickedButton) {
          setClickedButton(false); // 버튼 클릭으로 인한 이벤트면 무시
          return;
        }
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, clickedButton]);

  return (
    <div
      ref={modalRef}
      className="absolute mt-5 left-0 bg-white border border-gray-10 shadow-01 rounded-[5px] w-[146px] py-4 z-50"
    >
      {STATUSES.map(status => {
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
