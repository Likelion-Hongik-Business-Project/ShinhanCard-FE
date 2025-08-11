import { useMemo } from "react";

import AssigneeActions from "@/components/inquiry/detail/AssigneeActions";
import AssigneeSection from "@/components/inquiry/detail/AssigneeSection";
import InquiryContent from "@/components/inquiry/detail/InquiryContent";
import InquiryHeader from "@/components/inquiry/detail/InquiryHeader";
import NotificationButton from "@/components/inquiry/detail/NotificationButton";
import PendingActions from "@/components/inquiry/detail/PendingActions";
import { useInquiryState } from "@/hooks/useInquiryState";
import { InquiryCardProps } from "@/types/inquiryTypes";

const InquiryCard = ({
  inquiry,
  teamId,
  userRole = "default",
  currentUserId,
  handleStartAnswer,
  onConfirm,
  handleDeleteInquiry,
  handleNotify,
  notificationSent,
  remainingTime,
  showEditor,
  myComment,
}: InquiryCardProps) => {
  const {
    permissions,
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    answersCount,
    canSendNotification,
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

  return (
    <div className="relative self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
      <InquiryHeader
        finalStateLabel={finalStateLabel}
        finalStatusConfig={finalStatusConfig}
        isWriter={isWriter}
        isAdmin={isAdmin}
        canSendNotification={canSendNotification}
        inquiry={inquiry}
      />
      <InquiryContent
        title={inquiry.title}
        content={inquiry.content}
        author={inquiry.author}
        inquiryId={inquiry.inquiry_id}
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
