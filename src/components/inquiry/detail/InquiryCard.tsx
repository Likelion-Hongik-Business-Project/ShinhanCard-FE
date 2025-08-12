import { useMemo, useState } from "react";

import AssigneeActions from "@/components/inquiry/detail/AssigneeActions";
import AssigneeSection from "@/components/inquiry/detail/AssigneeSection";
import InquiryContent from "@/components/inquiry/detail/InquiryContent";
import InquiryHeader from "@/components/inquiry/detail/InquiryHeader";
import NotificationButton from "@/components/inquiry/detail/NotificationButton";
import PendingActions from "@/components/inquiry/detail/PendingActions";
import { useTeamApi } from "@/hooks/team/useTeamApi";
import { useInquiryState } from "@/hooks/useInquiryState";
import { InquiryCardProps } from "@/types/inquiryTypes";
import { AssigneeUser } from "@/types/team/user.type";

import {
  putInquiryAssignee,
  putInquiryObserver,
} from "@/apis/inquiry/detail/inquiryManagementApi";

const InquiryCard = ({
  inquiry,
  teamId,
  userRole = "default",
  currentUserId,
  handleStartAnswer,
  onConfirm,
  handleDeleteInquiry,
  handleNotify,
  onToggleNotification,
  notificationSent,
  remainingTime,
  showEditor,
  myComment,
}: InquiryCardProps) => {
  const [isEditingAssignees, setIsEditingAssignees] = useState(false);
  const [tempAssigneeIds, setTempAssigneeIds] = useState<number[]>([]);
  const [tempObserverIds, setTempObserverIds] = useState<number[]>([]);

  const { useUsersQuery } = useTeamApi();
  const { data: usersData } = useUsersQuery();
  const allUsers: AssigneeUser[] = usersData?.result ?? [];

  const {
    permissions,
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    answersCount,
  } = useInquiryState(inquiry, userRole, currentUserId);

  // 담당자 정렬 로직
  const sortedAssignees = useMemo(() => {
    if (!inquiry.assignees) return [];
    return [...inquiry.assignees].sort((a, b) => {
      return Number(b.is_checked) - Number(a.is_checked);
    });
  }, [inquiry.assignees]);

  // 현재 유저 확인 상태
  const isCurrentUserConfirmed = !!inquiry.assignees.find(
    assignee => assignee.user_id === currentUserId && assignee.is_checked
  );

  const showButtons =
    permissions.showAssigneeFeatures ||
    (isWriter && !["답변 완료", "등록 보류"].includes(finalStateLabel));

  // 담당자 수정 모드 시작 (모달에서 수정하기 클릭 시)
  const handleStartEditAssignees = () => {
    // 현재 값들로 임시 상태 초기화
    setTempAssigneeIds(inquiry.assignees.map(a => a.user_id));
    setTempObserverIds(inquiry.observers.map(o => o.userId));
    setIsEditingAssignees(true);
  };

  // 담당자/참조자 수정 완료 처리
  const handleCompleteEditAssignees = async () => {
    try {
      const originalAssigneeIds = inquiry.assignees.map(a => a.user_id);
      const originalObserverIds = inquiry.observers.map(o => o.userId);

      // 변경된 것만 API 호출
      const promises = [];

      // 담당자가 변경된 경우
      if (
        JSON.stringify(originalAssigneeIds.sort()) !==
        JSON.stringify(tempAssigneeIds.sort())
      ) {
        promises.push(
          putInquiryAssignee(teamId, inquiry.inquiry_id, {
            newAssignee_ids: tempAssigneeIds,
          })
        );
      }

      // 참조자가 변경된 경우
      if (
        JSON.stringify(originalObserverIds.sort()) !==
        JSON.stringify(tempObserverIds.sort())
      ) {
        promises.push(
          putInquiryObserver(teamId, inquiry.inquiry_id, {
            newObserver_ids: tempObserverIds,
          })
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      // 성공 시 편집 모드 종료
      setIsEditingAssignees(false);
      setTempAssigneeIds([]);
      setTempObserverIds([]);

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("담당자/참조자 수정 실패:", error);
    }
  };

  return (
    <div className="relative self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
      <InquiryHeader
        finalStateLabel={finalStateLabel}
        finalStatusConfig={finalStatusConfig}
        inquiry={inquiry}
        onToggleNotification={onToggleNotification}
      />
      <InquiryContent
        title={inquiry.title}
        content={inquiry.content}
        author={inquiry.author}
        inquiryId={inquiry.inquiry_id}
        files={inquiry.files}
        teamId={teamId}
        createdAt={inquiry.created_at}
        isWriter={isWriter}
        isAdmin={isAdmin}
        answersCount={answersCount}
        onDelete={handleDeleteInquiry}
      />
      <div className="self-stretch h-0 border-t border-gray-10" />
      <AssigneeSection
        assignees={sortedAssignees}
        observers={inquiry.observers}
        isPendingState={finalStateLabel === "등록 보류"}
        isEditingAssignees={isEditingAssignees}
        allUsers={allUsers}
        onAssigneeChange={setTempAssigneeIds}
        onObserverChange={setTempObserverIds}
        tempAssigneeIds={tempAssigneeIds}
        tempObserverIds={tempObserverIds}
        currentUserId={currentUserId}
      />
      {showButtons &&
        (permissions.showAssigneeFeatures ? (
          <AssigneeActions
            showAssigneeFeatures={permissions.showAssigneeFeatures}
            onStartAnswer={handleStartAnswer}
            onConfirm={onConfirm}
            isCurrentUserConfirmed={isCurrentUserConfirmed}
            showEditor={showEditor}
            hasMyComment={!!myComment}
            inquiryId={inquiry.inquiry_id}
            teamId={teamId}
            isEditingAssignees={isEditingAssignees}
            onStartEditAssignees={handleStartEditAssignees}
            onCompleteEditAssignees={handleCompleteEditAssignees}
          />
        ) : (
          <div className="w-full flex justify-between items-center">
            <div className="flex justify-start">
              <NotificationButton
                isWriter={isWriter}
                notificationSent={notificationSent}
                remainingTime={remainingTime}
                finalStateLabel={finalStateLabel}
                onSend={handleNotify}
              />
            </div>
            <div className="flex justify-end">
              <PendingActions
                isWriter={isWriter}
                isPendingState={finalStateLabel === "등록 보류"}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default InquiryCard;
