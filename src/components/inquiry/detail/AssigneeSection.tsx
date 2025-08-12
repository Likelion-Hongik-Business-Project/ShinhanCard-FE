import { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

import CloseIcon from "@/assets/svgs/inquiry/close.svg";
import CheckGray from "@/assets/svgs/inquiry/detail/check-gray.svg";
import CheckGreen from "@/assets/svgs/inquiry/detail/check-green.svg";
import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import UserCheck from "@/assets/svgs/inquiry/detail/user-check.svg";
import Modal from "@/components/common/Modal";
import ProfileModal from "@/components/common/ProfileModal";
import DepartmentSelector from "@/components/inquiry/form/DepartmentSelector";
import UserSearchList from "@/components/inquiry/form/UserSearchList";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useOutsideClick } from "@/hooks/common/useOutsideClick";
import { AssigneeSectionProps } from "@/types/inquiryTypes";
import { AssigneeUser } from "@/types/team/user.type";

// 담당자 상태에 따른 텍스트 색상 결정
const getAssigneeTextColor = (isPendingState: boolean, isChecked: boolean) => {
  if (isPendingState) return "text-point-yellow";
  if (isChecked) return "text-state-done-03";
  return "text-gray-50";
};

const AssigneeSection = ({
  assignees,
  observers,
  isPendingState,
  isEditingAssignees = false,
  allUsers = [],
  onAssigneeChange,
  onObserverChange,
  tempAssigneeIds = [],
  tempObserverIds = [],
  currentUserId,
}: AssigneeSectionProps) => {
  // 각각 독립적인 입력 state
  const [assigneeInputValue, setAssigneeInputValue] = useState("");
  const [observerInputValue, setObserverInputValue] = useState("");

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showObserverLimitModal, setShowObserverLimitModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [observerOpen, setObserverOpen] = useState(false);
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean;
    userId: number;
    userName: string;
    isSelf: boolean;
    type: "assignee" | "observer";
  }>({
    isOpen: false,
    userId: 0,
    userName: "",
    isSelf: false,
    type: "assignee",
  });

  // 프로필 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalOffset, setProfileModalOffset] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // 각각 독립적인 디바운스 처리
  const debouncedAssigneeInput = useDebounce(assigneeInputValue, 300);
  const debouncedObserverInput = useDebounce(observerInputValue, 300);

  // 프로필 호버 핸들러
  const handleProfileHover = (
    event: React.MouseEvent<HTMLDivElement>,
    userId: number
  ) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const modalHeight = 242; // ProfileModal의 대략적인 높이

    let top = rect.bottom + 8;

    // 모달이 화면 아래로 넘어가면 위로 붙이기
    if (top + modalHeight > window.innerHeight) {
      top = rect.top - modalHeight - 8;
    }

    setProfileModalOffset({
      left: rect.left,
      top: Math.max(top, 0),
    });
    setHoveredUserId(userId);
    setIsProfileModalOpen(true);
  };

  const handleProfileLeave = () => {
    // ProfileModal 내부에서 호버 상태를 관리하므로 즉시 닫지 않음
  };

  // 외부 클릭 시 드롭다운 닫기
  useOutsideClick(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useOutsideClick(observerRef, () => {
    if (observerOpen) setObserverOpen(false);
  });

  // 선택된 담당자 목록
  const selectedUsers = useMemo(() => {
    if (!tempAssigneeIds) return [];
    return allUsers.filter(user => tempAssigneeIds.includes(user.user_id));
  }, [allUsers, tempAssigneeIds]);

  // 선택된 참조자 목록
  const selectedObservers = useMemo(() => {
    if (!tempObserverIds) return [];
    return allUsers.filter(user => tempObserverIds.includes(user.user_id));
  }, [allUsers, tempObserverIds]);

  // 담당자용 필터링된 사용자 목록
  const filteredAssigneeUsers = allUsers
    .filter(u =>
      u.username
        ?.toLowerCase()
        .includes(debouncedAssigneeInput.trim().toLowerCase())
    )
    .filter(
      u =>
        !tempAssigneeIds?.includes(u.user_id) &&
        !tempObserverIds?.includes(u.user_id)
    );

  // 참조자용 필터링된 사용자 목록
  const filteredObserverUsers = allUsers
    .filter(u =>
      u.username
        ?.toLowerCase()
        .includes(debouncedObserverInput.trim().toLowerCase())
    )
    .filter(
      u =>
        !tempAssigneeIds?.includes(u.user_id) &&
        !tempObserverIds?.includes(u.user_id)
    );

  // 담당자 선택 처리
  const handleSelectUser = (user: AssigneeUser) => {
    if (user.user_id === undefined) return;
    if (!onAssigneeChange) return;

    if (tempAssigneeIds.includes(user.user_id)) return;

    if (tempAssigneeIds.length >= 3) {
      setShowLimitModal(true);
      return;
    }

    onAssigneeChange([...tempAssigneeIds, user.user_id]);
    setAssigneeInputValue("");
    setIsOpen(false);
  };

  // 참조자 선택 처리
  const handleObserverSelect = (user: AssigneeUser) => {
    if (user.user_id === undefined) return;
    if (!onObserverChange) return;

    if (tempObserverIds.includes(user.user_id)) return;
    // 참조자는 최대 5명까지 가능
    if (tempObserverIds.length >= 5) {
      setShowObserverLimitModal(true);
      return;
    }

    onObserverChange([...tempObserverIds, user.user_id]);
    setObserverInputValue("");
    setObserverOpen(false);
  };

  useEffect(() => {
    if (tempAssigneeIds?.length >= 3 && assigneeInputValue !== "") {
      setAssigneeInputValue("");
    }
  }, [tempAssigneeIds, assigneeInputValue]);

  // 표시할 담당자 목록 결정
  const getDisplayAssignees = () => {
    if (isEditingAssignees) {
      return selectedUsers;
    }
    return assignees || [];
  };

  // 표시할 참조자 목록 결정
  const getDisplayObservers = () => {
    if (isEditingAssignees) {
      return selectedObservers;
    }
    return observers || [];
  };

  // 담당자 제거 모달 표시
  const handleRemoveUser = (id: number) => {
    const userToRemove = allUsers.find(user => user.user_id === id);
    if (!userToRemove) return;

    const isSelf = id === currentUserId;
    setRemoveModal({
      isOpen: true,
      userId: id,
      userName: userToRemove.username,
      isSelf,
      type: "assignee",
    });
  };

  // 참조자 제거 모달 표시
  const handleRemoveObserver = (id: number) => {
    const userToRemove = allUsers.find(user => user.user_id === id);
    if (!userToRemove) return;

    const isSelf = id === currentUserId;
    setRemoveModal({
      isOpen: true,
      userId: id,
      userName: userToRemove.username,
      isSelf,
      type: "observer",
    });
  };

  // 제거 확인 처리
  const confirmRemoveUser = () => {
    if (removeModal.type === "assignee" && onAssigneeChange) {
      onAssigneeChange(
        tempAssigneeIds.filter(userId => userId !== removeModal.userId)
      );
    } else if (removeModal.type === "observer" && onObserverChange) {
      onObserverChange(
        tempObserverIds.filter(userId => userId !== removeModal.userId)
      );
    }
    setRemoveModal({
      isOpen: false,
      userId: 0,
      userName: "",
      isSelf: false,
      type: "assignee",
    });
  };

  // 제거 취소 처리
  const cancelRemoveUser = () => {
    setRemoveModal({
      isOpen: false,
      userId: 0,
      userName: "",
      isSelf: false,
      type: "assignee",
    });
  };

  // 담당자 드롭다운 렌더링
  const renderAssigneeDropdown = () => {
    if (!isEditingAssignees || !isOpen) return null;

    return (
      <div className="absolute top-full mt-1 w-full bg-white rounded-[5px] shadow-02 flex flex-col z-50">
        {assigneeInputValue.trim() === "" ? (
          <DepartmentSelector
            allUsers={allUsers}
            onSelectUser={handleSelectUser}
          />
        ) : filteredAssigneeUsers.length === 0 ? (
          <div className="flex flex-col gap-4 p-2">
            <span className="text-detail1 text-gray-50">
              사용자를 선택하세요
            </span>
            <span className="text-detail1 bg-gray-10 py-2 px-1 flex items-center text-gray-60">
              없음
            </span>
          </div>
        ) : (
          <UserSearchList
            users={filteredAssigneeUsers}
            onSelectUser={handleSelectUser}
          />
        )}
      </div>
    );
  };

  // 참조자 드롭다운 렌더링
  const renderObserverDropdown = () => {
    if (!isEditingAssignees || !observerOpen) return null;

    return (
      <div className="absolute top-full mt-1 w-full bg-white rounded-[5px] shadow-02 flex flex-col z-50">
        {observerInputValue.trim() === "" ? (
          <DepartmentSelector
            allUsers={allUsers}
            onSelectUser={handleObserverSelect}
          />
        ) : filteredObserverUsers.length === 0 ? (
          <div className="flex flex-col gap-4 p-2">
            <span className="text-detail1 text-gray-50">
              사용자를 선택하세요
            </span>
            <span className="text-detail1 bg-gray-10 py-2 px-1 flex items-center text-gray-60">
              없음
            </span>
          </div>
        ) : (
          <UserSearchList
            users={filteredObserverUsers}
            onSelectUser={handleObserverSelect}
          />
        )}
      </div>
    );
  };

  return (
    <div className="px-[16px] flex flex-col justify-start items-start gap-[16px]">
      {/* 답변 담당자 */}
      <div
        ref={containerRef}
        className="flex gap-7.5 items-center relative w-full"
      >
        <div className="flex gap-2 items-center">
          <UserCheck />
          <span className="text-body2 text-gray-60">답변 담당자</span>
        </div>

        <div className="relative w-[728px]">
          {isEditingAssignees ? (
            <>
              <div
                className={clsx(
                  "rounded-[5px] px-2 py-1 cursor-pointer text-body2 flex flex-wrap items-center gap-4 min-h-[32px]",
                  tempAssigneeIds?.length > 0 || isOpen
                    ? "bg-gray-10 border border-gray-40"
                    : "bg-white text-gray-30 border-none",
                  "hover:bg-gray-10"
                )}
                onClick={() => setIsOpen(true)}
              >
                {selectedUsers.map(user => (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-1.5 bg-gray-10 rounded"
                  >
                    <div
                      className="flex gap-2 items-center cursor-pointer"
                      onMouseEnter={e => handleProfileHover(e, user.user_id)}
                      onMouseLeave={handleProfileLeave}
                    >
                      {user.profile_url ? (
                        <img
                          src={user.profile_url}
                          alt="프로필 이미지"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <ProfileIcon />
                      )}
                      <span>{user.username}</span>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveUser(user.user_id);
                      }}
                      className="cursor-pointer"
                    >
                      <CloseIcon className="w-[18.833px] h-[18.833px]" />
                    </button>
                  </div>
                ))}
                <input
                  value={assigneeInputValue}
                  onChange={e => setAssigneeInputValue(e.target.value)}
                  className="flex-1 min-w-0 cursor-pointer outline-none text-gray-100 placeholder:text-gray-30 bg-transparent"
                  placeholder={tempAssigneeIds?.length === 0 ? "필수입력" : ""}
                />
              </div>

              <div className="relative w-full">{renderAssigneeDropdown()}</div>
            </>
          ) : (
            // 일반 모드 - 담당자 조회만 가능
            <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
              {getDisplayAssignees()?.length > 0 ? (
                <>
                  {getDisplayAssignees().map(assignee => {
                    const originalAssignee = assignee as {
                      user_id: number;
                      user_name: string;
                      profile_image_url?: string;
                      is_checked: boolean;
                    };
                    const textColor = getAssigneeTextColor(
                      isPendingState,
                      originalAssignee.is_checked
                    );

                    return (
                      <div
                        key={originalAssignee.user_id}
                        className="flex justify-start items-center gap-[4px]"
                      >
                        <div
                          className="flex justify-start items-center gap-[8px] cursor-pointer"
                          onMouseEnter={e =>
                            handleProfileHover(e, originalAssignee.user_id)
                          }
                          onMouseLeave={handleProfileLeave}
                        >
                          {originalAssignee.profile_image_url ? (
                            <img
                              src={originalAssignee.profile_image_url}
                              alt={`${originalAssignee.user_name}의 프로필 이미지`}
                              className="w-[20px] h-[20px] rounded-full"
                            />
                          ) : (
                            <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                          )}
                          <div
                            className={`justify-start ${textColor} text-body2`}
                          >
                            {originalAssignee.user_name}
                          </div>
                        </div>
                        {!isPendingState && (
                          <div className="w-[20px] h-[20px] relative overflow-hidden">
                            {originalAssignee.is_checked ? (
                              <CheckGreen className="w-[20px] h-[20px]" />
                            ) : (
                              <CheckGray className="w-[20px] h-[20px]" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-gray-50 text-body2">
                  담당자가 지정되지 않았습니다
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 답변 참조자 */}
      <div
        ref={observerRef}
        className="flex gap-7.5 items-center relative w-full"
      >
        <div className="flex gap-2 items-center">
          <UserCheck />
          <span className="text-body2 text-gray-60">답변 참조자</span>
        </div>

        <div className="relative w-[728px]">
          {isEditingAssignees ? (
            <>
              <div
                className={clsx(
                  "rounded-[5px] px-2 py-1 cursor-pointer text-body2 flex flex-wrap items-center gap-4 min-h-[32px]",
                  tempObserverIds?.length > 0 || observerOpen
                    ? "bg-gray-10 border border-gray-40"
                    : "bg-white text-gray-30 border-none",
                  "hover:bg-gray-10"
                )}
                onClick={() => setObserverOpen(true)}
              >
                {selectedObservers.map(user => (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-1.5 bg-gray-10 rounded"
                  >
                    <div
                      className="flex gap-2 items-center cursor-pointer"
                      onMouseEnter={e => handleProfileHover(e, user.user_id)}
                      onMouseLeave={handleProfileLeave}
                    >
                      {user.profile_url ? (
                        <img
                          src={user.profile_url}
                          alt="프로필 이미지"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <ProfileIcon />
                      )}
                      <span>{user.username}</span>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveObserver(user.user_id);
                      }}
                      className="cursor-pointer"
                    >
                      <CloseIcon className="w-[18.833px] h-[18.833px]" />
                    </button>
                  </div>
                ))}
                <input
                  value={observerInputValue}
                  onChange={e => setObserverInputValue(e.target.value)}
                  className="flex-1 min-w-0 cursor-pointer outline-none text-gray-100 placeholder:text-gray-30 bg-transparent"
                  placeholder={tempObserverIds?.length === 0 ? "선택입력" : ""}
                />
              </div>

              <div className="relative w-full">{renderObserverDropdown()}</div>
            </>
          ) : (
            // 일반 모드 - 참조자 조회만 가능
            <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
              {getDisplayObservers()?.length > 0 ? (
                <>
                  {getDisplayObservers().map(observer => {
                    if (isEditingAssignees) {
                      // 편집 모드에서는 AssigneeUser 타입
                      const user = observer as AssigneeUser;
                      return (
                        <div
                          key={user.user_id}
                          className="flex justify-start items-center gap-[6px]"
                        >
                          <div
                            className="flex justify-start items-center gap-[8px] cursor-pointer"
                            onMouseEnter={e =>
                              handleProfileHover(e, user.user_id)
                            }
                            onMouseLeave={handleProfileLeave}
                          >
                            {user.profile_url ? (
                              <img
                                src={user.profile_url}
                                alt={`${user.username}의 프로필 이미지`}
                                className="w-[20px] h-[20px] rounded-full"
                              />
                            ) : (
                              <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                            )}
                            <div className="justify-start text-gray-100 text-body2">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // 일반 모드에서는 기존 observer 타입
                      const originalObserver = observer as {
                        userId: number;
                        userName: string;
                        profileImageUrl?: string;
                      };

                      return (
                        <div
                          key={originalObserver.userId}
                          className="flex justify-start items-center gap-[6px]"
                        >
                          <div
                            className="flex justify-start items-center gap-[8px] cursor-pointer"
                            onMouseEnter={e =>
                              handleProfileHover(e, originalObserver.userId)
                            }
                            onMouseLeave={handleProfileLeave}
                          >
                            {originalObserver.profileImageUrl ? (
                              <img
                                src={originalObserver.profileImageUrl}
                                alt={`${originalObserver.userName}의 프로필 이미지`}
                                className="w-[20px] h-[20px] rounded-full"
                              />
                            ) : (
                              <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                            )}
                            <div className="justify-start text-gray-100 text-body2">
                              {originalObserver.userName}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </>
              ) : (
                <div className="text-gray-50 text-body2">
                  참조자가 지정되지 않았습니다
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 제거 확인 모달 */}
      {removeModal.isOpen && (
        <Modal
          isOpen={removeModal.isOpen}
          onClose={cancelRemoveUser}
          title={
            removeModal.isSelf
              ? `해당 게시글 권한을\n철회하시겠습니까?`
              : `'${removeModal.userName}'님의\n해당 게시글 권한을 삭제하시겠습니까?`
          }
          description={
            removeModal.isSelf
              ? `권한을 삭제할시, 답변, 담당관리 등의\n기능을 수행할 수 없습니다.`
              : `담당자/참조자를 수정 시 권한을 부여하거나\n삭제할 수 있습니다.`
          }
          buttons={[
            {
              label: "뒤로가기",
              type: "gray",
              onClick: cancelRemoveUser,
            },
            {
              label: "삭제하기",
              type: "blue",
              onClick: confirmRemoveUser,
            },
          ]}
        />
      )}

      {/* 담당자 최대 인원 제한 모달 */}
      {showLimitModal && (
        <Modal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          title="담당자는 최대 3명까지 가능합니다"
          buttons={[
            {
              label: "확인",
              onClick: () => setShowLimitModal(false),
              type: "blue",
            },
          ]}
        />
      )}

      {/* 참조자 최대 인원 제한 모달 */}
      {showObserverLimitModal && (
        <Modal
          isOpen={showObserverLimitModal}
          onClose={() => setShowObserverLimitModal(false)}
          title="참조자는 최대 5명까지 가능합니다"
          buttons={[
            {
              label: "확인",
              onClick: () => setShowObserverLimitModal(false),
              type: "blue",
            },
          ]}
        />
      )}

      {/* 프로필 모달 */}
      {isProfileModalOpen && profileModalOffset && hoveredUserId && (
        <div
          className="fixed z-2000 transition-all duration-200 ease-in-out"
          style={{
            left: profileModalOffset.left,
            top: profileModalOffset.top,
          }}
        >
          <ProfileModal
            id={hoveredUserId}
            isOpen={true}
            onClose={() => {
              setIsProfileModalOpen(false);
              setProfileModalOffset(null);
              setHoveredUserId(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AssigneeSection;
