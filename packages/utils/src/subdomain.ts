/**
 * Subdomain detection and management utilities
 * Similar to Odoo's multi-tenant architecture
 */

export interface SubdomainInfo {
  isSubdomain: boolean;
  subdomain: string | null;
  baseDomain: string;
}

/**
 * Get subdomain information from current URL
 */
export function getSubdomainInfo(): SubdomainInfo {
  const hostname = window.location.hostname;
  
  // For localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check if subdomain is stored in localStorage for development
    const devSubdomain = localStorage.getItem('dev_subdomain');
    return {
      isSubdomain: !!devSubdomain,
      subdomain: devSubdomain,
      baseDomain: hostname,
    };
  }

  // Split hostname into parts
  const parts = hostname.split('.');
  
  // If we have more than 2 parts (e.g., subdomain.example.com)
  // and it's not 'www', then we have a subdomain
  if (parts.length > 2 && parts[0] !== 'www') {
    return {
      isSubdomain: true,
      subdomain: parts[0],
      baseDomain: parts.slice(1).join('.'),
    };
  }

  return {
    isSubdomain: false,
    subdomain: null,
    baseDomain: hostname,
  };
}

/**
 * Check if current URL is the main landing page (no subdomain)
 */
export function isLandingPage(): boolean {
  const { isSubdomain } = getSubdomainInfo();
  return !isSubdomain;
}

/**
 * Get the full URL for a subdomain
 */
export function getSubdomainUrl(subdomain: string, path: string = '/'): string {
  const { baseDomain } = getSubdomainInfo();
  const protocol = window.location.protocol;
  
  // For localhost, we'll use a query parameter approach
  if (baseDomain === 'localhost' || baseDomain === '127.0.0.1') {
    return `${protocol}//${baseDomain}:${window.location.port}${path}?tenant=${subdomain}`;
  }
  
  return `${protocol}//${subdomain}.${baseDomain}${path}`;
}

/**
 * Redirect to subdomain
 */
export function redirectToSubdomain(subdomain: string, path: string = '/'): void {
  const url = getSubdomainUrl(subdomain, path);
  window.location.href = url;
}

/**
 * Redirect to main landing page
 */
export function redirectToLanding(): void {
  const { baseDomain } = getSubdomainInfo();
  const protocol = window.location.protocol;
  
  if (baseDomain === 'localhost' || baseDomain === '127.0.0.1') {
    window.location.href = `${protocol}//${baseDomain}:${window.location.port}`;
  } else {
    window.location.href = `${protocol}//${baseDomain}`;
  }
}

/**
 * Store enterprise/tenant information
 */
export function setEnterpriseInfo(info: { subdomain: string; name: string; id: string }): void {
  localStorage.setItem('enterprise', JSON.stringify(info));
  
  // For development, also store subdomain separately
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    localStorage.setItem('dev_subdomain', info.subdomain);
  }
}

/**
 * Get stored enterprise information
 */
export function getEnterpriseInfo(): { subdomain: string; name: string; id: string } | null {
  const stored = localStorage.getItem('enterprise');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Clear enterprise information (logout)
 */
export function clearEnterpriseInfo(): void {
  localStorage.removeItem('enterprise');
  localStorage.removeItem('dev_subdomain');
}
