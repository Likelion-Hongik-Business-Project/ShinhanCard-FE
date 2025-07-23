import { useState } from "react";

import { Down as Arrow } from "@/assets/svgs/layout";

import { groupTeamData } from "@/mocks/groupTeamData";

type Props = {
  groupId: string;
  onClose: () => void;
};

const TeamSelector = ({ groupId }: Props) => {
  const [, setSelectedTeam] = useState<string | null>(null);
  const [showHiddenTeams, setShowHiddenTeams] = useState(false);

  const allDivisions = groupTeamData[groupId] || [];

  const activeSections = allDivisions
    .map(division => {
      const activeTeams = division.teams.filter(team => !team.isEnded);
      return activeTeams.length
        ? {
            head: division.division_name,
            teams: activeTeams.map(t => t.team_name),
          }
        : null;
    })
    .filter(Boolean) as { head: string; teams: string[] }[];

  const endedSections = allDivisions
    .map(division => {
      const endedTeams = division.teams.filter(team => team.isEnded);
      return endedTeams.length
        ? {
            head: division.division_name,
            teams: endedTeams.map(t => t.team_name),
          }
        : null;
    })
    .filter(Boolean) as { head: string; teams: string[] }[];

  const visibleSections = showHiddenTeams ? endedSections : activeSections;

  return (
    <div className="w-200 h-full bg-white border border-gray-20 px-8 py-[52px] flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex flex-col gap-6">
          {visibleSections.map(section => (
            <div className="flex gap-6 flex-col" key={section.head}>
              <div className="flex flex-col gap-4">
                <p className="text-body1-b text-gray-80 p-2">{section.head}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                  {section.teams.map(team => (
                    <button
                      key={team}
                      onClick={() => setSelectedTeam(team)}
                      className="cursor-pointer p-2 rounded-lg text-body2 transition-colors bg-white hover:bg-gray-10 whitespace-nowrap"
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="my-2 border-gray-20" />
            </div>
          ))}

          {endedSections.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSelector;
