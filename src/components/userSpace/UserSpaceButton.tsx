import Button from "@/components/common/Button";
import { USER_SPACE_TABS } from "@/constants/userSpace";
import { TabKey } from "@/types/userSpace/userSpace.type";

interface Props {
  activeTab: TabKey;
  onTabChange: (key: TabKey) => void;
}

const UserSpaceButton = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className="flex gap-4 pt-20 w-full overflow-x-auto scrollbar-hide">
      {USER_SPACE_TABS.map(
        ({
          key,
          label,
          activeIcon: ActiveIcon,
          inactiveIcon: InactiveIcon,
        }) => (
          <Button
            key={key}
            buttonType="none"
            className={`${
              activeTab === key
                ? "bg-state-progress-01 border-[2px] border-main"
                : "bg-white border border-gray-20"
            } flex flex-col cursor-pointer justify-center items-center gap-4 rounded-[13px] px-10 w-full max-w-[463px] h-[160px]`}
            onClick={() => onTabChange(key as TabKey)}
          >
            {activeTab === (key as TabKey) ? (
              <ActiveIcon className="w-10 h-10" />
            ) : (
              <InactiveIcon className="w-10 h-10" />
            )}
            <span
              className={`text-heading2-b ${
                activeTab === key ? "text-main-dark" : "text-gray-50"
              }`}
            >
              {label}
            </span>
          </Button>
        )
      )}
    </div>
  );
};

export default UserSpaceButton;
