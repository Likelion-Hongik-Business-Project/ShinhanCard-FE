import { formatDateParams } from "@/utils/dateUtils";
import { INQUIRY_STATUS_VALUE } from "@/utils/inquiryStatus";
import { GetAssignedExcelRequest } from "@/types/excel/excelApi.type";

import instance from "@/apis/instance";

export const getAssignedExcel = async (params: GetAssignedExcelRequest) => {
  const { teamId, option, status, date, page } = params;

  const pageParam = option === "all" ? "" : page;

  const statusParam =
    option === "all" || status === "전체" ? "" : INQUIRY_STATUS_VALUE[status];

  const dateParam = option === "all" ? "" : formatDateParams(date);

  return await instance.get(`/api/inquiries/assigned/${teamId}/export`, {
    params: { page: pageParam, status: statusParam, date: dateParam },
    responseType: "blob",
  });
};
