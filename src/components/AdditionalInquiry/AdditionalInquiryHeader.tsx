import { Pen } from "@/assets/svgs/AdditionalInquiry";

type Props = {
  follow_ups_cnt: number;
  isChatOpen: boolean;
  onClick: () => void;
};

const AdditionalInquiryHeader = ({
  follow_ups_cnt,
  isChatOpen,
  onClick,
}: Props) => {
  return (
    <div className="w-full  h-16 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <span className="text-heading2-sb">추가 문의 </span>
        <span className="py-[2px] px-3 rounded-[30px] w-[35px] h-[26px] bg-main text-white text-body1 text-center">
          {follow_ups_cnt}
        </span>
      </div>
      {!isChatOpen && (
        <button
          onClick={onClick}
          className="w-16 h-16 rounded-[15px] bg-main px-6 text-white cursor-pointer"
        >
          <Pen />
        </button>
      )}
    </div>
  );
};

export default AdditionalInquiryHeader;
