import { useState } from "react";

import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { useUserProfile } from "@/hooks/userSpace/useUserSpaceApi";
import {
  InquiryItem,
  InquiryListResponse,
} from "@/types/userSpace/userSpaceApi.type";

import UserSpaceButton from "./UserSpaceButton";
import UserSpaceProfile from "./UserSpaceProfile";

const USER_ID = 1;

const UserSpacePage = () => {
  const [activeTab, setActiveTab] = useState<"written" | "assigned" | "scrap">(
    "written"
  );
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<
    InquiryListResponse["selected_team"] | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(0);

  const { data: profile, isLoading } = useUserProfile(USER_ID);

  return (
    <section>
      {isLoading || !profile ? (
        <p className="text-center text-gray-50 text-body2">프로필 로딩 중...</p>
      ) : (
        <>
          <div className="profile-container">
            <UserSpaceProfile userId={USER_ID} />
          </div>

          <UserSpaceButton
            userId={USER_ID}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onDataFetched={({ inquiries, selectedTeam, pageSize }) => {
              setInquiries(inquiries);
              setSelectedTeam(selectedTeam);
              setPageSize(pageSize);
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
                teams={activeTab === "scrap" ? [] : [selectedTeam]}
                selectedTeamId={selectedTeam?.team_id}
                writer={
                  activeTab === "written"
                    ? {
                        user_id: USER_ID,
                        name: profile.name,
                        profile_image_url: profile.profile_image_url,
                      }
                    : undefined
                }
                pageSize={pageSize}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default UserSpacePage;
