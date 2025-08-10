import Button from "@/components/common/Button";
import { USER_SPACE_TABS } from "@/constants/userSpace";
import {
  useAssignedInquiries,
  useScrapInquiries,
  useSubmittedInquiries,
} from "@/hooks/userSpace/useUserSpaceApi";
import { InquiryItem } from "@/types/inquiry/inquiryListApi.type";
import { Normalized, TabKey } from "@/types/userSpace/userSpace.type";

interface Props {
  userId: number;
  activeTab: TabKey;
  onTabChange: (key: TabKey) => void;
  onDataFetched: (data: Normalized) => void;
  profile: { name: string; team_id: number; profile_image_url: string | null };
}

type MyInquiryItem = Omit<InquiryItem, "writer"> & {
  writer_id?: number;
  writer_name?: string;
  writer_profile_image_url?: string | null;
};

const UserSpaceButton = ({
  userId,
  activeTab,
  onTabChange,
  onDataFetched,
  profile,
}: Props) => {
  const { data: assignedQuery } = useAssignedInquiries(profile.team_id);
  const { data: scrapQuery } = useScrapInquiries(userId);
  const { data: writtenQuery } = useSubmittedInquiries(profile.team_id, userId);

  const assignedData = assignedQuery?.result;
  const scrapData = scrapQuery?.result;
  const writtenData = writtenQuery?.result;

  const mapWithWriter = (
    inquiries: MyInquiryItem[] | undefined,
    fallbackWriter?: {
      id?: number;
      name?: string;
      profile_image_url?: string | null;
    }
  ): InquiryItem[] => {
    return (inquiries ?? []).map(inq => ({
      ...inq,
      writer: {
        id: inq.writer_id ?? fallbackWriter?.id ?? 0,
        name: inq.writer_name ?? fallbackWriter?.name ?? "",
        profile_image_url:
          inq.writer_profile_image_url ??
          fallbackWriter?.profile_image_url ??
          "",
      },
    }));
  };

  const handleClick = (key: TabKey) => {
    onTabChange(key);

    let normalized: Normalized | null = null;
    if (key === "assigned" && assignedData) {
      normalized = {
        inquiries: mapWithWriter(assignedData.inquiries as MyInquiryItem[]),
        selectedTeam: assignedData.selected_team ?? null,
        pageSize: assignedData.pagination?.page_size ?? 0,
      };
    } else if (key === "scrap" && scrapData) {
      normalized = {
        inquiries: mapWithWriter(scrapData.inquiries as MyInquiryItem[]),
        selectedTeam: null,
        pageSize: scrapData.pagination?.page_size ?? 0,
      };
    } else if (key === "written" && writtenData) {
      normalized = {
        inquiries: mapWithWriter(writtenData.inquiries as MyInquiryItem[], {
          id: userId,
          name: profile.name,
          profile_image_url: profile.profile_image_url ?? "",
        }),
        selectedTeam: writtenData.selected_team ?? null,
        pageSize: writtenData.pagination?.page_size ?? 0,
      };
    }

    if (normalized) onDataFetched(normalized);
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
            onClick={() => handleClick(key as TabKey)}
          >
            {activeTab === (key as TabKey) ? (
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
