import { useEffect } from "react";

export const useFakeProgress = <
  T extends { id: number; size: number; uploadedSize: number; status: string },
>(
  files: T[],
  setFiles: React.Dispatch<React.SetStateAction<T[]>>
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles(prev =>
        prev.map(file => {
          if (file.status === "done") return file;

          const nextUploadedSize = file.uploadedSize + file.size / 50;
          if (nextUploadedSize >= file.size) {
            return {
              ...file,
              uploadedSize: file.size,
              status: "done" as const,
            };
          }
          return { ...file, uploadedSize: nextUploadedSize };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [files, setFiles]);
};
