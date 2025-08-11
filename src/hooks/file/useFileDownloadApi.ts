import { useState } from "react";

import { getFileDownloadUrl } from "@/apis/file/fileApi";

export const useFileDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const download = async (fileId?: number | null, fallbackName?: string) => {
    if (fileId == null) return;

    try {
      setDownloading(true);

      const { result } = await getFileDownloadUrl(fileId);
      const { download_url, file_name } = result;

      const filename = file_name ?? fallbackName ?? "download";

      const resp = await fetch(download_url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } finally {
      setDownloading(false);
    }
  };

  return { downloading, download };
};
