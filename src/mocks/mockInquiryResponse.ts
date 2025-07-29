import { InquiryResponse } from "@/types/InquiryResponse";

export const mockInquiryResponse: InquiryResponse = {
  inquiry_id: 1001,
  title: "회원가입 시 500 에러 문의",
  content: `회원가입을 시도할 때 서버에서 500 에러가 발생합니다.

- 발생 환경: Android Chrome
- 재현 방법:
  1. 회원가입 페이지 진입
  2. 이메일·비밀번호 입력
  3. ‘가입하기’ 버튼 클릭

에러 로그:
\`\`\`
POST /api/signup 500 Internal Server Error
\`\`\``,
  created_at: "2025-07-28T09:30:00Z",
  inquiry_state: "최종완료",
  writer: {
    user_id: 501,
    name: "김철수",
    profile_image_url: "https://example.com/profiles/501.png",
  },
  assignees: [
    {
      user_id: 601,
      name: "강채원",
      profile_image_url: "https://example.com/profiles/601.png",
      is_confirmed: true,
    },
    {
      user_id: 602,
      name: "고다현",
      profile_image_url: "https://example.com/profiles/602.png",
      is_confirmed: true,
    },
    {
      user_id: 603,
      name: "장윤영",
      profile_image_url: "https://example.com/profiles/603.png",
      is_confirmed: false,
    },
  ],
  references: [
    {
      user_id: 701,
      name: "홍길동",
      profile_image_url: "https://example.com/profiles/701.png",
    },
  ],
  files: [
    {
      file_name: "error_screenshot.png",
      file_url: "https://example.com/files/error_screenshot.png",
    },
    {
      file_name: "server.log",
      file_url: "https://example.com/files/server.log",
    },
  ],
  can_edit: false,
  can_answer: true,
  can_notify: true,
  is_scrapped: false,
  confirmed_assignees_count: 2,
  confirmed_assignees: [
    {
      user_id: 601,
      name: "강채원",
      profile_image_url: "https://example.com/profiles/601.png",
    },
    {
      user_id: 602,
      name: "고다현",
      profile_image_url: "https://example.com/profiles/602.png",
    },
  ],
  comment_count: 6,
  comments: [
    {
      comment_id: 8001,
      writer: {
        user_id: 601,
        name: "강채원",
        profile_image_url: "https://example.com/profiles/601.png",
      },
      content:
        "로그 확인해보니 DB 연결 오류로 보입니다. 해당 부분 점검하겠습니다.",
      created_at: "2025-07-28T10:00:00Z",
      can_delete: false,
    },
    {
      comment_id: 8002,
      writer: {
        user_id: 602,
        name: "고다현",
        profile_image_url: "https://example.com/profiles/602.png",
      },
      content: "제가 이슈 재현 환경 세팅해서 PR 올려두었습니다.",
      created_at: "2025-07-28T11:15:00Z",
      can_delete: true,
    },
  ],
  follow_ups: [
    {
      follow_up_id: 9001,
      content: "최종완료 후에도 동일 증상 확인되어 추가 문의드립니다.",
      created_at: "2025-07-29T14:00:00Z",
      writer: {
        user_id: 501,
        name: "김철수",
        profile_image_url: "https://example.com/profiles/501.png",
      },
      comments: [
        {
          comment_id: 9101,
          content: "추가 로그 요청합니다. 서버 로그 전체 첨부 부탁드립니다.",
          created_at: "2025-07-29T14:10:00Z",
          writer: {
            user_id: 603,
            name: "장윤영",
            profile_image_url: "https://example.com/profiles/603.png",
          },
          parent_comment_id: null,
        },
        {
          comment_id: 9102,
          content: "로그 공유했습니다. 확인 부탁드립니다.",
          created_at: "2025-07-29T14:25:00Z",
          writer: {
            user_id: 501,
            name: "김철수",
            profile_image_url: "https://example.com/profiles/501.png",
          },
          parent_comment_id: 9101,
        },
      ],
    },
    {
      follow_up_id: 9002,
      content: "최종완료 후에도 동일 증상 확인되어 추가 문의드립니다.",
      created_at: "2025-07-29T14:00:00Z",
      writer: {
        user_id: 511,
        name: "김철수",
        profile_image_url: "https://example.com/profiles/501.png",
      },
      comments: [
        {
          comment_id: 9111,
          content: "추가 로그 요청합니다. 서버 로그 전체 첨부 부탁드립니다.",
          created_at: "2025-07-29T14:10:00Z",
          writer: {
            user_id: 613,
            name: "장윤영",
            profile_image_url: "https://example.com/profiles/603.png",
          },
          parent_comment_id: null,
        },
        {
          comment_id: 9112,
          content: "로그 공유했습니다. 확인 부탁드립니다.",
          created_at: "2025-07-29T14:25:00Z",
          writer: {
            user_id: 511,
            name: "김철수",
            profile_image_url: "https://example.com/profiles/501.png",
          },
          parent_comment_id: 9111,
        },
      ],
    },
  ],
};
