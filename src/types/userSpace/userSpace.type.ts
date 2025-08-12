import { TAB_KEYS } from "@/constants/userSpace";

import { GetProfileResponse } from "../profile/profileApi.type";
import {
  GetUserSpaceInitialResult,
  UserSpaceInquiryItem,
  UserSpaceTeamItem,
} from "./userSpaceApi.type";

export type Normalized = {
  inquiries: UserSpaceInquiryItem[];
  selectedTeam: GetUserSpaceInitialResult["selected_team"] | null;
  pageSize: number;
  totalCount: number;
  teams: UserSpaceTeamItem[];
};

export type ProfilePick = Pick<
  GetProfileResponse,
  "name" | "team_id" | "profile_image_url"
>;

export type TabKey = (typeof TAB_KEYS)[number];
