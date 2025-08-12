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
  options: FormatDateOptions = {}
): string => {
  if (!dateString) return "";

  let date: Date;

  if (typeof dateString === "string") {
    // formatTime과 동일한 방식으로 단순하게 파싱
    // 브라우저가 자동으로 로컬 시간대 처리
    date = new Date(dateString);
  } else {
    date = dateString;
  }

  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateString);
    return "";
  }

  if (options.showTime) {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatRemain = (ms: number) => {
  const r = Math.max(0, ms);
  const h = String(Math.floor(r / 3600000)).padStart(2, "0");
  const m = String(Math.floor((r % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((r % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const parseUtc = (s?: string | null) => {
  if (!s) return null;

  // formatTime, formatDateToKorean과 동일한 방식으로 단순 파싱
  // 브라우저가 자동으로 로컬 시간대 처리하도록 함
  const d = new Date(s);

  if (isNaN(+d)) {
    console.warn("Failed to parse date:", s);
    return null;
  }

  return d;
};
