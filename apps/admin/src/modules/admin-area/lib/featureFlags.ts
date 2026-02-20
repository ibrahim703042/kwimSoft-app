/**
 * Feature flag overrides persisted in localStorage.
 * Effective flag = override if set, else default from FEATURES in config.
 */

import { FEATURES } from "@/config";

const STORAGE_KEY = "kwimsoft-feature-overrides";

export function getFeatureOverrides(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function setFeatureOverride(key: string, value: boolean): void {
  const overrides = getFeatureOverrides();
  overrides[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function getEffectiveFeatureFlags(): Record<string, boolean> {
  const defaults = FEATURES as Record<string, boolean>;
  const overrides = getFeatureOverrides();
  return { ...defaults, ...overrides };
}

export function resetFeatureOverrides(): void {
  localStorage.removeItem(STORAGE_KEY);
}
