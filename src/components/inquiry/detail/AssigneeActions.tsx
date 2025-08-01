import Check from "@/assets/svgs/inquiry/detail/check.svg";
import Pencil from "@/assets/svgs/inquiry/detail/pencil.svg";
import Users from "@/assets/svgs/inquiry/detail/users.svg";
import Button from "@/components/common/Button";

interface AssigneeActionsProps {
  showAssigneeFeatures: boolean;
}

const AssigneeActions = ({ showAssigneeFeatures }: AssigneeActionsProps) => {
  if (!showAssigneeFeatures) return null;

  return (
    <div className="flex justify-between items-center w-full">
      {/* 담당자 수정 버튼 */}
      <Button buttonType="default" className="text-gray-80">
        <Users className="text-gray-80" />
        담당자 수정
      </Button>

      <div className="flex items-center gap-[16px] ">
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
