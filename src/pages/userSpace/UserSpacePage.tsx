import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
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
import { INQUIRY_STATUS_VALUE } from "@/utils/inquiryStatus";
import { ExportOption } from "@/types/excel/excelApi.type";
import {
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
    selectedTeamId!,
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
    selectedTeamId!,
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
    selectedTeamId!,
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
      setSelectedTeamId(userSpaceData.selected_team.team_id);
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
    }
  }, [activeTab, getCurrentTeams]);

  // 현재 탭에 따른 데이터 선택
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case "written":
        return writtenData?.result || userSpaceData;
      case "assigned":
        return assignedData?.result;
      case "scrap":
        return scrapData?.result;
      default:
        return userSpaceData;
    }
  }, [activeTab, writtenData, assignedData, scrapData, userSpaceData]);

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
    if (!selectedTeamId) return;

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
        <p className="text-center text-gray-50 text-body2">로딩 중...</p>
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
          title: `${profile.name}님이 쓴 문의`,
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
          title: `${profile.name}님의 담당 문의`,
          description: `${profile.name}님의 담당 문의가 총`,
          emptyText: `${profile.name}님의 담당 문의가 없습니다`,
          writer: undefined, // assigned에서는 각 inquiry의 writer 사용
        };
      case "scrap":
        return {
          title: `${profile.name}님의 스크랩`,
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

  return (
    <section>
      <div className="profile-container">
        <UserSpaceProfile userId={userIdNum!} profile={profile} />
      </div>

      <UserSpaceButton activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pt-10">
        <InquiryPageLayout
          title={tabInfo.title}
          description={tabInfo.description}
          emptyText={tabInfo.emptyText}
          inquiries={inquiries}
          teams={currentTeams}
          selectedTeamId={selectedTeamId!}
          onSelectTeam={handleSelectTeam}
          writer={tabInfo.writer}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          selectedStatus={status}
          onStatusChange={setStatus}
          selectedDate={date}
          onDateChange={setDate}
          onExport={handleExport}
        />
      </div>
    </section>
  );
};

export default UserSpacePage;
