import { InquiryData } from "@/types/inquiryTypes";

// 기존 영어 상태를 한글로 매핑
export const STATUS_MAPPING: Record<string, string> = {
  OPEN: "확인 전",
  IN_PROGRESS: "확인 중",
  RESOLVED: "답변 완료",
  CLOSED: "답변 완료",
};

// 답변 타입 정의
// interface Comment {
//   comment_id: number;
//   writer: {
//     user_id: number;
//     name: string;
//     profile_image_url?: string;
//     team_name?: string;
//   };
//   content: string;
//   created_at: string;
//   can_delete: boolean;
// }

// 테스트용 확장 필드가 포함된 문의 타입
interface ExtendedInquiryData extends InquiryData {
  // 테스트용 필드들
  test_scenario: string;
  test_user_role: "default" | "assignee" | "writer" | "admin";
  test_current_user_id: number;
}

// Mock Data - 실제로는 단일 문의 정보만 반환
export const mockInquiryDetailResponse: {
  inquiries: ExtendedInquiryData[];
} = {
  inquiries: [
    {
      // case 1: 확인 전 상태 - 담당자 관점
      inquiry_id: 1001,
      title: "000000 하는 법 문의드립니다.",
      content:
        "당근은 모바일 서비스 특성상 별다른 비밀번호 없이 휴대폰 본인인증 절차를 통해 계정을 생성하실 수 있습니다.\n\n다만, 다른 모바일 기기에서 서비스를 연속해서 사용하기 위해서는 기존에 가입하고 인증 했던 휴대폰 번호와 고유한 사용자 식별 값(이하 CI)으로 다시 본인인증을 해야 합니다.\n\n구체적인 절차가 궁금합니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-20T10:32:11+09:00",
      writer: {
        user_id: 111,
        name: "손주완",
        profile_image_url: "/assets/images/profile.png",
        team_name: "기획팀",
      },
      assignees: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: false,
        },
        {
          user_id: 4,
          name: "이수연",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: false,
        },
      ],
      references: [
        {
          user_id: 5,
          name: "이승찬",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      files: [],
      can_edit: false,
      can_answer: true,
      can_notify: false,
      is_scrapped: false,
      confirmed_assignees_count: 0,
      confirmed_assignees: [],
      comment_count: 0,
      comments: [],
      follow_ups: [],
      test_scenario: "확인 전 상태 - 담당자(고다현) 관점",
      test_user_role: "assignee",
      test_current_user_id: 1,
    },
    {
      // case 2: 확인 중 상태 - 기본 사용자 관점
      inquiry_id: 1002,
      title: "디자인 시스템 적용 범위 문의",
      content:
        "현재 컴포넌트 라이브러리의 토큰 구조를 전사 공통으로 가져가도 되는지, 아니면 팀 단위 커스터마이징을 허용하는지 정책이 궁금합니다.\n\n특히 다음 사항들에 대해 알고 싶습니다:\n1. 브랜드 컬러 커스터마이징 가능 여부\n2. 폰트 패밀리 변경 가능 여부\n3. 컴포넌트 크기 조정 가이드라인",
      inquiry_state: "IN_PROGRESS",
      created_at: "2025-07-19T14:05:00+09:00",
      writer: {
        user_id: 777,
        name: "이승찬",
        profile_image_url: "/assets/images/profile.png",
        team_name: "프론트엔드팀",
      },
      assignees: [
        {
          user_id: 6,
          name: "이규영",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
        },
        {
          user_id: 7,
          name: "이승주",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: false,
        },
        {
          user_id: 8,
          name: "이주완",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: false,
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
      files: [],
      can_edit: false,
      can_answer: false,
      can_notify: false,
      is_scrapped: true,
      confirmed_assignees_count: 1,
      confirmed_assignees: [
        {
          user_id: 6,
          name: "이규영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      comment_count: 1,
      comments: [
        {
          comment_id: 2001,
          writer: {
            user_id: 6,
            name: "이규영",
            profile_image_url: "/assets/images/profile.png",
            team_name: "프론트엔드팀",
          },
          content:
            "현재 디자인 토큰은 전사 공통으로 관리하고 있습니다. 다만 브랜드 컬러나 특정 컴포넌트의 경우 팀별 커스터마이징이 제한적으로 허용됩니다. 자세한 가이드라인은 디자인 시스템 문서를 참고해주세요.",
          created_at: "2025-07-19T16:30:00+09:00",
          can_delete: false,
        },
      ],
      follow_ups: [],
      test_scenario: "확인 중 상태 - 기본 사용자 관점",
      test_user_role: "default",
      test_current_user_id: 999,
    },
    {
      // case 3: 답변 완료 상태 - 문의자 관점
      inquiry_id: 1003,
      title: "배포 파이프라인에서 캐시 전략 문의",
      content:
        "GitHub Actions에서 Docker 레이어 캐시를 활용하려면 어떤 설정이 필요한지, 그리고 현재 레이어 캐시가 제대로 동작하는지 확인할 방법이 있을까요.\n\n현재 빌드 시간이 너무 오래 걸려서 캐시 최적화가 필요한 상황입니다.",
      inquiry_state: "RESOLVED",
      created_at: "2025-07-18T09:12:44+09:00",
      writer: {
        user_id: 888,
        name: "김지원",
        profile_image_url: "/assets/images/profile.png",
        team_name: "백엔드팀",
      },
      assignees: [
        {
          user_id: 4,
          name: "이수연",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
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
      files: [],
      can_edit: true,
      can_answer: false,
      can_notify: false,
      is_scrapped: false,
      confirmed_assignees_count: 1,
      confirmed_assignees: [
        {
          user_id: 4,
          name: "이수연",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      comment_count: 1,
      comments: [
        {
          comment_id: 3001,
          writer: {
            user_id: 4,
            name: "이수연",
            profile_image_url: "/assets/images/profile.png",
            team_name: "Core 개발 1부",
          },
          content:
            "Docker 레이어 캐시를 위해서는 다음과 같은 설정이 필요합니다:\n\n1. `docker/build-push-action`에서 `cache-from`과 `cache-to` 설정\n2. 멀티스테이지 빌드 시 각 스테이지별 캐시 전략\n3. 의존성 변경이 적은 레이어를 앞쪽에 배치\n\n현재 캐시 동작 확인은 Actions 로그에서 'CACHED' 표시를 통해 확인할 수 있습니다.\n\n추가로, 캐시 효율성을 높이려면 .dockerignore 파일도 잘 관리해야 합니다. 불필요한 파일들이 캐시 키에 영향을 주지 않도록 주의해주세요.",
          created_at: "2025-07-18T11:20:00+09:00",
          can_delete: false,
        },
      ],
      follow_ups: [],
      test_scenario: "답변 완료 상태 - 문의자(김지원) 관점",
      test_user_role: "writer",
      test_current_user_id: 888,
    },
    {
      // case 4: 등록 보류 상태 - 문의자 관점
      inquiry_id: 1004,
      title: "로그 수집 정책 변경 관련",
      content:
        "로그 필드에 개인정보가 포함될 수 있어 필터링 정책을 개편하려고 합니다. 현행 정책 문서가 어디 있는지, 그리고 변경 시 승인 절차가 어떻게 되는지 알고 싶습니다.\n\n특히 개인정보 보호법 관련해서 주의해야 할 사항들이 있다면 알려주세요.",
      inquiry_state: "OPEN",
      created_at: "2025-07-17T17:48:20+09:00",
      writer: {
        user_id: 321,
        name: "박민수",
        profile_image_url: "/assets/images/profile.png",
        team_name: "데이터팀",
      },
      assignees: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
        },
        {
          user_id: 3,
          name: "이채영",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
        },
      ],
      references: [
        {
          user_id: 2,
          name: "이윤영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      files: [],
      can_edit: true,
      can_answer: false,
      can_notify: true,
      is_scrapped: false,
      confirmed_assignees_count: 2,
      confirmed_assignees: [
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
      comment_count: 0,
      comments: [],
      follow_ups: [],
      test_scenario: "등록 보류 상태 - 문의자(박민수) 관점",
      test_user_role: "writer",
      test_current_user_id: 321,
    },
    {
      // case 5: 팀관리자 관점
      inquiry_id: 1005,
      title: "사내 SSO 연동 가이드 요청",
      content:
        "Next.js 서비스에 사내 SSO를 붙이려고 하는데, OAuth2 클라이언트 등록 절차와 Redirect URI 정책이 궁금합니다.\n\n개발환경과 운영환경에서 다른 설정이 필요한지도 알고 싶습니다.",
      inquiry_state: "CLOSED",
      created_at: "2025-07-16T08:20:11+09:00",
      writer: {
        user_id: 642,
        name: "최서영",
        profile_image_url: "/assets/images/profile.png",
        team_name: "보안팀",
      },
      assignees: [
        {
          user_id: 5,
          name: "이승찬",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
        },
        {
          user_id: 8,
          name: "이주완",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
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
      files: [
        {
          file_name: "SSO_연동_가이드.pdf",
          file_url: "/files/sso_guide.pdf",
        },
      ],
      can_edit: false,
      can_answer: false,
      can_notify: false,
      is_scrapped: true,
      confirmed_assignees_count: 2,
      confirmed_assignees: [
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
      comment_count: 2,
      comments: [
        {
          comment_id: 5001,
          writer: {
            user_id: 5,
            name: "이승찬",
            profile_image_url: "/assets/images/profile.png",
            team_name: "프론트엔드팀",
          },
          content:
            "SSO 연동은 다음 절차를 따라주세요:\n\n1. 사내 포털에서 OAuth2 클라이언트 등록 신청\n2. 서비스명, Redirect URI, 스코프 정보 제출\n3. 보안팀 검토 후 클라이언트 ID/Secret 발급\n\nRedirect URI는 HTTPS만 허용되며, localhost는 개발환경에서만 사용 가능합니다.\n\n추가로 개발 완료 후에는 보안 점검을 받아야 합니다. 운영 배포 최소 1주일 전에 신청해주세요.",
          created_at: "2025-07-16T10:30:00+09:00",
          can_delete: true,
        },
        {
          comment_id: 5002,
          writer: {
            user_id: 8,
            name: "이주완",
            profile_image_url: "/assets/images/profile.png",
            team_name: "인프라팀",
          },
          content:
            "Next.js에서는 NextAuth.js를 사용하시는 것을 추천합니다. 사내 OAuth2 프로바이더 설정 예시 코드를 공유드릴게요.",
          created_at: "2025-07-16T14:15:00+09:00",
          can_delete: true,
        },
      ],
      follow_ups: [
        {
          follow_up_id: 5001,
          content:
            "혹시 테스트 환경에서 SSL 인증서 관련해서 추가 설정이 필요한가요?",
          created_at: "2025-07-16T18:00:00+09:00",
          writer: {
            user_id: 642,
            name: "최서영",
            profile_image_url: "/assets/images/profile.png",
          },
          comments: [
            {
              comment_id: 5004,
              writer: {
                user_id: 5,
                name: "이승찬",
                profile_image_url: "/assets/images/profile.png",
                team_name: "프론트엔드팀",
              },
              content:
                "테스트 환경에서는 자체 서명 인증서도 허용됩니다. 다만 브라우저에서 경고가 나올 수 있으니 참고해주세요.",
              created_at: "2025-07-16T18:30:00+09:00",
              can_delete: true,
            },
          ],
        },
      ],
      test_scenario: "팀관리자 관점 - 모든 글 삭제 권한",
      test_user_role: "admin",
      test_current_user_id: 1000,
    },
    {
      // case 6: 알림 발송 가능한 문의자
      inquiry_id: 1006,
      title: "CI 기준 계정 최대 3개 제한 관련 문의",
      content:
        "한 개의 휴대폰 번호로 계정 1개만 생성 가능하고 CI 기준 최대 3개의 계정을 만들 수 있다고 하셨는데, 예외 케이스가 있는지 알고 싶습니다.\n\n특히 법인 사용자의 경우 어떻게 처리되는지 궁금합니다.",
      inquiry_state: "OPEN",
      created_at: "2025-07-26T10:00:00+09:00",
      writer: {
        user_id: 999,
        name: "오지훈",
        profile_image_url: "/assets/images/profile.png",
        team_name: "QA팀",
      },
      assignees: [
        {
          user_id: 7,
          name: "이승주",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: false,
        },
      ],
      references: [
        {
          user_id: 1,
          name: "고다현",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      files: [],
      can_edit: true,
      can_answer: false,
      can_notify: true,
      is_scrapped: false,
      confirmed_assignees_count: 0,
      confirmed_assignees: [],
      comment_count: 0,
      comments: [],
      follow_ups: [],
      test_scenario: "알림 발송 가능한 문의자 관점",
      test_user_role: "writer",
      test_current_user_id: 999,
    },
    {
      // case 7: 담당자가 한 명인 경우 - 등록 보류 불가능
      inquiry_id: 1007,
      title: "프로필 이미지 업로드 용량 제한",
      content:
        "프로필 이미지 업로드 시 허용 용량과 확장자 제한이 어떻게 되는지 문의드립니다.\n\n현재 5MB 이상의 이미지가 업로드되지 않는 상황입니다.",
      inquiry_state: "RESOLVED",
      created_at: "2025-07-14T11:05:33+09:00",
      writer: {
        user_id: 100,
        name: "정은지",
        profile_image_url: "/assets/images/profile.png",
        team_name: "디자인팀",
      },
      assignees: [
        {
          user_id: 2,
          name: "이윤영",
          profile_image_url: "/assets/images/profile.png",
          is_confirmed: true,
        },
      ],
      references: [
        {
          user_id: 8,
          name: "이주완",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      files: [],
      can_edit: false,
      can_answer: true,
      can_notify: false,
      is_scrapped: false,
      confirmed_assignees_count: 1,
      confirmed_assignees: [
        {
          user_id: 2,
          name: "이윤영",
          profile_image_url: "/assets/images/profile.png",
        },
      ],
      comment_count: 1,
      comments: [
        {
          comment_id: 7001,
          writer: {
            user_id: 2,
            name: "이윤영",
            profile_image_url: "/assets/images/profile.png",
            team_name: "Core 개발 2부",
          },
          content:
            "프로필 이미지 업로드 제한사항:\n\n• 최대 용량: 5MB\n• 허용 확장자: JPG, PNG, GIF\n• 권장 해상도: 200x200px 이상\n• 정사각형 비율 권장\n\n업로드 후 자동으로 리사이징되며, 원본은 30일 후 삭제됩니다.",
          created_at: "2025-07-14T13:20:00+09:00",
          can_delete: false,
        },
      ],
      follow_ups: [],
      test_scenario: "담당자 1명인 경우 - 담당자(이윤영) 관점",
      test_user_role: "assignee",
      test_current_user_id: 2,
    },
  ],
};
