import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Check from "@/assets/svgs/inquiry/detail/check.svg";
import Pencil from "@/assets/svgs/inquiry/detail/pencil.svg";
import Users from "@/assets/svgs/inquiry/detail/users.svg";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import type { AssigneeActionsProps } from "@/types/inquiryTypes";

const AssigneeActions = ({
  showAssigneeFeatures,
  onStartAnswer,
  onConfirm,
  isCurrentUserConfirmed,
  showEditor,
  hasMyComment,
  InquiryId,
}: AssigneeActionsProps) => {
  const navigate = useNavigate();
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);

  if (!showAssigneeFeatures) return null;

  const shouldShowAnswerButton = !showEditor && !hasMyComment;

  const openAssigneeModal = () => setIsAssigneeModalOpen(true);
  const closeAssigneeModal = () => setIsAssigneeModalOpen(false);
  const handleEditClick = () => {
    closeAssigneeModal();
    navigate(`/inquiry/form?mode=edit&inquiryId=${InquiryId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <Button
          buttonType="default"
          className="text-gray-80"
          onClick={openAssigneeModal}
        >
          <Users className="text-gray-80" />
          담당자 수정하기
        </Button>

        <div className="flex items-center gap-[16px]">
          {shouldShowAnswerButton && (
            <Button buttonType="blue" onClick={() => onStartAnswer}>
              <Pencil />
              답변 작성
            </Button>
          )}
          {!isCurrentUserConfirmed && !hasMyComment && (
            <Button buttonType="default" onClick={onConfirm}>
              <Check className="text-gray-60" />
              확인 처리하기
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isAssigneeModalOpen}
        onClose={closeAssigneeModal}
        title={`담당자/참조자를 \n수정하시겠습니까?`}
        description={`담당자/참조자를 수정 시 권한을 부여하거나\n삭제할 수 있습니다.`}
        buttons={[
          { label: "뒤로가기", type: "gray", onClick: closeAssigneeModal },
          { label: "수정하기", type: "blue", onClick: handleEditClick },
        ]}
      />
    </>
  );
};

export default AssigneeActions;
