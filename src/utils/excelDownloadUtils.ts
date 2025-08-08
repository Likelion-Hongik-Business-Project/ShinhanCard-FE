/**
 * Content-Disposition 헤더에서 파일명 추출
 */
export const parseFilenameFromDisposition = (
  disposition?: string | null
): string => {
  if (!disposition) return "export.xlsx";

  const matchStar = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (matchStar?.[1]) {
    return decodeURIComponent(matchStar[1].trim());
  }

  const matchBasic = disposition.match(
    /filename\s*=\s*"([^"]+)"|filename\s*=\s*([^;]+)/i
  );
  if (matchBasic?.[1] || matchBasic?.[2]) {
    return (matchBasic[1] ?? matchBasic[2]).trim().replace(/^"+|"+$/g, "");
  }

  return "export.xlsx";
};

/**
 * Blob 데이터를 받아 파일 다운로드 트리거
 */
export const triggerDownload = (blob: Blob, filename: string) => {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename || "export.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
};
