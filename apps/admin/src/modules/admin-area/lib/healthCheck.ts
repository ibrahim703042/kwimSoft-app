/**
 * Check if an API base URL is reachable (server responds).
 * Uses GET with short timeout; CORS may block cross-origin checks.
 */

const DEFAULT_TIMEOUT_MS = 6000;

export type HealthResult =
  | { status: "connected"; statusCode: number }
  | { status: "failed"; error: string };

export async function checkUrlReachable(
  baseUrl: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<HealthResult> {
  if (!baseUrl || baseUrl === "—") {
    return { status: "failed", error: "Not configured" };
  }

  const url = baseUrl.replace(/\/+$/, "");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      mode: "cors",
      credentials: "omit",
    });
    clearTimeout(timeoutId);
    const code = res.status;
    if (code >= 200 && code < 500) {
      return { status: "connected", statusCode: code };
    }
    if (code >= 500) {
      return { status: "failed", error: `Server error ${code}` };
    }
    return { status: "connected", statusCode: code };
  } catch (e) {
    clearTimeout(timeoutId);
    const message =
      e instanceof Error
        ? e.name === "AbortError"
          ? "Timeout"
          : e.message || "Network error"
        : "Network error";
    return { status: "failed", error: message };
  }
}
