import { Division, Group, Team } from "@/types/team/user.type";

import { PostInquiryRequest } from "./inquiryApi.type";
import { UserPreview } from "./inquiryDraft.type";

export interface GetInquiryDraftExistsResponse {
  draft_id: number;
  is_present: boolean;
}

export interface GetInquiryDraftResponse {
  title: string;
  content: string;
  status: "DRAFT";
  assignees: UserPreview[];
  observers: UserPreview[];
  group: Group;
  division: Division;
  team: Team;
  inquiry_id: number;
  created_at: string;
}

export type PutInquiryDraftRequest = PostInquiryRequest;
export interface PutInquiryDraftResponse {
  status: "DRAFT";
  inquiry_id: number;
  updated_at: string;
}

export type PostInquiryDraftRequest = PostInquiryRequest;
export interface PostInquiryDraftResponse {
  inquiry_id: number;
  status: "DRAFT";
}

export interface PatchInquiryDraftRequest {
  title?: string;
  content?: string;
  assignee_ids?: number[];
  observer_ids?: number[];
}

export interface DeleteInquiryDraftResponse {
  message: string;
  deleted_at: string;
}
