import AssigneeSection from "@/components/inquiry/detail/AssigneeSection";
import InquiryContent from "@/components/inquiry/detail/InquiryContent";
import InquiryHeader from "@/components/inquiry/detail/InquiryHeader";
import { useInquiryState } from "@/hooks/useInquiryState";
import { InquiryCardProps } from "@/types/inquiryTypes";

const InquiryCard = ({
  inquiry,
  userRole = "default",
  currentUserId,
  confirmedUsers,
}: InquiryCardProps) => {
  const {
    isAssigneeEditMode,
    permissions,
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    isPendingState,
    answersCount,
  } = useInquiryState(inquiry, userRole, currentUserId);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-[32px]">
      {/* 헤더 - 상태 및 액션 버튼 */}
      <InquiryHeader
        finalStateLabel={finalStateLabel}
        finalStatusConfig={finalStatusConfig}
        isWriter={isWriter}
        isAdmin={isAdmin}
        canSendNotification={inquiry.can_notify}
        isScrapped={inquiry.is_scrapped}
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
      <div className="self-stretch h-0 border-t border-gray-10" />

      {/* 담당자 정보 */}
      <AssigneeSection
        assignees={inquiry.assignees}
        references={inquiry.references}
        confirmedAssignees={inquiry.confirmed_assignees}
        isPendingState={isPendingState}
        isAssigneeEditMode={isAssigneeEditMode}
        showAssigneeFeatures={permissions.showAssigneeFeatures}
        confirmedUsers={confirmedUsers}
      />
    </div>
  );
};

export default InquiryCard;
