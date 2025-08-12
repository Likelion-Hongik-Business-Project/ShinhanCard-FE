import { useState } from "react";

import Close from "@/assets/svgs/inquiry/close.svg";
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
  // 등록 보류 상태 관련 props
  isPendingState = false,
  isWriter = false,
  isAssigneeChanged = false,
  onCancelRegistration,
  onSubmitInquiry,
}: AssigneeActionsProps) => {
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // 등록 보류 상태에서 문의자인 경우
  if (isPendingState && isWriter) {
    const openAssigneeModal = () => setIsAssigneeModalOpen(true);
    const closeAssigneeModal = () => setIsAssigneeModalOpen(false);

    const handleModalEditClick = () => {
      closeAssigneeModal();
      onStartEditAssignees?.();
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
              {isEditingAssignees ? "담당자 수정 완료" : "담당자 수정"}
            </Button>
          </div>

          <div className="flex items-center gap-[16px]">
            {/* 등록 취소 버튼 */}
            <Button
              buttonType="white"
              onClick={onCancelRegistration}
              className="text-gray-80"
            >
              <Close className="h-[20px] w-[20px] text-gray-80" />
              <span>등록 취소</span>
            </Button>
            {/* 문의 등록하기 버튼 */}
            <Button
              buttonType={isAssigneeChanged ? "blue" : "done"}
              onClick={isAssigneeChanged ? onSubmitInquiry : undefined}
              disabled={!isAssigneeChanged}
              className={
                isAssigneeChanged
                  ? "text-white"
                  : "pointer-events-none text-gray-80"
              }
            >
              <Pencil
                className={
                  isAssigneeChanged
                    ? "h-[16px] w-[16px] text-white"
                    : "h-[16px] w-[16px] text-gray-80"
                }
              />
              <span>문의 등록하기</span>
            </Button>
          </div>
        </div>

        {/* 담당자 수정 모달 */}
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
  }

  // 기존 로직 (등록 보류가 아니거나 문의자가 아닌 경우)
  if (!showAssigneeFeatures) return null;

  const shouldShowAnswerButton =
    !showEditor && !hasMyComment && !isEditingAssignees;

  const openAssigneeModal = () => setIsAssigneeModalOpen(true);
  const closeAssigneeModal = () => setIsAssigneeModalOpen(false);

  const handleModalEditClick = () => {
    closeAssigneeModal();
    onStartEditAssignees?.();
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
            {isEditingAssignees ? "담당자 수정 완료" : "담당자 수정"}
          </Button>
        </div>

        <div className="flex items-center gap-[16px]">
          {shouldShowAnswerButton && (
            <Button buttonType="blue" onClick={() => onStartAnswer()}>
              <Pencil />
              답변 작성
            </Button>
          )}
          {!isCurrentUserConfirmed && !hasMyComment && !isEditingAssignees && (
            <Button
              buttonType="green"
              onClick={onConfirm}
              className="hover:text-gray-30 group"
            >
              <Check className="text-white group-hover:text-gray-30" />
              확인
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
