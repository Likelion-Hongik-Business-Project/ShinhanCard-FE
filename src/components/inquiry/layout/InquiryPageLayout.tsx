import { Dispatch, SetStateAction, useState } from "react";

import ExportDropdown from "@/components/common/ExportDropdown";
import InquiryList from "@/components/inquiry/list/InquiryList";
import TeamTabs from "@/components/inquiry/list/TeamTabs";
import { getInquiryStatusLabel } from "@/utils/inquiryStatus";
import {
  InquiryListItem,
  InquiryServerStatus,
  InquiryStatus,
  Profile,
  TeamItem,
  TInquiryBase,
  YearMonth,
} from "@/types/inquiry/inquiryListApi.type";

type Props<TInquiry> = {
  title: string;
  description: string;
  emptyText: string;
  inquiries: TInquiry[]; // 서버 data
  teams: TeamItem[];
  selectedTeamId: number;
  onSelectTeam: (teamId: number) => void;
  writer?: Profile; // 내가 쓴 문의일 경우
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  selectedStatus: string;
  onStatusChange: (status: InquiryStatus | "전체") => void;
  selectedDate: { year: number; month: number }[];
  onDateChange: Dispatch<SetStateAction<YearMonth[]>>;
};

const InquiryPageLayout = <TInquiry extends TInquiryBase>({
  title,
  description,
  emptyText,
  inquiries,
  teams,
  selectedTeamId,
  onSelectTeam,
  writer,
  totalCount,
  totalPages,
  currentPage,
  onPageChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
}: Props<TInquiry>) => {
  // 모달 상태
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const maxVisibleTabs = 3;
  const hiddenTeams = teams.slice(maxVisibleTabs);

  const currentItems = inquiries
    .map((item: TInquiry) => {
      const statusLabel = getInquiryStatusLabel(
        item.status as InquiryServerStatus
      );
      if (!statusLabel) return null;

      const profile = writer ?? item.writer!;
      return {
        id: item.inquiry_id,
        team_id: selectedTeamId,
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
        is_scraped: item.is_scraped,
      };
    })
    .filter((item): item is InquiryListItem => item !== null);

  // 필터링
  const filteredInquiries =
    selectedStatus === "전체"
      ? currentItems
      : currentItems.filter(item => item.status === selectedStatus);

  // 모달 토글 함수: 상태 모달과 일시 모달 둘 중 하나만 열리게
  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
    setIsDateModalOpen(false);
  };

  const toggleDateModal = () => {
    setIsDateModalOpen(prev => !prev);
    setIsStatusModalOpen(false);
  };

  // 엑셀 다운로드 함수
  const handleExport = async (option: "filtered" | "all") => {
    console.log(option);
    // TODO: API 각각 연결
  };

  return (
    <>
      <div className="flex justify-between mb-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-gray-80 text-heading1">{title}</h1>
          <p className="text-gray-100 text-body1">
            {description}
            <span className="text-body1-b"> {totalCount}</span>건 있습니다.
          </p>
        </div>
        {totalCount !== 0 && (
          <div className="self-end">
            <ExportDropdown onExport={handleExport} />
          </div>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="flex w-full h-[calc(100vh-340px)] pb-[118px] justify-center items-center">
          <p className="text-gray-40 text-heading2-b">{emptyText}</p>
        </div>
      ) : (
        <>
          <TeamTabs
            teams={teams}
            selectedTeamId={selectedTeamId}
            onSelectTeam={onSelectTeam}
            onToggleModal={() => setIsTeamModalOpen(prev => !prev)}
            isModalOpen={isTeamModalOpen}
            hiddenTeams={hiddenTeams}
            onCloseModal={() => setIsTeamModalOpen(false)}
          />
          <InquiryList
            inquiries={filteredInquiries}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            selectedStatus={selectedStatus}
            setSelectedStatus={onStatusChange}
            selectedDate={selectedDate}
            setSelectedDate={onDateChange}
            isStatusModalOpen={isStatusModalOpen}
            setIsStatusModalOpen={setIsStatusModalOpen}
            isDateModalOpen={isDateModalOpen}
            setIsDateModalOpen={setIsDateModalOpen}
            toggleStatusModal={toggleStatusModal}
            toggleDateModal={toggleDateModal}
          />
        </>
      )}
    </>
  );
};

export default InquiryPageLayout;
