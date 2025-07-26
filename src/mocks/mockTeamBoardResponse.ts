import { TeamBoardResponse } from "@/types/teamBoard";

export const mockTeamBoardResponse: TeamBoardResponse = {
  team_id: 2002,
  group_name: "경영기획 그룹",
  division_name: "ICT 기획본부",
  team_name: "Core 개발 2부팀",
  inquiry_count: 42,
  inquiries: [
    {
      inquiry_id: 1001,
      title: "피그마 어떻게 써요",
      content_preview:
        "당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. 당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다. ",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 501,
        name: "홍길동",
        profile_image_url: "https://example.com/profiles/501.png",
      },
      is_scrapped: false,
    },
    {
      inquiry_id: 1002,
      title: "디자인 시스템 적용 범위 문의",
      content_preview:
        "현재 컴포넌트 라이브러리의 토큰 구조를 전사 공통으로 가져가도 되는지, 아니면 팀 단위 커스터마이징을 허용하는지 정책이 궁금합니다.",
      inquiry_state: "IN_PROGRESS",
      created_at: "2025-07-19T14:05:00+09:00",
      writer: {
        user_id: 777,
        name: "이승찬",
        profile_image_url: "https://example.com/profiles/777.jpg",
      },
      is_scrapped: true,
    },
    {
      inquiry_id: 1003,
      title: "배포 파이프라인에서 캐시 전략 문의",
      content_preview:
        "GitHub Actions에서 Docker 레이어 캐시를 활용하려면 어떤 설정이 필요한지, 그리고 현재 레이어 캐시가 제대로 동작하는지 확인할 방법이 있을까요.",
      inquiry_state: "RESOLVED",
      created_at: "2025-07-18T09:12:44+09:00",
      writer: {
        user_id: 888,
        name: "김지원",
        profile_image_url: "https://example.com/profiles/888.png",
      },
      is_scrapped: false,
    },
    {
      inquiry_id: 1004,
      title: "로그 수집 정책 변경 관련",
      content_preview:
        "로그 필드에 개인정보가 포함될 수 있어 필터링 정책을 개편하려고 합니다. 현행 정책 문서가 어디 있는지, 그리고 변경 시 승인 절차가 어떻게 되는지 알고 싶습니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-17T17:48:20+09:00",
      writer: {
        user_id: 321,
        name: "박민수",
        profile_image_url: "https://example.com/profiles/321.webp",
      },
      is_scrapped: false,
    },
    {
      inquiry_id: 1005,
      title: "사내 SSO 연동 가이드 요청",
      content_preview:
        "Next.js 서비스에 사내 SSO를 붙이려고 하는데, OAuth2 클라이언트 등록 절차와 Redirect URI 정책이 궁금합니다.",
      inquiry_state: "CLOSED",
      created_at: "2025-07-16T08:20:11+09:00",
      writer: {
        user_id: 642,
        name: "최서영",
        profile_image_url: "https://example.com/profiles/642.png",
      },
      is_scrapped: true,
    },
    {
      inquiry_id: 1006,
      title: "CI 기준 계정 최대 3개 제한 관련 문의",
      content_preview:
        "한 개의 휴대폰 번호로 계정 1개만 생성 가능하고 CI 기준 최대 3개의 계정을 만들 수 있다고 하셨는데, 예외 케이스가 있는지 알고 싶습니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-15T22:11:00+09:00",
      writer: {
        user_id: 999,
        name: "오지훈",
        profile_image_url: "https://example.com/profiles/999.jpg",
      },
      is_scrapped: false,
    },
    {
      inquiry_id: 1007,
      title: "프로필 이미지 업로드 용량 제한",
      content_preview:
        "프로필 이미지 업로드 시 허용 용량과 확장자 제한이 어떻게 되는지 문의드립니다.",
      inquiry_state: "RESOLVED",
      created_at: "2025-07-14T11:05:33+09:00",
      writer: {
        user_id: 100,
        name: "정은지",
        profile_image_url: "https://example.com/profiles/100.png",
      },
      is_scrapped: false,
    },
  ],
  pagination: {
    page: 1,
    page_size: 10,
    total: 42,
    has_next: true,
  },
};
