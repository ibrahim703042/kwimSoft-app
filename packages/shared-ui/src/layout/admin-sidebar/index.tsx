/**
 * Admin Sidebar - Re-exports sidebar components from shared-ui
 * 
 * Apps should import directly from @kwim/shared-ui instead.
 * This file is kept for backward compatibility.
 */
export {
  Sidebar,
  SidebarHeader,
  SidebarSearch,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "../../components/sidebar";

export { Sidebar as default } from "../../components/sidebar";
