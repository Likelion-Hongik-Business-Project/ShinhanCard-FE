import type { AssigneeUser } from "@/types/team/user.type";

type ActiveFlag = { active?: boolean; is_active?: boolean };

const isActiveFlag = (v?: ActiveFlag) =>
  Boolean(v?.active ?? v?.is_active ?? true);

export const isOrgActive = (u: AssigneeUser) =>
  isActiveFlag(u?.group) && isActiveFlag(u?.division) && isActiveFlag(u?.team);

export const isUserActive = (u: AssigneeUser) => isOrgActive(u);

export const koCompare = (
  a?: string,
  b?: string,
  tieBreakerA?: number | string,
  tieBreakerB?: number | string
) => {
  const r = (a ?? "").localeCompare(b ?? "", "ko");
  if (r !== 0) return r;
  if (tieBreakerA != null && tieBreakerB != null) {
    return String(tieBreakerA).localeCompare(String(tieBreakerB));
  }
  return 0;
};

export const makeSearchSorter = (term: string) => {
  const t = term.trim().toLowerCase();
  return (a: AssigneeUser, b: AssigneeUser) => {
    const na = a.username ?? "";
    const nb = b.username ?? "";
    const sa = na.toLowerCase().startsWith(t);
    const sb = nb.toLowerCase().startsWith(t);
    if (sa !== sb) return sa ? -1 : 1;
    return koCompare(na, nb, a.user_id, b.user_id);
  };
};

export const pickActiveUsersSorted = (all: AssigneeUser[], ids: number[]) =>
  all
    .filter(u => ids.includes(u.user_id) && isUserActive(u))
    .sort((a, b) => koCompare(a.username, b.username, a.user_id, b.user_id));

export const filterAndSortCandidates = (
  all: AssigneeUser[],
  { excludeIds = [], term = "" }: { excludeIds?: number[]; term?: string }
) =>
  all
    .filter(isUserActive)
    .filter(u =>
      (u.username ?? "").toLowerCase().includes(term.trim().toLowerCase())
    )
    .filter(u => !excludeIds.includes(u.user_id))
    .sort(makeSearchSorter(term));
