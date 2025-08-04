import {
  GetDivisionResponse,
  GetGroupResponse,
  GetTeamResponse,
  TeamMember,
} from "@/types/team/team.type";

// Mock 그룹 데이터
export const MOCK_GROUPS: GetGroupResponse[] = [
  {
    groupId: 1,
    groupName: "IT그룹",
    active: true,
  },
  {
    groupId: 2,
    groupName: "경영기획 그룹",
    active: true,
  },
  {
    groupId: 3,
    groupName: "마케팅 그룹",
    active: true,
  },
  {
    groupId: 4,
    groupName: "인사 그룹",
    active: true,
  },
];

// Mock 본부 데이터
export const MOCK_DIVISIONS: GetDivisionResponse[] = [
  {
    divisionId: 1,
    divisionName: "IT본부",
    active: true,
  },
  {
    divisionId: 2,
    divisionName: "ICT본부",
    active: true,
  },
  {
    divisionId: 3,
    divisionName: "경영기획본부",
    active: true,
  },
  {
    divisionId: 4,
    divisionName: "마케팅본부",
    active: true,
  },
];

// Mock 팀 데이터
export const MOCK_TEAMS: GetTeamResponse[] = [
  {
    teamId: 1,
    teamName: "Core 개발 1부",
    active: true,
  },
  {
    teamId: 2,
    teamName: "Core 개발 2부",
    active: true,
  },
  {
    teamId: 3,
    teamName: "Frontend 개발팀",
    active: true,
  },
  {
    teamId: 4,
    teamName: "Backend 개발팀",
    active: true,
  },
  {
    teamId: 5,
    teamName: "DevOps팀",
    active: true,
  },
  {
    teamId: 6,
    teamName: "AI 개발팀",
    active: true,
  },
  {
    teamId: 7,
    teamName: "데이터 분석팀",
    active: true,
  },
];

// Mock 팀원 데이터
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "강여자",
    profile_image_url: null,
    email: "kang@shinhancard.com",
    phone: "010-1000-1001",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 2,
    name: "김남자",
    profile_image_url: null,
    email: "kim@shinhancard.com",
    phone: "010-1000-1002",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 3,
    name: "이여자",
    profile_image_url: null,
    email: "lee@shinhancard.com",
    phone: "010-1000-1003",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 4,
    name: "이장윤",
    profile_image_url: null,
    email: "leejang@shinhancard.com",
    phone: "010-1000-1004",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 5,
    name: "장윤영",
    profile_image_url: null,
    email: "jangyoon@shinhancard.com",
    phone: "010-1000-1005",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 6,
    name: "장윤지",
    profile_image_url: null,
    email: "jangyoonji@shinhancard.com",
    phone: "010-1000-1006",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 7,
    name: "홍남자",
    profile_image_url: null,
    email: "hong@shinhancard.com",
    phone: "010-1000-1007",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 8,
    name: "홍여자",
    profile_image_url: null,
    email: "hongyeo@shinhancard.com",
    phone: "010-1000-1008",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 9,
    name: "홍여자",
    profile_image_url: null,
    email: "hongyeo@shinhancard.com",
    phone: "010-1000-1008",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 10,
    name: "홍여자",
    profile_image_url: null,
    email: "hongyeo@shinhancard.com",
    phone: "010-1000-1008",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 11,
    name: "홍여자",
    profile_image_url: null,
    email: "hongyeo@shinhancard.com",
    phone: "010-1000-1008",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
  {
    id: 12,
    name: "한로로",
    profile_image_url: null,
    email: "hongyeo@shinhancard.com",
    phone: "010-1000-1008",
    group_name: "IT그룹",
    division_name: "IT본부",
    team_name: "Core 개발 2부",
  },
];
