import { useCallback, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import profileFallbackUrl from "@/assets/svgs/common/profile.svg?url";
import CloseIcon from "@/assets/svgs/inquiry/close.svg";
import { Search } from "@/assets/svgs/layout";
import { useAddInterestedMember } from "@/hooks/home/useHomeMemberApi";
import { useTeamMembers } from "@/hooks/team/useTeamMembers";
import { useTeamSelection } from "@/hooks/team/useTeamSelection";

import ProfileModal from "../common/ProfileModal";
import AddMemberSidebarHeader from "./AddMemberSidebarHeader";

import "@/styles/scrollbar.css";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  teamName: string;
  teamId: number;
};

const AddMemberSidebar = ({ isOpen, onClose, teamName, teamId }: Props) => {
  // 팀 선택 훅
  const {
    groups,
    divisions,
    teams,
    isLoading: teamSelectionLoading,
    selectedGroupId,
    selectedDivisionId,
    selectedTeamId,
    setSelectedGroupId,
    setSelectedDivisionId,
    setSelectedTeamId,
    resetSelection,
    selectedTeam,
  } = useTeamSelection();

  // 관심 팀원 추가 훅
  const { mutate: addInterestedMember } = useAddInterestedMember();

  // 프로필 모달 호버 상태
  const [hoveredMemberId, setHoveredMemberId] = useState<number | null>(null);
  const [modalOffset, setModalOffset] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const currentHoveredMemberRef = useRef<number | null>(null);

  // 스크롤 컨테이너 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 팀원 목록 훅 (사이드바 초기 상태: props의 팀, 팀 선택 후: 선택된 팀)
  const {
    members,
    totalCount,
    isLoading: membersLoading,
    searchTerm,
    setSearchTerm,
  } = useTeamMembers(selectedTeamId || teamId);

  // 현재 팀 정보 (사이드바 초기 상태: props의 팀, 팀 선택 후: 선택된 팀)
  const currentTeamName = selectedTeamId
    ? selectedTeam?.team_name
    : teamName || "팀명 없음";

  // 검색어 하이라이트 함수
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-main text-body2-b">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 관심 팀원 추가 핸들러
  const handleAddInterestedMember = (userId: number) => {
    addInterestedMember(userId);
  };

  // 모든 상태 초기화 함수
  const resetAllStates = useCallback(() => {
    setHoveredMemberId(null);
    setModalOffset(null);
    setSearchTerm("");
    currentHoveredMemberRef.current = null;
    resetSelection(); // 팀 선택 상태 초기화
  }, [resetSelection]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (hoveredMemberId && modalOffset) {
      // 현재 호버된 멤버를 다시 찾아서 위치 재계산
      const memberElement = document.querySelector(
        `[data-member-id="${hoveredMemberId}"]`
      ) as HTMLElement;
      if (memberElement) {
        const target = memberElement;
        const modalHeight = 242;
        const sidebar = target.closest("aside") as HTMLElement;

        const left = target.offsetLeft - 28;
        let top = target.offsetTop + target.offsetHeight;

        if (sidebar && top + modalHeight > sidebar.offsetHeight) {
          top = target.offsetTop - modalHeight - 40;
        }
        top = Math.max(top, 0);

        setModalOffset({ left, top });
      }
    }
  }, [hoveredMemberId, modalOffset]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // 멤버 호버 핸들러
  const handleMemberMouseEnter = (
    memberId: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    // 현재 호버된 멤버 업데이트
    currentHoveredMemberRef.current = memberId;

    const target = event.currentTarget as HTMLDivElement;
    const modalHeight = 242;
    const sidebar = target.closest("aside") as HTMLElement;

    // 멤버 div의 사이드바 내부 상대 위치
    const left = target.offsetLeft - 55;
    let top = target.offsetTop + target.offsetHeight;

    // 모달이 일부라도 아래로 넘어가면 위로 붙이기
    if (sidebar && top + modalHeight > sidebar.offsetHeight) {
      top = target.offsetTop - modalHeight - 40;
    }
    // 위로 넘어가면 최상단에 붙이기
    top = Math.max(top, 0);

    setHoveredMemberId(memberId);
    setModalOffset({ left, top });
  };

  const handleMemberMouseLeave = () => {
    currentHoveredMemberRef.current = null;
  };

  // 팀 선택 완료 시 팀 선택 모드 종료
  useEffect(() => {
    if (selectedTeamId) {
      // 팀 선택 완료 시 드롭다운 닫기 로직은 AddMemberSidebarHeader에서 처리
    }
  }, [selectedTeamId]);

  // 사이드바 열릴 때 바깥 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // 사이드바가 닫힐 때 모든 상태 초기화
      resetAllStates();
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, resetAllStates]);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      >
        <div className="absolute inset-0" />
      </div>

      <aside
        className={clsx(
          "fixed top-16 right-0 h-[calc(100vh-64px)] bg-white z-50 transition-transform duration-300 w-88 px-8 py-10 overflow-visible",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-full w-full">
          <div className="gap-6 flex flex-col h-full">
            <AddMemberSidebarHeader
              currentTeamName={currentTeamName || ""}
              totalCount={totalCount}
              groups={groups}
              divisions={divisions}
              teams={teams}
              selectedGroupId={selectedGroupId}
              selectedDivisionId={selectedDivisionId}
              selectedTeamId={selectedTeamId}
              setSelectedGroupId={setSelectedGroupId}
              setSelectedDivisionId={setSelectedDivisionId}
              setSelectedTeamId={setSelectedTeamId}
              resetSelection={resetSelection}
            />
            {/* 검색 */}
            <div className="h-14 border-t-2 border-b-2 border-gray-20 flex items-center justify-start">
              <div className="flex items-center gap-4 h-10">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="이름 검색"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-63 pl-10 pr-4 py-2 text-body2 focus:outline-none bg-gray-10 border-none rounded-[30px]"
                  />
                </div>
                <button onClick={() => setSearchTerm("")}>
                  <CloseIcon className="w-5 h-5 cursor-pointer text-gray-40" />
                </button>
              </div>
            </div>
            {/* 팀원 목록 */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar"
            >
              {membersLoading || teamSelectionLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-50">로딩 중...</div>
                </div>
              ) : members.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-50">
                    {searchTerm ? "검색 결과가 없습니다." : "팀원이 없습니다."}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {members.map(member => (
                    <div
                      key={member.id}
                      data-member-id={member.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-10 rounded-[8px] cursor-pointer transition-colors relative"
                      onClick={() => handleAddInterestedMember(member.id)}
                      onMouseEnter={e => handleMemberMouseEnter(member.id, e)}
                      onMouseLeave={handleMemberMouseLeave}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            member.profile_image_url?.trim()
                              ? member.profile_image_url.trim()
                              : profileFallbackUrl
                          }
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = profileFallbackUrl;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className=" text-body2 text-gray-80 truncate">
                          {highlightSearchTerm(member.name, searchTerm)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 프로필 모달 */}
            {hoveredMemberId && modalOffset && (
              <div
                className="absolute z-2000 transition-all duration-200 ease-in-out"
                style={{
                  left: modalOffset.left,
                  top: modalOffset.top,
                }}
              >
                <ProfileModal
                  id={hoveredMemberId}
                  isOpen={true}
                  onClose={() => {
                    setHoveredMemberId(null);
                    setModalOffset(null);
                  }}
                  onSidebarClose={onClose}
                />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AddMemberSidebar;
