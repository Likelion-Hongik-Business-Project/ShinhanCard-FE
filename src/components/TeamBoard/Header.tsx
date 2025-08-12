import { Pen, Users } from "@/assets/svgs/board";
import ExportDropdown from "@/components/common/ExportDropdown";
import { ExportOption } from "@/types/excel/excelApi.type";

interface Props {
  group_name: string;
  division_name: string;
  team_name: string;
  team_id: number;
  isActive: boolean;
  hasInquiry: boolean;
  onExport: (option: ExportOption) => void;
  onClickWrite: () => void;
  openAddMemberSidebar: (teamName: string, teamId: number) => void;
}

const Header = ({
  group_name,
  division_name,
  team_name,
  team_id,
  isActive,
  hasInquiry,
  onExport,
  onClickWrite,
  openAddMemberSidebar,
}: Props) => {
  const handleUsersClick = () => {
    openAddMemberSidebar(team_name, team_id);
  };

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
              isActive ? "text-gray-80" : "text-gray-50"
            }`}
          >
            {team_name}
          </h1>
          <Users
            className="w-8 h-8 cursor-pointer text-gray-40 hover:text-gray-60 transition-colors"
            onClick={handleUsersClick}
          />
        </div>
      </div>
      <div className="flex gap-4">
        {hasInquiry && <ExportDropdown onExport={onExport} />}
        {isActive && (
          <button
            type="button"
            onClick={onClickWrite}
            className="h-16 px-6 rounded-[15px] bg-main flex items-center cursor-pointer gap-4 text-heading3 text-white"
          >
            <Pen className="w-4 h-4 text-white" />
            문의 작성
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
