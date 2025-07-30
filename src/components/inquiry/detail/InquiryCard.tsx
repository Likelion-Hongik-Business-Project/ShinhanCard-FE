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
  userRole = "default",
  currentUserId,
}: InquiryCardProps) => {
  const {
    isAssigneeEditMode,
    notificationSent,
    canSendNotification,
    remainingTime,
    permissions,
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    isPendingState,
    answersCount,
  } = useInquiryState(inquiry, userRole, currentUserId);

  return (
    <div className="self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
      {/* 헤더 - 상태 및 액션 버튼 */}
      <InquiryHeader
        finalStateLabel={finalStateLabel}
        finalStatusConfig={finalStatusConfig}
        isWriter={isWriter}
        isAdmin={isAdmin}
        canSendNotification={canSendNotification}
      />

      {/* 본문 */}
      <InquiryContent
        title={inquiry.title}
        content={inquiry.content_preview}
        writer={inquiry.writer}
        createdAt={inquiry.created_at}
        isWriter={isWriter}
        isAdmin={isAdmin}
        answersCount={answersCount}
      />

      {/* 구분선 */}
      <div className="self-stretch h-0 border-t border-gray-10"></div>

      {/* 담당자 정보 */}
      <AssigneeSection
        assignees={inquiry.assignees}
        references={inquiry.references}
        confirmedAssignees={inquiry.confirmed_assignees}
        isPendingState={isPendingState}
        isAssigneeEditMode={isAssigneeEditMode}
        showAssigneeFeatures={permissions.showAssigneeFeatures}
      />

      <div className="self-stretch flex justify-between items-center">
        {/* 문의자용 담당자 알림 발송 버튼 */}
        <NotificationButton
          isWriter={isWriter}
          notificationSent={notificationSent}
          remainingTime={remainingTime}
        />

        {/* 문의자 등록 보류 상태 버튼들 */}
        <PendingActions isWriter={isWriter} isPendingState={isPendingState} />
      </div>

      {/* 담당자용 액션 버튼들 */}
      <AssigneeActions
        showAssigneeFeatures={permissions.showAssigneeFeatures}
      />
    </div>
  );
};

export default InquiryCard;
