import { NavLink } from "react-router-dom";
import { MenuItem } from "@/app/ModuleRegistry";

interface SidebarMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  index: number;
}

export default function SidebarMenuItem({
  item,
  isOpen,
  index,
}: SidebarMenuItemProps) {
  const Icon = item.icon;

  return (
    <>
      <NavLink
        to={item.path || "#"}
        className={({ isActive }) =>
          `group relative flex items-center text-sm gap-3.5 p-2 rounded-md ${
            item.gap ? "mt-0" : ""
          } ${
            isActive
              ? "text-white bg-gradient-to-r from-[rgba(32,61,148,1)] to-[rgba(16,22,71,1)]"
              : "hover:text-white hover:bg-gradient-to-r hover:from-[rgba(32,61,148,1)] hover:to-[rgba(16,22,71,1)]"
          }`
        }
      >
        <div>{Icon && <Icon />}</div>
        <h2
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
          className={`whitespace-pre text-[#f5f5f5de] duration-300 ${
            !isOpen && "opacity-0 translate-x-28 overflow-hidden"
          }`}
        >
          {item.label}
        </h2>
        {!isOpen && (
          <h2 className="absolute left-48 z-50 bg-white font-medium text-gray-900 rounded-md drop-shadow-lg px-2 py-2 w-fit hidden group-hover:block group-hover:left-14 group-hover:duration-500">
            {item.label}
          </h2>
        )}
      </NavLink>
      {item.gap && <hr className="border-t border-gray-600 my-3" />}
    </>
  );
}
