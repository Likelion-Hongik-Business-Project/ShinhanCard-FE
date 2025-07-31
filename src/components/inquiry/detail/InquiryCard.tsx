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

  // 버튼 표시 여부 확인
  const showButtons = permissions.showAssigneeFeatures || 
                     (isWriter && !["답변 완료", "등록 보류"].includes(finalStateLabel)) ||
                     (isWriter && isPendingState);

  return (
    <div className={`self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start ${showButtons ? 'gap-[32px]' : 'gap-[32px]'}`}>
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
        content={inquiry.content}
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

      {/* 버튼들 - 조건부 렌더링 */}
      {showButtons && (
        permissions.showAssigneeFeatures ? (
          <AssigneeActions
            showAssigneeFeatures={permissions.showAssigneeFeatures}
          />
        ) : (
          <div className="w-full flex justify-between items-center">
            {/* 문의자용 담당자 알림 발송 버튼 */}
            <div className="flex justify-start">
              <NotificationButton
                isWriter={isWriter}
                notificationSent={notificationSent}
                remainingTime={remainingTime}
                finalStateLabel={finalStateLabel}
              />
            </div>

            {/* 문의자 등록 보류 상태 버튼들 */}
            <div className="flex justify-end">
              <PendingActions isWriter={isWriter} isPendingState={isPendingState} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default InquiryCard;