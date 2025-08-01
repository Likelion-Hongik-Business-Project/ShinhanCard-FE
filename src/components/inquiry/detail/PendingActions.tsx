import Close from "@/assets/svgs/inquiry/close.svg";
import { Pencil } from "@/assets/svgs/layout";
import Button from "@/components/common/Button";
import { PendingActionsProps } from "@/types/inquiryTypes";

const PendingActions = ({ isWriter, isPendingState }: PendingActionsProps) => {
  if (!isWriter || !isPendingState) return null;

  return (
    <div className="flex justify-end items-center gap-[16px]">
      {/* 등록 취소 버튼 */}
      <Button buttonType="default" className="text-gray-60">
        <Close className="h-[20px] w-[20px] text-gray-80" />
        <span>등록 취소</span>
      </Button>
      {/* 문의 등록하기 버튼 */}
      <Button buttonType="done" className="pointer-events-none">
        <Pencil className="h-[16px] w-[16px] text-gray-80" />
        <span>문의 등록하기</span>
      </Button>
    </div>
  );
};

export default PendingActions;
