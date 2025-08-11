import { useParams } from "react-router-dom";

import AdditionalInquirySection from "@/components/AdditionalInquiry/AdditionalInquirySection";
import Modal from "@/components/common/Modal";
import AnswerSection from "@/components/inquiry/detail/answer/AnswerSection";
import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import { useInquiryDetail } from "@/hooks/useInquiryDetail";
import { mockInquiryResponse } from "@/mocks/mockInquiryResponse";
import type { UserRole } from "@/types/inquiryTypes";

const InquiryDetailPage = () => {
  const { team_id } = useParams<{
    team_id: string;
  }>();

  // 새로 만든 훅을 호출하여 모든 로직과 상태를 가져옴
  const {
    isLoading,
    isError,
    inquiryData,
    currentUserId,
    showEditor,
    tabsToDisplay,
    selectedUserId,
    selectedComment,
    myComment,
    draftContent,
    setDraftContent,
    editingComment,
    isWritingAnswer,
    notificationSent,
    remainingTime,
    handleStartAnswer,
    handleSelectTab,
    onEditorSubmit,
    handleConfirm,
    handleDeleteInquiry,
    handleNotify,
    modalProps,
    closeModal,
    onDeleteAnswer,
    selectedFileIds,
    setSelectedFileIds,
    isEditMode,
    onToggleNotification,
  } = useInquiryDetail();

  // 조건부 렌더링
  const defaultTeamInfo = {
    group_name: " ",
    division_name: " ",
    team_name: "문의 상세 정보",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto w-full">
          <Header teamInfo={defaultTeamInfo} onDelete={handleDeleteInquiry} />
          <div className="mt-8 rounded-2xl bg-white p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-main border-t-transparent"></div>
              <h2 className="text-xl text-gray-80">
                데이터를 불러오는 중입니다...
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !inquiryData) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto w-full">
          <Header teamInfo={defaultTeamInfo} onDelete={handleDeleteInquiry} />
          <div className="mt-8 rounded-2xl bg-white p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-80 mb-2">
                  문의를 찾을 수 없습니다
                </h2>
                <p className="text-gray-60">
                  요청하신 문의글을 불러올 수 없습니다. 잠시 후 다시
                  시도해주세요.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-main px-4 py-2 text-white hover:bg-main/90 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 최종 렌더링
  const teamInfoForHeader = {
    group_name: inquiryData.group.group_name,
    division_name: inquiryData.division.division_name,
    team_name: inquiryData.team.team_name,
  };

  const userRole = (inquiryData.role?.toLowerCase() || "default") as UserRole;
  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen bg-gray-5">
      <div className=" flex w-full max-w-[1440px] min-w-[1120px] flex-col gap-14 py-8">
        <div className="flex flex-col gap-10">
          <Header
            isAdmin={isAdmin}
            teamInfo={teamInfoForHeader}
            onDelete={handleDeleteInquiry}
          />
          <InquiryCard
            inquiry={inquiryData}
            teamId={Number(team_id)}
            userRole={userRole}
            currentUserId={currentUserId}
            handleStartAnswer={handleStartAnswer}
            onConfirm={handleConfirm}
            handleDeleteInquiry={handleDeleteInquiry}
            handleNotify={handleNotify}
            notificationSent={notificationSent}
            remainingTime={remainingTime}
            showEditor={showEditor}
            myComment={myComment}
            onToggleNotification={onToggleNotification}
          />
        </div>
        <AnswerSection
          inquiry={inquiryData}
          currentUserId={currentUserId}
          showEditor={showEditor}
          tabsToDisplay={tabsToDisplay}
          selectedUserId={selectedUserId}
          selectedComment={selectedComment}
          draftContent={draftContent}
          setDraftContent={setDraftContent}
          handleStartAnswer={handleStartAnswer}
          handleSelectTab={handleSelectTab}
          onEditorSubmit={onEditorSubmit}
          editingComment={editingComment}
          isWritingAnswer={isWritingAnswer}
          onDeleteAnswer={onDeleteAnswer}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
          isEditMode={isEditMode}
        />
        <AdditionalInquirySection inquiry={mockInquiryResponse} />
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
