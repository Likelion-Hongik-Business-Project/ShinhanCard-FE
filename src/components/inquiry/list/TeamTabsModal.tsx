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
    <div className="absolute top-24 right-8 w-[400px] max-h-[500px] overflow-y-auto rounded-xl bg-white shadow-lg border border-gray-30 z-50">
      <ul className="divide-y divide-gray-20">
        {teams.map(team => (
          <li
            key={team.team_id}
            onClick={() => {
              onSelectTeam(team.team_id);
              onClose();
            }}
            className={`px-6 py-4 cursor-pointer hover:bg-gray-10 transition ${
              team.team_id === selectedTeamId
                ? "bg-gray-10 text-main"
                : "text-gray-80"
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
