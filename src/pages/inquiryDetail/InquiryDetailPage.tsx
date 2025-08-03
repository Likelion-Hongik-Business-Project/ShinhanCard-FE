import AdditionalInquirySection from "@/components/AdditionalInquiry/AdditionalInquirySection";
import AnswerSection from "@/components/inquiry/detail/answer/AnswerSection";
import AssigneeActions from "@/components/inquiry/detail/AssigneeActions";
import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import NotificationButton from "@/components/inquiry/detail/NotificationButton";
import PendingActions from "@/components/inquiry/detail/PendingActions";
import { useAnswerHandler } from "@/hooks/useAnswerHandler";
import { useInquiryData } from "@/hooks/useInquiryData";
import { useInquiryState } from "@/hooks/useInquiryState";
import { mockInquiryResponse } from "@/mocks/mockInquiryResponse";

const InquiryDetailPage = () => {
  // inquiryId를 기반으로 문의 데이터와 사용자 정보를 가져오는 커스텀 훅
  const { inquiry, userRole, currentUserId } = useInquiryData();

  // 상태 정보, 권한 계산 커스텀 훅
  const state = useInquiryState(inquiry!, userRole, currentUserId);
  const isAssignee =
    inquiry?.assignees.some(a => a.user_id === currentUserId) ?? false;
  const isAnswerable = state.canAnswer && isAssignee;

  // 답변 관련 상태, 핸들러 커스텀 훅
  const answerHandler = useAnswerHandler({
    inquiry,
    currentUserId,
    isAnswerable,
  });

  if (!inquiry) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto w-full">
          <Header />
          <div className="mt-8 rounded-2xl bg-white p-16 text-center">
            <h2 className="text-xl text-gray-80">문의를 찾을 수 없습니다.</h2>
          </div>
        </div>
      </div>
    );
  }

  // 버튼 영역 표시 여부 결정
  const showButtons =
    state.permissions.showAssigneeFeatures ||
    (state.isWriter &&
      !["답변 완료", "등록 보류"].includes(state.finalStateLabel)) ||
    (state.isWriter && state.isPendingState);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full flex-col gap-[56px]">
        <div>
          {/* 헤더 */}
          <Header isAdmin={userRole === "admin"} />
        </div>

        {/* 문의글*/}
        <div className="self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
          <InquiryCard
            inquiry={inquiry}
            userRole={userRole}
            currentUserId={currentUserId}
          />

          {/* 답변 담당자 버튼, 알림 버튼, 등록보류 버튼 */}
          {showButtons &&
            (state.permissions.showAssigneeFeatures ? (
              <div className="w-full">
                <AssigneeActions
                  showAssigneeFeatures={state.permissions.showAssigneeFeatures}
                  onStartAnswer={answerHandler.handleStartAnswer}
                />
              </div>
            ) : (
              <div className="w-full flex justify-between items-center">
                <div className="flex justify-start">
                  <NotificationButton
                    isWriter={state.isWriter}
                    notificationSent={state.notificationSent}
                    remainingTime={state.remainingTime}
                    finalStateLabel={state.finalStateLabel}
                  />
                </div>
                <div className="flex justify-end">
                  <PendingActions
                    isWriter={state.isWriter}
                    isPendingState={state.isPendingState}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* 답변 섹션 */}
        <AnswerSection
          inquiry={inquiry}
          currentUserId={currentUserId}
          {...answerHandler}
        />

        <AdditionalInquirySection inquiry={mockInquiryResponse} />
      </div>
    </div>
  );
};

export default InquiryDetailPage;
