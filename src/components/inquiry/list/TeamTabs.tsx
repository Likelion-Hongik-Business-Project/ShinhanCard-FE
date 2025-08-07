import { useEffect, useRef, useState } from "react";

import TeamTabButton from "@/components/inquiry/list/TeamTabButton";
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
  const [maxVisibleTabs, setMaxVisibleTabs] = useState(3);

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const visibleTabs = teams.slice(0, maxVisibleTabs);
  const hiddenTabs = teams.slice(maxVisibleTabs);

  const isHiddenTeamSelected = hiddenTabs.some(
    team => team.team_id === selectedTeamId
  );

  const isMoreTabActive = isHiddenTeamSelected || isModalOpen;

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setMaxVisibleTabs(width <= 1120 ? 2 : 3);
      }
    });

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, onCloseModal]);

  return (
    <div ref={wrapperRef} className="relative flex w-full">
      {visibleTabs.map(team => (
        <TeamTabButton
          key={team.team_id}
          team={team}
          isSelected={team.team_id === selectedTeamId}
          onClick={() => onSelectTeam(team.team_id)}
        />
      ))}
      {hiddenTabs.length > 0 && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={onToggleModal}
            className={`px-7 py-5 rounded-t-[15px] cursor-pointer transition mb-[1px] ${
              isMoreTabActive
                ? "border-[2px] border-gray-20 text-gray-80 bg-white py-[18px] px-[26px]"
                : "bg-gray-20 text-gray-50"
            }`}
          >
            <span className="text-heading3-b">...</span>
          </button>
          {isModalOpen && (
            <div ref={modalRef}>
              <TeamTabsModal
                teams={hiddenTeams}
                selectedTeamId={selectedTeamId}
                onSelectTeam={onSelectTeam}
                onClose={onCloseModal}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamTabs;
