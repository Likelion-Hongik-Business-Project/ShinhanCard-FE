/** 1) 이스케이프 복원 */
export const unescapeMarkdown = (md: string) =>
  (md ?? "").replace(/\\([!()[\]{}])/g, "$1");

/** 2) URL 안전 인코딩 (공백/한글/괄호/따옴표/<> 커버) */
export const sanitizeUrl = (raw: string) => {
  let s = (raw ?? "").trim();
  if (s.startsWith("<") && s.endsWith(">")) s = s.slice(1, -1); // ![...](<url>) 케이스
  try {
    s = decodeURI(s);
  } catch {
    // ignore invalid URI
  }
  s = encodeURI(s);
  return s.replace(
    /[()'"<>]/g,
    ch => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`
  );
};

/** 2.5) URL이 ) 뒤에서 줄바꿈으로 끊긴 케이스 복구: "…%281)\n.png)" -> "…%281).png)" */
export const fixBrokenUrlLinebreaks = (md: string) =>
  (md ?? "").replace(/\)\s*\n\s*(\.[A-Za-z0-9]{2,5}\))/g, ")$1");

/** 3) 이미지 문법만 안전 변환 (괄호/공백/줄바꿈/타이틀/<> 모두 대응) */
export const transformImagesSafely = (md: string) => {
  // 먼저 잘린 확장자 줄바꿈을 복구
  const pre = fixBrokenUrlLinebreaks(md);

  const parts = (pre ?? "").split(/(```[\s\S]*?```)/g); // fenced code 보존
  return parts
    .map(part => {
      if (part.startsWith("```")) return part;

      // ⬇️ inner를 greedy(*)로 캡처 + title 옵션 + 닫는 )까지 한 번에 소비
      return part.replace(
        /!\[([^\]]*)\]\(\s*([\s\S]*)\s*(?:(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))\s*)?\)/g,
        (
          _m,
          alt: string,
          inner: string,
          t1?: string,
          t2?: string,
          t3?: string
        ) => {
          const body = inner.trim();

          // URL 내부 줄바꿈 제거 (예: "%281)\n.png" → "%281).png")
          let url = body.replace(/\s*\n\s*/g, "");

          // 최종 인코딩 (<url> 케이스 포함)
          url = sanitizeUrl(url);

          const title = t1 ?? t2 ?? t3;
          return title ? `![${alt}](${url} "${title}")` : `![${alt}](${url})`;
        }
      );
    })
    .join("");
};

/** 4) 이미지 토큰 앞뒤 개행 보정 (텍스트에 바로 붙어있는 경우 분리) */
export const ensureLineBreakAroundImages = (md: string) =>
  (md ?? "")
    .replace(/(!\[.*?\]\(.*?\))(?!\s|\n)/g, "$1\n")
    .replace(/([^\s\n])(!\[.*?\]\(.*?\))/g, "$1\n$2");

/** 최종 정규화 파이프라인: 언이스케이프 → 이미지 변환 → 개행 보정 */
export const normalizeContent = (md: string) =>
  ensureLineBreakAroundImages(
    transformImagesSafely(unescapeMarkdown(md ?? ""))
  );
