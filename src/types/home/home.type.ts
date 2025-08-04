// 관심 팀원 추가 응답 타입
export type AddInterestedMemberResponse = Record<string, never>;

// 관심 팀원 추가 요청 타입
export interface AddInterestedMemberRequest {
  userId: number;
}
