import { useEffect, useRef } from "react";

type Option = { value: number; label: string };

export function useInitialOrgSelection(params: {
  isEdit: boolean;
  names: { group?: string; division?: string; team?: string };
  initialTeamId?: number;
  ids: {
    groupId?: number | null;
    divisionId?: number | null;
    teamId?: number | null;
  };
  options: { groups: Option[]; divisions: Option[]; teams: Option[] };
  handlers: {
    onGroup: (groupId: number) => void;
    onDivision: (divisionId: number) => void;
    onTeam: (teamId: number) => void;
  };
}) {
  const {
    isEdit,
    names,
    initialTeamId,
    ids: { groupId, divisionId, teamId },
    options: { groups, divisions, teams },
    handlers: { onGroup, onDivision, onTeam },
  } = params;

  const didInit = useRef(false);

  const norm = (s?: string) =>
    (s ?? "").trim().replace(/\s+/g, " ").toLowerCase();

  useEffect(() => {
    if (isEdit || didInit.current) return;

    // 1) 그룹
    if (!groupId && names.group && groups.length) {
      const g = groups.find(o => norm(o.label) === norm(names.group));
      if (g) {
        onGroup(g.value);
        return;
      }
    }

    // 2) 본부 (그룹 세팅 후)
    if (groupId && !divisionId && names.division && divisions.length) {
      const d = divisions.find(o => norm(o.label) === norm(names.division));
      if (d) {
        onDivision(d.value);
        return;
      }
    }

    // 3) 팀 (본부 세팅 후)
    if (divisionId && !teamId && teams.length) {
      if (names.team) {
        const tByName = teams.find(o => norm(o.label) === norm(names.team));
        if (tByName) {
          onTeam(tByName.value);
          didInit.current = true;
          return;
        }
      }
      if (initialTeamId && teams.some(o => o.value === initialTeamId)) {
        onTeam(initialTeamId);
        didInit.current = true;
        return;
      }
    }

    if (groupId && divisionId && teamId) {
      didInit.current = true;
    }
  }, [
    isEdit,
    names.group,
    names.division,
    names.team,
    initialTeamId,
    groupId,
    divisionId,
    teamId,
    groups,
    divisions,
    teams,
    onGroup,
    onDivision,
    onTeam,
  ]);
}
