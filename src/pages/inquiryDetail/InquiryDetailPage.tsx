// src/pages/inquiryDetail/InquiryDetailPage.tsx
import { useParams } from "react-router-dom";

import AdditionalInquirySection from "@/components/AdditionalInquiry/AdditionalInquirySection";
import AnswerSection from "@/components/inquiry/detail/answer/AnswerSection";
import Header from "@/components/inquiry/detail/Header";
import InquiryCard from "@/components/inquiry/detail/InquiryCard";
import { useGetTeamInquiryDetail } from "@/hooks/inquiry/useInquiryApi";
import { mockInquiryResponse } from "@/mocks/mockInquiryResponse";

const InquiryDetailPage = () => {
  const { team_id, inquiry_id } = useParams<{
    team_id: string;
    inquiry_id: string;
  }>();

  const {
    data: inquiryResponse,
    isLoading,
    isError,
    error,
  } = useGetTeamInquiryDetail(Number(team_id), Number(inquiry_id));

  // 로딩 및 에러 상태에서 사용할 기본 팀 정보
  const defaultTeamInfo = {
    group_name: " ",
    division_name: " ",
    team_name: "문의 상세 정보",
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto w-full">
          <Header teamInfo={defaultTeamInfo} />
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

  // 에러 상태
  if (isError || !inquiryResponse?.result) {
    if (isError) {
      console.error("문의 상세 정보 로딩 실패:", error);
    }
    return (
      <div className="min-h-screen">
        <div className="mx-auto w-full">
          <Header teamInfo={defaultTeamInfo} />
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

  // 데이터 로딩 성공 후
  const inquiry = inquiryResponse.result;

  // Header에 전달할 팀 정보 객체 생성
  const teamInfoForHeader = {
    group_name: inquiry.group.groupName,
    division_name: inquiry.division.divisionName,
    team_name: inquiry.team.teamName,
  };

  // 권한 확인 - 기존 mock 데이터 구조 사용
  const isAdmin = inquiry.test_user_role === "admin";
  const currentUserId = inquiry.test_current_user_id;

  return (
    <div className="min-h-screen bg-gray-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-8">
        <div className="flex flex-col gap-10">
          {/* 헤더 */}
          <Header isAdmin={isAdmin} teamInfo={teamInfoForHeader} />

          {/* 문의글 카드 */}
          <InquiryCard
            inquiry={inquiry}
            userRole={inquiry.test_user_role}
            currentUserId={currentUserId}
          />
        </div>

        {/* 답변 섹션 */}
        <AnswerSection
          inquiry_id={inquiry.inquiry_id}
          team_id={Number(team_id)}
          comments={inquiry.answers.answers}
          currentUserId={currentUserId}
          canAnswer={inquiry.can_answer || isAdmin}
        />

        {/* 추가문의 섹션 */}
        <AdditionalInquirySection inquiry={mockInquiryResponse} />
      </div>
    </div>
  );
};

export default InquiryDetailPage;
