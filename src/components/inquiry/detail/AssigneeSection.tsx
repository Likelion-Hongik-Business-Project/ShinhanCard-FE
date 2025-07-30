import CheckGray from "@/assets/svgs/inquiry/detail/check-gray.svg";
import CheckGreen from "@/assets/svgs/inquiry/detail/check-green.svg";
import ProfileIcon from "@/assets/svgs/inquiry/detail/profile.svg";
import UserCheck from "@/assets/svgs/inquiry/detail/user-check.svg";

interface AssigneeSectionProps {
  assignees?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  references?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  confirmedAssignees?: number[];
  isPendingState: boolean;
  isAssigneeEditMode: boolean;
  showAssigneeFeatures: boolean;
}

const AssigneeSection = ({
  assignees,
  references,
  confirmedAssignees,
  isPendingState,
  isAssigneeEditMode,
  showAssigneeFeatures,
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
              confirmedAssignees?.includes(assignee.user_id) || false;

            let textColor;
            if (isPendingState) {
              textColor = "text-point-yellow";
            } else if (isConfirmed) {
              textColor = "text-state-done-03";
            } else {
              textColor = "text-gray-50";
            }

            return (
              <div
                key={assignee.user_id}
                className="flex justify-start items-center gap-[4px]"
              >
                <div className="flex justify-start items-center gap-[8px]">
                  <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
                  <div className={`justify-start ${textColor} text-body2`}>
                    {assignee.name}
                  </div>
                </div>
                <div className="w-[20px] h-[20px] relative overflow-hidden">
                  {isConfirmed && !isPendingState ? (
                    <CheckGreen className="w-[20px] h-[20px]" />
                  ) : (
                    <CheckGray className="w-[20px] h-[20px]" />
                  )}
                </div>
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
                <ProfileIcon className="w-[20px] h-[20px] rounded-full text-gray-30" />
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

      {/* 담당자용 수정 섹션 */}
      {showAssigneeFeatures && isAssigneeEditMode && (
        <div className="w-full mt-4 p-4 bg-gray-10 rounded-lg">
          <div className="text-gray-60 text-body2">
            담당자 수정 섹션 (UI 추가 예정)
          </div>
        </div>
      )}
    </div>
  );
};

export default AssigneeSection;
