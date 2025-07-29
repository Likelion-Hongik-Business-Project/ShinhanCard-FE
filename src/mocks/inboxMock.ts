import { InboxResponse } from "@/types/inbox";

export const MOCK_INBOX_RESPONSE: InboxResponse = {
  total_pending_count: 10,
  teams: [
    {
      team_id: 2,
      group_name: "지원그룹",
      division_name: "경영본부",
      team_name: "기획운영팀",
      inquiry_count: 4,
      inquiries: [
        {
          id: 104,
          writer: {
            id: 22,
            name: "강채원",
            profile_image_url: "https://example.com/profiles/22.png",
          },
          notification_text:
            "‘장윤영’님이 참조자인 새로운 문의글이 올라왔습니다.",
          created_at: "2025-07-11T09:00:00",
        },
        {
          id: 105,
          writer: {
            id: 25,
            name: "심수연",
            profile_image_url: "https://example.com/profiles/25.png",
          },
          notification_text: "‘심수연’님이 새로운 문의글을 등록했습니다.",
          created_at: "2025-07-11T08:30:00",
        },
        {
          id: 106,
          writer: {
            id: 26,
            name: "원채영",
            profile_image_url: "https://example.com/profiles/26.png",
          },
          notification_text: "‘원채영’님이 댓글을 추가했습니다.",
          created_at: "2025-07-10T18:45:00",
        },
        {
          id: 107,
          writer: {
            id: 27,
            name: "박규영",
            profile_image_url: "https://example.com/profiles/27.png",
          },
          notification_text: "‘박규영’님이 문의를 수정했습니다.",
          created_at: "2025-07-10T15:15:00",
        },
      ],
      pagination: {
        page: 1,
        page_size: 8,
        total: 4,
        has_next: false,
      },
    },
    {
      team_id: 3,
      group_name: "전략그룹",
      division_name: "사업본부",
      team_name: "콘텐츠기획팀",
      inquiry_count: 6,
      inquiries: [
        {
          id: 101,
          writer: {
            id: 23,
            name: "고다현",
            profile_image_url: "https://example.com/profiles/23.png",
          },
          notification_text: "‘고다현’님이 담당을 재요청했습니다.",
          created_at: "2025-07-10T14:20:00",
        },
        {
          id: 102,
          writer: {
            id: 28,
            name: "장윤영",
            profile_image_url: "https://example.com/profiles/28.png",
          },
          notification_text: "‘장윤영’님이 문의를 등록했습니다.",
          created_at: "2025-07-10T13:40:00",
        },
        {
          id: 103,
          writer: {
            id: 29,
            name: "손주완",
            profile_image_url: "https://example.com/profiles/29.png",
          },
          notification_text: "‘손주완’님이 참조자로 추가되었습니다.",
          created_at: "2025-07-10T12:10:00",
        },
        {
          id: 108,
          writer: {
            id: 30,
            name: "이승찬",
            profile_image_url: "https://example.com/profiles/30.png",
          },
          notification_text: "‘이승찬’님이 댓글을 남겼습니다.",
          created_at: "2025-07-10T10:55:00",
        },
        {
          id: 109,
          writer: {
            id: 31,
            name: "김다연",
            profile_image_url: "https://example.com/profiles/31.png",
          },
          notification_text: "‘김다연’님이 문의를 삭제했습니다.",
          created_at: "2025-07-10T10:20:00",
        },
        {
          id: 110,
          writer: {
            id: 32,
            name: "변희민",
            profile_image_url: "https://example.com/profiles/32.png",
          },
          notification_text: "‘변희민’님이 담당을 변경했습니다.",
          created_at: "2025-07-10T09:45:00",
        },
      ],
      pagination: {
        page: 1,
        page_size: 8,
        total: 6,
        has_next: false,
      },
    },
  ],
};

export const MOCK_ARCHIVED_INBOX_RESPONSE: InboxResponse = {
  total_pending_count: 0,
  teams: [
    {
      team_id: 4,
      group_name: "운영그룹",
      division_name: "지원본부",
      team_name: "고객지원팀",
      inquiry_count: 3,
      inquiries: [
        {
          id: 201,
          writer: {
            id: 40,
            name: "이하늘",
            profile_image_url: "https://example.com/profiles/40.png",
          },
          notification_text: "‘이하늘’님의 문의가 보관되었습니다.",
          created_at: "2025-07-05T13:10:00",
        },
        {
          id: 202,
          writer: {
            id: 41,
            name: "정예린",
            profile_image_url: "https://example.com/profiles/41.png",
          },
          notification_text:
            "‘정예린’님의 문의가 처리 완료되어 보관함으로 이동했습니다.",
          created_at: "2025-07-04T10:30:00",
        },
        {
          id: 203,
          writer: {
            id: 42,
            name: "김태윤",
            profile_image_url: "https://example.com/profiles/42.png",
          },
          notification_text: "‘김태윤’님이 완료된 문의를 보관했습니다.",
          created_at: "2025-07-03T17:20:00",
        },
      ],
      pagination: {
        page: 1,
        page_size: 8,
        total: 3,
        has_next: false,
      },
    },
    {
      team_id: 5,
      group_name: "기획그룹",
      division_name: "전략본부",
      team_name: "서비스기획팀",
      inquiry_count: 2,
      inquiries: [
        {
          id: 204,
          writer: {
            id: 43,
            name: "오지현",
            profile_image_url: "https://example.com/profiles/43.png",
          },
          notification_text: "‘오지현’님이 완료된 문의를 보관처리했습니다.",
          created_at: "2025-07-02T09:50:00",
        },
        {
          id: 205,
          writer: {
            id: 44,
            name: "박선우",
            profile_image_url: "https://example.com/profiles/44.png",
          },
          notification_text: "‘박선우’님의 문의가 자동 보관 처리되었습니다.",
          created_at: "2025-07-01T08:00:00",
        },
      ],
      pagination: {
        page: 1,
        page_size: 8,
        total: 2,
        has_next: false,
      },
    },
  ],
};
