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
