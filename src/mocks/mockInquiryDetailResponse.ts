import { TeamBoardResponse } from "@/types/teamBoard";

// 기존 영어 상태를 한글로 매핑 (하위 호환용)
export const STATUS_MAPPING: Record<string, string> = {
  OPEN: "확인 전",
  IN_PROGRESS: "확인 중",
  RESOLVED: "답변 완료",
  CLOSED: "답변 완료",
};

// 답변 타입 정의
interface Answer {
  answer_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
  };
  is_edited: boolean;
}

// 확장된 문의 타입
interface ExtendedInquiry {
  inquiry_id: number;
  title: string;
  content_preview: string;
  inquiry_state: string;
  created_at: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
  };
  assignees?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  references?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  is_scrapped: boolean;

  // 새로 추가된 필드들
  confirmed_assignees: number[]; // 확인한 담당자 ID들
  answers_count: number; // 답변 개수
  answers?: Answer[]; // 답변 목록
  last_notification_sent?: string; // 마지막 알림 발송 시간

  // 테스트용 필드들
  test_scenario: string; // 테스트 case 설명
  test_user_role: "default" | "assignee" | "writer" | "admin";
  test_current_user_id: number;
}

export const mockInquiryDetailResponse: TeamBoardResponse & {
  inquiries: ExtendedInquiry[];
} = {
  team_id: 2002,
  group_name: "경영기획 그룹",
  division_name: "ICT 기획본부",
  team_name: "Core 개발 2부팀",
  inquiry_count: 42,
  inquiries: [
    {
      // case 1: 확인 전 상태 - 담당자 관점
      inquiry_id: 1001,
      title: "000000 하는 법 문의드립니다.",
      content_preview:
        "당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다. 다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 111,
        name: "손주완",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 4,
          name: "이수연",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      references: [
        {
          user_id: 5,
          name: "이승찬",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: false,
      confirmed_assignees: [], // 아무도 확인하지 않음
      answers_count: 0, // 답변 없음
      answers: [], // 빈 답변 배열
      test_scenario: "확인 전 상태 - 담당자(고다현) 관점",
      test_user_role: "assignee",
      test_current_user_id: 1, // 고다현
    },
    {
      // case 2: 확인 중 상태 - 기본 사용자 관점
      inquiry_id: 1002,
      title: "디자인 시스템 적용 범위 문의",
      content_preview:
        "현재 컴포넌트 라이브러리의 토큰 구조를 전사 공통으로 가져가도 되는지, 아니면 팀 단위 커스터마이징을 허용하는지 정책이 궁금합니다.",
      inquiry_state: "IN_PROGRESS",
      created_at: "2025-07-19T14:05:00+09:00",
      writer: {
        user_id: 777,
        name: "이승찬",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 6,
          name: "이규영",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 7,
          name: "이승주",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 8,
          name: "이주완",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      references: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 2,
          name: "이윤영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: true,
      confirmed_assignees: [6], // 이규영만 확인함
      answers_count: 1, // 답변 1개
      answers: [
        {
          answer_id: 2001,
          content:
            "현재 디자인 토큰은 전사 공통으로 관리하고 있습니다. 다만 브랜드 컬러나 특정 컴포넌트의 경우 팀별 커스터마이징이 제한적으로 허용됩니다. 자세한 가이드라인은 디자인 시스템 문서를 참고해주세요.",
          created_at: "2025-07-19T16:30:00+09:00",
          writer: {
            user_id: 6,
            name: "이규영",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: false,
        },
      ],
      test_scenario: "확인 중 상태 - 기본 사용자 관점",
      test_user_role: "default",
      test_current_user_id: 999, // 관련 없는 사용자
    },
    {
      // case 3: 답변 완료 상태 - 문의자 관점
      inquiry_id: 1003,
      title: "배포 파이프라인에서 캐시 전략 문의",
      content_preview:
        "GitHub Actions에서 Docker 레이어 캐시를 활용하려면 어떤 설정이 필요한지, 그리고 현재 레이어 캐시가 제대로 동작하는지 확인할 방법이 있을까요.",
      inquiry_state: "RESOLVED",
      created_at: "2025-07-18T09:12:44+09:00",
      writer: {
        user_id: 888,
        name: "김지원",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 4,
          name: "이수연",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      references: [
        {
          user_id: 5,
          name: "이승찬",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 6,
          name: "이규영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: false,
      confirmed_assignees: [4], // 모든 담당자 확인
      answers_count: 2, // 답변 2개
      answers: [
        {
          answer_id: 3001,
          content:
            "Docker 레이어 캐시를 위해서는 다음과 같은 설정이 필요합니다:\n\n1. `docker/build-push-action`에서 `cache-from`과 `cache-to` 설정\n2. 멀티스테이지 빌드 시 각 스테이지별 캐시 전략\n3. 의존성 변경이 적은 레이어를 앞쪽에 배치\n\n현재 캐시 동작 확인은 Actions 로그에서 'CACHED' 표시를 통해 확인할 수 있습니다.",
          created_at: "2025-07-18T11:20:00+09:00",
          writer: {
            user_id: 4,
            name: "이수연",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: false,
        },
        {
          answer_id: 3002,
          content:
            "추가로, 캐시 효율성을 높이려면 .dockerignore 파일도 잘 관리해야 합니다. 불필요한 파일들이 캐시 키에 영향을 주지 않도록 주의해주세요.",
          created_at: "2025-07-18T14:45:00+09:00",
          updated_at: "2025-07-18T14:50:00+09:00",
          writer: {
            user_id: 4,
            name: "이수연",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: true,
        },
      ],
      last_notification_sent: "2025-07-18T13:00:00+09:00", // 4시간 전 알림 발송
      test_scenario: "답변 완료 상태 - 문의자(김지원) 관점",
      test_user_role: "writer",
      test_current_user_id: 888, // 김지원
    },
    {
      // case 4: 등록 보류 상태 - 문의자 관점
      inquiry_id: 1004,
      title: "로그 수집 정책 변경 관련",
      content_preview:
        "로그 필드에 개인정보가 포함될 수 있어 필터링 정책을 개편하려고 합니다. 현행 정책 문서가 어디 있는지, 그리고 변경 시 승인 절차가 어떻게 되는지 알고 싶습니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-17T17:48:20+09:00",
      writer: {
        user_id: 321,
        name: "박민수",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 3,
          name: "이채영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      references: [
        {
          user_id: 2,
          name: "이윤영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: false,
      confirmed_assignees: [1, 3], // 모든 담당자 확인했지만
      answers_count: 0, // 답변은 없음 → 등록 보류 상태
      answers: [],
      test_scenario: "등록 보류 상태 - 문의자(박민수) 관점",
      test_user_role: "writer",
      test_current_user_id: 321, // 박민수
    },
    {
      // case 5: 팀관리자 관점
      inquiry_id: 1005,
      title: "사내 SSO 연동 가이드 요청",
      content_preview:
        "Next.js 서비스에 사내 SSO를 붙이려고 하는데, OAuth2 클라이언트 등록 절차와 Redirect URI 정책이 궁금합니다.",
      inquiry_state: "CLOSED",
      created_at: "2025-07-16T08:20:11+09:00",
      writer: {
        user_id: 642,
        name: "최서영",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 5,
          name: "이승찬",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 8,
          name: "이주완",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      references: [
        {
          user_id: 4,
          name: "이수연",
          profile_image_url: "/assets/images/profile.png",
        },
        {
          user_id: 6,
          name: "이규영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: true,
      confirmed_assignees: [5, 8], // 모든 담당자 확인
      answers_count: 3, // 답변 3개
      answers: [
        {
          answer_id: 5001,
          content:
            "SSO 연동은 다음 절차를 따라주세요:\n\n1. 사내 포털에서 OAuth2 클라이언트 등록 신청\n2. 서비스명, Redirect URI, 스코프 정보 제출\n3. 보안팀 검토 후 클라이언트 ID/Secret 발급\n\nRedirect URI는 HTTPS만 허용되며, localhost는 개발환경에서만 사용 가능합니다.",
          created_at: "2025-07-16T10:30:00+09:00",
          writer: {
            user_id: 5,
            name: "이승찬",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: false,
        },
        {
          answer_id: 5002,
          content:
            "Next.js에서는 NextAuth.js를 사용하시는 것을 추천합니다. 사내 OAuth2 프로바이더 설정 예시 코드를 공유드릴게요.",
          created_at: "2025-07-16T14:15:00+09:00",
          writer: {
            user_id: 8,
            name: "이주완",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: false,
        },
        {
          answer_id: 5003,
          content:
            "추가로 개발 완료 후에는 보안 점검을 받아야 합니다. 운영 배포 최소 1주일 전에 신청해주세요.",
          created_at: "2025-07-16T16:45:00+09:00",
          writer: {
            user_id: 5,
            name: "이승찬",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: false,
        },
      ],
      test_scenario: "팀관리자 관점 - 모든 글 삭제 권한",
      test_user_role: "admin",
      test_current_user_id: 1000, // 팀관리자
    },
    {
      // case 6: 알림 발송 가능한 문의자
      inquiry_id: 1006,
      title: "CI 기준 계정 최대 3개 제한 관련 문의",
      content_preview:
        "한 개의 휴대폰 번호로 계정 1개만 생성 가능하고 CI 기준 최대 3개의 계정을 만들 수 있다고 하셨는데, 예외 케이스가 있는지 알고 싶습니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-26T10:00:00+09:00", // 4시간 이상 전
      writer: {
        user_id: 999,
        name: "오지훈",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 7,
          name: "이승주",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      references: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: false,
      confirmed_assignees: [], // 아직 확인 안함
      answers_count: 0, // 답변 없음
      answers: [],
      test_scenario: "알림 발송 가능한 문의자 관점",
      test_user_role: "writer",
      test_current_user_id: 999, // 오지훈
    },
    {
      // case 7: 담당자가 한 명인 경우 - 등록 보류 불가능
      inquiry_id: 1007,
      title: "프로필 이미지 업로드 용량 제한",
      content_preview:
        "프로필 이미지 업로드 시 허용 용량과 확장자 제한이 어떻게 되는지 문의드립니다.",
      inquiry_state: "RESOLVED",
      created_at: "2025-07-14T11:05:33+09:00",
      writer: {
        user_id: 100,
        name: "정은지",
        profile_image_url: "/assets/images/profile.png",
      },
      assignees: [
        {
          user_id: 2,
          name: "이윤영",
          profile_image_url: "/assets/images/profile.png",
        }, // 담당자 1명
      ],
      references: [
        {
          user_id: 8,
          name: "이주완",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      is_scrapped: false,
      confirmed_assignees: [2], // 유일한 담당자 확인
      answers_count: 1, // 답변 1개 → 답변 완료 상태
      answers: [
        {
          answer_id: 7001,
          content:
            "프로필 이미지 업로드 제한사항:\n\n• 최대 용량: 5MB\n• 허용 확장자: JPG, PNG, GIF\n• 권장 해상도: 200x200px 이상\n• 정사각형 비율 권장\n\n업로드 후 자동으로 리사이징되며, 원본은 30일 후 삭제됩니다.",
          created_at: "2025-07-14T13:20:00+09:00",
          writer: {
            user_id: 2,
            name: "이윤영",
            profile_image_url: "/assets/images/profile.png",
          },
          is_edited: false,
        },
      ],
      test_scenario: "담당자 1명인 경우 - 담당자(이윤영) 관점",
      test_user_role: "assignee",
      test_current_user_id: 2, // 이윤영
    },
  ],
  pagination: {
    page: 1,
    page_size: 10,
    total: 42,
    has_next: true,
  },
};
