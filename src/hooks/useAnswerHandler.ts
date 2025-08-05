import { useEffect, useState } from "react";

import type { Answerer, InquiryData } from "@/types/inquiryTypes";

interface UseAnswerHandlerProps {
  inquiry: InquiryData | undefined;
  currentUserId: number;
  isAnswerable: boolean;
}

// 문의 상세 페이지의 답변 섹션 상태와 핸들러를 관리하는 훅
export const useAnswerHandler = ({
  inquiry,
  currentUserId,
  isAnswerable,
}: UseAnswerHandlerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [draftContent, setDraftContent] = useState("");

  const myComment = inquiry?.comments.find(
    c => c.writer.user_id === currentUserId
  );

  // inquiry 데이터가 로드되거나 변경될 때 첫 번째 답변을 기본으로 선택
  useEffect(() => {
    if (inquiry && inquiry.comments.length > 0) {
      setSelectedUserId(inquiry.comments[0].writer.user_id);
    } else {
      setSelectedUserId(null);
    }
  }, [inquiry]);

  // 답변 작성 시작 핸들러
  const handleStartAnswer = () => {
    if (!isAnswerable) return;
    const initialContent = myComment ? myComment.content : draftContent;
    setDraftContent(initialContent);
    setSelectedUserId(currentUserId);
    setIsEditing(true);
    setIsReplying(true);
  };

  // 탭 선택 핸들러
  const handleSelectTab = (userId: number) => {
    setSelectedUserId(userId);
    if (userId === currentUserId && isAnswerable) {
      if (myComment) setDraftContent(myComment.content);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  // 답변 제출 핸들러
  const handleSubmit = (content: string) => {
    console.log("Submitted content:", content);
    setDraftContent("");
    setIsEditing(false);
    setIsReplying(false);
  };

  // inquiry 데이터가 없으면 훅의 나머지 부분이 실행되지 않도록 기본 상태를 반환
  if (!inquiry) {
    return {
      isEditing: false,
      selectedUserId: null,
      draftContent: "",
      tabsToDisplay: [],
      selectedComment: undefined,
      showEditor: false,
      myComment: undefined,
      setDraftContent,
      handleStartAnswer,
      handleSelectTab,
      handleSubmit,
    };
  }

  // 표시할 탭 목록을 계산하는 함수
  const getTabsToDisplay = (): Answerer[] => {
    const commenters = inquiry.comments.map(comment => comment.writer);
    const tabs = commenters.reduce((acc, current) => {
      if (!acc.some(item => item.user_id === current.user_id))
        acc.push(current);
      return acc;
    }, [] as Answerer[]);

    const isCurrentUserInTabs = tabs.some(tab => tab.user_id === currentUserId);
    if (isReplying && isAnswerable && !isCurrentUserInTabs) {
      const currentUserInfo = inquiry.assignees.find(
        a => a.user_id === currentUserId
      );
      if (currentUserInfo) tabs.push(currentUserInfo);
    }
    return tabs;
  };

  const tabsToDisplay = getTabsToDisplay();
  const selectedComment = inquiry.comments.find(
    c => c.writer.user_id === selectedUserId
  );
  const showEditor = isEditing && selectedUserId === currentUserId;

  return {
    isEditing,
    selectedUserId,
    draftContent,
    tabsToDisplay,
    selectedComment,
    showEditor,
    myComment,
    setDraftContent,
    handleStartAnswer,
    handleSelectTab,
    handleSubmit,
  };
};
