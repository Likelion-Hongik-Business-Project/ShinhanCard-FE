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
          notification_text: "답변이 완료되었습니다. 답변을 확인해주세요.",
          created_at: "2025-07-11T09:00:00",
        },
        {
          id: 105,
          writer: {
            id: 25,
            name: "심수연",
            profile_image_url: "https://example.com/profiles/25.png",
          },
          notification_text:
            "심수연님이 회원님의 문의에 답변을 등록하였습니다.",
          created_at: "2025-07-11T08:30:00",
        },
        {
          id: 106,
          writer: {
            id: 26,
            name: "원채영",
            profile_image_url: "https://example.com/profiles/26.png",
          },
          notification_text: "원채영님이 남긴 문의에 담당자로 지정되었습니다.",
          created_at: "2025-07-10T18:45:00",
        },
        {
          id: 107,
          writer: {
            id: 27,
            name: "박규영",
            profile_image_url: "https://example.com/profiles/27.png",
          },
          notification_text: "박규영님이 남긴 문의에 참조자로 지정되었습니다.",
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
          notification_text:
            "담당 문의에 대한 확인 요청 알림이 도착하였습니다.",
          created_at: "2025-07-10T14:20:00",
        },
        {
          id: 102,
          writer: {
            id: 28,
            name: "장윤영",
            profile_image_url: "https://example.com/profiles/28.png",
          },
          notification_text: "장윤영님이 추가 문의에서 회원님을 언급했습니다.",
          created_at: "2025-07-10T13:40:00",
        },
        {
          id: 103,
          writer: {
            id: 29,
            name: "손주완",
            profile_image_url: "https://example.com/profiles/29.png",
          },
          notification_text: "회원님이 남긴 추가 문의에 새 답글이 달렸습니다.",
          created_at: "2025-07-10T12:10:00",
        },
        {
          id: 108,
          writer: {
            id: 30,
            name: "이승찬",
            profile_image_url: "https://example.com/profiles/30.png",
          },
          notification_text:
            "문의 등록이 보류되었습니다. 담당자를 수정해주세요.",
          created_at: "2025-07-10T10:55:00",
        },
        {
          id: 109,
          writer: {
            id: 31,
            name: "김다연",
            profile_image_url: "https://example.com/profiles/31.png",
          },
          notification_text: "관리자에 의해 문의글이 삭제되었습니다.",
          created_at: "2025-07-10T10:20:00",
        },
        {
          id: 110,
          writer: {
            id: 32,
            name: "변희민",
            profile_image_url: "https://example.com/profiles/32.png",
          },
          notification_text: "변희민님이 추가 문의에서 회원님을 언급했습니다.",
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
          notification_text: "답변이 완료되었습니다. 답변을 확인해주세요.",
          created_at: "2025-07-05T13:10:00",
        },
        {
          id: 202,
          writer: {
            id: 41,
            name: "정예린",
            profile_image_url: "https://example.com/profiles/41.png",
          },
          notification_text: "답변이 완료되었습니다. 답변을 확인해주세요.",
          created_at: "2025-07-04T10:30:00",
        },
        {
          id: 203,
          writer: {
            id: 42,
            name: "김태윤",
            profile_image_url: "https://example.com/profiles/42.png",
          },
          notification_text:
            "김태윤님이 회원님의 문의에 답변을 등록하였습니다.",
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
          notification_text: "오지현님이 남긴 문의에 담당자로 지정되었습니다.",
          created_at: "2025-07-02T09:50:00",
        },
        {
          id: 205,
          writer: {
            id: 44,
            name: "박선우",
            profile_image_url: "https://example.com/profiles/44.png",
          },
          notification_text: "박선우님이 남긴 문의에 참조자로 지정되었습니다.",
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
