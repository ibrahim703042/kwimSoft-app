import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useSelector } from "react-redux";

interface BreadcrumbItem {
  path: string;
  name: string;
}

interface AppState {
  app: {
    breadCrumbItems: BreadcrumbItem[];
  };
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbItems = useSelector(
    (state: AppState) => state.app?.breadCrumbItems || []
  );

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center gap-1">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {breadcrumbItems.length > 0
          ? breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <ChevronRight
                  size={14}
                  className="text-muted-foreground/50"
                />
                <li>
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
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
            ))
          : pathSegments.map((segment, index) => {
              const path = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;

              return (
                <React.Fragment key={path}>
                  <ChevronRight
                    size={14}
                    className="text-muted-foreground/50"
                  />
                  <li>
                    {isLast ? (
                      <span className="font-medium text-foreground">
                        {formatSegment(segment)}
                      </span>
                    ) : (
                      <Link
                        to={path}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {formatSegment(segment)}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
