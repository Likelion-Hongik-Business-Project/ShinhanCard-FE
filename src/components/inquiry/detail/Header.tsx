import { useNavigate } from "react-router-dom";

import { Users } from "@/assets/svgs/board";
import { HeaderProps } from "@/types/inquiryTypes";

const Header = ({
  isTeamEnd = false,
  isAdmin = false,
  teamInfo,
  onDelete,
}: HeaderProps) => {
  const { group_name, division_name, team_name } = teamInfo;
  const navigate = useNavigate();
  return (
    <div className="self-stretch flex justify-between items-end">
      <div className="flex flex-col justify-start items-start gap-[16px]">
        <div className="px-[8px] py-[4px] bg-main rounded-[30px] flex justify-center items-center gap-[10px]">
          <div className="text-white text-detail1">
            {group_name} / {division_name}
          </div>
        </div>
        <div className="flex justify-start items-center gap-[16px]">
          <button onClick={() => navigate(`/team/${teamInfo.team_id}`)}>
            <div className="px-[4px] flex justify-start items-center cursor-pointer">
              <div
                className={`text-heading1 ${
                  isTeamEnd ? "text-gray-50" : "text-gray-80"
                }`}
              >
                {team_name}
              </div>
            </div>
          </button>
          <div className="w-[32px] h-[32px] relative overflow-hidden">
            <Users className="w-[32px] h-[32px] text-gray-40" />
          </div>
        </div>
      </div>

      {/* 팀관리자 삭제 버튼 */}
      {isAdmin && (
        <div className="px-[16px] flex justify-center items-center gap-[10px]">
          <button
            onClick={onDelete}
            className="justify-start text-point-red text-body1 cursor-pointer"
          >
            게시물 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
