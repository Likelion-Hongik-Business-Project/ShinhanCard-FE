import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  PostInquiryDraftRequest,
  PutInquiryDraftRequest,
} from "@/types/inquiry/inquiryDraftApi.type";

import {
  deleteInquiryDraft,
  getDraftExists,
  getInquiryDraft,
  postInquiryDraft,
  putInquiryDraft,
} from "@/apis/inquiry/draft/inquiryDraftApi";

const INQUIRY_DRAFT_KEYS = {
  all: ["inquiry-drafts"] as const,
  exists: (teamId: number) =>
    [...INQUIRY_DRAFT_KEYS.all, "exists", teamId] as const,
  detail: (teamId: number, inquiryId: number) =>
    [...INQUIRY_DRAFT_KEYS.all, "detail", teamId, inquiryId] as const,
};

export const useInquiryDraftApi = () => {
  // 임시 저장 존재 여부 조회
  const useCheckDraftExists = (teamId: number, enabled: boolean = false) => {
    return useQuery({
      queryKey: INQUIRY_DRAFT_KEYS.exists(teamId),
      queryFn: () => getDraftExists(teamId),
      enabled,
    });
  };
  // 임시 저장 조회
  const useGetInquiryDraft = (teamId: number, inquiryId: number) =>
    useQuery({
      queryKey: INQUIRY_DRAFT_KEYS.detail(teamId, inquiryId),
      queryFn: () => getInquiryDraft(teamId, inquiryId),
      enabled: !!teamId && !!inquiryId,
    });

  // 임시 저장 생성
  const usePostInquiryDraftMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        teamId,
        data,
      }: {
        teamId: number;
        data: PostInquiryDraftRequest;
      }) => postInquiryDraft(teamId, data),

      onSuccess: (_, variables) => {
        const { teamId } = variables;
        queryClient.invalidateQueries({
          queryKey: INQUIRY_DRAFT_KEYS.exists(teamId),
        });
      },
    });
  };

  // 임시 저장 수정
  const usePutInquiryDraftMutation = () =>
    useMutation({
      mutationFn: ({
        teamId,
        inquiryId,
        data,
      }: {
        teamId: number;
        inquiryId: number;
        data: PutInquiryDraftRequest;
      }) => putInquiryDraft(teamId, inquiryId, data),
    });

  // 임시 저장 삭제
  const useDeleteInquiryDraftMutation = () =>
    useMutation({
      mutationFn: ({
        teamId,
        inquiryId,
      }: {
        teamId: number;
        inquiryId: number;
      }) => deleteInquiryDraft(teamId, inquiryId),
    });

  return {
    useCheckDraftExists,
    useGetInquiryDraft,
    usePostInquiryDraftMutation,
    usePutInquiryDraftMutation,
    useDeleteInquiryDraftMutation,
  };
};
