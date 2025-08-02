import Arrow from "@/assets/svgs/common/down.svg";

const Pagination = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <button
        type="button"
        disabled
        className="text-detail1 text-gray-50 disabled:opacity-50"
      >
        <Arrow className="w-6 h-6 text-gray-40 rotate-90" />
      </button>
      <button className="w-[38px] h-[38px] border-2 border-main text-main rounded-[5px] bg-white text-body1">
        1
      </button>
      <button className="w-[38px] h-[38px] border-1 border-gray-50 text-gray-60 rounded-[5px] bg-white  text-body1">
        2
      </button>
      <button
        type="button"
        className="text-detail1 text-gray-50 disabled:opacity-50"
      >
        <Arrow className="w-6 h-6 text-gray-50 -rotate-90" />
      </button>
    </div>
  );
};

export default Pagination;
