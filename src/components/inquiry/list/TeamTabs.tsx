import { TeamItem } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  teams: TeamItem[];
  selectedTeamId: number;
  onSelectTeam: (teamId: number) => void;
  onOpenModal: () => void;
};

const TeamTabs = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  onOpenModal,
}: Props) => {
  const maxVisibleTabs = 3;
  const visibleTabs = teams.slice(0, maxVisibleTabs);
  const hiddenTabs = teams.slice(maxVisibleTabs);

  return (
    <div className="flex">
      {visibleTabs.map(team => (
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
      {hiddenTabs && (
        <button
          onClick={onOpenModal}
          className="px-7 py-5 rounded-t-[15px] cursor-pointer transition mb-[1px] bg-gray-20 text-gray-50"
        >
          <span className="text-heading3-b">...</span>
        </button>
      )}
    </div>
  );
};

export default TeamTabs;
