import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/app/Breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

/**
 * Page header with title, optional description, and action buttons
 */
export function PageHeader({ 
  title, 
  description, 
  actions, 
  showBreadcrumbs = true,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {showBreadcrumbs && <Breadcrumbs />}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
