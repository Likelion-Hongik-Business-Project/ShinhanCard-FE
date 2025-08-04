import { InterestMember } from "@/types/home";
import {
  AssignedInquiryItem,
  HomeInitialResponse,
  InquiryServerStatus,
  MyInquiryItem,
  UncheckedAnswerListResponse,
  UncheckedInquiryListResponse,
} from "@/types/inquiry";

export const MOCK_HOME_MEMBER_RESPONSE: InterestMember = {
  isSuccess: true,
  code: "COMMON200",
  message: "요청 처리 성공",
  result: {
    interest_count: 6,
    interest_members: [
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "김태경",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "김태경",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
      {
        name: "원채영",
        member_id: "123",
        group_name: "경영기획",
        division_name: "ICT 본부",
        team_name: "Core 개발 2부",
        profile_image_url: "/assets/images/profile.png",
      },
    ],
  },
};

// 홈페이지 초기 진입 Mock 데이터
export const MOCK_HOME_INITIAL_RESPONSE: HomeInitialResponse = {
  total_unchecked_answer_count: 15,
  total_unchecked_inquiries_count: 12,
  interest_count: 3,
  writer: {
    id: 301,
    name: "장윤영",
    profile_image_url: "/assets/images/profile.png",
  },
  selected_team: {
    team_id: 1,
    group_name: "그룹 A",
    division_name: "0000 본부",
    team_name: "@@@ 팀",
  },
  unchecked_answer_teams: [
    {
      team_id: 1,
      group_name: "그룹 A",
      division_name: "0000 본부",
      team_name: "@@@ 팀",
    },
    {
      team_id: 2,
      group_name: "그룹 B",
      division_name: "1111 본부",
      team_name: "### 팀",
    },
    {
      team_id: 3,
      group_name: "그룹 C",
      division_name: "2222 본부",
      team_name: "$$$ 팀",
    },
  ],
  unchecked_inquiries_teams: [
    {
      team_id: 1,
      group_name: "그룹 A",
      division_name: "0000 본부",
      team_name: "@@@ 팀",
    },
    {
      team_id: 2,
      group_name: "그룹 B",
      division_name: "1111 본부",
      team_name: "### 팀",
    },
    {
      team_id: 3,
      group_name: "그룹 C",
      division_name: "2222 본부",
      team_name: "$$$ 팀",
    },
  ],
  inquiries: Array.from({ length: 15 }, (_, index) => {
    const inquiry_id = 1000 + index;

    const totalMonths = (2025 - 2015) * 12 + 7 - 1;
    const currentTotalMonths = totalMonths - index;

    const year = 2015 + Math.floor(currentTotalMonths / 12);
    const month = (currentTotalMonths % 12) + 1;
    const day = (index % 28) + 1;
    const hour = (index % 24).toString().padStart(2, "0");
    const minute = (index % 60).toString().padStart(2, "0");

    const created_at = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour}:${minute}:00Z`;

    return {
      inquiry_id,
      title: `${inquiry_id} 문의 드립니다.`,
      inquiry_assignees: [
        {
          id: 300 + (index % 5),
          name: ["장윤영", "심수연", "원채영", "박규영", "김홍엽"][index % 5],
          profile_image_url: "",
        },
      ],
      status: "UNCHECKED" as InquiryServerStatus,
      created_at,
      is_scraped: index % 2 === 0,
    } as MyInquiryItem;
  }),
  pagination: {
    page: 1,
    page_size: 10,
    total: 15,
    has_next: true,
  },
};

// 미확인 답변 리스트 Mock 데이터
export const MOCK_UNCHECKED_ANSWER_RESPONSE: UncheckedAnswerListResponse = {
  selected_team: {
    team_id: 1,
    group_name: "그룹 A",
    division_name: "0000 본부",
    team_name: "@@@ 팀",
  },
  inquiries: Array.from({ length: 15 }, (_, index) => {
    const inquiry_id = 1000 + index;

    const totalMonths = (2025 - 2015) * 12 + 7 - 1;
    const currentTotalMonths = totalMonths - index;

    const year = 2015 + Math.floor(currentTotalMonths / 12);
    const month = (currentTotalMonths % 12) + 1;
    const day = (index % 28) + 1;
    const hour = (index % 24).toString().padStart(2, "0");
    const minute = (index % 60).toString().padStart(2, "0");

    const created_at = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour}:${minute}:00Z`;

    return {
      inquiry_id,
      title: `${inquiry_id} 문의 드립니다.`,
      inquiry_assignees: [
        {
          id: 300 + (index % 5),
          name: ["장윤영", "심수연", "원채영", "박규영", "김홍엽"][index % 5],
          profile_image_url: "",
        },
      ],
      status: "UNCHECKED" as InquiryServerStatus,
      created_at,
      is_scraped: index % 2 === 0,
    } as MyInquiryItem;
  }),
  pagination: {
    page: 1,
    page_size: 10,
    total: 15,
    has_next: true,
  },
};

// 미확인 문의 리스트 Mock 데이터
export const MOCK_UNCHECKED_INQUIRY_RESPONSE: UncheckedInquiryListResponse = {
  selected_team: {
    team_id: 1,
    group_name: "그룹 A",
    division_name: "0000 본부",
    team_name: "@@@ 팀",
  },
  inquiries: Array.from({ length: 12 }, (_, index) => {
    const inquiry_id = 2000 + index;

    const totalMonths = (2025 - 2015) * 12 + 7 - 1;
    const currentTotalMonths = totalMonths - index;

    const year = 2015 + Math.floor(currentTotalMonths / 12);
    const month = (currentTotalMonths % 12) + 1;
    const day = (index % 28) + 1;
    const hour = (index % 24).toString().padStart(2, "0");
    const minute = (index % 60).toString().padStart(2, "0");

    const created_at = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour}:${minute}:00Z`;

    return {
      inquiry_id,
      writer: {
        user_id: 300 + (index % 5),
        name: ["장윤영", "심수연", "원채영", "박규영", "김홍엽"][index % 5],
        profile_image_url: "",
      },
      title: `${inquiry_id} 문의 드립니다.`,
      status: ["UNCHECKED", "IN_PROGRESS", "COMPLETED"][
        index % 3
      ] as InquiryServerStatus,
      created_at,
      is_scraped: index % 2 === 0,
    } as AssignedInquiryItem;
  }),
  pagination: {
    page: 1,
    page_size: 10,
    total: 12,
    has_next: true,
  },
};

// 기존 데이터와의 호환성을 위한 별칭
export const homepageData = {
  id: MOCK_HOME_INITIAL_RESPONSE.writer.id,
  name: MOCK_HOME_INITIAL_RESPONSE.writer.name,
  profile_image_url: MOCK_HOME_INITIAL_RESPONSE.writer.profile_image_url,
  answer_count: MOCK_HOME_INITIAL_RESPONSE.total_unchecked_answer_count,
  inquiry_count: MOCK_HOME_INITIAL_RESPONSE.total_unchecked_inquiries_count,
  interest_count: MOCK_HOME_INITIAL_RESPONSE.interest_count,
};

export const homeTeams = MOCK_HOME_INITIAL_RESPONSE.unchecked_answer_teams;
