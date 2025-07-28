export type InputStatus = "error" | "notfound" | "typing" | "done" | "default";

// ID label 텍스트
export const ID_LABEL_TEXT: Partial<Record<InputStatus, string>> = {
  error: "올바른 형식으로 사번을 입력해주세요.",
  notfound: "존재하지 않는 사번입니다.",
};

// PW label 텍스트
export const PW_LABEL_TEXT: Partial<Record<InputStatus, string>> = {
  error: "비밀번호가 올바르지 않습니다.",
  typing: "Password",
  done: "Password",
  default: "Password",
};

// label 색상
export const LABEL_COLOR_MAP: Record<InputStatus, string> = {
  error: "text-point-red",
  notfound: "text-point-yellow",
  typing: "text-gray-40",
  done: "text-gray-40",
  default: "text-gray-40",
};

// border 색상
export const BORDER_COLOR_MAP: Record<InputStatus, string> = {
  error: "outline-point-red",
  typing: "outline-state-progress-02",
  notfound: "outline-point-yellow",
  done: "outline-gray-30",
  default: "outline-gray-30",
};
