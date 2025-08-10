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

interface FormatDateOptions {
  showTime?: boolean;
}

export const formatDateParams = (
  selectedDate: { year: number; month: number }[]
) => {
  if (selectedDate.length === 0) return undefined;

  return selectedDate
    .map(({ year, month }) => `${year}-${String(month).padStart(2, "0")}`)
    .join(",");
};

export const formatDateToKorean = (
  dateString: string | Date,
  // options 객체를 받되, 기본값은 빈 객체로 설정
  options: FormatDateOptions = {}
): string => {
  const date = new Date(dateString);

  // 옵션에서 showTime이 true일 경우에만 => 시간까지 포함된 형식으로 반환
  if (options.showTime) {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간 형식
    });
  }

  // 옵션이 없거나 showTime이 true가 아닌 경우 => 기존과 동일하게 날짜만 반환
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
