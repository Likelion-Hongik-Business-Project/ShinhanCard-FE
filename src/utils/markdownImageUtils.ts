/** \ 이스케이프 복원 */
export const unescapeMarkdown = (md: string) =>
  (md ?? "").replace(/\\([!()[\]{}])/g, "$1");

/** URL 안전화 (공백/한글/괄호/따옴표/<> 처리) */
export const sanitizeUrl = (raw: string) => {
  let s = (raw ?? "").trim();
  if (s.startsWith("<") && s.endsWith(">")) s = s.slice(1, -1); // ![...](<url>)
  try {
    s = decodeURI(s);
  } catch {
    // ignore invalid URI
  }

  s = encodeURI(s);
  return s.replace(
    /[()'"<>]/g,
    ch => "%" + ch.charCodeAt(0).toString(16).toUpperCase()
  );
};

/**
 * 코드블록은 건너뛰고, 이미지 문법만 안전 변환
 * - ![alt](url "title") / ![alt](url 'title') / ![alt](url (title)) / ![alt](<url>)
 * - URL에 공백 허용 (나중에 sanitizeUrl로 인코딩)
 */
export const transformImagesSafely = (md: string) => {
  const parts = (md ?? "").split(/(```[\s\S]*?```)/g); // fenced code 보존
  return parts
    .map(part => {
      if (part.startsWith("```")) return part;

      // 1) 괄호 안 전체를 먼저 잡음 (공백 포함)
      return part.replace(
        /!\[([^\]]*)\]\(\s*([^)]*?)\s*\)/g,
        (_m, alt: string, inner: string) => {
          let url = inner.trim();
          let title: string | undefined;

          // 2) 끝에 title이 붙었는지 감지: "..." | '...' | (...) 중 하나
          const mTitle = url.match(
            /\s+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))\s*$/
          );
          if (mTitle) {
            title = mTitle[1] ?? mTitle[2] ?? mTitle[3];
            url = url.slice(0, mTitle.index).trim();
          }

          // 3) <url> 케이스 or 일반 url 모두 sanitize
          const safe = sanitizeUrl(url);
          return title ? `![${alt}](${safe} "${title}")` : `![${alt}](${safe})`;
        }
      );
    })
    .join("");
};
