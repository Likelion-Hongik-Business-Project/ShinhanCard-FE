import Modal from "@/components/common/Modal";

interface Props {
  // 공통
  missingField: "team" | "title" | "content" | "assignee" | null;
  onCloseMissing: () => void;

  // 임시저장 관련
  isDraftOpen: boolean;
  draftModalMode: "detect" | "conflict"; // 추가: 감지 / 충돌 모드
  onCloseDraft: () => void;
  onRestoreDraft: () => void; // 불러오기
  onResetDraft: () => void; // 현재 글 유지(닫기만)
  onOverwriteDraft: () => void; // 추가: 현재 글로 임시저장 (덮어쓰기)

  // 등록 확인
  isConfirmOpen: boolean;
  onCloseConfirm: () => void;
  onConfirmSubmit: () => void;

  // 공통 진행 상태
  isSubmitting?: boolean;
}

const InquiryFormModal = ({
  // 공통
  missingField,
  onCloseMissing,

  // 임시저장
  isDraftOpen,
  draftModalMode,
  onCloseDraft,
  onRestoreDraft,
  onResetDraft,
  onOverwriteDraft,

  // 등록 확인
  isConfirmOpen,
  onCloseConfirm,
  onConfirmSubmit,

  // 상태
  isSubmitting,
}: Props) => {
  return (
    <>
      {/* 임시저장 감지/충돌 모달 */}
      {draftModalMode === "detect" ? (
        <Modal
          isOpen={isDraftOpen}
          onClose={isSubmitting ? () => {} : onCloseDraft}
          title={"임시저장된 글이 있습니다.\n불러오시겠습니까?"}
          description="저장된 글을 불러올 시 작성중이던 게시글은 삭제됩니다."
          buttons={[
            {
              label: "현재 글 유지",
              type: "white",
              onClick: isSubmitting ? () => {} : onResetDraft,
            },
            {
              label: "불러오기",
              type: "blue",
              onClick: isSubmitting ? () => {} : onRestoreDraft,
            },
          ]}
        />
      ) : (
        <Modal
          isOpen={isDraftOpen}
          onClose={isSubmitting ? () => {} : onCloseDraft}
          title={"해당 팀으로 임시저장된 글이 있습니다.\n덮어쓰시겠습니까?"}
          description={
            "임시저장 가능 갯수는 1개까지로\n이전에 임시저장한 글은 삭제됩니다."
          }
          buttons={[
            {
              label: "뒤로가기",
              type: "white",
              onClick: isSubmitting ? () => {} : onCloseDraft,
            },
            {
              label: "덮어쓰기",
              type: "blue",
              onClick: isSubmitting ? () => {} : onOverwriteDraft,
            },
          ]}
        />
      )}

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
          "등록 시 담당자와 참조자에게 알림이 발송되며,\n" +
          "답변이 달린 이후에는 글을 수정 및 삭제할 수 없습니다."
        }
        buttons={[
          {
            label: "취소",
            type: "white",
            onClick: isSubmitting ? () => {} : onCloseConfirm,
          },
          {
            label: isSubmitting ? "등록 중…" : "문의 등록하기",
            type: "blue",
            onClick: isSubmitting ? () => {} : onConfirmSubmit,
          },
        ]}
      />
    </>
  );
};

export default InquiryFormModal;
