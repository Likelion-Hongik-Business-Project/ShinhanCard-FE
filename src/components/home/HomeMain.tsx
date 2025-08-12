import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Heart from "@/assets/svgs/common/heart.svg";
import { Message, Pencil } from "@/assets/svgs/layout";
import HomeButton from "@/components/home/HomeButton";
import HomeMember from "@/components/home/HomeMember";
import InquiryList from "@/components/inquiry/list/InquiryList";
import TeamTabs from "@/components/inquiry/list/TeamTabs";
import {
  useUncheckedAnswer,
  useUncheckedInquiries,
} from "@/hooks/home/useHomeApi";
import { useInterestedMembers } from "@/hooks/home/useHomeMemberApi";
import { getInquiryStatusLabel } from "@/utils/inquiryStatus";
import { GetHomeInitialResponse } from "@/types/home/homeApi.type";
import {
  InquiryListItem,
  InquiryServerStatus,
  Profile,
  YearMonth,
} from "@/types/inquiry/inquiryListApi.type";

type Props = {
  answerCount: number;
  inquiryCount: number;
  interestCount: number;
  homeInitialData?: GetHomeInitialResponse;
};

const HomeMain = ({
  answerCount,
  inquiryCount,
  interestCount,
  homeInitialData,
}: Props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("answer");
  const [isHovered, setIsHovered] = useState(false);

  // 팀/필터 관련 상태
  const [selectedTeamId, setSelectedTeamId] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedDate, setSelectedDate] = useState<YearMonth[]>([]);

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 2번, 3번 API 훅
  const { data: uncheckedAnswerData } = useUncheckedAnswer(
    activeTab === "answer" ? selectedTeamId : 0,
    activeTab === "answer" ? currentPage : 1
  );
  const { data: uncheckedInquiriesData } = useUncheckedInquiries(
    activeTab === "inquiry" ? selectedTeamId : 0,
    activeTab === "inquiry" ? currentPage : 1
  );

  //관심 팀원 조회 API 훅
  const { data: interestedMembersData } = useInterestedMembers();

  // homeInitialData가 로드되면 selectedTeamId 초기화
  useEffect(() => {
    if (homeInitialData?.selected_team?.team_id) {
      setSelectedTeamId(homeInitialData.selected_team.team_id);
    }
  }, [homeInitialData]);

  // 현재 탭에 따른 팀 리스트 선택
  const getCurrentTeams = useCallback(() => {
    if (!homeInitialData) return [];

    switch (activeTab) {
      case "answer":
        return homeInitialData.unchecked_answer_teams;
      case "inquiry":
        return homeInitialData.unchecked_inquries_teams;
      default:
        return homeInitialData.unchecked_answer_teams;
    }
  }, [homeInitialData, activeTab]);

  // 탭 변경 시 필터 및 페이지네이션 초기화
  useEffect(() => {
    setSelectedStatus("전체");
    setSelectedDate([]);
    setCurrentPage(1);
    setIsStatusModalOpen(false);
    setIsDateModalOpen(false);
    setIsTeamModalOpen(false);

    // 탭 변경 시 해당 탭의 첫 번째 팀으로 초기화
    const currentTeams = getCurrentTeams();
    if (currentTeams.length > 0) {
      setSelectedTeamId(currentTeams[0].team_id);
    }
  }, [activeTab, getCurrentTeams]);

  // 팀 선택 핸들러
  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    // 팀 변경 시 필터 초기화
    setSelectedStatus("전체");
    setSelectedDate([]);
    setCurrentPage(1);
  };

  // 모달 토글 함수들
  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
    setIsTeamModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
    setIsTeamModalOpen(false);
  };

  const toggleTeamModal = () => {
    setIsTeamModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
    setIsDateModalOpen(false);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
  };

  // 현재 탭에 따른 원본 데이터 선택
  const getCurrentRawData = () => {
    if (activeTab === "answer") {
      // 미확인 답변 데이터 사용
      return uncheckedAnswerData?.result?.inquiries || [];
    } else if (activeTab === "inquiry") {
      // 미확인 문의 데이터 사용
      return uncheckedInquiriesData?.result?.inquiries || [];
    }
    return [];
  };

  // 현재 탭에 따른 페이지네이션 정보 선택
  const getCurrentPagination = () => {
    switch (activeTab) {
      case "answer":
        return (
          uncheckedAnswerData?.result?.pagination || {
            page: 1,
            page_size: 10,
            total: 0,
            has_next: false,
          }
        );
      case "inquiry":
        return (
          uncheckedInquiriesData?.result?.pagination || {
            page: 1,
            page_size: 10,
            total: 0,
            has_next: false,
          }
        );
      default:
        return (
          homeInitialData?.pagination || {
            page: 1,
            page_size: 10,
            total: 0,
            has_next: false,
          }
        );
    }
  };

  const rawData = getCurrentRawData();
  const pagination = getCurrentPagination();
  const totalPages =
    pagination.total > 0
      ? Math.ceil(pagination.total / pagination.page_size)
      : 0;

  // 현재 페이지 문의들을 InquiryListItem 형태로 변환
  const currentItems = rawData
    .map(
      (
        item:
          | import("@/types/home/homeApi.type").InquiryItem
          | import("@/types/home/homeApi.type").InquiryItemWithoutWriter
      ) => {
        // InquiryServerStatus로 변환
        const serverStatus = item.status as InquiryServerStatus;
        const statusLabel = getInquiryStatusLabel(serverStatus);
        if (!statusLabel) return null;

        // 미확인 답변과 미확인 문의의 데이터 구조가 다름
        let leftProfiles: Profile[];

        if (activeTab === "answer") {
          // 미확인 답변: result.writer 사용 (모든 문의가 동일한 작성자)
          const writer = uncheckedAnswerData?.result?.writer;
          if (writer) {
            leftProfiles = [
              {
                id: writer.id,
                name: writer.name,
                profile_image_url: writer.profile_image_url,
              },
            ];
          } else {
            leftProfiles = [];
          }
        } else if (activeTab === "inquiry") {
          // 미확인 문의: 각 inquiry의 writer 사용
          if ("writer" in item && item.writer) {
            leftProfiles = [
              {
                id: item.writer.id,
                name: item.writer.name,
                profile_image_url: item.writer.profile_image_url,
              },
            ];
          } else {
            leftProfiles = [];
          }
        } else {
          // 홈페이지 초기 데이터: result.writer 사용 (모든 문의가 동일한 작성자)
          const writer = homeInitialData?.writer;
          if (writer) {
            leftProfiles = [
              {
                id: writer.id,
                name: writer.name,
                profile_image_url: writer.profile_image_url,
              },
            ];
          } else {
            leftProfiles = [];
          }
        }

        return {
          id: item.inquiry_id,
          team_id: selectedTeamId,
          leftProfiles,
          title: item.title,
          status: statusLabel,
          created_at: item.created_at,
          is_scrapped: item.is_scrapped,
        };
      }
    )
    .filter((item): item is InquiryListItem => item !== null);

  // 필터링 로직
  const filteredInquiries =
    selectedStatus === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === selectedStatus);

  // 숨겨진 팀들 계산 (TeamTabs에서 사용)
  const currentTeams = getCurrentTeams();
  const maxVisibleTabs = 3; // TeamTabs에서 사용하는 기본값
  const hiddenTeams = currentTeams.slice(maxVisibleTabs);

  return (
    <>
      <div className="flex h-40 justify-between items-center mb-20">
        <div className="flex gap-4 w-full">
          <HomeButton
            type="answer"
            count={answerCount}
            label="미확인 답변"
            icon={Pencil}
            isActive={activeTab === "answer"}
            onClick={setActiveTab}
          />
          <HomeButton
            type="inquiry"
            count={inquiryCount}
            label="미확인 문의"
            icon={Message}
            isActive={activeTab === "inquiry"}
            onClick={setActiveTab}
          />
          <HomeButton
            type="interest"
            count={interestCount}
            label="관심 팀원"
            icon={Heart}
            isActive={activeTab === "interest"}
            onClick={setActiveTab}
          />
        </div>
        <div className="min-w-[123px]"></div>
        <button
          className={`flex flex-col cursor-pointer min-w-49.25 h-40 items-center gap-4 p-10 rounded-[13px] transition-colors
            ${isHovered ? "bg-main-dark" : "bg-main"}
              `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => navigate("/inquiry/form")}
        >
          <Pencil
            className={
              isHovered ? "text-gray-30 w-10 h-10" : "text-white w-10 h-10"
            }
          />
          <p
            className={`text-heading3 ${isHovered ? "text-gray-30" : "text-white"}`}
          >
            문의 작성하기
          </p>
        </button>
      </div>

      <div className="w-full h-auto">
        {/* 미확인 답변 */}
        {activeTab === "answer" && (
          <div className="w-full">
            <TeamTabs
              teams={getCurrentTeams()}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
              onToggleModal={toggleTeamModal}
              isModalOpen={isTeamModalOpen}
              hiddenTeams={hiddenTeams}
              onCloseModal={closeTeamModal}
            />
            {filteredInquiries.length === 0 ? (
              <div className="flex w-full h-[calc(100vh-340px)] pb-[118px] justify-center items-center">
                <p className="text-gray-40 text-heading2-b">
                  미확인 답변이 없습니다
                </p>
              </div>
            ) : (
              <InquiryList
                inquiries={filteredInquiries}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                isStatusModalOpen={isStatusModalOpen}
                setIsStatusModalOpen={setIsStatusModalOpen}
                isDateModalOpen={isDateModalOpen}
                setIsDateModalOpen={setIsDateModalOpen}
                toggleStatusModal={toggleStatusModal}
                toggleDateModal={toggleDateModal}
              />
            )}
          </div>
        )}

        {/* 미확인 문의 */}
        {activeTab === "inquiry" && (
          <div className="w-full">
            <TeamTabs
              teams={getCurrentTeams()}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
              onToggleModal={toggleTeamModal}
              isModalOpen={isTeamModalOpen}
              hiddenTeams={hiddenTeams}
              onCloseModal={closeTeamModal}
            />
            {filteredInquiries.length === 0 ? (
              <div className="flex w-full h-[calc(100vh-340px)] pb-[118px] justify-center items-center">
                <p className="text-gray-40 text-heading2-b">
                  미확인 문의가 없습니다
                </p>
              </div>
            ) : (
              <InquiryList
                inquiries={filteredInquiries}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                isStatusModalOpen={isStatusModalOpen}
                setIsStatusModalOpen={setIsStatusModalOpen}
                isDateModalOpen={isDateModalOpen}
                setIsDateModalOpen={setIsDateModalOpen}
                toggleStatusModal={toggleStatusModal}
                toggleDateModal={toggleDateModal}
              />
            )}
          </div>
        )}

        {/* 관심 팀원 */}
        {activeTab === "interest" && interestedMembersData?.result && (
          <HomeMember
            interestCount={interestedMembersData.result.interest_count}
            interestMember={interestedMembersData.result.interested_members}
          />
        )}
      </div>
    </>
  );
};

export default HomeMain;
