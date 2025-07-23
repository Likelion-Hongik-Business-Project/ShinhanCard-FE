export type GroupTeamData = Record<
  string,
  {
    division_name: string;
    teams: {
      team_name: string;
      isEnded: boolean;
    }[];
  }[]
>;

export const groupTeamData: GroupTeamData = {
  "그룹 A": [
    {
      division_name: "기획 본부",
      teams: [
        { team_name: "A-기획 1팀", isEnded: false },
        { team_name: "A-기획 2팀", isEnded: true },
        { team_name: "A-기획 3팀", isEnded: false },
        { team_name: "A-기획 4팀", isEnded: false },
        { team_name: "A-기획 5팀", isEnded: false },
        { team_name: "A-기획 6팀", isEnded: false },
      ],
    },
    {
      division_name: "개발 본부",
      teams: [
        { team_name: "A-프론트엔드팀", isEnded: false },
        { team_name: "A-백엔드팀", isEnded: false },
        { team_name: "A-인프라팀", isEnded: true },
      ],
    },
  ],
  "그룹 B": [
    {
      division_name: "디자인 본부",
      teams: [
        { team_name: "B-UX팀", isEnded: false },
        { team_name: "B-UI팀", isEnded: false },
      ],
    },
    {
      division_name: "개발 본부",
      teams: [
        { team_name: "B-프론트엔드팀", isEnded: false },
        { team_name: "B-백엔드팀", isEnded: true },
      ],
    },
  ],
  "그룹 C": [
    {
      division_name: "운영 본부",
      teams: [
        { team_name: "C-운영지원팀", isEnded: false },
        { team_name: "C-고객응대팀", isEnded: true },
      ],
    },
  ],
  "그룹 D": [
    {
      division_name: "마케팅 본부",
      teams: [
        { team_name: "D-콘텐츠팀", isEnded: false },
        { team_name: "D-광고팀", isEnded: false },
        { team_name: "D-브랜드팀", isEnded: false },
      ],
    },
  ],
  "그룹 E": [
    {
      division_name: "전략 본부",
      teams: [
        { team_name: "E-전략기획팀", isEnded: false },
        { team_name: "E-사업개발팀", isEnded: true },
      ],
    },
  ],
  "그룹 F": [
    {
      division_name: "기술 본부",
      teams: [
        { team_name: "F-데이터팀", isEnded: false },
        { team_name: "F-AI팀", isEnded: false },
        { team_name: "F-보안팀", isEnded: true },
      ],
    },
  ],
};
