import { TeamItem } from "@/types/inquiry";

interface TeamTabsProps {
  teams: TeamItem[];
  selectedTeamId: number;
  onSelectTeam: (teamId: number) => void;
}

export default function TeamTabs({
  teams,
  selectedTeamId,
  onSelectTeam,
}: TeamTabsProps) {
  return (
    <div className="flex space-x-2 mb-6">
      {teams.map(team => (
        <button
          key={team.team_id}
          onClick={() => onSelectTeam(team.team_id)}
          className={`px-4 py-2 rounded ${
            team.team_id === selectedTeamId
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {team.team_name}
        </button>
      ))}
    </div>
  );
}
