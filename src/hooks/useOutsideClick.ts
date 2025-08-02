import { useEffect } from "react";

export const useOutsideClick = (
  refs:
    | React.RefObject<HTMLElement | null>
    | React.RefObject<HTMLElement | null>[],
  onClickOutside: () => void
) => {
  useEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs];

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const isInside = refList.some(
        ref => ref.current && ref.current.contains(target)
      );

      if (!isInside) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, onClickOutside]);
};
