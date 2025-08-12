export interface FollowupsRequest {
  content: string;
  assigneeId: number;
}

export interface FollowupsResponse {
  followupId: number;
  createdAt: string;
}

export type PostFollowupsRequest = FollowupsRequest;
export type PutFollowupsRequest = FollowupsRequest;
export type PostFollowupsResponse = FollowupsResponse;
export type PutFollowupsResponse = FollowupsResponse;
