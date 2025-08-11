import { InquiryStatus, YearMonth } from "@/types/inquiry/inquiryListApi.type";

export type ExportOption = "filtered" | "all";

export type GetAssignedExcelRequest = {
  teamId: number;
  option: ExportOption;
  status: InquiryStatus | "전체";
  date: YearMonth[];
};

export type ExcelScopedRequest = GetAssignedExcelRequest & {
  scope: "assigned" | "submitted" | "scrapped" | "team";
  teamId: number;
};
