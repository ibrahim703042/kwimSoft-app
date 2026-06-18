# KWIM App Security Assessment

## Executive Summary

The KWIM frontend is a Vite/React SPA communicating with an external API. This assessment covers client-side risks identified during modernization. Critical mitigations implemented include route protection, centralized HTTP client with JWT injection, environment-based secrets, and removal of hardcoded Mapbox tokens from source.

Remaining high-priority items require backend cooperation (httpOnly cookies, server-side RBAC, CORS policy).

## Risk Matrix

| Finding | Severity | Status |
|---------|----------|--------|
| JWT stored in localStorage (XSS token theft) | High | Documented; CSP headers added in dev |
| Auth header not sent on API calls | High | Fixed via `httpClient` |
| No route protection | High | Fixed via `ProtectedRoute` |
| Hardcoded Mapbox token in source | High | Moved to `VITE_MAPBOX_TOKEN` |
| Hardcoded API URLs | Medium | Moved to `VITE_API_BASE_URL` |
| Console logging of auth data | Medium | Removed from login flow |
| Non-functional logout | Medium | Fixed in user dropdown |
| Malformed driver API URL (`?company/`) | Medium | Fixed in `fleetApi` |
| `.env` not gitignored | Medium | Fixed |
| Dual auth models (cookie + JWT) | Medium | Unified on JWT via `httpClient` |

## Attack Scenarios

1. **XSS → token exfiltration**: Malicious script reads `localStorage.user.token`. Mitigation: sanitize inputs, avoid `dangerouslySetInnerHTML`, plan httpOnly cookies.
2. **Unauthenticated access**: User opens `/administration` without login. Mitigation: `ProtectedRoute` redirects to `/login`.
3. **Secret exposure in repo**: Committed API keys or Mapbox tokens. Mitigation: `.env.example` only; real values in local `.env`.

## Mitigation Checklist

- [x] Single HTTP client with Bearer token
- [x] Protected routes for authenticated pages
- [x] Environment variables for API URL and Mapbox token
- [x] Security headers in Vite dev server
- [x] Logout clears session
- [ ] Backend: httpOnly session cookies
- [ ] Backend: RBAC on API endpoints
- [ ] CI: dependency scanning (npm audit)
- [ ] Production CSP via hosting platform
