import { buildExcelParams } from "@/utils/excelDownloadUtils";
import { ExcelScopedRequest } from "@/types/excel/excelApi.type";

import instance from "@/apis/instance";

export const getExcelByScope = async (requestParams: ExcelScopedRequest) => {
  const { scope, teamId } = requestParams;
  const params = buildExcelParams(requestParams);

  const pathMap = {
    assigned: `/api/inquiries/assigned/${teamId}/export`,
    submitted: `/api/inquiries/submitted/${teamId}/export`,
    scraped: `/api/scrap/${teamId}/export`,
    team: `/api/teams/${teamId}/inquiries/export`,
  } as const;

  return instance.get(pathMap[scope], {
    params,
    responseType: "blob",
  });
};
