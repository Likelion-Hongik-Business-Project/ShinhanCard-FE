import { useState } from "react";

import type { ModalProps } from "@/types/modal";

import { useAnswerHandler } from "./answer/useAnswerHandler";
import { useInquiryData } from "./useInquiryData";
import { useInquiryModals } from "./useInquiryModals";
import { useInquiryState } from "./useInquiryState";

export const useInquiryPageHandler = () => {
  const { inquiry, userRole, currentUserId } = useInquiryData();
  const state = useInquiryState(inquiry, userRole, currentUserId);

  const [modalProps, setModalProps] = useState<Omit<
    ModalProps,
    "isOpen" | "onClose"
  > | null>(null);
  const [confirmedUsers, setConfirmedUsers] = useState<number[]>([]);
  const [contentToSubmit, setContentToSubmit] = useState<string>("");

  const isAssignee =
    inquiry?.assignees.some(a => a.user_id === currentUserId) ?? false;
  const isAnswerable = state.canAnswer && isAssignee;

  const answerHandler = useAnswerHandler({
    inquiry,
    currentUserId,
    isAnswerable,
  });

  const modalCallbacks = {
    onConfirmInquiry: () => {
      setConfirmedUsers(prev => [...prev, currentUserId]);
    },
    onSubmitAnswer: () => {
      answerHandler.handleSubmit(contentToSubmit);
    },
    onSendNotification: () => console.log("알림 메일 발송 로직 실행"),
    onDeletePost: () => console.log("게시글 삭제 로직 실행"),
  };
  const modals = useInquiryModals({ setModalProps, callbacks: modalCallbacks });

  const handleEditorSubmit = (content: string) => {
    setContentToSubmit(content);
    modals.openSubmitAnswerModal();
  };

  return {
    inquiry,
    userRole,
    currentUserId,
    state,
    answerHandler,
    modals,
    modalProps,
    confirmedUsers,
    handleEditorSubmit,
    closeModal: () => setModalProps(null),
  };
};
