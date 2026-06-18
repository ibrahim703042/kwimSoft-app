import type {
  AuditLogEntry,
  AccessReview,
  IamPermissionModule,
  IamPolicy,
  IamSession,
} from "./types";

export const permissionModules: IamPermissionModule[] = [
  {
    id: "academic",
    name: "Academic",
    permissions: [
      { id: "GRADE_VIEW", label: "GRADE_VIEW", description: "View student grades" },
      { id: "GRADE_CREATE", label: "GRADE_CREATE", description: "Create grade entries" },
      { id: "GRADE_EDIT", label: "GRADE_EDIT", description: "Edit existing grades" },
    ],
  },
  {
    id: "attendance",
    name: "Attendance",
    permissions: [
      { id: "ATT_VIEW", label: "ATT_VIEW", description: "View attendance records" },
      { id: "ATT_MARK", label: "ATT_MARK", description: "Mark attendance" },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    permissions: [
      { id: "FIN_VIEW", label: "FIN_VIEW", description: "View financial data" },
      { id: "FIN_EXPORT", label: "FIN_EXPORT", description: "Export reports" },
    ],
  },
];

export const mockSessions: IamSession[] = [
  {
    id: "1",
    user: "Ibrahim K.",
    email: "ibrahim@kwim.local",
    device: "Chrome / Windows",
    ip: "203.0.113.42",
    startedAt: "2026-06-18 08:12",
    lastActivity: "2 min ago",
    status: "active",
  },
  {
    id: "2",
    user: "Marie D.",
    email: "marie@kwim.local",
    device: "Safari / macOS",
    ip: "203.0.113.15",
    startedAt: "2026-06-18 07:45",
    lastActivity: "15 min ago",
    status: "active",
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: "2026-06-18 09:01",
    user: "ibrahim@kwim.local",
    action: "View grades",
    target: "TEACHERS",
    ip: "203.0.113.42",
    result: "success",
  },
  {
    id: "2",
    timestamp: "2026-06-18 08:55",
    user: "admin@kwim.local",
    action: "Reset password",
    target: "marie@kwim.local",
    ip: "203.0.113.1",
    result: "success",
  },
  {
    id: "3",
    timestamp: "2026-06-18 08:40",
    user: "unknown",
    action: "Login attempt",
    target: "portal",
    ip: "203.0.113.9",
    result: "failure",
  },
];

export const mockAccessReviews: AccessReview[] = [
  { id: "1", department: "Finance", totalUsers: 120, pending: 18, approved: 95, rejected: 7 },
  { id: "2", department: "Academic", totalUsers: 340, pending: 45, approved: 280, rejected: 15 },
  { id: "3", department: "IT", totalUsers: 85, pending: 5, approved: 78, rejected: 2 },
];

export const mockPolicies: IamPolicy[] = [
  { id: "1", name: "Password complexity", type: "Password", status: "active", lastModified: "2026-05-10" },
  { id: "2", name: "Session timeout", type: "Session", status: "active", lastModified: "2026-04-22" },
  { id: "3", name: "MFA enforcement", type: "Authentication", status: "draft", lastModified: "2026-06-01" },
];

export const iamDashboardStats = {
  totalUsers: 12450,
  activeSessions: 520,
  mfaEnabledPercent: 87,
  lockedAccounts: 14,
};
