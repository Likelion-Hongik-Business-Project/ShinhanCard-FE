export const mockInquiryResponse = {
  title: "회원가입 API 호출 시 400 오류 발생",
  content:
    "POST /api/signup 요청 시 400 Bad Request 응답이 반환됩니다. 요청 페이로드를 아래와 같이 전송했으나 서버에서 유효성 검사를 통과하지 못했습니다.",
  status: "DRAFT",
  role: "AUTHOR",
  author: {
    username: "kimseunghan",
    teamname: "개발팀",
    user_id: 101,
    profile_image_url: "/assets/images/profile.png",
  },
  assignees: [
    {
      username: "박지영",
      is_checked: true,
      user_id: 102,
      profile_image_url: "/assets/images/profile.png",
    },
  ],
  observers: [
    {
      userId: 103,
      userName: "최민수",
      profileImageUrl: "/assets/images/profile.png",
    },
  ],
  group: {
    groupId: 1,
    groupName: "서비스 개발팀",
    active: true,
  },
  division: {
    divisionId: 2,
    divisionName: "백엔드 파트",
    active: true,
  },
  team: {
    teamId: 3,
    teamName: "회원가입 API 팀",
    active: true,
  },
  answers: {
    count: 1,
    answers: [
      {
        content:
          "400 오류는 필수 필드 누락 또는 데이터 타입 불일치로 발생할 수 있습니다. 예를 들어 `email` 필드가 없거나 형식이 잘못되었는지 확인하세요.",
        user: {
          username: "이준호",
          profile_url: "/assets/images/profile.png",
          role: "AUTHOR",
          user_id: 104,
        },
        files: [
          {
            fileId: 201,
            fileKey: "request_example.json",
            fileName: "request_example.json",
            fileSize: 850,
          },
        ],
        created_at: "2025-08-06T19:12:26.250Z",
        is_selected: false,
      },
    ],
  },
  files: [
    {
      fileId: 301,
      fileKey: "error_log.txt",
      fileName: "error_log.txt",
      fileSize: 2048,
    },
  ],
  inquiry_id: 1234,
  is_scraped: false,
  created_at: "2025-08-06T19:12:26.250Z",
  follow_ups: {
    count: 2,
    follow_ups: [
      {
        follow_up_id: 1,
        content: "요청 페이로드에 `cardNumber` 필드를 추가해 주실 수 있나요?",
        author: {
          username: "kimseunghan",
          profile_url: "/assets/images/profile.png",
          role: "AUTHOR",
          user_id: 101,
        },
        comments: [
          {
            comment_id: 401,
            author: {
              username: "박지영",
              profile_url: "/assets/images/profile.png",
              role: "AUTHOR",
              user_id: 102,
            },
            content:
              '추가했습니다. 아래 JSON을 참고하세요:\n```json\n{"email":"user@test.com","password":"Pass123!","cardNumber":"1234-5678-9012-3456"}\n```',
            created_at: "2025-08-06T20:00:00.000Z",
            tagged_user: {
              username: "kimseunghan",
              user_id: 101,
            },
          },
          {
            comment_id: 402,
            author: {
              username: "최민수",
              profile_url: "/assets/images/profile.png",
              role: "AUTHOR",
              user_id: 103,
            },
            content: "해당 부분 반영하였습니다. 확인 부탁드립니다.",
            created_at: "2025-08-06T20:15:00.000Z",
            tagged_user: {
              username: "박지영",
              user_id: 102,
            },
          },
        ],
        tagged_user: {
          username: "박지영",
          user_id: 102,
        },
        created_at: "2025-08-06T19:45:30.000Z",
      },
      {
        follow_up_id: 2,
        content: "패스워드 유효성 검사는 어떻게 진행되고 있나요?",
        author: {
          username: "kimseunghan",
          profile_url: "/assets/images/profile.png",
          role: "AUTHOR",
          user_id: 101,
        },
        comments: [
          {
            comment_id: 403,
            author: {
              username: "박지영",
              profile_url: "/assets/images/profile.png",
              role: "AUTHOR",
              user_id: 102,
            },
            content:
              "현재 서버에서 정규표현식으로 체크하도록 구현되어 있습니다.",
            created_at: "2025-08-06T20:30:00.000Z",
            tagged_user: {
              username: "kimseunghan",
              user_id: 101,
            },
          },
          {
            comment_id: 404,
            author: {
              username: "이준호",
              profile_url: "/assets/images/profile.png",
              role: "AUTHOR",
              user_id: 104,
            },
            content: "프론트엔드에서도 간단한 유효성 검사를 추가할게요.",
            created_at: "2025-08-06T20:45:00.000Z",
            tagged_user: {
              username: "kimseunghan",
              user_id: 101,
            },
          },
        ],
        tagged_user: {
          username: "박지영",
          user_id: 102,
        },
        created_at: "2025-08-06T20:00:00.000Z",
      },
    ],
  },
};
