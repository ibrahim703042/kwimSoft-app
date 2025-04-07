import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadCrumbItemsSelector } from "@/store/selectors/appSelectors";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Breadcrumbs() {
  const breadCrumbItems = useSelector(breadCrumbItemsSelector);

  console.log("breadCrumbItems", breadCrumbItems);

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
              <BreadcrumbLink>
                <Link href="/">Page</Link>
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
