import { useEffect, useState } from "react";

import AssigneeActions from "@/components/inquiry/detail/AssigneeActions";
import AssigneeSection from "@/components/inquiry/detail/AssigneeSection";
import InquiryContent from "@/components/inquiry/detail/InquiryContent";
import InquiryHeader from "@/components/inquiry/detail/InquiryHeader";
import NotificationButton from "@/components/inquiry/detail/NotificationButton";
import PendingActions from "@/components/inquiry/detail/PendingActions";
import { useInquiryManagementApi } from "@/hooks/inquiry/useInquiryManagementApi";
import { useInquiryState } from "@/hooks/useInquiryState";
import { InquiryCardProps } from "@/types/inquiryTypes";

const InquiryCard = ({
  inquiry,
  userRole = "default",
  currentUserId,
}: InquiryCardProps) => {
  useEffect(() => {
    console.log("InquiryCard가 받은 inquiry 객체:", inquiry);
    console.log(">>>> is_scraped 값:", inquiry?.is_scraped);
  }, [inquiry]);

  // const { team_id } = useParams<{ team_id: string; }>();
  const [isEditingAssignees, setIsEditingAssignees] = useState(false);

  // API 훅들
  const { putInquiryAssigneeMutation } = useInquiryManagementApi();

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

  /*
  // 담당자 수정 핸들러
  const handleUpdateAssignees = async (assigneeIds: number[]) => {
    if (!team_id) return;
    
    try {
      await putInquiryAssigneeMutation.mutateAsync({
        team_id: Number(team_id),
        inquiry_id: inquiry.inquiry_id,
        data: { assignee_ids: assigneeIds }
      });
      setIsEditingAssignees(false);
    } catch (error) {
      console.error('담당자 수정 실패:', error);
    }
  };
*/

  // 버튼 표시 여부 확인
  const showButtons =
    permissions.showAssigneeFeatures ||
    (isWriter && !["답변 완료", "등록 보류"].includes(finalStateLabel)) ||
    (isWriter && isPendingState);

  return (
    <div className="relative self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
      {/* 헤더 - 상태 및 액션 버튼 */}
      <InquiryHeader
        finalStateLabel={finalStateLabel}
        finalStatusConfig={finalStatusConfig}
        isWriter={isWriter}
        isAdmin={isAdmin}
        canSendNotification={canSendNotification}
        inquiry={inquiry}
      />

      {/* 본문 */}
      <InquiryContent
        title={inquiry.title}
        content={inquiry.content}
        author={inquiry.author}
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
        observers={inquiry.observers}
        confirmedAssignees={inquiry.confirmed_assignees}
        isPendingState={isPendingState}
        isAssigneeEditMode={isAssigneeEditMode}
        showAssigneeFeatures={permissions.showAssigneeFeatures}
      />

      {/* 담당자 수정은 별도 영역에서 처리 */}
      {permissions.showAssigneeFeatures && (
        <div className="w-full">
          <button
            onClick={() => setIsEditingAssignees(!isEditingAssignees)}
            disabled={putInquiryAssigneeMutation.isPending}
            className="text-body2 text-main hover:text-main/80 transition-colors disabled:opacity-50"
          >
            {putInquiryAssigneeMutation.isPending ? "수정중..." : "담당자 수정"}
          </button>
          {isEditingAssignees && (
            <div className="mt-4 p-4 border rounded-lg">
              <p className="text-body2 text-gray-60 mb-4">
                담당자 수정 기능은 구현 예정입니다.
              </p>
              <button
                onClick={() => setIsEditingAssignees(false)}
                className="text-body2 text-gray-50"
              >
                취소
              </button>
            </div>
          )}
        </div>
      )}

      {/* 버튼들 - 조건부 렌더링 */}
      {showButtons &&
        (permissions.showAssigneeFeatures ? (
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
              <PendingActions
                isWriter={isWriter}
                isPendingState={isPendingState}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default InquiryCard;
