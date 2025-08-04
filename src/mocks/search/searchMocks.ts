import {
  RecentSearchData,
  RecommendSearchData,
  SearchResultData,
} from "@/types/search/search";

export const recentSearchMockData: RecentSearchData = {
  keywords: [
    "기획운영",
    "지원그룹 회의록",
    "신규 ",
    "김홍엽",
    "프로젝트 계획서",
    "월간 보고서",
    "팀 미팅",
    "개발 환경 설정",
    "데이터 분석",
    "사용자 피드백",
  ],
};

export const recommendSearchMockData: RecommendSearchData = {
  total_count: 5,
  inquiries: [
    {
      inquiry_id: 1004,
      title: "피그마 어떻게 써요",
      group_name: "경영기획 그룹",
      division_name: "ICT 본부",
      team_name: "Core 개발 2부",
    },
    {
      inquiry_id: 1005,
      title: "피그마 어떻게 써요",
      group_name: "경영기획 그룹",
      division_name: "ICT 본부",
      team_name: "Core 개발 2부",
    },
    {
      inquiry_id: 1006,
      title: "피그마 디자인 시스템",
      group_name: "UX/UI 그룹",
      division_name: "디자인 본부",
      team_name: "디자인 시스템팀",
    },
    {
      inquiry_id: 1007,
      title: "피그마 프로토타이핑",
      group_name: "UX/UI 그룹",
      division_name: "디자인 본부",
      team_name: "프로토타입팀",
    },
    {
      inquiry_id: 1008,
      title: "피그마 플러그인 개발",
      group_name: "개발 그룹",
      division_name: "ICT 본부",
      team_name: "플러그인팀",
    },
  ],
};

// 검색 결과 조회 Mock 데이터
export const searchResultsMockData: SearchResultData = {
  total_count: 33,
  inquiries: [
    {
      inquiry_id: 1001, // 문의글 ID
      title: "피그마 어떻게 써요", // 문의 제목
      content_preview: "Figma 협업 기능에 대해 설명 요청드립니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 1,
        name: "김철수",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "경영기획 그룹", // 그룹 이름
      division_name: "ICT 본부", // 본부 이름
      team_name: "Core 개발 2부", // 팀 이름
    },
    {
      inquiry_id: 1002, // 문의글 ID
      title: "피그마 디자인 시스템 구축", // 문의 제목
      content_preview:
        "디자인 시스템 구축 방법과 베스트 프랙티스를 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 2,
        name: "이영희",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "UX/UI 그룹", // 그룹 이름
      division_name: "디자인 본부", // 본부 이름
      team_name: "디자인 시스템팀", // 팀 이름
    },
    {
      inquiry_id: 1003, // 문의글 ID
      title: "피그마 프로토타이핑 가이드", // 문의 제목
      content_preview: "프로토타이핑 작업 시 주의사항과 팁을 공유해주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 3,
        name: "박민수",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "UX/UI 그룹", // 그룹 이름
      division_name: "디자인 본부", // 본부 이름
      team_name: "프로토타입팀", // 팀 이름
    },
    {
      inquiry_id: 1004, // 문의글 ID
      title: "피그마 플러그인 개발 방법", // 문의 제목
      content_preview:
        "플러그인 개발을 위한 개발 환경 설정과 기본 구조를 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 4,
        name: "정수진",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "개발 그룹", // 그룹 이름
      division_name: "ICT 본부", // 본부 이름
      team_name: "플러그인팀", // 팀 이름
    },
    {
      inquiry_id: 1005, // 문의글 ID
      title: "피그마 협업 워크플로우", // 문의 제목
      content_preview:
        "팀 협업 시 효율적인 워크플로우를 구축하는 방법을 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 5,
        name: "최지원",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "UX/UI 그룹", // 그룹 이름
      division_name: "디자인 본부", // 본부 이름
      team_name: "디자인 시스템팀", // 팀 이름
    },
    {
      inquiry_id: 1006, // 문의글 ID
      title: "피그마 컴포넌트 라이브러리", // 문의 제목
      content_preview:
        "재사용 가능한 컴포넌트 라이브러리 구축 방법을 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 6,
        name: "한소영",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "UX/UI 그룹", // 그룹 이름
      division_name: "디자인 본부", // 본부 이름
      team_name: "디자인 시스템팀", // 팀 이름
    },
    {
      inquiry_id: 1007, // 문의글 ID
      title: "피그마 애니메이션 효과", // 문의 제목
      content_preview:
        "인터랙션과 애니메이션 효과를 구현하는 방법을 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 7,
        name: "송태호",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "UX/UI 그룹", // 그룹 이름
      division_name: "디자인 본부", // 본부 이름
      team_name: "디자인 시스템팀", // 팀 이름
    },
    {
      inquiry_id: 1008, // 문의글 ID
      title: "피그마 API 연동", // 문의 제목
      content_preview:
        "외부 API와 연동하여 데이터를 시각화하는 방법을 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 8,
        name: "임동현",
        profile_image_url: "",
      },
      is_scrapped: false,
      group_name: "개발 그룹", // 그룹 이름
      division_name: "ICT 본부", // 본부 이름
      team_name: "플러그인팀", // 팀 이름
    },
  ],
  pagination: {
    page: 1,
    page_size: 6,
    total: 33,
    has_next: true,
  },
};
