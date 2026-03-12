import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kwim/shared-ui";
import { breadCrumbItemsSelector } from "@/store/selectors/appSelectors";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface BreadcrumbItemData {
  name: string;
  path?: string;
}

export default function Breadcrumbs() {
  const breadCrumbItems = useSelector(breadCrumbItemsSelector) as BreadcrumbItemData[];

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[0.8rem]">
          {breadCrumbItems?.[breadCrumbItems?.length - 1]?.name}
        </p>
      </div>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Page</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {breadCrumbItems?.[breadCrumbItems?.length - 1]?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
