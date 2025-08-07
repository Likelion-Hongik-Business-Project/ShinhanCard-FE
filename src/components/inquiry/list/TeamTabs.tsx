import TeamTabsModal from "@/components/inquiry/list/TeamTabsModal";
import { TeamItem } from "@/types/inquiry/inquiryListApi.type";

type Props = {
  teams: TeamItem[];
  selectedTeamId: number;
  onSelectTeam: (teamId: number) => void;
  onToggleModal: () => void;
  isModalOpen: boolean;
  hiddenTeams: TeamItem[];
  onCloseModal: () => void;
};

const TeamTabs = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  onToggleModal,
  isModalOpen,
  hiddenTeams,
  onCloseModal,
}: Props) => {
  const maxVisibleTabs = 3;
  const visibleTabs = teams.slice(0, maxVisibleTabs);
  const hiddenTabs = teams.slice(maxVisibleTabs);

  const isHiddenTeamSelected = hiddenTabs.some(
    team => team.team_id === selectedTeamId
  );

  const isMoreTabActive = isHiddenTeamSelected || isModalOpen;

  return (
    <div className="relative flex">
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
      {hiddenTabs.length > 0 && (
        <div className="relative">
          <button
            onClick={onToggleModal}
            className={`px-7 py-5 rounded-t-[15px] cursor-pointer transition mb-[1px] ${
              isMoreTabActive
                ? "border-t-[2px] border-x-[2px] border-gray-20 text-gray-80 bg-white py-[18px] px-[26px]"
                : "bg-gray-20 text-gray-50"
            }`}
          >
            <span className="text-heading3-b">...</span>
          </button>
          {isModalOpen && (
            <TeamTabsModal
              teams={hiddenTeams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={onSelectTeam}
              onClose={onCloseModal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TeamTabs;
