import { useCallback, useState } from "react";

interface UseDragAndDropOptions {
  onDrop: (files: FileList) => void;
}

export const useDragAndDrop = ({ onDrop }: UseDragAndDropOptions) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      onDrop(e.dataTransfer.files);
    },
    [onDrop]
  );

  return {
    isDragging,
    dragEventProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
};
