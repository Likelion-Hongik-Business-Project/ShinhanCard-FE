import { HomeButtonProps } from "@/types/home/homeButton.type";

const HomeButton = ({
  type,
  count,
  label,
  icon: Icon,
  isActive,
  onClick,
}: HomeButtonProps) => {
  return (
    <button
      onClick={() => onClick(type)}
      className={`w-full min-w-44 max-w-80 px-10 py-7.75 border-2 rounded-[13px] flex flex-col justify-center items-start cursor-pointer ${isActive ? "bg-state-progress-01 border-main" : "bg-white border-2 border-gray-20"}`}
    >
      <p className="text-gray-80 text-[48px] font-bold leading-[120%] font-pretendard">
        {count}
      </p>
      <div className="flex w-full justify-between items-center">
        <div className="flex h-full flex-col justify-end">
          <p
            className={`${isActive ? "text-gray-80" : "text-gray-60"} text-heading3-sb`}
          >
            {label}
          </p>
        </div>
        <Icon
          className={
            isActive ? "text-main w-10 h-10" : "text-main-bright w-10 h-10"
          }
        />
      </div>
    </button>
  );
};

export default HomeButton;
