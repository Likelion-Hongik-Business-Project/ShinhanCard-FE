import CheckGray from "@/assets/svgs/inquiry/detail/check-gray.svg";
import CheckGreen from "@/assets/svgs/inquiry/detail/check-green.svg";
import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import UserCheck from "@/assets/svgs/inquiry/detail/user-check.svg";
import { AssigneeSectionProps } from "@/types/inquiryTypes";

const getAssigneeTextColor = (isPendingState: boolean, isChecked: boolean) => {
  if (isPendingState) return "text-point-yellow";
  if (isChecked) return "text-state-done-03";
  return "text-gray-50";
};

const AssigneeSection = ({
  assignees,
  observers,
  isPendingState,
}: AssigneeSectionProps) => {
  return (
    <div className="px-[16px] flex flex-col justify-start items-start gap-[16px]">
      {/* 답변 담당자 */}
      <div className="flex justify-start items-center gap-[20px]">
        <div className="flex justify-start items-center gap-[8px]">
          <div className="w-[20px] h-[20px] overflow-hidden">
            <UserCheck className="w-[20px] h-[20px] text-gray-40" />
          </div>
          <div className="justify-start text-gray-50 text-body2">
            답변 담당자
          </div>
        </div>
        <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
          {assignees?.map(assignee => {
            const isChecked = assignee.is_checked;

            const textColor = getAssigneeTextColor(isPendingState, isChecked);

            return (
              <div
                key={assignee.user_id}
                className="flex justify-start items-center gap-[4px]"
              >
                <div className="flex justify-start items-center gap-[8px]">
                  {assignee.profile_image_url ? (
                    <img
                      src={assignee.profile_image_url}
                      alt={`${assignee.user_name}의 프로필 이미지`}
                      className="w-[20px] h-[20px] rounded-full"
                    />
                  ) : (
                    <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                  )}
                  <div className={`justify-start ${textColor} text-body2`}>
                    {assignee.user_name}
                  </div>
                </div>
                {!isPendingState && (
                  <div className="w-[20px] h-[20px] relative overflow-hidden">
                    {isChecked ? (
                      <CheckGreen className="w-[20px] h-[20px]" />
                    ) : (
                      <CheckGray className="w-[20px] h-[20px]" />
                    )}
                  </div>
                )}
              </div>
            );
          }) || (
            <div className="text-gray-50 text-body2">
              담당자가 지정되지 않았습니다
            </div>
          )}
        </div>
      </div>

      {/* 답변 참조자 */}
      <div className="flex items-center gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <div className="w-[20px] h-[20px] overflow-hidden">
            <UserCheck className="w-[20px] h-[20px] text-gray-40" />
          </div>
          <div className="text-gray-50 text-body2">답변 참조자</div>
        </div>
        <div className="w-[728px] px-[8px] py-[4px] bg-white rounded-[5px] flex justify-start items-center gap-[16px]">
          {observers?.map(observer => (
            <div
              key={observer.userId}
              className="flex justify-start items-center gap-[6px]"
            >
              <div className="flex justify-start items-center gap-[8px]">
                {observer.profileImageUrl ? (
                  <img
                    src={observer.profileImageUrl}
                    alt={`${observer.userName}의 프로필 이미지`}
                    className="w-[20px] h-[20px] rounded-full"
                  />
                ) : (
                  <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                )}
                <div className="justify-start text-gray-100 text-body2">
                  {observer.userName}
                </div>
              </div>
            </div>
          )) || (
            <div className="text-gray-50 text-body2">
              참조자가 지정되지 않았습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssigneeSection;
