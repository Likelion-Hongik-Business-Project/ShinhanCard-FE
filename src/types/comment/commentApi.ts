export interface CommentRequest {
  content: string;
  taggedUserId: number;
}

export interface CommentResponse {
  CommentId: number;
  createdAt: string;
}

export type PostCommentRequest = CommentRequest;
export type PutCommentRequest = CommentRequest;
export type PostCommentResponse = CommentResponse;
export type PutCommentResponse = CommentResponse;
