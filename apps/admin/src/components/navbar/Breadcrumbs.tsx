import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Breadcrumbs as SharedBreadcrumbs, type NavbarBreadcrumbItem } from "@kwim/shared-ui";

interface AppState {
  app: {
    breadCrumbItems: NavbarBreadcrumbItem[];
  };
}

const RouterLink = ({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) => (
  <Link to={to} className={className}>{children}</Link>
);

const Breadcrumbs = () => {
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

  const items: NavbarBreadcrumbItem[] =
    breadcrumbItems.length > 0
      ? breadcrumbItems
      : pathSegments.map((segment, index) => ({
          path: "/" + pathSegments.slice(0, index + 1).join("/"),
          name: formatSegment(segment),
        }));

  if (items.length === 0) {
    return null;
  }

  return (
    <SharedBreadcrumbs
      items={items}
      homeLink="/"
      showHome={true}
      LinkComponent={RouterLink}
    />
  );
};

export default Breadcrumbs;
