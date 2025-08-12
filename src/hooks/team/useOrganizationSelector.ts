import { useMemo, useState } from "react";

import { useTeamApi } from "@/hooks/team/useTeamApi";
import { Division, Group, Team } from "@/types/team/user.type";

type Option = {
  label: string;
  value: number;
  active?: boolean;
  is_active?: boolean;
  meta?: { active?: boolean };
};

const getActive = (o: Option) =>
  typeof o.active === "boolean"
    ? o.active
    : typeof o.is_active === "boolean"
      ? o.is_active
      : (o.meta?.active ?? true);

const ensureSelected = (
  filtered: Option[],
  raw: Option[],
  selectedId?: number | null
) => {
  if (!selectedId) return filtered;
  if (filtered.some(o => o.value === selectedId)) return filtered;
  const found = raw.find(o => o.value === selectedId);
  return found ? [found, ...filtered] : filtered;
};

export const useOrganizationSelector = () => {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);

  const {
    useGroupsQuery,
    useDivisionsByGroupIdQuery,
    useTeamsByDivisionIdQuery,
  } = useTeamApi();

  const { data: groupData } = useGroupsQuery();
  const { data: divisionData } = useDivisionsByGroupIdQuery(groupId);
  const { data: teamData } = useTeamsByDivisionIdQuery(divisionId);

  // 원본 옵션(활성여부 포함)
  const groupOptionsRaw: Option[] =
    groupData?.result.map((g: Group) => ({
      label: g.group_name,
      value: Number(g.group_id),
      active: g.active ?? g.active,
    })) ?? [];

  const divisionOptionsRaw: Option[] =
    divisionData?.result.map((d: Division) => ({
      label: d.division_name,
      value: Number(d.division_id),
      active: d.active ?? d.active,
    })) ?? [];

  const teamOptionsRaw: Option[] =
    teamData?.result.map((t: Team) => ({
      label: t.team_name,
      value: Number(t.team_id),
      active: t.active ?? t.active,
    })) ?? [];

  // 가나다(ko) 정렬자
  const koCollator = useMemo(
    () => new Intl.Collator("ko", { numeric: true, sensitivity: "base" }),
    []
  );
  const byLabel = (a: Option, b: Option) =>
    koCollator.compare(a.label, b.label);

  // active만 + 가나다순 + 현재 선택 보존
  const groupOptions = useMemo(() => {
    const filtered = groupOptionsRaw.filter(getActive).slice().sort(byLabel);
    return ensureSelected(filtered, groupOptionsRaw, groupId);
  }, [groupOptionsRaw, groupId]);

  const divisionOptions = useMemo(() => {
    const filtered = divisionOptionsRaw.filter(getActive).slice().sort(byLabel);
    return ensureSelected(filtered, divisionOptionsRaw, divisionId);
  }, [divisionOptionsRaw, divisionId]);

  const teamOptions = useMemo(() => {
    const filtered = teamOptionsRaw.filter(getActive).slice().sort(byLabel);
    return ensureSelected(filtered, teamOptionsRaw, teamId);
  }, [teamOptionsRaw, teamId]);

  const handleGroupChange = (value: number) => {
    setGroupId(value);
    setDivisionId(null);
    setTeamId(null);
  };

  const handleDivisionChange = (value: number) => {
    setDivisionId(value);
    setTeamId(null);
  };

  const handleTeamChange = (value: number) => {
    setTeamId(value);
  };

  const setFromIds = (
    gId?: number | null,
    dId?: number | null,
    tId?: number | null
  ) => {
    if (gId !== undefined) setGroupId(gId);
    if (dId !== undefined) setDivisionId(dId);
    if (tId !== undefined) setTeamId(tId);
  };

  const resetOrg = () => {
    setGroupId(null);
    setDivisionId(null);
    setTeamId(null);
  };

  const group = groupOptions.find(g => g.value === groupId)?.label || "";
  const division =
    divisionOptions.find(d => d.value === divisionId)?.label || "";
  const team = teamOptions.find(t => t.value === teamId)?.label || "";

  return {
    group,
    division,
    team,
    groupId,
    divisionId,
    teamId,
    groupOptions,
    divisionOptions,
    teamOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
    setFromIds,
    resetOrg,
  };
};
