import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Heart from "@/assets/svgs/common/heart.svg";
import { Message, Pencil } from "@/assets/svgs/layout";
import HomeButton from "@/components/home/HomeButton";
import HomeMember from "@/components/home/HomeMember";
import InquiryList from "@/components/inquiry/list/InquiryList";
import TeamTabs from "@/components/inquiry/list/TeamTabs";
import { getInquiryStatusLabel } from "@/utils/inquiryStatus";
import { InterestMember } from "@/types/home";
import {
  InquiryListItem,
  InquiryServerStatus,
  YearMonth,
} from "@/types/inquiry";
import {
  MOCK_HOME_INITIAL_RESPONSE,
  MOCK_HOME_MEMBER_RESPONSE,
  MOCK_UNCHECKED_ANSWER_RESPONSE,
  MOCK_UNCHECKED_INQUIRY_RESPONSE,
} from "@/mocks/home";

type Props = {
  answerCount: number;
  inquiryCount: number;
  interestCount: number;
};

const HomeMain = ({ answerCount, inquiryCount, interestCount }: Props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("answer");
  const [isHovered, setIsHovered] = useState(false);
  const [homeMember, setHomeMember] = useState<InterestMember | null>(null);

  // 팀/필터 관련 상태
  const [selectedTeamId, setSelectedTeamId] = useState(
    MOCK_HOME_INITIAL_RESPONSE.selected_team.team_id
  );
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedDate, setSelectedDate] = useState<YearMonth[]>([]);

  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (activeTab === "interest") {
      setHomeMember(MOCK_HOME_MEMBER_RESPONSE);
    }
  }, [activeTab]);

  // 탭 변경 시 필터 및 페이지네이션 초기화
  useEffect(() => {
    setSelectedStatus("전체");
    setSelectedDate([]);
    setCurrentPage(1);
    setIsStatusModalOpen(false);
    setIsDateModalOpen(false);

    // 탭 변경 시 해당 탭의 첫 번째 팀으로 초기화
    const currentTeams = getCurrentTeams();
    if (currentTeams.length > 0) {
      setSelectedTeamId(currentTeams[0].team_id);
    }
  }, [activeTab]);

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
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  // 현재 탭에 따른 팀 리스트 선택
  const getCurrentTeams = () => {
    switch (activeTab) {
      case "answer":
        return MOCK_HOME_INITIAL_RESPONSE.unchecked_answer_teams;
      case "inquiry":
        return MOCK_HOME_INITIAL_RESPONSE.unchecked_inquiries_teams;
      default:
        return MOCK_HOME_INITIAL_RESPONSE.unchecked_answer_teams;
    }
  };

  // 현재 탭에 따른 원본 데이터 선택
  const getCurrentRawData = () => {
    if (activeTab === "answer") {
      // 현재 페이지에 해당하는 데이터만 반환 (실제 API 동작 시뮬레이션)
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return MOCK_UNCHECKED_ANSWER_RESPONSE.inquiries.slice(
        startIndex,
        endIndex
      );
    } else if (activeTab === "inquiry") {
      // 현재 페이지에 해당하는 데이터만 반환 (실제 API 동작 시뮬레이션)
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return MOCK_UNCHECKED_INQUIRY_RESPONSE.inquiries.slice(
        startIndex,
        endIndex
      );
    }
    return [];
  };

  // 현재 탭에 따른 페이지네이션 정보 선택
  const getCurrentPagination = () => {
    switch (activeTab) {
      case "answer":
        return MOCK_UNCHECKED_ANSWER_RESPONSE.pagination;
      case "inquiry":
        return MOCK_UNCHECKED_INQUIRY_RESPONSE.pagination;
      default:
        return { page: 1, page_size: 10, total: 0, has_next: false };
    }
  };

  const rawData = getCurrentRawData();
  const pagination = getCurrentPagination();
  const totalInquiries = pagination.total;
  const totalPages = Math.ceil(totalInquiries / pageSize);

  // 현재 페이지 문의들을 InquiryListItem 형태로 변환
  const currentItems = rawData
    .map(item => {
      // InquiryServerStatus로 변환 (Mock 데이터는 이미 올바른 형태)
      const serverStatus = item.status as InquiryServerStatus;
      const statusLabel = getInquiryStatusLabel(serverStatus);
      if (!statusLabel) return null;

      // 미확인 답변과 미확인 문의의 데이터 구조가 다름
      let leftProfiles: {
        user_id: number;
        name: string;
        profile_image_url: string;
      }[];
      if ("inquiry_assignees" in item) {
        // 미확인 답변: inquiry_assignees 사용
        leftProfiles = item.inquiry_assignees.map(
          (assignee: {
            id: number;
            name: string;
            profile_image_url: string;
          }) => ({
            user_id: assignee.id,
            name: assignee.name,
            profile_image_url: assignee.profile_image_url,
          })
        );
      } else if ("writer" in item) {
        // 미확인 문의: writer 사용
        leftProfiles = [
          {
            user_id: item.writer.user_id,
            name: item.writer.name,
            profile_image_url: item.writer.profile_image_url,
          },
        ];
      } else {
        leftProfiles = [];
      }

      return {
        id: item.inquiry_id,
        team_id: selectedTeamId,
        leftProfiles,
        title: item.title,
        status: statusLabel,
        created_at: item.created_at,
        is_scraped: item.is_scraped,
      };
    })
    .filter((item): item is InquiryListItem => item !== null);

  // 필터링 로직: InquiryPageLayout과 동일한 방식
  const filteredInquiries =
    selectedStatus === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === selectedStatus);

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
        {activeTab === "answer" && (
          <div className="w-full">
            <TeamTabs
              teams={getCurrentTeams()}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
            />
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
          </div>
        )}
        {activeTab === "inquiry" && (
          <div className="w-full">
            <TeamTabs
              teams={getCurrentTeams()}
              selectedTeamId={selectedTeamId}
              onSelectTeam={handleSelectTeam}
            />
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
          </div>
        )}
        {activeTab === "interest" && homeMember && (
          <HomeMember
            interestCount={homeMember.result.interest_count}
            interestMember={homeMember.result.interest_members}
          />
        )}
      </div>
    </>
  );
};

export default HomeMain;
