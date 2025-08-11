import { TAB_KEYS } from "@/constants/userSpace";

import {
  GetInitMyInquiryListResponse,
  InquiryItem,
} from "../inquiry/inquiryListApi.type";
import { GetProfileResponse } from "../profile/profileApi.type";

export type Normalized = {
  inquiries: InquiryItem[];
  selectedTeam: GetInitMyInquiryListResponse["selected_team"] | null;
  pageSize: number;
  totalCount: number;
  teams: GetInitMyInquiryListResponse["teams"];
};

export type ProfilePick = Pick<
  GetProfileResponse,
  "name" | "team_id" | "profile_image_url"
>;

export type TabKey = (typeof TAB_KEYS)[number];
