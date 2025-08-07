import CheckGray from "@/assets/svgs/inquiry/detail/check-gray.svg";
import CheckGreen from "@/assets/svgs/inquiry/detail/check-green.svg";
import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import UserCheck from "@/assets/svgs/inquiry/detail/user-check.svg";
import { AssigneeSectionProps } from "@/types/inquiryTypes";

const getAssigneeTextColor = (
  isPendingState: boolean,
  isConfirmed: boolean
) => {
  if (isPendingState) return "text-point-yellow";
  if (isConfirmed) return "text-state-done-03";
  return "text-gray-50";
};

const AssigneeSection = ({
  assignees,
  references,
  isPendingState,
  confirmedUsers = [],
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
            const isConfirmed =
              assignee.is_confirmed ||
              confirmedUsers.includes(assignee.user_id);

            const textColor = getAssigneeTextColor(isPendingState, isConfirmed);

            return (
              <div
                key={assignee.user_id}
                className="flex justify-start items-center gap-[4px]"
              >
                <div className="flex justify-start items-center gap-[8px]">
                  {assignee.profile_image_url ? (
                    <img
                      src={assignee.profile_image_url}
                      alt={`${assignee.name}의 프로필 이미지`}
                      className="w-[20px] h-[20px] rounded-full"
                    />
                  ) : (
                    <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                  )}
                  <div className={`justify-start ${textColor} text-body2`}>
                    {assignee.name}
                  </div>
                </div>
                {!isPendingState && (
                  <div className="w-[20px] h-[20px] relative overflow-hidden">
                    {isConfirmed ? (
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
          {references?.map(reference => (
            <div
              key={reference.user_id}
              className="flex justify-start items-center gap-[6px]"
            >
              <div className="flex justify-start items-center gap-[8px]">
                {reference.profile_image_url ? (
                  <img
                    src={reference.profile_image_url}
                    alt={`${reference.name}의 프로필 이미지`}
                    className="w-[20px] h-[20px] rounded-full"
                  />
                ) : (
                  <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                )}
                <div className="justify-start text-gray-100 text-body2">
                  {reference.name}
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
