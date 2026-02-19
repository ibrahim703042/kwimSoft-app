/**
 * @kwim/ui - Shared UI Components Package
 * 
 * This package will contain all shared UI components.
 * Components will be migrated from src/components/ during app setup.
 * 
 * For now, this serves as a placeholder that re-exports from the original location
 * until the full migration is complete.
 */

// Export utilities
export { cn } from '@kwim/utils';

// Note: Full component migration will happen during apps setup phase
// This package structure is ready to receive:
// - shadcn/ui components (button, dialog, form, table, etc.)
// - Navbar components
// - Sidebar components  
// - Layout components (AuthHeader, AuthFooter)
// - Utility components (Loading, PageTitle, SearchBar, etc.)

export const UI_PACKAGE_VERSION = '1.0.0';
