import { AssignedInquiryListResponse } from "@/types/inquiry";

export const MOCK_ASSIGNED_INQUIRY_RESPONSE: AssignedInquiryListResponse = {
  total_count: 120,
  selected_team: {
    team_id: 1,
    group_name: "그룹 A",
    division_name: "A 본부",
    team_name: "A 팀",
  },
  teams: [
    {
      team_id: 1,
      group_name: "그룹 A",
      division_name: "A 본부",
      team_name: "A 팀",
    },
    {
      team_id: 2,
      group_name: "그룹 B",
      division_name: "B 본부",
      team_name: "B 팀",
    },
    {
      team_id: 3,
      group_name: "그룹 C",
      division_name: "C 본부",
      team_name: "C 팀",
    },
  ],
  inquiries: Array.from({ length: 120 }, (_, index) => {
    const inquiry_id = 2000 - index;
    const totalMonths = (2025 - 2015) * 12 + 7 - 1;
    const currentTotalMonths = totalMonths - index;

    const year = 2015 + Math.floor(currentTotalMonths / 12);
    const month = (currentTotalMonths % 12) + 1;
    const day = (index % 28) + 1;
    const hour = (index % 24).toString().padStart(2, "0");
    const minute = (index % 60).toString().padStart(2, "0");

    return {
      inquiry_id,
      writer: {
        user_id: 300 + (index % 5),
        name: ["장윤영", "심수연", "원채영", "박규영", "김홍엽"][index % 5],
        profile_image_url: "",
      },
      title: `문의 제목 ${inquiry_id}`,
      status: ["확인 전", "확인 중", "답변 완료"][
        index % 3
      ] as AssignedInquiryListResponse["inquiries"][number]["status"],
      created_at: `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}T${hour}:${minute}:00Z`,
      is_scraped: index % 2 === 0,
    };
  }),
  pagination: {
    page: 1,
    page_size: 10,
    total: 120,
    has_next: true,
  },
};
