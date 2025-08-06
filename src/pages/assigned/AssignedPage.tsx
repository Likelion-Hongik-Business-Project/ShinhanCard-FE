import InquiryPageLayout from "@/components/inquiry/layout/InquiryPageLayout";
import { useAssignedApi } from "@/hooks/inquiry/assigned/useAssignedApi";
import { AssignedInquiryItem } from "@/types/inquiry/inquiryListApi.type";

const AssignedPage = () => {
  // const [page, setPage] = useState(1);
  // const [status, setStatus] = useState<string | undefined>(undefined);
  // const [date, setDate] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useAssignedApi({ page: 1 });

  if (isLoading) return <div>로딩 중..</div>;
  if (isError || !data) return <div>에러가 발생하였습니다</div>;

  const { inquiries, teams, selected_team, pagination } = data;

  return (
    <InquiryPageLayout<AssignedInquiryItem>
      title="내 담당 문의"
      description="나의 담당 문의가 총"
      emptyText="나의 담당 문의가 없습니다"
      inquiries={inquiries}
      teams={teams}
      selectedTeamId={selected_team.team_id}
      pageSize={pagination.page_size}
    />
  );
};

export default AssignedPage;
