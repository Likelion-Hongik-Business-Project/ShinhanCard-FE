import { TeamItem } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  teams: TeamItem[];
  selectedTeamId: number;
  onSelectTeam: (teamId: number) => void;
  onClose: () => void;
};

const TeamTabsModal = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  onClose,
}: Props) => {
  return (
    <div className="absolute top-16 right-0 1600:left-0 w-[384px] max-h-[280px] overflow-y-auto gray-scrollbar rounded-[10px] bg-white shadow-02 border border-gray-20 z-50 p-6">
      <ul className="flex flex-col gap-2">
        {teams.map(team => (
          <li
            key={team.team_id}
            onClick={() => {
              onSelectTeam(team.team_id);
              onClose();
            }}
            className={`pl-6 pr-10 py-6 text-[18px] truncate rounded-[10px] text-gray-80 cursor-pointer hover:bg-gray-20 transition ${
              team.team_id === selectedTeamId && "bg-gray-20 text-gray-80"
            }`}
          >
            {team.group_name} &gt; {team.division_name} &gt; {team.team_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamTabsModal;
