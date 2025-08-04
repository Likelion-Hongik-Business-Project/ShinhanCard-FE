import { useEffect, useState } from "react";

import clsx from "clsx";

import CheckIcon from "@/assets/svgs/common/check.svg";
import DownIcon from "@/assets/svgs/common/down.svg";
import UsersIcon from "@/assets/svgs/inquiry/detail/users.svg";

type Props = {
  currentTeamName: string;
  totalCount: number;
  groups: Array<{ groupId: number; groupName: string; active: boolean }>;
  divisions: Array<{
    divisionId: number;
    divisionName: string;
    active: boolean;
  }>;
  teams: Array<{ teamId: number; teamName: string; active: boolean }>;
  selectedGroupId: number | null;
  selectedDivisionId: number | null;
  selectedTeamId: number | null;
  setSelectedGroupId: (groupId: number) => void;
  setSelectedDivisionId: (divisionId: number) => void;
  setSelectedTeamId: (teamId: number) => void;
  resetSelection: () => void;
};

const AddMemberSidebarHeader = ({
  currentTeamName,
  totalCount,
  groups,
  divisions,
  teams,
  selectedGroupId,
  selectedDivisionId,
  selectedTeamId,
  setSelectedGroupId,
  setSelectedDivisionId,
  setSelectedTeamId,
  resetSelection,
}: Props) => {
  const [isTeamSelectionOpen, setIsTeamSelectionOpen] = useState(false);
  const [clickedOption, setClickedOption] = useState<string | null>(null);

  // 드롭다운 옵션들
  const groupOptions = groups.map(group => group.groupName);
  const divisionOptions = divisions.map(division => division.divisionName);
  const teamOptions = teams.map(team => team.teamName);

  // 팀 선택 완료 시 드롭다운 닫기
  useEffect(() => {
    if (selectedTeamId) {
      setIsTeamSelectionOpen(false);
    }
  }, [selectedTeamId]);

  return (
    <div className="w-full flex flex-col">
      {/* 팀 선택 헤더 */}
      <button
        onClick={() => {
          setIsTeamSelectionOpen(!isTeamSelectionOpen);
          // 토글을 열 때 선택된 상태들을 초기화
          if (!isTeamSelectionOpen) {
            resetSelection();
          }
        }}
        className="flex items-center justify-start w-full p-2 gap-4 cursor-pointer"
      >
        <div className="flex items-center">
          <span className="text-heading3 text-gray-80">{currentTeamName}</span>
        </div>
        <DownIcon
          className={clsx(
            "w-5 h-5 text-gray-30 transition-transform",
            isTeamSelectionOpen && "rotate-180 text-gray-80"
          )}
        />
      </button>

      {/* 팀 선택 드롭다운 - 같은 위치에 겹쳐서 표시 */}
      {isTeamSelectionOpen && (
        <div className="relative">
          {/* 그룹 드롭다운 */}
          {!selectedGroupId && groupOptions.length > 0 && (
            <ul className="absolute w-[172px] border rounded-[5px] bg-white z-100 max-h-[246px] overflow-y-auto scrollbar-hide text-detail1 text-gray-60 border-gray-30">
              {groupOptions.map(option => (
                <li
                  key={option}
                  onClick={() => {
                    setClickedOption(option);
                    setTimeout(() => {
                      const group = groups.find(g => g.groupName === option);
                      if (group) {
                        setSelectedGroupId(group.groupId);
                      }
                      setClickedOption(null);
                    }, 100);
                  }}
                  className="cursor-pointer hover:bg-gray-10 flex justify-between items-center p-3"
                >
                  <span
                    className={clsx(
                      "flex",
                      clickedOption === option
                        ? "text-main text-detail1-b"
                        : "text-gray-60"
                    )}
                  >
                    {option}
                  </span>
                  <CheckIcon
                    className={clsx(
                      "w-3 h-3",
                      clickedOption === option ? "text-main" : "text-gray-30"
                    )}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* 본부 드롭다운 */}
          {selectedGroupId &&
            !selectedDivisionId &&
            divisionOptions.length > 0 && (
              <ul className="absolute w-[172px] border rounded-[5px] bg-white z-100 max-h-[246px] overflow-y-auto scrollbar-hide text-detail1 text-gray-60 border-gray-30">
                {divisionOptions.map(option => (
                  <li
                    key={option}
                    onClick={() => {
                      setClickedOption(option);
                      setTimeout(() => {
                        const division = divisions.find(
                          d => d.divisionName === option
                        );
                        if (division) {
                          setSelectedDivisionId(division.divisionId);
                        }
                        setClickedOption(null);
                      }, 100);
                    }}
                    className="cursor-pointer hover:bg-gray-10 flex justify-between items-center p-3"
                  >
                    <span
                      className={clsx(
                        "flex",
                        clickedOption === option
                          ? "text-main text-detail1-b"
                          : "text-gray-60"
                      )}
                    >
                      {option}
                    </span>
                    <CheckIcon
                      className={clsx(
                        "w-3 h-3",
                        clickedOption === option ? "text-main" : "text-gray-30"
                      )}
                    />
                  </li>
                ))}
              </ul>
            )}

          {/* 팀 드롭다운 */}
          {selectedDivisionId && !selectedTeamId && teamOptions.length > 0 && (
            <ul className="absolute w-[172px] border rounded-[5px] bg-white z-100 max-h-[236px] overflow-y-auto scrollbar-hide text-detail1 text-gray-60 border-gray-20 shadow-lg">
              {teamOptions.map(option => (
                <li
                  key={option}
                  onClick={() => {
                    setClickedOption(option);
                    setTimeout(() => {
                      const team = teams.find(t => t.teamName === option);
                      if (team) {
                        setSelectedTeamId(team.teamId);
                      }
                      setClickedOption(null);
                    }, 100);
                  }}
                  className="cursor-pointer hover:bg-gray-10 flex justify-between items-center p-3"
                >
                  <span
                    className={clsx(
                      "flex",
                      clickedOption === option
                        ? "text-main text-detail1-b"
                        : "text-gray-60"
                    )}
                  >
                    {option}
                  </span>
                  <CheckIcon
                    className={clsx(
                      "w-3 h-3",
                      clickedOption === option ? "text-main" : "text-gray-30"
                    )}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* 디버깅용 - 드롭다운이 안 보일 때 확인 */}
          {isTeamSelectionOpen &&
            !selectedGroupId &&
            groupOptions.length === 0 && (
              <div className="absolute w-[172px] border rounded-[5px] bg-white z-100 p-3 text-gray-60">
                그룹 데이터 로딩 중...
              </div>
            )}
        </div>
      )}

      <div className="flex p-2 items-center gap-2 text-detail1 text-gray-60">
        <UsersIcon className="w-4 h-4" />
        <span>팀원 {totalCount}명</span>
      </div>
    </div>
  );
};

export default AddMemberSidebarHeader;
