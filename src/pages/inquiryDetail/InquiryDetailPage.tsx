import Modal from "@/components/common/Modal";
import FollowupSection from "@/components/Followup/FollowupSection";
import AnswerSection from "@/components/inquiry/detail/answer/AnswerSection";
import AssigneeActions from "@/components/inquiry/detail/AssigneeActions";
import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import NotificationButton from "@/components/inquiry/detail/NotificationButton";
import PendingActions from "@/components/inquiry/detail/PendingActions";
import { useInquiryPageHandler } from "@/hooks/inquiry/detail/useInquiryDetailPageHandler";
import { mockInquiryResponse } from "@/mocks/mockInquiryResponse";

const InquiryDetailPage = () => {
  const {
    inquiry,
    userRole,
    currentUserId,
    state,
    answerHandler,
    modals,
    modalProps,
    confirmedUsers,
    handleEditorSubmit,
    closeModal,
  } = useInquiryPageHandler();

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

  const showButtons =
    state.permissions.showAssigneeFeatures ||
    (state.isWriter &&
      !["답변 완료", "등록 보류"].includes(state.finalStateLabel)) ||
    (state.isWriter && state.isPendingState);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full flex-col gap-[56px]">
        <div>
          <Header
            isAdmin={userRole === "admin"}
            onDelete={modals.openDeletePostModal}
          />
        </div>

        <div className="self-stretch p-[64px] bg-white rounded-[15px] flex flex-col justify-start items-start gap-[32px]">
          <InquiryCard
            inquiry={inquiry}
            userRole={userRole}
            currentUserId={currentUserId}
            confirmedUsers={confirmedUsers}
          />

          {showButtons &&
            (state.permissions.showAssigneeFeatures ? (
              <div className="w-full">
                <AssigneeActions
                  showAssigneeFeatures={state.permissions.showAssigneeFeatures}
                  onStartAnswer={answerHandler.handleStartAnswer}
                  onConfirm={modals.openConfirmInquiryModal}
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
                    onSend={modals.openSendNotificationModal}
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

        <AnswerSection
          inquiry={inquiry}
          currentUserId={currentUserId}
          {...answerHandler}
          onEditorSubmit={handleEditorSubmit}
        />

        <FollowupSection inquiry={mockInquiryResponse} />
      </div>

      {modalProps && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalProps.title}
          description={modalProps.description}
          buttons={modalProps.buttons}
        />
      )}
    </div>
  );
};

export default InquiryDetailPage;
