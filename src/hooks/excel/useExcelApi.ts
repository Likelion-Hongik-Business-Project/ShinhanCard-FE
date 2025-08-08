import { useMutation } from "@tanstack/react-query";

import {
  parseFilenameFromDisposition,
  triggerDownload,
} from "@/utils/excelDownloadUtils";
import { ExcelScopedRequest } from "@/types/excel/excelApi.type";

import { getExcelByScope } from "@/apis/excel/excelApi";

export const useExcelExport = () => {
  return useMutation({
    mutationFn: (vars: ExcelScopedRequest) => getExcelByScope(vars),
    onSuccess: response => {
      const dispo =
        response.headers["content-disposition"] ??
        response.headers["Content-Disposition"];
      const filename = parseFilenameFromDisposition(dispo);
      triggerDownload(response.data, filename);
    },
  });
};
