import { ReactNode } from "react";
import { PageHeader as CorePageHeader } from "@kwim/core";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  showBreadcrumbs = true,
  className,
}: PageHeaderProps) {
  return (
    <CorePageHeader
      title={title}
      description={description}
      actions={actions}
      breadcrumb={showBreadcrumbs ? <Breadcrumbs /> : undefined}
      className={className}
    />
  );
}
