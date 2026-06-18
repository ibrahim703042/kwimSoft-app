export type IamUserStatus = "active" | "locked" | "inactive";

export interface IamUser {
  id: string;
  fullName: string;
  email: string;
  function: string;
  status: IamUserStatus;
  mfaEnabled: boolean;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface IamFunction {
  id: string;
  name: string;
  path: string;
  membersCount?: number;
  permissionsCount?: number;
  lastModified?: string;
}

export interface IamPermissionModule {
  id: string;
  name: string;
  permissions: { id: string; label: string; description: string }[];
}

export interface IamSession {
  id: string;
  user: string;
  email: string;
  device: string;
  ip: string;
  startedAt: string;
  lastActivity: string;
  status: "active" | "expired";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  result: "success" | "failure";
}

export interface AccessReview {
  id: string;
  department: string;
  totalUsers: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface IamPolicy {
  id: string;
  name: string;
  type: string;
  status: "active" | "draft" | "archived";
  lastModified: string;
}
