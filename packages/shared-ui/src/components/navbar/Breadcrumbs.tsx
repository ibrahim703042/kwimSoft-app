import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  path: string;
  name: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeLink?: string;
  showHome?: boolean;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: React.ReactNode }>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  homeLink = "/",
  showHome = true,
  LinkComponent,
}) => {
  const Link = LinkComponent || (({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) => (
    <a href={to} className={className}>{children}</a>
  ));

  if (items.length === 0 && !showHome) {
    return null;
  }

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center gap-1">
        {showHome && (
          <li>
            <Link
              to={homeLink}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={14} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            <ChevronRight size={14} className="text-muted-foreground/50" />
            <li>
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
