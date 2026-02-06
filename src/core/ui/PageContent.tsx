import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContentProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * Main content area with consistent styling
 */
export function PageContent({ children, className, noPadding = false }: PageContentProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border transition-colors duration-300",
        !noPadding && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
