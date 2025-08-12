import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import ExportDropdown from "@/components/common/ExportDropdown";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import InquiryList from "@/components/inquiry/list/InquiryList";
import TeamTabs from "@/components/inquiry/list/TeamTabs";
import UserSpaceButton from "@/components/userSpace/UserSpaceButton";
import UserSpaceProfile from "@/components/userSpace/UserSpaceProfile";
import { useExcelExport } from "@/hooks/excel/useExcelApi";
import {
  useAssignedInquiries,
  useInitialUserSpace,
  useScrapInquiries,
  useSubmittedInquiries,
  useUserProfile,
} from "@/hooks/userSpace/useUserSpaceApi";
import {
  getInquiryStatusLabel,
  INQUIRY_STATUS_VALUE,
} from "@/utils/inquiryStatus";
import { ExportOption } from "@/types/excel/excelApi.type";
import {
  InquiryListItem,
  InquiryServerStatus,
  InquiryStatus,
  YearMonth,
} from "@/types/inquiry/inquiryListApi.type";
import {
  GetUserSpaceInitialResult,
  GetUserSpaceTeamResult,
  UserSpaceInquiryItem,
  UserSpaceMyInquiryItem,
  UserSpaceTeamItem,
} from "@/types/userSpace/userSpaceApi.type";

const UserSpacePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsed = userId ? Number(userId) : NaN;
  const userIdNum = Number.isFinite(parsed) ? parsed : null;
  const invalidId = userIdNum === null;

  // 탭 상태
  const [activeTab, setActiveTab] = useState<"written" | "assigned" | "scrap">(
    "written"
  );

  // 필터 및 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<InquiryStatus | "전체">("전체");
  const [date, setDate] = useState<YearMonth[]>([]);

  // 팀 관련 상태
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teams, setTeams] = useState<UserSpaceTeamItem[]>([]);
  const [assignedTeams, setAssignedTeams] = useState<UserSpaceTeamItem[]>([]);
  const [scrapTeams, setScrapTeams] = useState<UserSpaceTeamItem[]>([]);

  // 1. 프로필 조회
  const { data: profileRes, isLoading: profileLoading } =
    useUserProfile(userIdNum);
  const profile = profileRes?.result;

  // 2. 초기 데이터 조회 (written 탭 기본 데이터)
  const { data: initialData, isLoading: initialLoading } =
    useInitialUserSpace(userIdNum);
  const userSpaceData = initialData?.result;

  // 현재 탭에 따른 팀 리스트 선택
  const getCurrentTeams = useCallback(() => {
    switch (activeTab) {
      case "written":
        return teams;
      case "assigned":
        return assignedTeams;
      case "scrap":
        return scrapTeams;
      default:
        return teams;
    }
  }, [activeTab, teams, assignedTeams, scrapTeams]);

  // 3. 탭별 데이터 조회 (활성 탭에 해당하는 API만 호출)
  const { data: writtenData } = useSubmittedInquiries(
    userIdNum!,
    selectedTeamId || 0, // null일 때 0을 전달하여 API 호출 방지
    page,
    status === "전체" ? undefined : INQUIRY_STATUS_VALUE[status],
    date.length > 0
      ? date
          .map(d => `${d.year}-${d.month.toString().padStart(2, "0")}`)
          .join(",")
      : undefined,
    activeTab
  );

  const { data: assignedData } = useAssignedInquiries(
    userIdNum!,
    selectedTeamId || 0, // null일 때 0을 전달하여 API 호출 방지
    page,
    status === "전체" ? undefined : INQUIRY_STATUS_VALUE[status],
    date.length > 0
      ? date
          .map(d => `${d.year}-${d.month.toString().padStart(2, "0")}`)
          .join(",")
      : undefined,
    activeTab
  );

  const { data: scrapData } = useScrapInquiries(
    userIdNum!,
    selectedTeamId || 0, // null일 때 0을 전달하여 API 호출 방지
    page,
    status === "전체" ? undefined : INQUIRY_STATUS_VALUE[status],
    date.length > 0
      ? date
          .map(d => `${d.year}-${d.month.toString().padStart(2, "0")}`)
          .join(",")
      : undefined,
    activeTab
  );

  // 초기 데이터 설정
  useEffect(() => {
    if (userSpaceData) {
      // selected_team이 null일 수 있으므로 안전하게 처리
      setSelectedTeamId(userSpaceData.selected_team?.team_id || null);
      setTeams(userSpaceData.teams || []);
      setAssignedTeams(userSpaceData.assigned_inquiry_teams || []);
      setScrapTeams(userSpaceData.scrapped_inquiry_teams || []);
    }
  }, [userSpaceData]);

  // 탭 변경 시 필터 및 페이지네이션 초기화
  useEffect(() => {
    setStatus("전체");
    setDate([]);
    setPage(1);

    // 탭 변경 시 해당 탭의 첫 번째 팀으로 초기화
    const currentTeams = getCurrentTeams();
    if (currentTeams.length > 0) {
      setSelectedTeamId(currentTeams[0].team_id);
    } else {
      // 팀이 없으면 selectedTeamId를 null로 설정하여 API 호출 방지
      setSelectedTeamId(null);
    }
  }, [activeTab, getCurrentTeams]);

  // 현재 탭에 따른 데이터 선택
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case "written":
        return writtenData?.result || userSpaceData;
      case "assigned":
        // assigned 탭에서 팀이 없으면 빈 데이터 구조 반환
        return (
          assignedData?.result ||
          (selectedTeamId === null
            ? {
                total_count: 0,
                inquiries: [],
                pagination: {
                  page: 1,
                  page_size: 10,
                  total: 0,
                  has_next: false,
                },
              }
            : undefined)
        );
      case "scrap":
        // scrap 탭에서 팀이 없으면 빈 데이터 구조 반환
        return (
          scrapData?.result ||
          (selectedTeamId === null
            ? {
                total_count: 0,
                inquiries: [],
                pagination: {
                  page: 1,
                  page_size: 10,
                  total: 0,
                  has_next: false,
                },
              }
            : undefined)
        );
      default:
        return userSpaceData;
    }
  }, [
    activeTab,
    writtenData,
    assignedData,
    scrapData,
    userSpaceData,
    selectedTeamId,
  ]);

  // 모달 상태 - 모든 Hook을 최상단에 배치
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // 현재 데이터
  const currentData = getCurrentData();
  const currentTeams = getCurrentTeams();

  // 팀 선택 핸들러
  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setPage(1);
    setStatus("전체");
    setDate([]);
  };

  // Export 핸들러
  const excelExport = useExcelExport();

  const handleExport = (option: ExportOption) => {
    if (!selectedTeamId || selectedTeamId === 0) return;

    // 활성 탭에 따라 적절한 scope 설정
    let scope: "submitted" | "assigned" | "scrapped";
    switch (activeTab) {
      case "written":
        scope = "submitted";
        break;
      case "assigned":
        scope = "assigned";
        break;
      case "scrap":
        scope = "scrapped";
        break;
      default:
        return;
    }

    excelExport.mutate({
      scope,
      teamId: selectedTeamId,
      userId: userIdNum!, // UserSpacePage에서 사용하는 user_id 추가
      option,
      status,
      date,
    });
  };

  // 로딩 상태
  const isLoading = profileLoading || initialLoading;

  if (invalidId) {
    return (
      <section>
        <p className="text-center text-gray-50 text-body2">
          유효한 사용자 ID가 없습니다.
        </p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <LoadingSpinner fullscreen={true} />
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <p className="text-center text-gray-50 text-body2">
          프로필을 찾을 수 없습니다.
        </p>
      </section>
    );
  }

  if (!currentData) {
    return (
      <section>
        <p className="text-center text-gray-50 text-body2">
          데이터를 불러올 수 없습니다.
        </p>
      </section>
    );
  }

  // InquiryPageLayout에 전달할 데이터 변환
  const inquiries = (currentData.inquiries || []).map(item => {
    if (activeTab === "written") {
      // written 탭: 상위 레벨 writer 사용
      const writtenData = currentData as
        | GetUserSpaceInitialResult
        | GetUserSpaceTeamResult;
      const myInquiryItem = item as UserSpaceMyInquiryItem;

      return {
        inquiry_id: myInquiryItem.inquiry_id,
        writer: {
          id: writtenData.writer.id,
          name: writtenData.writer.name,
          profile_image_url: writtenData.writer.profile_image_url || "",
        },
        title: myInquiryItem.title,
        status: myInquiryItem.status as InquiryServerStatus, // InquiryServerStatus로 캐스팅
        created_at: myInquiryItem.created_at,
        is_scrapped: myInquiryItem.is_scrapped,
      };
    } else {
      // assigned/scrap 탭: 각 항목의 writer 사용
      const inquiryItem = item as UserSpaceInquiryItem;

      return {
        inquiry_id: inquiryItem.inquiry_id,
        writer: {
          id: inquiryItem.writer.id,
          name: inquiryItem.writer.name,
          profile_image_url: inquiryItem.writer.profile_image_url || "",
        },
        title: inquiryItem.title,
        status: inquiryItem.status as InquiryServerStatus, // InquiryServerStatus로 캐스팅
        created_at: inquiryItem.created_at,
        is_scrapped: inquiryItem.is_scrapped,
      };
    }
  });
  const totalCount = currentData.total_count || 0;
  const pagination = currentData.pagination;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.page_size)
    : 0;

  // 탭별 제목과 설명
  const getTabInfo = () => {
    switch (activeTab) {
      case "written": {
        const writtenData = currentData as
          | GetUserSpaceInitialResult
          | GetUserSpaceTeamResult;
        return {
          title: `${profile.name}님이 쓴 문의 (${totalCount})`,
          description: `${profile.name}님이 쓴 문의가 총`,
          emptyText: `${profile.name}님이 쓴 문의가 없습니다`,
          writer: writtenData?.writer
            ? {
                id: writtenData.writer.id,
                name: writtenData.writer.name,
                profile_image_url: writtenData.writer.profile_image_url || "",
              }
            : undefined,
        };
      }
      case "assigned":
        return {
          title: `${profile.name}님의 담당 문의 (${totalCount})`,
          description: `${profile.name}님의 담당 문의가 총`,
          emptyText: `${profile.name}님의 담당 문의가 없습니다`,
          writer: undefined, // assigned에서는 각 inquiry의 writer 사용
        };
      case "scrap":
        return {
          title: `${profile.name}님의 스크랩 (${totalCount})`,
          description: `${profile.name}님이 스크랩한 문의가 총`,
          emptyText: `${profile.name}님이 스크랩한 문의가 없습니다`,
          writer: undefined, // scrap에서는 각 inquiry의 writer 사용
        };
      default:
        return {
          title: "",
          description: "",
          emptyText: "",
          writer: undefined,
        };
    }
  };

  const tabInfo = getTabInfo();

  const maxVisibleTabs = 3;
  const hiddenTeams = currentTeams.slice(maxVisibleTabs);

  // InquiryList용 데이터 변환
  const currentItems = inquiries
    .map(item => {
      const statusLabel = getInquiryStatusLabel(
        item.status as InquiryServerStatus
      );
      if (!statusLabel) return null;

      const profile = tabInfo.writer ?? item.writer!;
      return {
        id: item.inquiry_id,
        team_id: selectedTeamId || 0,
        leftProfiles: [
          {
            id: profile.id,
            name: profile.name,
            profile_image_url: profile.profile_image_url,
          },
        ],
        title: item.title,
        status: statusLabel,
        created_at: item.created_at,
        is_scrapped: item.is_scrapped,
      };
    })
    .filter((item): item is InquiryListItem => item !== null);

  // 필터링
  const filteredInquiries =
    status === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === status);

  // 모달 토글 함수
  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  return (
    <section>
      <div className="profile-container">
        <UserSpaceProfile userId={userIdNum!} profile={profile} />
      </div>

      <UserSpaceButton activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pt-10">
        {/* 상단 텍스트 + Export 버튼 영역 */}
        <div className="flex justify-between mb-6">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-80 text-heading1">{tabInfo.title}</h1>
          </div>
          {totalCount !== 0 && currentTeams.length > 0 && (
            <div className="self-end">
              <ExportDropdown onExport={handleExport} />
            </div>
          )}
        </div>

        {/* 빈 상태 또는 TeamTabs + InquiryList */}
        {totalCount === 0 || currentTeams.length === 0 ? (
          <div className="flex w-full h-[calc(100vh-340px)] pb-[118px] justify-center items-center">
            <p className="text-gray-40 text-heading2-b">{tabInfo.emptyText}</p>
          </div>
        ) : (
          <>
            <TeamTabs
              teams={currentTeams}
              selectedTeamId={selectedTeamId || 0}
              onSelectTeam={handleSelectTeam}
              onToggleModal={() => setIsTeamModalOpen(prev => !prev)}
              isModalOpen={isTeamModalOpen}
              hiddenTeams={hiddenTeams}
              onCloseModal={() => setIsTeamModalOpen(false)}
            />
            <InquiryList
              inquiries={filteredInquiries}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              selectedStatus={status}
              setSelectedStatus={setStatus}
              selectedDate={date}
              setSelectedDate={setDate}
              isStatusModalOpen={isStatusModalOpen}
              setIsStatusModalOpen={setIsStatusModalOpen}
              isDateModalOpen={isDateModalOpen}
              setIsDateModalOpen={setIsDateModalOpen}
              toggleStatusModal={toggleStatusModal}
              toggleDateModal={toggleDateModal}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default UserSpacePage;
