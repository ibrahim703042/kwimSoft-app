/**
 * Admin Header - Re-exports navbar components from shared-ui
 * 
 * Apps should import directly from @kwim/shared-ui instead.
 * This file is kept for backward compatibility.
 */
export {
  Navbar,
  GlobalSearch,
  ThemeToggle,
  LanguageSwitcher,
  NotificationDropdown,
  UserDropdown,
  QuickActions,
  Breadcrumbs,
  UserInfo,
} from "../../components/navbar";

export { Navbar as default } from "../../components/navbar";
