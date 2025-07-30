import { Users } from "@/assets/svgs/board";
import { mockInquiryDetailResponse } from "@/mocks/mockInquiryDetailResponse";

interface HeaderProps {
  isTeamEnd?: boolean;
}

const Header = ({ isTeamEnd = false }: HeaderProps) => {
  const { group_name, division_name, team_name } = mockInquiryDetailResponse;

  return (
    <div className="flex justify-between items-end">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="py-1 px-2 bg-main rounded-[30px] flex items-center">
            <span className="text-detail1 text-white">
              {group_name} / {division_name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <h1
            className={`text-heading1 ${
              isTeamEnd ? "text-gray-50" : "text-gray-80"
            }`}
          >
            {team_name}
          </h1>
          <Users className="w-8 h-8 text-gray-40" />
        </div>
      </div>
    </div>
  );
};

export default Header;
