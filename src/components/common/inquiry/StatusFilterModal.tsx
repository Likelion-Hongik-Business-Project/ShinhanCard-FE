import { INQUIRY_STATUS_STYLES } from "@/constants/inquiry";

const STATUSES = ["전체", "확인 전", "확인 중", "답변 완료"];

type Props = {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onClose: () => void;
};

const StatusFilterModal = ({
  selectedStatus,
  onSelectStatus,
  onClose,
}: Props) => {
  return (
    <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-[10px] w-40 py-2 z-50">
      {STATUSES.map(status => (
        <button
          key={status}
          onClick={() => {
            onSelectStatus(status);
            onClose();
          }}
          className={`w-full flex items-center gap-2 px-4 py-2 text-body1 rounded-[10px] ${
            selectedStatus === status ? "bg-gray-20" : ""
          }`}
        >
          {status !== "전체" && (
            <div
              className={`w-2 h-2 rounded-full ${
                INQUIRY_STATUS_STYLES[status]?.dot || "bg-gray-40"
              }`}
            />
          )}
          <span
            className={`${
              INQUIRY_STATUS_STYLES[status]?.text || "text-gray-40"
            }`}
          >
            {status}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilterModal;
