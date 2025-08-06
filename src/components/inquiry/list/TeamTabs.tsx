import { TeamItem } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  teams: TeamItem[];
  selectedTeamId: number;
  onSelectTeam: (teamId: number) => void;
};

const TeamTabs = ({ teams, selectedTeamId, onSelectTeam }: Props) => {
  return (
    <div className="flex">
      {teams.map(team => (
        <button
          key={team.team_id}
          onClick={() => onSelectTeam(team.team_id)}
          className={`px-7 py-5 rounded-t-[15px] cursor-pointer transition mb-[1px] ${
            team.team_id === selectedTeamId
              ? "border-t-[2px] text-gray-80 border-main bg-white pt-[18px]"
              : "bg-gray-20 text-gray-50"
          }`}
        >
          <span className="text-heading3-b">
            {team.group_name} &gt; {team.division_name} &gt; {team.team_name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TeamTabs;
