type DividerProps = {
  small?: boolean;
};

// Divider
const Divider = ({ small }: DividerProps) => (
  <div
    className={`${small ? "w-16" : "w-[240px]"} h-[2px] ${
      small ? "" : "mx-auto"
    } bg-gray-20 my-2`}
  />
);

export default Divider;
