"use client";

import { useEffect, useRef, useState } from "react";

import { useQueries } from "@tanstack/react-query";
import clsx from "clsx";

import Arrow from "@/assets/svgs/common/down.svg";
import { useTeamApi } from "@/hooks/team/useTeamApi";
import { Team } from "@/types/team/user.type";

import { getTeamsByDivisionId } from "@/apis/team/teamApi";

type Props = {
  groupId: number;
  onTeamSelect: (team: { teamId: number; teamName: string }) => void;
};

const TeamSelector = ({ groupId, onTeamSelect }: Props) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showHiddenTeams, setShowHiddenTeams] = useState(false);
  const [teamMap, setTeamMap] = useState<Record<number, Team[]>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  const { useDivisionsByGroupIdQuery } = useTeamApi();
  const { data: divisionData } = useDivisionsByGroupIdQuery(groupId);
  const divisions = divisionData?.result ?? [];

  const teamQueries = useQueries({
    queries: divisions.map(division => ({
      queryKey: ["teams", division.divisionId],
      queryFn: () => getTeamsByDivisionId(division.divisionId),
      enabled: !!division.divisionId,
    })),
  });

  useEffect(() => {
    const isAllFetched = teamQueries.every(query => query.isSuccess);
    if (!isAllFetched) return;

    const newTeamMap: Record<number, Team[]> = {};

    teamQueries.forEach((query, idx) => {
      const divisionId = divisions[idx]?.divisionId;
      if (query.data && divisionId) {
        newTeamMap[divisionId] = query.data.result;
      }
    });

    setTeamMap(prev => {
      const isSame = JSON.stringify(prev) === JSON.stringify(newTeamMap);
      return isSame ? prev : newTeamMap;
    });
  }, [divisions, teamQueries.map(q => q.data).join(",")]);

  const sections = divisions
    .map(division => {
      const teams = teamMap[division.divisionId]?.filter(
        team => team.active === !showHiddenTeams
      );

      if (!teams || teams.length === 0) return null;

      return {
        head: division.divisionName,
        teams: teams.map(team => ({
          teamId: team.teamId,
          teamName: team.teamName,
          active: team.active,
        })),
      };
    })
    .filter(Boolean) as {
    head: string;
    teams: {
      teamId: number;
      teamName: string;
      active: boolean;
    }[];
  }[];

  const handleTeamClick = (team: { teamId: number; teamName: string }) => {
    setSelectedTeam(team.teamName);
    onTeamSelect({ teamId: team.teamId, teamName: team.teamName });
  };

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
                    key={team.teamId}
                    onClick={() => handleTeamClick(team)}
                    className={clsx(
                      "cursor-pointer p-2 rounded-lg text-body2 transition-colors whitespace-nowrap",
                      selectedTeam === team.teamName
                        ? "bg-main text-white"
                        : "bg-white hover:bg-gray-10"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-body2",
                        team.active
                          ? "text-gray-80"
                          : "text-gray-40 hover:text-gray-60"
                      )}
                    >
                      {team.teamName}
                      {!team.active && " (종료)"}
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
