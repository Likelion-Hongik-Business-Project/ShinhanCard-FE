import Modal from "@/components/common/Modal";

interface Props {
  missingField: "team" | "title" | "content" | "assignee" | null;
  onCloseMissing: () => void;
  isDraftOpen: boolean;
  onCloseDraft: () => void;
  onRestoreDraft: () => void;
  onResetDraft: () => void;
  isConfirmOpen: boolean;
  onCloseConfirm: () => void;
  onConfirmSubmit: () => void;
}

const InquiryFormModal = ({
  missingField,
  onCloseMissing,
  isDraftOpen,
  onCloseDraft,
  onRestoreDraft,
  onResetDraft,
  isConfirmOpen,
  onCloseConfirm,
  onConfirmSubmit,
}: Props) => {
  return (
    <>
      {/* 임시저장 감지 모달 */}
      <Modal
        isOpen={isDraftOpen}
        onClose={onCloseDraft}
        title={"임시저장된 글이 있습니다.\n불러오시겠습니까?"}
        description="새로 작성하면 기존 임시저장된 글은 사라집니다."
        buttons={[
          {
            label: "새로 작성",
            type: "white",
            onClick: onResetDraft,
          },
          {
            label: "불러오기",
            type: "blue",
            onClick: onRestoreDraft,
          },
        ]}
      />

      {/* 필수 항목 누락 시 모달 */}
      <Modal
        isOpen={!!missingField}
        onClose={onCloseMissing}
        title={
          missingField === "team"
            ? "문의를 올릴 팀을 선택해주세요"
            : missingField === "title"
              ? "문의 제목을 입력해주세요"
              : missingField === "content"
                ? "문의 내용을 입력해주세요"
                : "답변 담당자를 선택해주세요"
        }
        buttons={[
          {
            label: "확인",
            type: "blue",
            onClick: onCloseMissing,
          },
        ]}
      />

      {/* 문의 등록 확인 모달 */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={onCloseConfirm}
        title="게시판에 문의를 등록할까요?"
        description={
          "등록 시 담당자와 참조자에게 알림이 발송되며,\n답변이 달린 이후에는 글을 수정 및 삭제할 수 없습니다."
        }
        buttons={[
          {
            label: "취소",
            type: "white",
            onClick: onCloseConfirm,
          },
          {
            label: "문의 등록하기",
            type: "blue",
            onClick: onConfirmSubmit,
          },
        ]}
      />
    </>
  );
};

export default InquiryFormModal;
