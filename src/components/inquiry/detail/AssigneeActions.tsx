import { useState } from "react";

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
  isEditingAssignees,
  onStartEditAssignees,
  onCompleteEditAssignees,
}: AssigneeActionsProps) => {
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  if (!showAssigneeFeatures) return null;

  const shouldShowAnswerButton =
    !showEditor && !hasMyComment && !isEditingAssignees;

  const openAssigneeModal = () => setIsAssigneeModalOpen(true);
  const closeAssigneeModal = () => setIsAssigneeModalOpen(false);

  const handleModalEditClick = () => {
    closeAssigneeModal();
    onStartEditAssignees?.(); // 옵셔널 체이닝 사용
  };

  const handleCompleteEditClick = () => {
    setIsCompleteModalOpen(true);
  };

  const confirmCompleteEdit = () => {
    setIsCompleteModalOpen(false);
    onCompleteEditAssignees?.();
  };

  const cancelCompleteEdit = () => {
    setIsCompleteModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-8 items-center">
          {shouldShowAnswerButton && (
            <Button buttonType="blue" onClick={() => onStartAnswer()}>
              <Pencil />
              답변 작성
            </Button>
          )}

          <Button
            buttonType={isEditingAssignees ? "blue" : "default"}
            className={isEditingAssignees ? "text-white" : "text-gray-80"}
            onClick={
              isEditingAssignees ? handleCompleteEditClick : openAssigneeModal
            }
          >
            <Users
              className={isEditingAssignees ? "text-white" : "text-gray-80"}
            />
            {isEditingAssignees ? "담당자 수정 완료" : "담당자 수정하기"}
          </Button>
        </div>

        <div className="flex items-center gap-[16px]">
          {!isCurrentUserConfirmed && !hasMyComment && !isEditingAssignees && (
            <Button buttonType="default" onClick={onConfirm}>
              <Check className="text-gray-60" />
              확인 처리하기
            </Button>
          )}
        </div>
      </div>

      {/* 수정 완료 확인 모달 */}
      <Modal
        isOpen={isAssigneeModalOpen}
        onClose={closeAssigneeModal}
        title={`담당자/참조자를 \n수정하시겠습니까?`}
        description={`담당자/참조자를 수정 시 권한을 부여하거나\n삭제할 수 있습니다.`}
        buttons={[
          { label: "뒤로가기", type: "gray", onClick: closeAssigneeModal },
          { label: "수정하기", type: "blue", onClick: handleModalEditClick },
        ]}
      />
      {/* 수정 완료 확인 모달 */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={cancelCompleteEdit}
        title={`해당 내용으로 담당자/참조자 변경을\n완료하시겠습니까?`}
        description={`해당 내용으로 담당자/참조자를 수정 시 권한을 부여하거나\n삭제할 수 있습니다.`}
        buttons={[
          { label: "뒤로가기", type: "gray", onClick: cancelCompleteEdit },
          { label: "완료하기", type: "blue", onClick: confirmCompleteEdit },
        ]}
      />
    </>
  );
};

export default AssigneeActions;
