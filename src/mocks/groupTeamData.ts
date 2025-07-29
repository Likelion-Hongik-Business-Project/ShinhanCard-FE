// 실제 데이터 구조
export const mockGroups = [
  { group_id: 1, name: "그룹 A", is_active: true },
  { group_id: 2, name: "그룹 B", is_active: true },
  { group_id: 3, name: "그룹 C", is_active: true },
  { group_id: 4, name: "그룹 D", is_active: true },
  { group_id: 5, name: "그룹 E", is_active: false },
  { group_id: 6, name: "그룹 F", is_active: true },
];

export const mockDivisions: Record<
  string,
  { division_id: number; name: string; is_active: boolean }[]
> = {
  "1": [
    { division_id: 11, name: "기획 본부", is_active: true },
    { division_id: 12, name: "개발 본부", is_active: true },
  ],
  "2": [
    { division_id: 21, name: "디자인 본부", is_active: true },
    { division_id: 22, name: "마케팅 본부", is_active: false },
  ],
  "3": [{ division_id: 31, name: "운영 본부", is_active: true }],
  "4": [
    { division_id: 41, name: "인사 본부", is_active: true },
    { division_id: 42, name: "총무 본부", is_active: true },
  ],
  "5": [{ division_id: 51, name: "전략 본부", is_active: true }],
  "6": [
    { division_id: 61, name: "기술 본부", is_active: true },
    { division_id: 62, name: "품질 본부", is_active: false },
  ],
};

export const mockTeams: Record<
  string,
  { team_id: number; name: string; is_active: boolean }[]
> = {
  "11": [
    { team_id: 101, name: "A-기획 1팀", is_active: true },
    { team_id: 102, name: "A-기획 2팀", is_active: false },
  ],
  "12": [
    { team_id: 103, name: "A-프론트엔드팀", is_active: true },
    { team_id: 104, name: "A-백엔드팀", is_active: true },
  ],
  "21": [
    { team_id: 201, name: "B-UX팀", is_active: true },
    { team_id: 202, name: "B-UI팀", is_active: true },
  ],
  "22": [
    { team_id: 203, name: "B-콘텐츠팀", is_active: true },
    { team_id: 204, name: "B-브랜드팀", is_active: false },
  ],
  "31": [
    { team_id: 301, name: "C-운영지원팀", is_active: true },
    { team_id: 302, name: "C-고객응대팀", is_active: true },
  ],
  "41": [
    { team_id: 401, name: "D-채용팀", is_active: true },
    { team_id: 402, name: "D-복지팀", is_active: false },
  ],
  "42": [
    { team_id: 403, name: "D-총무 1팀", is_active: true },
    { team_id: 404, name: "D-총무 2팀", is_active: true },
  ],
  "51": [
    { team_id: 501, name: "E-전략기획팀", is_active: true },
    { team_id: 502, name: "E-사업개발팀", is_active: false },
  ],
  "61": [
    { team_id: 601, name: "F-데이터팀", is_active: true },
    { team_id: 602, name: "F-AI팀", is_active: false },
  ],
  "62": [
    { team_id: 603, name: "F-QA팀", is_active: false },
    { team_id: 604, name: "F-테스트팀", is_active: true },
  ],
};
