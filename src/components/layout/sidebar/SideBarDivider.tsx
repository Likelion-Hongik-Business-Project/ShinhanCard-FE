type Props = {
  small?: boolean;
};

// Divider
const SideBarDivider = ({ small }: Props) => (
  <div
    className={`${small ? "w-16" : "w-[240px]"} h-[2px] ${
      small ? "" : "mx-auto"
    } bg-gray-20 my-2`}
  />
);

export default SideBarDivider;
