import { useMutation } from "@tanstack/react-query";

import {
  parseFilenameFromDisposition,
  triggerDownload,
} from "@/utils/excelDownloadUtils";
import { GetAssignedExcelRequest } from "@/types/excel/excelApi.type";

import { getAssignedExcel } from "@/apis/excel/excelApi";

export const useAssignedExport = () => {
  return useMutation({
    mutationFn: (vars: GetAssignedExcelRequest) => getAssignedExcel(vars),
    onSuccess: response => {
      const disposition =
        response.headers["content-disposition"] ??
        response.headers["Content-Disposition"];
      const filename = parseFilenameFromDisposition(disposition);
      triggerDownload(response.data, filename);
    },
  });
};
