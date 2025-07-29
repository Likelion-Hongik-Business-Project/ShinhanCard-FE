import { INBOX_TABS } from "@/constants/inbox";

export type Tab = (typeof INBOX_TABS)[number];

export type InquiryType =
  | "ANSWER_COMPLETED"
  | "ANSWER_CREATED"
  | "ASSIGNED"
  | "REFERENCED"
  | "RE_NOTIFY"
  | "MENTIONED"
  | "REPLIED"
  | "PENDING"
  | "DELETED";

export type InboxResponse = {
  total_pending_count: number;
  teams: TeamInbox[];
};

export type TeamInbox = {
  team_id: number;
  group_name: string;
  division_name: string;
  team_name: string;
  inquiry_count: number;
  inquiries: Inquiry[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    has_next: boolean;
  };
};

export type Inquiry = {
  id: number;
  writer: {
    id: number;
    name: string;
    profile_image_url: string;
  };
  notification_text: string;
  created_at: string;
};
