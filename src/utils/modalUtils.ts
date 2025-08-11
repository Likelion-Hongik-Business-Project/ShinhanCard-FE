import { ModalButton } from "@/types/modal";

export const getButtonClass = (
  type: ModalButton["type"],
  isSingle: boolean
): string => {
  const widthClass = isSingle ? "w-[280px]" : "w-[200px]";
  const base = `flex justify-center items-center gap-4 rounded-[15px] text-heading3 cursor-pointer ${widthClass} h-16 transition-colors duration-200`;

  switch (type) {
    case "blue":
      return `${base} bg-main text-white hover:bg-main-dark hover:text-gray-30`;
    case "white":
      return `${base} bg-white border border-main text-main hover:bg-gray-10`;
    case "gray":
      return `${base} bg-gray-30 text-white hover:bg-gray-50`;
    case "red":
      return `${base} bg-point-red text-white hover:bg-point-red-dark`;
  }
};
