import {
  InquiryServerStatus,
  ScrapedInquiryListResponse,
} from "@/types/inquiry/inquiryListApi.type";

export const MOCK_SCRAP_RESPONSE: ScrapedInquiryListResponse = {
  total_count: 120,
  selected_team: {
    team_id: 2,
    group_name: "그룹 B",
    division_name: "B 본부",
    team_name: "B 팀",
  },
  teams: [
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
        user_id: 100 + (index % 4),
        name: ["심수연", "박규영", "장윤영", "원채영"][index % 4],
        profile_image_url: "",
      },
      title: `스크랩한 문의 ${inquiry_id}`,
      status: ["UNCHECKED", "IN_PROGRESS", "COMPLETED"][
        index % 3
      ] as InquiryServerStatus,
      created_at: `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}T${hour}:${minute}:00Z`,
      is_scraped: true,
    };
  }),
  pagination: {
    page: 1,
    page_size: 10,
    total: 120,
    has_next: true,
  },
};
