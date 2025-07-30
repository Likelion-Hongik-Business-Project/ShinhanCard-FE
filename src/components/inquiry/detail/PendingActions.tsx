import Button from "@/components/common/Button";

interface PendingActionsProps {
  isWriter: boolean;
  isPendingState: boolean;
}

const PendingActions = ({ isWriter, isPendingState }: PendingActionsProps) => {
  if (!isWriter || !isPendingState) return null;

  return (
    <div className="self-stretch px-[16px] justify-end items-start flex">
      <div className="justify-start items-center gap-[16px] flex">
        {/* 등록 취소 버튼 */}
        <Button buttonType="default" className="text-gray-80">
          등록 취소
        </Button>
        {/* 문의 등록하기 버튼 */}
        <Button buttonType="default" className="bg-gray-20 text-gray-80">
          문의 등록하기
        </Button>
      </div>
    </div>
  );
};

export default PendingActions;
