/** URL 안전 변환 (한글/공백/괄호/<>) */
export const sanitizeUrl = (raw: string) => {
  let s = (raw || "").trim();

  // ![alt](<url>) 형태 대응
  if (s.startsWith("<") && s.endsWith(">")) s = s.slice(1, -1);

  try {
    s = decodeURI(s);
  } catch {
    // ignore decode errors
  }

  s = encodeURI(s);

  // encodeURI가 안 해주는 문제문자 수동 인코딩
  s = s.replace(
    /[()'"<>]/g,
    ch => "%" + ch.charCodeAt(0).toString(16).toUpperCase()
  );

  return s;
};

/**
 * 코드블록(``` ```)은 건너뛰고, 마크다운 이미지 문법만 안전하게 변환
 * - ![alt](url "title")
 * - ![alt](<url>)
 * - 연속 이미지, 특수문자 포함 URL 대응
 */
export const transformImagesSafely = (md: string) => {
  const parts = (md ?? "").split(/(```[\s\S]*?```)/g); // 코드블록 보존
  return parts
    .map(part => {
      if (part.startsWith("```")) return part;

      return part.replace(
        /!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^)\s]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g,
        (_, alt: string, urlA?: string, urlB?: string) => {
          const url = sanitizeUrl(urlA || urlB || "");
          return `![${alt}](${url})`;
        }
      );
    })
    .join("");
};
