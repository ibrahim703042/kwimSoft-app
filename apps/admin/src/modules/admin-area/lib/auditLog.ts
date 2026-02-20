/**
 * Audit log persisted in localStorage.
 * Real events when features are toggled, console views, etc.
 */

const STORAGE_KEY = "kwimsoft-audit-log";
const MAX_EVENTS = 500;

export interface AuditEvent {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string; // ISO
  meta?: Record<string, unknown>;
}

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getAuditEvents(): AuditEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuditEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_EVENTS);
  } catch {
    return [];
  }
}

export function appendAuditEvent(event: {
  user: string;
  action: string;
  resource: string;
  meta?: Record<string, unknown>;
}): void {
  const list = getAuditEvents();
  const newEvent: AuditEvent = {
    id: nextId(),
    user: event.user,
    action: event.action,
    resource: event.resource,
    timestamp: new Date().toISOString(),
    meta: event.meta,
  };
  const updated = [newEvent, ...list].slice(0, MAX_EVENTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAuditLog(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
