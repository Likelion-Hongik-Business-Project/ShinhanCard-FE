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

/** 3) 이미지 문법만 안전 변환: 괄호/공백/줄바꿈/타이틀/<> 모두 대응 */
export const transformImagesSafely = (md: string) => {
  const parts = (md ?? "").split(/(```[\s\S]*?```)/g); // fenced code 보존
  return parts
    .map(part => {
      if (part.startsWith("```")) return part;

      // 닫는 ) 전까지 전체(inner)를 캡처(줄바꿈 포함)
      return part.replace(
        /!\[([^\]]*)\]\(\s*([\s\S]*?)\s*\)/g,
        (_m, alt: string, inner: string) => {
          let body = inner.trim();

          // 맨 끝 타이틀(".."/'..'/(..)) 분리
          const mTitle = body.match(
            /\s+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))\s*$/
          );
          const title = mTitle
            ? (mTitle[1] ?? mTitle[2] ?? mTitle[3])
            : undefined;
          if (mTitle) body = body.slice(0, mTitle.index).trim();

          // URL 내부 줄바꿈 제거(예: "…%281)\n.png" -> "…%281).png")
          let url = body.replace(/\s*\n\s*/g, "");

          // <url> 케이스 or 일반 url 모두 sanitize
          url = sanitizeUrl(url);

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
