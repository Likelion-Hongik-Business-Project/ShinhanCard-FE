import type { ModalProps } from "@/types/modal";

// 모달 콜백 함수 타입
interface ModalCallbacks {
  onConfirmInquiry: () => void;
  onSubmitAnswer: () => void;
  onSendNotification: () => void;
  onDeletePost: () => void;
}

interface UseInquiryModalsProps {
  setModalProps: React.Dispatch<
    React.SetStateAction<Omit<ModalProps, "isOpen" | "onClose"> | null>
  >;
  callbacks: ModalCallbacks;
}

export const useInquiryModals = ({
  setModalProps,
  callbacks,
}: UseInquiryModalsProps) => {
  const closeModal = () => setModalProps(null);

  const openConfirmInquiryModal = () => {
    setModalProps({
      title: "해당 문의를 확인 처리할까요?",
      description:
        "확인 처리는 취소되지 않으며,\n추후 언제든지 답변을 작성하실 수 있습니다.",
      buttons: [
        { type: "white", label: "취소", onClick: closeModal },
        {
          type: "blue",
          label: "확인",
          onClick: () => {
            callbacks.onConfirmInquiry();
            closeModal();
          },
        },
      ],
    });
  };

  const openSubmitAnswerModal = (isEditing: boolean) => {
    if (isEditing) {
      // 수정이면 모달 없이 바로 제출
      callbacks.onSubmitAnswer();
      return;
    }

    // 신규 등록일 때만 모달
    setModalProps({
      title: "답변을 등록할까요?",
      description:
        "답변 등록 시 해당 문의는 자동으로 확인 처리되며,\n마지막 답변은 삭제되지 않습니다.",
      buttons: [
        { type: "white", label: "취소", onClick: closeModal },
        {
          type: "blue",
          label: "답변 등록",
          onClick: () => {
            callbacks.onSubmitAnswer();
            closeModal();
          },
        },
      ],
    });
  };

  const openSendNotificationModal = () => {
    setModalProps({
      title: "메일을 발송하시겠습니까?",
      description: "메일 전송 후 4시간후에 다시 메일을\n발송하실 수 있습니다.",
      buttons: [
        { type: "gray", label: "뒤로가기", onClick: closeModal },
        {
          type: "blue",
          label: "메일 발송하기",
          onClick: () => {
            callbacks.onSendNotification();
            closeModal();
          },
        },
      ],
    });
  };

  const openDeletePostModal = () => {
    setModalProps({
      title: "해당 게시글을 삭제하시겠습니까?",
      description: "관리자 권한으로 게시글을 삭제 할 시\n복구 할 수 없습니다.",
      buttons: [
        { type: "gray", label: "취소", onClick: closeModal },
        {
          type: "red",
          label: "게시글 삭제",
          onClick: () => {
            callbacks.onDeletePost();
            closeModal();
          },
        },
      ],
    });
  };

  return {
    openConfirmInquiryModal,
    openSubmitAnswerModal,
    openSendNotificationModal,
    openDeletePostModal,
  };
};
