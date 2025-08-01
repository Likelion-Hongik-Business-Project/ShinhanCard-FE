export const formatDateGroupLabel = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return "오늘";
  if (isYesterday) return "어제";

  const isSameYear = date.getFullYear() === now.getFullYear();
  if (isSameYear) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  } else {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// YYYY년 MM월 DD일
export const formatDateToKorean = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// “2025-07-06T01:00:00Z” → “2025년 07월 06일 01:00”
export const formatDateTimeToKorean = (iso: string) => {
  const d = new Date(iso);
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${YYYY}년 ${MM}월 ${DD}일 ${hh}:${mm}`;
};
