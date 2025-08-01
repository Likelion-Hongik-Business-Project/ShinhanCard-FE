import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import Arrow from "@/assets/svgs/common/down.svg";
import { mockDivisions, mockTeams } from "@/mocks/groupTeamData";

type Props = {
  groupId: number;
  onTeamSelect: (team: { teamId: number; teamName: string }) => void;
};

const TeamSelector = ({ groupId, onTeamSelect }: Props) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showHiddenTeams, setShowHiddenTeams] = useState(false);

  useEffect(() => {
    setShowHiddenTeams(false);
  }, [groupId]);

  const divisions = mockDivisions[String(groupId)] || [];

  const sections = divisions
    .map(division => {
      const allTeams = mockTeams[division.division_id] || [];
      const filteredTeams = allTeams.filter(
        team => team.is_active === !showHiddenTeams
      );

      if (filteredTeams.length === 0) return null;

      return {
        head: division.name,
        teams: filteredTeams,
      };
    })
    .filter(Boolean) as {
    head: string;
    teams: {
      team_id: number;
      name: string;
      is_active: boolean;
    }[];
  }[];

  const handleTeamClick = (team: { team_id: number; name: string }) => {
    setSelectedTeam(team.name);
    onTeamSelect({ teamId: team.team_id, teamName: team.name });
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      setIsNarrow(width <= 440);
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[calc(100vw-560px)] max-w-[800px] min-w-[440px] h-[calc(100vh-64px)] bg-white border-r border-gray-20 px-8 py-[52px] flex flex-col justify-between overflow-y-auto"
    >
      <div className="flex flex-col gap-6">
        {sections.map(section => (
          <div className="flex gap-6 flex-col" key={section.head}>
            <div className="flex flex-col gap-4">
              <p className="text-body1-b text-gray-80 p-2">{section.head}</p>
              <div
                className={clsx(
                  "grid gap-x-6 gap-y-4 self-start",
                  isNarrow ? "grid-cols-2" : "grid-cols-4"
                )}
              >
                {section.teams.map(team => (
                  <button
                    key={team.team_id}
                    onClick={() => handleTeamClick(team)}
                    className={clsx(
                      "cursor-pointer p-2 rounded-lg text-body2 transition-colors whitespace-nowrap",
                      selectedTeam === team.name
                        ? "bg-main text-white"
                        : "bg-white hover:bg-gray-10"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-body2",
                        team.is_active
                          ? "text-gray-80"
                          : "text-gray-40 hover:text-gray-60"
                      )}
                    >
                      {team.name}
                      {!team.is_active && " (종료)"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <hr className="m-2 border-gray-20" />
          </div>
        ))}

        <button
          className="text-body2 items-center text-gray-40 p-2 flex gap-4 text-left cursor-pointer"
          onClick={() => setShowHiddenTeams(prev => !prev)}
        >
          {showHiddenTeams ? (
            <>
              <Arrow className="w-4 h-4 rotate-90" />
              <span>뒤로</span>
            </>
          ) : (
            <>
              <span>숨겨진 팀 보기</span>
              <Arrow className="w-4 h-4 -rotate-90" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TeamSelector;
