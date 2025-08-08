import { Pagination, Profile } from "@/types/inquiry/inquiryListApi.type";

export type NotificationItem = {
  notification_id: number;
  inquiry_id: number | null;
  notification_type: string;
  notification_title: string;
  notification_body: string;
  writer: Profile;
  created_at: string;
  is_read: boolean;
  is_archived: boolean;
};

export type GetNotificationsResponse = {
  unread_count: number;
  notifications: NotificationItem[];
  pagination: Pagination;
};

export type GetNotificationsRequest = {
  page: number;
  page_size: number;
};
