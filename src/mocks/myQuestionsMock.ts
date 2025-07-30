import { InquiryServerStatus, MyInquiryListResponse } from "@/types/inquiry";

export const MOCK_MY_QUESTIONS_RESPONSE: MyInquiryListResponse = {
  total_count: 45,
  writer: {
    id: 100,
    name: "심수연",
    profile_image_url: "",
  },
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
  ],
  inquiries: Array.from({ length: 45 }, (_, index) => {
    const inquiry_id = 5000 - index;
    const year = 2025;
    const month = ((index % 12) + 1).toString().padStart(2, "0");
    const day = ((index % 28) + 1).toString().padStart(2, "0");
    const hour = (index % 24).toString().padStart(2, "0");
    const minute = (index % 60).toString().padStart(2, "0");

    return {
      inquiry_id,
      title: `내 문의 제목 ${inquiry_id}`,
      inquiry_assignees: [
        {
          id: 200 + (index % 3),
          name: ["박상욱", "장윤영", "김홍엽"][index % 3],
          profile_image_url: "",
        },
      ],
      status: ["UNCHECKED", "IN_PROGRESS", "COMPLETED"][
        index % 3
      ] as InquiryServerStatus,
      created_at: `${year}-${month}-${day}T${hour}:${minute}:00Z`,
      is_scraped: index % 2 === 0,
    };
  }),
  pagination: {
    page: 1,
    page_size: 10,
    total: 45,
    has_next: true,
  },
};
