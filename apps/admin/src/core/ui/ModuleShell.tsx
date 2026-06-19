import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  ModuleShell as CoreModuleShell,
  type ModuleShellProps as CoreModuleShellProps,
} from "@kwim/core";
import { setBreadCrumbItemsAction } from "@/store/actions/appActions";

export type { ShellNavItem, ModuleShellProps } from "@kwim/core";

/**
 * Admin adapter — wires Redux breadcrumb dispatch into @kwim/core ModuleShell.
 */
export function ModuleShell(props: Readonly<CoreModuleShellProps>) {
  const dispatch = useDispatch();

  const onBreadcrumbChange = useCallback(
    (items: Array<{ path: string; name: string }> | null) => {
      dispatch(setBreadCrumbItemsAction(items ?? []));
    },
    [dispatch]
  );

  return <CoreModuleShell {...props} onBreadcrumbChange={onBreadcrumbChange} />;
}
