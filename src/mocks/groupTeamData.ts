import { Division, Group, Team } from "@/types/team/user";

// 실제 데이터 구조
export const mockGroups: Group[] = [
  { groupId: 1, groupName: "그룹 A", active: true },
  { groupId: 2, groupName: "그룹 B", active: true },
  { groupId: 3, groupName: "그룹 C", active: true },
  { groupId: 4, groupName: "그룹 D", active: true },
  { groupId: 5, groupName: "그룹 E", active: false },
  { groupId: 6, groupName: "그룹 F", active: true },
];

export const mockDivisions: Record<string, Division[]> = {
  "1": [
    { divisionId: 11, divisionName: "기획 본부", active: true },
    { divisionId: 12, divisionName: "개발 본부", active: true },
  ],
  "2": [
    { divisionId: 21, divisionName: "디자인 본부", active: true },
    { divisionId: 22, divisionName: "마케팅 본부", active: false },
  ],
  "3": [{ divisionId: 31, divisionName: "운영 본부", active: true }],
  "4": [
    { divisionId: 41, divisionName: "인사 본부", active: true },
    { divisionId: 42, divisionName: "총무 본부", active: true },
  ],
  "5": [{ divisionId: 51, divisionName: "전략 본부", active: true }],
  "6": [
    { divisionId: 61, divisionName: "기술 본부", active: true },
    { divisionId: 62, divisionName: "품질 본부", active: false },
  ],
};

export const mockTeams: Record<string, Team[]> = {
  "11": [
    { teamId: 101, teamName: "A-기획 1팀", active: true },
    { teamId: 102, teamName: "A-기획 2팀", active: false },
  ],
  "12": [
    { teamId: 103, teamName: "A-프론트엔드팀", active: true },
    { teamId: 104, teamName: "A-백엔드팀", active: true },
  ],
  "21": [
    { teamId: 201, teamName: "B-UX팀", active: true },
    { teamId: 202, teamName: "B-UI팀", active: true },
  ],
  "22": [
    { teamId: 203, teamName: "B-콘텐츠팀", active: true },
    { teamId: 204, teamName: "B-브랜드팀", active: false },
  ],
  "31": [
    { teamId: 301, teamName: "C-운영지원팀", active: true },
    { teamId: 302, teamName: "C-고객응대팀", active: true },
    { teamId: 303, teamName: "C-고객응대팀", active: true },
    { teamId: 304, teamName: "C-고객응대팀", active: true },
    { teamId: 305, teamName: "C-고객응대팀", active: true },
    { teamId: 306, teamName: "C-고객응대팀", active: true },
  ],
  "41": [
    { teamId: 401, teamName: "D-채용팀", active: true },
    { teamId: 402, teamName: "D-복지팀", active: false },
  ],
  "42": [
    { teamId: 403, teamName: "D-총무 1팀", active: true },
    { teamId: 404, teamName: "D-총무 2팀", active: true },
  ],
  "51": [
    { teamId: 501, teamName: "E-전략기획팀", active: true },
    { teamId: 502, teamName: "E-사업개발팀", active: false },
  ],
  "61": [
    { teamId: 601, teamName: "F-데이터팀", active: true },
    { teamId: 602, teamName: "F-AI팀", active: false },
  ],
  "62": [
    { teamId: 603, teamName: "F-QA팀", active: false },
    { teamId: 604, teamName: "F-테스트팀", active: true },
  ],
};
