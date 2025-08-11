import { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

import CloseIcon from "@/assets/svgs/inquiry/close.svg";
import CheckGray from "@/assets/svgs/inquiry/detail/check-gray.svg";
import CheckGreen from "@/assets/svgs/inquiry/detail/check-green.svg";
import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import UserCheck from "@/assets/svgs/inquiry/detail/user-check.svg";
import Modal from "@/components/common/Modal";
import DepartmentSelector from "@/components/inquiry/form/DepartmentSelector";
import UserSearchList from "@/components/inquiry/form/UserSearchList";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useOutsideClick } from "@/hooks/common/useOutsideClick";
import { AssigneeSectionProps } from "@/types/inquiryTypes";
import { AssigneeUser } from "@/types/team/user.type";

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
  tempAssigneeIds = [],
  currentUserId,
}: AssigneeSectionProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean;
    userId: number;
    userName: string;
    isSelf: boolean;
  }>({ isOpen: false, userId: 0, userName: "", isSelf: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedInput = useDebounce(inputValue, 300);

  useOutsideClick(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const selectedUsers = useMemo(() => {
    if (!tempAssigneeIds) return [];
    return allUsers.filter(user => tempAssigneeIds.includes(user.user_id));
  }, [allUsers, tempAssigneeIds]);

  const handleSelectUser = (user: AssigneeUser) => {
    if (user.user_id === undefined) return;
    if (!onAssigneeChange) return;

    if (tempAssigneeIds.includes(user.user_id)) return;

    if (tempAssigneeIds.length >= 3) {
      setShowLimitModal(true);
      return;
    }

    onAssigneeChange([...tempAssigneeIds, user.user_id]);
    setInputValue("");
  };

  const filteredUsers = allUsers
    .filter(u =>
      u.username?.toLowerCase().includes(debouncedInput.trim().toLowerCase())
    )
    .filter(u => !tempAssigneeIds?.includes(u.user_id));

  useEffect(() => {
    if (tempAssigneeIds?.length >= 3 && inputValue !== "") {
      setInputValue("");
    }
  }, [tempAssigneeIds, inputValue]);

  const getDisplayAssignees = () => {
    if (isEditingAssignees) {
      return selectedUsers;
    }
    return assignees || [];
  };

  const getDisplayObservers = () => {
    return observers || [];
  };

  const handleRemoveUser = (id: number) => {
    const userToRemove = allUsers.find(user => user.user_id === id);
    if (!userToRemove) return;

    const isSelf = id === currentUserId;
    setRemoveModal({
      isOpen: true,
      userId: id,
      userName: userToRemove.username,
      isSelf,
    });
  };

  const confirmRemoveUser = () => {
    if (!onAssigneeChange) return;
    onAssigneeChange(
      tempAssigneeIds.filter(userId => userId !== removeModal.userId)
    );
    setRemoveModal({ isOpen: false, userId: 0, userName: "", isSelf: false });
  };

  const cancelRemoveUser = () => {
    setRemoveModal({ isOpen: false, userId: 0, userName: "", isSelf: false });
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
                    <div className="flex gap-2 items-center">
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
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="flex-1 min-w-0 cursor-pointer outline-none text-gray-100 placeholder:text-gray-30 bg-transparent"
                  placeholder={tempAssigneeIds?.length === 0 ? "필수입력" : ""}
                />
              </div>

              <div className="relative w-full">
                {isOpen && (
                  <div className="absolute top-full mt-1 w-full bg-white rounded-[5px] shadow-02 flex flex-col z-50">
                    {inputValue.trim() === "" ? (
                      <DepartmentSelector
                        allUsers={allUsers}
                        onSelectUser={handleSelectUser}
                      />
                    ) : filteredUsers.length === 0 ? (
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
                        users={filteredUsers}
                        onSelectUser={handleSelectUser}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* 담당자 삭제 모달 */}
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
            </>
          ) : (
            // 일반 모드 (편집 불가)
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
                        <div className="flex justify-start items-center gap-[8px]">
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

      {/* 답변 참조자 (편집 불가) */}
      <div className="flex gap-7.5 items-center relative w-full">
        <div className="flex gap-2 items-center">
          <UserCheck />
          <span className="text-body2 text-gray-60">답변 참조자</span>
        </div>

        <div className="relative w-[728px]">
          <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
            {getDisplayObservers()?.length > 0 ? (
              <>
                {getDisplayObservers().map(observer => {
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
                      <div className="flex justify-start items-center gap-[8px]">
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
                })}
              </>
            ) : (
              <div className="text-gray-50 text-body2">
                참조자가 지정되지 않았습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssigneeSection;
