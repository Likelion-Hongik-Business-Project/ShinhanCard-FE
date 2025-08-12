import { buildExcelParams } from "@/utils/excelDownloadUtils";
import { ExcelScopedRequest } from "@/types/excel/excelApi.type";

import instance from "@/apis/instance";

export const getExcelByScope = async (requestParams: ExcelScopedRequest) => {
  const { scope, teamId, userId } = requestParams;
  const params = buildExcelParams(requestParams);

  const pathMap = {
    // UserSpacePage용 경로 (userId 포함)
    assigned: userId
      ? `/api/inquiries/${userId}/assigned/${teamId}/export`
      : `/api/inquiries/assigned/${teamId}/export`,
    submitted: userId
      ? `/api/inquiries/${userId}/submitted/${teamId}/export`
      : `/api/inquiries/submitted/${teamId}/export`,
    scrapped: userId
      ? `/api/scrap/${userId}/${teamId}/export`
      : `/api/scrap/${teamId}/export`,
    // 기존 경로 (userId 없음)
    team: `/api/teams/${teamId}/inquiries/export`,
  } as const;

  return instance.get(pathMap[scope], {
    params,
    responseType: "blob",
  });
};
