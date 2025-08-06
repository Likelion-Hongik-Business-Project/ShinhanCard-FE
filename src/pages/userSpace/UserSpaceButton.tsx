import Button from "@/components/common/Button";
import { USER_SPACE_TABS } from "@/constants/userSpace";
import {
  useAssignedInquiries,
  useScrapInquiries,
  useWrittenInquiries,
} from "@/hooks/userSpace/useUserSpaceApi";
import {
  InquiryItem,
  InquiryListResponse,
  ProfilePreviewResponse,
} from "@/types/userSpace/userSpaceApi.type";

interface Props {
  userId: number;
  activeTab: string;
  onTabChange: (key: string) => void;
  onDataFetched: (data: {
    inquiries: InquiryItem[];
    selectedTeam: InquiryListResponse["selected_team"] | null;
    pageSize: number;
  }) => void;
  profile: Pick<
    ProfilePreviewResponse,
    "name" | "team_id" | "profile_image_url"
  >;
}

const UserSpaceButton = ({
  userId,
  activeTab,
  onTabChange,
  onDataFetched,
  profile,
}: Props) => {
  const { data: assignedData } = useAssignedInquiries(profile.team_id);
  const { data: scrapData } = useScrapInquiries(userId);
  const { data: writtenData } = useWrittenInquiries(profile.team_id, userId);

  const handleClick = (key: string) => {
    onTabChange(key);
    const dataMap = {
      assigned: assignedData,
      scrap: scrapData,
      written: writtenData,
    };
    const result = dataMap[key];
    if (result) {
      onDataFetched({
        inquiries: result.inquiries,
        selectedTeam: result.selected_team,
        pageSize: result.pagination.page_size,
      });
    }
  };

  return (
    <div className="flex gap-4 pt-20 w-full overflow-x-auto scrollbar-hide">
      {USER_SPACE_TABS.map(
        ({
          key,
          label,
          activeIcon: ActiveIcon,
          inactiveIcon: InactiveIcon,
        }) => (
          <Button
            key={key}
            buttonType="none"
            className={`${
              activeTab === key
                ? "bg-state-progress-01 border-[2px] border-main"
                : "bg-white border border-gray-20"
            } flex flex-col justify-center items-center gap-4 rounded-[13px] px-10 w-full max-w-[463px] h-[160px]`}
            onClick={() => handleClick(key)}
          >
            {activeTab === key ? (
              <ActiveIcon className="w-10 h-10" />
            ) : (
              <InactiveIcon className="w-10 h-10" />
            )}
            <span
              className={`text-heading2-b ${
                activeTab === key ? "text-main-dark" : "text-gray-50"
              }`}
            >
              {label}
            </span>
          </Button>
        )
      )}
    </div>
  );
};

export default UserSpaceButton;
