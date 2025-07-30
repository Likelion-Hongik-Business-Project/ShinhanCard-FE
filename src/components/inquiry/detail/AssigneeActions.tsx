import Check from "@/assets/svgs/inquiry/detail/check.svg";
import Pencil from "@/assets/svgs/inquiry/detail/pencil.svg";
import UserCheck from "@/assets/svgs/inquiry/detail/user-check.svg";
import Button from "@/components/common/Button";

interface AssigneeActionsProps {
  showAssigneeFeatures: boolean;
}

const AssigneeActions = ({ showAssigneeFeatures }: AssigneeActionsProps) => {
  if (!showAssigneeFeatures) return null;

  return (
    <div className="self-stretch px-[16px] justify-between items-start flex">
      {/* 담당자 수정 버튼 */}
      <Button buttonType="default" className="text-gray-80">
        <UserCheck className="text-gray-80" />
        담당자 수정
      </Button>

      <div className="justify-start items-center gap-[16px] flex">
        {/* 답변 작성 버튼 */}
        <Button buttonType="blue">
          <Pencil />
          답변 작성
        </Button>

        {/* 확인 버튼*/}
        <Button buttonType="green">
          <Check />
          확인
        </Button>
      </div>
    </div>
  );
};

export default AssigneeActions;
