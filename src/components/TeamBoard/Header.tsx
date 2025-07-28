import { Pen, Upload, Users } from "@/assets/svgs/board";

interface HeaderProps {
  group_name: string;
  division_name: string;
  team_name: string;
  isTeamEnd: boolean;
}

const Header = ({
  group_name,
  division_name,
  team_name,
  isTeamEnd,
}: HeaderProps) => {
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
      <div className="flex gap-4">
        <button
          type="button"
          className="h-16 px-6 rounded-[15px] border border-gray-20 cursor-pointer flex items-center gap-4 bg-white text-heading3 text-gray-80"
        >
          <Upload className="w-4 h-4 text-gray-60" />
          Export
        </button>
        {!isTeamEnd && (
          <button
            type="button"
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
