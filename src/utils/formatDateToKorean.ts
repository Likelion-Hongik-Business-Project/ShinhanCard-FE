interface FormatDateOptions {
  showTime?: boolean;
}

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
