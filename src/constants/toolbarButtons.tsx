import {
  BoldIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  H4Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  QuotesIcon,
  StrikeIcon,
} from "@/assets/svgs/inquiry/toolbar";
import { ToolbarButton } from "@/types/toolbar";

export const toolbarButtons: ToolbarButton[] = [
  { command: "heading", level: 1, icon: () => <H1Icon />, key: "h1" },
  { command: "heading", level: 2, icon: () => <H2Icon />, key: "h2" },
  { command: "heading", level: 3, icon: () => <H3Icon />, key: "h3" },
  { command: "heading", level: 4, icon: () => <H4Icon />, key: "h4" },
  "divider",
  { command: "bold", icon: () => <BoldIcon />, key: "bold" },
  { command: "italic", icon: () => <ItalicIcon />, key: "italic" },
  { command: "strike", icon: () => <StrikeIcon />, key: "strike" },
  "divider",
  { command: "quote", icon: () => <QuotesIcon />, key: "quote" },
  { command: "link", icon: () => <LinkIcon />, key: "link" },
  { command: "image", icon: () => <ImageIcon />, key: "image" },
];
