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
import { formatRemain, parseUtc } from "@/utils/dateUtils";
import type { Comment, User } from "@/types/inquiryTypes";
import type { ModalProps } from "@/types/modal";

import { useInquiryModals } from "./useInquiryModals";

const NOTIFICATION_COOLDOWN = 4 * 60 * 60 * 1000;

const dedupValidIds = (ids: Array<number | null | undefined>) =>
  Array.from(
    new Set(
      (ids ?? [])
        .map(n => (typeof n === "string" ? Number(n) : (n as number)))
        .filter(n => Number.isFinite(n) && (n as number) > 0) as number[]
    )
  );

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
  const {
    postInquiryNotifyMutation,
    putInquiryAssigneeMutation,
    putInquiryNotificationMutation,
  } = useInquiryManagementApi();
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
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
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
    // 404면 쿨다운 없음
    if (
      isMailTimeError &&
      mailTimeError instanceof AxiosError &&
      mailTimeError.response?.status === 404
    ) {
      setNotificationSent(false);
      setRemainingTime("");
      return;
    }

    const lastSent = lastSentTimeResponse?.result?.lastSentTime ?? null;
    const base = parseUtc(lastSent);

    const tick = () => {
      if (!base) {
        setNotificationSent(false);
        setRemainingTime("");
        return;
      }
      const diff = Date.now() - +base; // 경과
      const remain = NOTIFICATION_COOLDOWN - diff;
      if (remain <= 0) {
        setNotificationSent(false);
        setRemainingTime("");
      } else {
        setNotificationSent(true);
        setRemainingTime(formatRemain(remain));
      }
    };

    tick();

    const id = window.setInterval(tick, 1000);

    // 탭 복귀 시 보정
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
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

    // dedup + 정렬(서버에서 순서 민감하지 않더라도 안정성↑)
    const safeIds = dedupValidIds(selectedFileIds).sort((a, b) => a - b);

    try {
      if (editingComment) {
        await putAnswerMutation.mutateAsync({
          answer_id: editingComment.answer_id,
          data: {
            content: draftContent,
            file_ids: safeIds, // ✅ 항상 전체 목록 전달
          },
        });

        setSelectedUserId(editingComment.user.user_id);
      } else {
        await postAnswerMutation.mutateAsync({
          inquiry_id: Number(inquiry_id),
          data: {
            content: draftContent,
            file_ids: safeIds, // ✅ 새 등록도 현재 선택 전체
          },
        });

        if (currentUserId) {
          setTimeout(() => setSelectedUserId(currentUserId), 200);
        }
      }

      // 완료 후 초기화
      setEditingComment(null);
      setDraftContent("");
      setShowEditor(false);
      setIsWritingAnswer(false);
      setSelectedFileIds([]);
    } catch (error) {
      console.error("답변 처리 실패:", error);
    }
  };

  const onSendNotification = async () => {
    // UX 즉시 반응: 4시간 쿨다운 시작
    setNotificationSent(true);
    setRemainingTime(formatRemain(NOTIFICATION_COOLDOWN));

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

      // 답변 삭제 성공 후 처리
      if (selectedComment?.answer_id === answerId) {
        setTimeout(() => {
          const remainingAnswers = inquiryData?.answers.answers.filter(
            answer => answer.answer_id !== answerId
          );

          if (remainingAnswers && remainingAnswers.length > 0) {
            setSelectedUserId(remainingAnswers[0].user.user_id);
          } else {
            setSelectedUserId(null);
          }
        }, 100);
      }

      // 내 답변이 삭제된 경우 편집 상태/파일 선택 초기화
      if (selectedComment?.user.user_id === currentUserId) {
        setShowEditor(false);
        setIsWritingAnswer(false);
        setEditingComment(null);
        setDraftContent("");
        setSelectedFileIds([]); // ✅ 초기화
      }
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
      navigate(-1);
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
        data: { newAssignee_ids: assigneeIds },
      });
      handleCloseAssigneeModal();
    } catch (error) {
      console.error("담당자 수정 실패:", error);
    }
  };

  const handleStartAnswer = (commentToEdit?: Comment) => {
    if (commentToEdit) {
      setEditingComment(commentToEdit);
      setDraftContent(commentToEdit.content ?? "");
      const fileIds = (commentToEdit.files ?? []).map(f => f.file_id);
      setSelectedFileIds(dedupValidIds(fileIds)); // ✅ 기존 파일 로드
    } else {
      setEditingComment(null);
      setDraftContent(myComment?.content || "");
      setSelectedFileIds([]); // ✅ 새 답변 시작 시 초기화
    }
    setShowEditor(true);
    setIsWritingAnswer(true);
    if (currentUserId) {
      setSelectedUserId(currentUserId);
    }
  };

  const handleSelectTab = (userId: number) => {
    setSelectedUserId(userId);

    if (userId === currentUserId) {
      if (isWritingAnswer || editingComment) {
        setShowEditor(true);
      } else if (myComment) {
        setShowEditor(false);
      } else {
        setShowEditor(false);
      }
    } else {
      setShowEditor(false);
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

  // 개인 알림 설정 토글 함수
  const onToggleNotification = async () => {
    if (!inquiryData) return;

    try {
      const newNotificationState = !inquiryData.is_notification_enabled;

      await putInquiryNotificationMutation.mutateAsync({
        team_id: Number(team_id),
        inquiry_id: Number(inquiry_id),
        is_notification_enabled: newNotificationState,
      });
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);
    }
  };

  return {
    isLoading,
    isError,
    error,
    inquiryData,
    currentUserId,
    myProfile: myProfileResponse?.result,
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
    selectedFileIds,
    setSelectedFileIds,
    isEditMode: !!editingComment,
    onToggleNotification,
  };
};
