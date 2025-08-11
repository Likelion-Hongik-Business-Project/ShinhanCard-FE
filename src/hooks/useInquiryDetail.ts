import { useEffect, useMemo, useState } from "react";

import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { useAnswerApi } from "@/hooks/inquiry/useAnswerApi";
import {
  useGetTeamInquiryDetail,
  useInquiryApi,
} from "@/hooks/inquiry/useInquiryApi";
import {
  useGetLastSentMailTime,
  useInquiryManagementApi,
} from "@/hooks/inquiry/useInquiryManagementApi";
import { useMyProfile } from "@/hooks/profile/useProfileApi";
import type { Comment, User } from "@/types/inquiryTypes";
import type { ModalProps } from "@/types/modal";

import { useInquiryModals } from "./useInquiryModals";

const NOTIFICATION_COOLDOWN = 4 * 60 * 60 * 1000;

export const useInquiryDetail = () => {
  // 훅 호출
  const navigate = useNavigate();
  const { team_id, inquiry_id } = useParams<{
    team_id: string;
    inquiry_id: string;
  }>();

  const {
    data: inquiryResponse,
    isLoading,
    isError,
    error,
  } = useGetTeamInquiryDetail(Number(team_id), Number(inquiry_id));
  const { data: myProfileResponse } = useMyProfile();
  const {
    postAnswerMutation,
    putAnswerMutation,
    postInquiryConfirmMutation,
    deleteAnswerMutation,
  } = useAnswerApi(Number(team_id));
  const { deleteInquiryMutation } = useInquiryApi();
  const { postInquiryNotifyMutation, putInquiryAssigneeMutation } =
    useInquiryManagementApi();
  const {
    data: lastSentTimeResponse,
    isError: isMailTimeError,
    error: mailTimeError,
  } = useGetLastSentMailTime(Number(inquiry_id));

  // 상태 관리
  const [showEditor, setShowEditor] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isWritingAnswer, setIsWritingAnswer] = useState(false); // 답변 작성 중인지 추적
  const [notificationSent, setNotificationSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
  const [modalProps, setModalProps] = useState<Omit<
    ModalProps,
    "isOpen" | "onClose"
  > | null>(null);

  // 데이터 정제
  const currentUserId = myProfileResponse?.result.id;
  const inquiryData = inquiryResponse?.result;

  const myComment = useMemo(
    () =>
      inquiryData?.answers.answers.find(c => c.user?.user_id === currentUserId),
    [inquiryData, currentUserId]
  );

  // 탭 목록에 현재 사용자 포함 (답변 작성 중일 때)
  const tabsToDisplay = useMemo(() => {
    if (!inquiryData || !currentUserId) return [];

    const answerers = inquiryData.answers.answers
      .map(c => c.user)
      .filter((user): user is NonNullable<typeof user> => !!user);

    const uniqueAnswerers = Array.from(
      new Map(answerers.map(a => [a.user_id, a])).values()
    );

    // 답변 작성 중이거나 작성한 적이 있으면서 내 답변이 없는 경우, 내 정보를 탭에 추가
    if (
      (showEditor || isWritingAnswer) &&
      !myComment &&
      myProfileResponse?.result
    ) {
      const myInfo = {
        user_id: currentUserId,
        username: myProfileResponse.result.name,
        profile_url: myProfileResponse.result.profile_image_url || undefined,
      };

      // 중복 제거를 위해 기존 답변자 중에 내가 없을 때만 추가
      const hasMyTab = uniqueAnswerers.some(a => a.user_id === currentUserId);
      if (!hasMyTab) {
        uniqueAnswerers.push(myInfo);
      }
    }

    return uniqueAnswerers.map(a => ({
      user_id: a.user_id,
      username: a.username,
      profile_image_url: a.profile_url,
    }));
  }, [
    inquiryData,
    currentUserId,
    showEditor,
    isWritingAnswer,
    myComment,
    myProfileResponse,
  ]);

  const selectedComment = useMemo(() => {
    if (!inquiryData || inquiryData.answers.answers.length === 0) return null;
    const targetId = selectedUserId ?? tabsToDisplay[0]?.user_id;
    return (
      inquiryData.answers.answers.find(c => c.user?.user_id === targetId) ||
      null
    );
  }, [selectedUserId, inquiryData, tabsToDisplay]);

  useEffect(() => {
    if (inquiryData && !selectedUserId) {
      const firstAnswerer = inquiryData.answers.answers.find(c => c.user);
      if (firstAnswerer) {
        setSelectedUserId(firstAnswerer.user.user_id);
      }
    }
  }, [inquiryData, selectedUserId]);

  useEffect(() => {
    if (
      isMailTimeError &&
      mailTimeError instanceof AxiosError &&
      mailTimeError.response?.status === 404
    ) {
      setNotificationSent(false);
      return;
    }
    const lastSentTimeData = lastSentTimeResponse?.result.lastSentTime;
    if (!lastSentTimeData) {
      setNotificationSent(false);
      return;
    }
    const lastNotifiedTime = new Date(lastSentTimeData).getTime();
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const timeDiff = now - lastNotifiedTime;
      if (timeDiff >= NOTIFICATION_COOLDOWN) {
        clearInterval(intervalId);
        // 0.5초(500ms) 지연 후 버튼을 활성화합니다.
        setTimeout(() => {
          setNotificationSent(false);
          setRemainingTime("");
        }, 500);
      } else {
        setNotificationSent(true);
        const remaining = NOTIFICATION_COOLDOWN - timeDiff;
        const hours = String(Math.floor(remaining / (1000 * 60 * 60))).padStart(
          2,
          "0"
        );
        const minutes = String(
          Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0");
        const seconds = String(
          Math.floor((remaining % (1000 * 60)) / 1000)
        ).padStart(2, "0");
        setRemainingTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [lastSentTimeResponse, isMailTimeError, mailTimeError]);

  // 실제 API를 호출하는 콜백 함수들
  const onConfirmInquiry = async () => {
    try {
      await postInquiryConfirmMutation.mutateAsync({
        inquiry_id: Number(inquiry_id),
      });
    } catch (error) {
      console.error("문의 확인 처리 실패:", error);
    }
  };

  const onSubmitAnswer = async () => {
    if (draftContent.trim().length === 0) return;
    try {
      if (editingComment) {
        await putAnswerMutation.mutateAsync({
          answer_id: editingComment.answer_id,
          data: { content: draftContent, file_ids: null },
        });
        setSelectedUserId(editingComment.user.user_id);
      } else {
        await postAnswerMutation.mutateAsync({
          inquiry_id: Number(inquiry_id),
          data: { content: draftContent, file_ids: null },
        });
        if (currentUserId) setSelectedUserId(currentUserId);
      }
      setShowEditor(false);
      setIsWritingAnswer(false); // 답변 제출 완료
    } catch (error) {
      console.error("답변 처리 실패:", error);
    }
  };

  const onSendNotification = async () => {
    try {
      await postInquiryNotifyMutation.mutateAsync({
        inquiry_id: Number(inquiry_id),
      });
    } catch (error) {
      console.error("알림 발송 실패:", error);
    }
  };

  // 답변 삭제 함수
  const onDeleteAnswer = async (answerId: number) => {
    try {
      await deleteAnswerMutation.mutateAsync({ answer_id: answerId });
    } catch (error) {
      console.error("답변 삭제 실패:", error);
    }
  };

  // 문의글 삭제 함수
  const onDeletePost = async () => {
    try {
      await deleteInquiryMutation.mutateAsync({
        team_id: Number(team_id),
        inquiry_id: Number(inquiry_id),
      });
      navigate(`/teams/${team_id}`);
    } catch (error) {
      console.error("문의글 삭제 실패:", error);
    }
  };

  // 모달을 여는 함수들을 생성
  const modals = useInquiryModals({
    setModalProps,
    callbacks: {
      onConfirmInquiry,
      onSubmitAnswer,
      onSendNotification,
      onDeletePost,
    },
  });

  // 핸들러 함수
  const handleOpenAssigneeModal = () => {
    const initialAssignees =
      inquiryData?.assignees.map(a => ({
        id: a.user_id,
        user_name: a.user_name,
        profile_image_url: a.profile_image_url || "",
      })) || [];
    setSelectedAssignees(initialAssignees);
    setIsAssigneeModalOpen(true);
  };

  const handleCloseAssigneeModal = () => {
    setIsAssigneeModalOpen(false);
  };

  const handleUpdateAssignees = async () => {
    const assigneeIds = selectedAssignees.map(a => a.id);
    try {
      await putInquiryAssigneeMutation.mutateAsync({
        team_id: Number(team_id),
        inquiry_id: Number(inquiry_id),
        data: { assignee_ids: assigneeIds },
      });
      handleCloseAssigneeModal();
    } catch (error) {
      console.error("담당자 수정 실패:", error);
    }
  };

  const handleStartAnswer = (commentToEdit?: Comment) => {
    if (commentToEdit) {
      setEditingComment(commentToEdit);
      setDraftContent(commentToEdit.content);
    } else {
      setEditingComment(null);
      setDraftContent(myComment?.content || "");
    }
    setShowEditor(true);
    setIsWritingAnswer(true); // 답변 작성 시작
    // 답변 작성을 시작할 때 내 탭으로 선택
    if (currentUserId) {
      setSelectedUserId(currentUserId);
    }
  };

  const handleSelectTab = (userId: number) => {
    setSelectedUserId(userId);
    if (userId === currentUserId) {
      // 내 탭을 클릭한 경우
      if (myComment) {
        // 내 답변이 있는 경우 - 에디터 숨김
        setShowEditor(false);
        setIsWritingAnswer(false);
      } else if (isWritingAnswer) {
        // 내 답변이 없고 답변 작성 중인 경우 - 에디터 표시
        setShowEditor(true);
      } else {
        // 내 답변이 없고 답변 작성 중이 아닌 경우 - 에디터 숨김
        setShowEditor(false);
        setIsWritingAnswer(false);
      }
    } else {
      // 다른 사람의 탭을 클릭한 경우 - 에디터 숨김
      setShowEditor(false);
      // isWritingAnswer는 유지 (다시 내 탭으로 돌아올 때를 위해)
    }
  };

  const onEditorSubmit = (content: string) => {
    if (content.trim().length === 0) {
      alert("답변 내용을 입력해주세요.");
      return;
    }
    setDraftContent(content);
    modals.openSubmitAnswerModal(!!editingComment);
  };

  const handleConfirm = () => modals.openConfirmInquiryModal();
  const handleDeleteInquiry = () => modals.openDeletePostModal();
  const handleNotify = () => modals.openSendNotificationModal();

  return {
    isLoading,
    isError,
    error,
    inquiryData,
    currentUserId,
    showEditor,
    tabsToDisplay,
    selectedUserId,
    selectedComment,
    myComment,
    draftContent,
    setDraftContent,
    editingComment,
    isWritingAnswer,
    notificationSent,
    remainingTime,
    isAssigneeModalOpen,
    selectedAssignees,
    setSelectedAssignees,
    handleOpenAssigneeModal,
    handleCloseAssigneeModal,
    handleUpdateAssignees,
    putInquiryAssigneeMutation,
    modalProps,
    closeModal: () => setModalProps(null),
    handleStartAnswer,
    handleSelectTab,
    onEditorSubmit,
    handleConfirm,
    handleDeleteInquiry,
    handleNotify,
    onDeleteAnswer,
  };
};
