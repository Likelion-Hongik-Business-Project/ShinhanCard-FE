import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { PostInquiryRequest } from "@/types/inquiry/inquiryApi.type";

import { postInquiry } from "@/apis/inquiry/inquiryApi";

export const useInquiryApi = () => {
  const navigate = useNavigate();

  const postInquiryMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: number;
      data: PostInquiryRequest;
    }) => postInquiry(teamId, data),

    onSuccess: res => {
      const { inquiry_id } = res.result;
      navigate(`/inquiries/${inquiry_id}`);
    },
  });
  return { postInquiryMutation };
};
