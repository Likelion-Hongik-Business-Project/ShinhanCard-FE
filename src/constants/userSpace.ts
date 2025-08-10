import BlueMessage from "@/assets/svgs/common/message-blue.svg";
import SkyMessage from "@/assets/svgs/common/message-sky.svg";
import BluePencil from "@/assets/svgs/common/pencil-blue.svg";
import SkyPencil from "@/assets/svgs/common/pencil-sky.svg";
import BlueStar from "@/assets/svgs/common/star-blue.svg";
import SkyStar from "@/assets/svgs/common/star-sky.svg";
import { TabKey } from "@/types/userSpace/userSpace.type";

export const USER_SPACE_TABS = [
  {
    key: "written",
    label: "작성한 문의 내역",
    activeIcon: BluePencil,
    inactiveIcon: SkyPencil,
  },
  {
    key: "assigned",
    label: "담당한 문의 내역",
    activeIcon: BlueMessage,
    inactiveIcon: SkyMessage,
  },
  {
    key: "scrap",
    label: "스크랩 내역",
    activeIcon: BlueStar,
    inactiveIcon: SkyStar,
  },
] as const;

export const TAB_KEYS = ["assigned", "scrap", "written"] as const;

export const isTabKey = (k: string): k is TabKey =>
  (TAB_KEYS as readonly string[]).includes(k);
