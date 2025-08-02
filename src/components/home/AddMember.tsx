import Plus from "@/assets/svgs/home/plus.svg";

type Props = { onClick: () => void };

const AddMember = ({ onClick }: Props) => {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer select-none border-2 border-dashed border-main-bright rounded-[15px] bg-gray-10"
      onClick={onClick}
    >
      <Plus className="w-12 h-12" />
      <span className="text-heading3-sb text-state-progress-02">
        관심 팀원 추가하기
      </span>
    </div>
  );
};

export default AddMember;
