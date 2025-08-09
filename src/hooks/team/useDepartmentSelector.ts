import { useMemo, useState } from "react";

import { AssigneeUser, Division, Group, Team } from "@/types/team/user.type";

export interface Option {
  label: string;
  value: number;
  profileImageUrl?: string;
}

export interface UseDepartmentSelectorReturn {
  groupId: number | null;
  divisionId: number | null;
  teamId: number | null;
  selectedUserId: number | null;

  groupOptions: Option[];
  divisionOptions: Option[];
  teamOptions: Option[];
  userOptions: Option[];

  handleGroupChange: (id: number) => void;
  handleDivisionChange: (id: number) => void;
  handleTeamChange: (id: number) => void;
  handleUserChange: (id: number) => AssigneeUser | null;

  getUserById: (id: number) => AssigneeUser | undefined;
}

export const useDepartmentSelector = (
  allUsers: AssigneeUser[]
): UseDepartmentSelectorReturn => {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const isActive = (o: Group | Division | Team): boolean =>
    (o.active ?? true) === true;

  // 활성 유저만
  const activeUsers = useMemo(
    () =>
      allUsers.filter(
        u => isActive(u.group) && isActive(u.division) && isActive(u.team)
      ),
    [allUsers]
  );

  // 인덱싱
  const byUserId = useMemo(() => {
    const m = new Map<number, AssigneeUser>();
    activeUsers.forEach(u => m.set(u.user_id, u));
    return m;
  }, [activeUsers]);

  const groupOptions = useMemo<Option[]>(() => {
    const m = new Map<number, string>();
    activeUsers.forEach(u => m.set(u.group.group_id, u.group.group_name));
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [activeUsers]);

  const divisionOptions = useMemo<Option[]>(() => {
    if (!groupId) return [];
    const m = new Map<number, string>();
    activeUsers
      .filter(u => u.group.group_id === groupId)
      .forEach(u => m.set(u.division.division_id, u.division.division_name));
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [activeUsers, groupId]);

  const teamOptions = useMemo<Option[]>(() => {
    if (!divisionId) return [];
    const m = new Map<number, string>();
    activeUsers
      .filter(u => u.division.division_id === divisionId)
      .forEach(u => m.set(u.team.team_id, u.team.team_name));
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [activeUsers, divisionId]);

  const userOptions = useMemo<Option[]>(() => {
    if (!teamId) return [];
    return activeUsers
      .filter(u => u.team.team_id === teamId)
      .map(u => ({
        label: u.username,
        value: u.user_id,
        profileImageUrl: u.profile_url,
      }));
  }, [activeUsers, teamId]);

  const handleGroupChange = (id: number) => {
    setGroupId(id || null);
    setDivisionId(null);
    setTeamId(null);
    setSelectedUserId(null);
  };
  const handleDivisionChange = (id: number) => {
    setDivisionId(id || null);
    setTeamId(null);
    setSelectedUserId(null);
  };
  const handleTeamChange = (id: number) => {
    setTeamId(id || null);
    setSelectedUserId(null);
  };
  const handleUserChange = (id: number) => {
    setSelectedUserId(id || null);
    return byUserId.get(id) ?? null;
  };

  const getUserById = (id: number) => byUserId.get(id);

  return {
    groupId,
    divisionId,
    teamId,
    selectedUserId,
    groupOptions,
    divisionOptions,
    teamOptions,
    userOptions,
    handleGroupChange,
    handleDivisionChange,
    handleTeamChange,
    handleUserChange,
    getUserById,
  };
};
