import { useState } from "react";

import { useParams } from "react-router-dom";

import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import UserSpaceButton from "@/components/userSpace/UserSpaceButton";
import UserSpaceProfile from "@/components/userSpace/UserSpaceProfile";
import { useUserProfile } from "@/hooks/userSpace/useUserSpaceApi";
import {
  GetInitMyInquiryListResponse,
  InquiryItem,
} from "@/types/inquiry/inquiryListApi.type";

const UserSpacePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsed = userId ? Number(userId) : NaN;
  const userIdNum = Number.isFinite(parsed) ? parsed : null;
  const invalidId = userIdNum === null;

  const [activeTab, setActiveTab] = useState<"written" | "assigned" | "scrap">(
    "written"
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState<{ year: number; month: number }[]>([]);
  const [data, setData] = useState({ total_count: 0 });
  const totalPages = Math.ceil(data.total_count / pageSize);

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<
    GetInitMyInquiryListResponse["selected_team"] | null
  >(null);

  const { data: profileRes, isLoading } = useUserProfile(userIdNum);
  const profile = profileRes?.result;

  const handleSelectTeam = (teamId: number) => {
    console.log("Selected team:", teamId);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

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
        <p className="text-center text-gray-50 text-body2">프로필 로딩 중...</p>
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

  return (
    <section>
      <div className="profile-container">
        <UserSpaceProfile userId={userIdNum!} />
      </div>

      <UserSpaceButton
        userId={userIdNum!}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDataFetched={({
          inquiries,
          selectedTeam,
          pageSize: fetchedPageSize,
        }) => {
          setInquiries(inquiries);
          setSelectedTeam(selectedTeam);
          setPageSize(fetchedPageSize || 10);
          setData({ total_count: inquiries.length });
        }}
        profile={profile}
      />

      <div className="pt-10">
        {inquiries.length === 0 ? (
          <p className="text-center text-gray-50 text-body2">
            {activeTab === "assigned"
              ? `${profile.name}님의 담당 문의가 없습니다`
              : activeTab === "scrap"
                ? "스크랩한 문의가 없습니다"
                : `${profile.name}님이 쓴 문의가 없습니다`}
          </p>
        ) : (
          <InquiryPageLayout
            title={`${profile.name}님의 ${
              activeTab === "assigned"
                ? "담당 문의"
                : activeTab === "scrap"
                  ? "스크랩"
                  : "쓴 문의"
            }`}
            description={`${profile.name}님의 ${
              activeTab === "scrap" ? "스크랩한" : "문의가 총"
            }`}
            emptyText={`${profile.name}님의 문의가 없습니다`}
            inquiries={inquiries}
            teams={
              activeTab === "scrap" ? [] : selectedTeam ? [selectedTeam] : []
            }
            selectedTeamId={selectedTeam?.team_id || 0}
            {...(activeTab === "written" && {
              writer: {
                id: userIdNum!,
                name: profile.name,
                profile_image_url: profile.profile_image_url || "",
              },
            })}
            onSelectTeam={handleSelectTeam}
            totalCount={data.total_count}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            selectedStatus={status}
            onStatusChange={setStatus}
            selectedDate={date}
            onDateChange={setDate}
            onExport={handleExport}
          />
        )}
      </div>
    </section>
  );
};

export default UserSpacePage;
