import { AssignedInquiryListResponse } from "@/types/inquiry";

export const MOCK_ASSIGNED_INQUIRY_RESPONSE: AssignedInquiryListResponse = {
  total_count: 20,
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
  inquiries: Array.from({ length: 20 }, (_, index) => ({
    inquiry_id: 1001 + index,
    writer: {
      user_id: 200 + (index % 3),
      name: ["원채영", "심수연", "박규영"][index % 3],
      profile_image_url: "",
    },
    title: `문의 제목 ${index + 1}`,
    status: ["확인 전", "확인 중", "답변 완료"][
      index % 3
    ] as AssignedInquiryListResponse["inquiries"][number]["status"],
    created_at: `2025-07-06T10:${(index % 60).toString().padStart(2, "0")}:00Z`,
    is_scraped: index % 2 === 0,
  })),
  pagination: {
    page: 1,
    page_size: 10,
    total: 20,
    has_next: true,
  },
};
