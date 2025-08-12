import { useMemo, useState } from "react";

import AssigneeActions from "@/components/inquiry/detail/AssigneeActions";
import AssigneeSection from "@/components/inquiry/detail/AssigneeSection";
import InquiryContent from "@/components/inquiry/detail/InquiryContent";
import InquiryHeader from "@/components/inquiry/detail/InquiryHeader";
import NotificationButton from "@/components/inquiry/detail/NotificationButton";
import PendingActions from "@/components/inquiry/detail/PendingActions";
import { useInquiryManagementApi } from "@/hooks/inquiry/useInquiryManagementApi";
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
  const [hasAssigneeChanged, setHasAssigneeChanged] = useState(false); // 담당자 변경 여부를 별도로 추적

  const { useUsersQuery } = useTeamApi();
  const { data: usersData } = useUsersQuery();
  const allUsers: AssigneeUser[] = usersData?.result ?? [];

  // 새로운 API 훅 사용
  const { patchInquiryReassignMutation, patchInquiryReRegisterMutation } =
    useInquiryManagementApi();

  const {
    permissions,
    isWriter,
    isAdmin,
    finalStateLabel,
    finalStatusConfig,
    answersCount,
  } = useInquiryState(inquiry, userRole, currentUserId);

  // 등록 보류 상태 여부
  const isPendingState = finalStateLabel === "등록 보류";

  // 담당자 정렬 로직
  const sortedAssignees = useMemo(() => {
    if (!inquiry.assignees) return [];
    return [...inquiry.assignees].sort((a, b) => {
      return Number(b.is_checked) - Number(a.is_checked);
    });
  }, [inquiry.assignees]);

  // 담당자 변경 감지: 기존 담당자와 새 담당자 목록의 교집합이 없는지 확인
  const isAssigneeChanged = useMemo(() => {
    // 등록 보류 상태가 아니면 항상 false
    if (!isPendingState) return false;

    // 편집 완료 후에만 저장된 상태 사용 (편집 중에는 항상 false)
    if (isEditingAssignees) {
      return false;
    }

    // 편집 완료 후에만 저장된 상태 사용
    return hasAssigneeChanged;
  }, [isPendingState, isEditingAssignees, hasAssigneeChanged]);

  // 현재 유저 확인 상태 - currentUserId가 ProfileData 타입이므로 id 속성 사용
  const isCurrentUserConfirmed = !!inquiry.assignees.find(
    assignee => assignee.user_id === currentUserId?.id && assignee.is_checked
  );

  const showButtons =
    permissions.showAssigneeFeatures ||
    (isWriter && !["답변 완료", "등록 보류"].includes(finalStateLabel)) ||
    (isPendingState && isWriter); // 등록 보류 상태에서 문의자인 경우 버튼 표시

  // 담당자 수정 모드 시작 (모달에서 수정하기 클릭 시)
  const handleStartEditAssignees = () => {
    // 현재 값들로 임시 상태 초기화
    setTempAssigneeIds(inquiry.assignees.map(a => a.user_id));
    setTempObserverIds(inquiry.observers.map(o => o.userId));
    setIsEditingAssignees(true);
    setHasAssigneeChanged(false); // 편집 시작할 때 변경 상태 초기화
  };

  // 담당자/참조자 수정 완료 처리
  const handleCompleteEditAssignees = async () => {
    try {
      const originalAssigneeIds = inquiry.assignees.map(a => a.user_id);
      const originalObserverIds = inquiry.observers.map(o => o.userId);

      // 담당자 변경 여부 확인 및 저장
      const assigneeChanged =
        JSON.stringify(originalAssigneeIds.sort()) !==
        JSON.stringify(tempAssigneeIds.sort());
      if (assigneeChanged) {
        // 교집합 확인하여 실제 변경 조건에 맞는지 확인
        const hasIntersection = originalAssigneeIds.some(id =>
          tempAssigneeIds.includes(id)
        );
        const isValidChange = !hasIntersection && tempAssigneeIds.length > 0;
        setHasAssigneeChanged(isValidChange);
      }

      // 변경된 것만 API 호출
      const promises = [];

      // 등록 보류 상태이면서 문의자인 경우 새로운 API 사용
      if (isPendingState && isWriter) {
        // 담당자가 변경된 경우 - 새로운 reassign API 사용
        if (assigneeChanged) {
          promises.push(
            patchInquiryReassignMutation.mutateAsync({
              team_id: teamId,
              inquiry_id: inquiry.inquiry_id,
              data: { newAssignee_ids: tempAssigneeIds },
            })
          );
        }

        // 참조자가 변경된 경우 - 기존 API 사용
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
      } else {
        // 기존 로직 - 기존 API 사용
        // 담당자가 변경된 경우
        if (assigneeChanged) {
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
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      // 성공 시 편집 모드 종료
      setIsEditingAssignees(false);
      setTempAssigneeIds([]);
      setTempObserverIds([]);
      // hasAssigneeChanged는 유지하여 "문의 등록하기" 버튼 활성화 상태 보존
    } catch (error) {
      console.error("담당자/참조자 수정 실패:", error);
      // 에러 메시지 표시
      alert("담당자/참조자 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 등록 취소 처리 (문의글 삭제)
  const handleCancelRegistration = () => {
    handleDeleteInquiry();
  };

  // 문의 등록하기 처리
  const handleSubmitInquiry = async () => {
    try {
      await patchInquiryReRegisterMutation.mutateAsync({
        team_id: teamId,
        inquiry_id: inquiry.inquiry_id,
      });
      // 성공 시 변경 상태 초기화
      setHasAssigneeChanged(false);
    } catch (error) {
      console.error("문의 재등록 실패:", error);
      // 에러는 mutation에서 처리됨
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
        isPendingState={isPendingState} // 등록 보류 상태 전달
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
        currentUserId={currentUserId?.id} // ProfileData의 id 속성 사용
        isWriter={isWriter} // 문의자 여부 전달
      />
      {showButtons &&
        (isPendingState && isWriter ? (
          // 등록 보류 상태에서 문의자인 경우
          <AssigneeActions
            showAssigneeFeatures={false} // 기존 담당자 기능은 비활성화
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
            // 등록 보류 상태 관련 props
            isPendingState={isPendingState}
            isWriter={isWriter}
            isAssigneeChanged={isAssigneeChanged}
            onCancelRegistration={handleCancelRegistration}
            onSubmitInquiry={handleSubmitInquiry}
          />
        ) : permissions.showAssigneeFeatures ? (
          // 기존 담당자 기능
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
          // 문의자 알림 버튼
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
