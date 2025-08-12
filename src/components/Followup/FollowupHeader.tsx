import Pencil from "@/assets/svgs/common/pencil.svg";

import Button from "../common/Button";

type Props = {
  follow_ups_cnt: number;
  isChatOpen: boolean;
  onClick: () => void;
};

const FollowupHeader = ({ follow_ups_cnt, isChatOpen, onClick }: Props) => {
  return (
    <div className="w-full  h-16 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <span className="text-heading2-sb text-gray-100">추가 문의 </span>
        <span className="py-[2px] px-3 rounded-[30px] w-fit h-[26px] bg-main text-white text-body1 text-center">
          {follow_ups_cnt}
        </span>
      </div>
      {!isChatOpen && (
        <Button
          buttonType="blue"
          onClick={onClick}
          className="w-16 h-16 rounded-[15px]"
        >
          <Pencil />
        </Button>
      )}
    </div>
  );
};

export default FollowupHeader;
