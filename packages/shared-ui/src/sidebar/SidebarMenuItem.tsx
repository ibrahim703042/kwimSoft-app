import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItem } from "../types/module";

interface SidebarMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  index: number;
  currentPath?: string;
  LinkComponent?: React.ComponentType<any>;
}

export default function SidebarMenuItem({
  item,
  isOpen,
  index,
  currentPath = "",
  LinkComponent,
}: SidebarMenuItemProps) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  // Auto-expand if a child is active
  const isChildActive = hasChildren
    ? item.children!.some((child) => currentPath === child.path)
    : false;

  const [expanded, setExpanded] = useState(isChildActive);

  // For items with children but no direct path
  if (hasChildren) {
    const isGroupActive = isChildActive;

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full group relative flex items-center text-sm gap-3.5 p-2 rounded-md ${
            item.gap ? "mt-0" : ""
          } ${
            isGroupActive
              ? "text-white bg-gradient-to-r from-[rgba(32,61,148,1)] to-[rgba(16,22,71,1)]"
              : "hover:text-white hover:bg-gradient-to-r hover:from-[rgba(32,61,148,1)] hover:to-[rgba(16,22,71,1)]"
          }`}
          title={!isOpen ? item.label : undefined}
        >
          <div>{Icon && <Icon size={18} />}</div>
          <span
            style={{ transitionDelay: `${index * 50}ms` }}
            className={`whitespace-pre text-[#f5f5f5de] duration-300 flex-1 text-left ${
              !isOpen && "opacity-0 translate-x-28 overflow-hidden"
            }`}
          >
            {item.label}
          </span>
          {isOpen && (
            <span className="text-gray-400">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </button>

        {/* Children */}
        {expanded && isOpen && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-600 pl-2">
            {item.children!.map((child) => {
              const isActive = currentPath === child.path;
              const childContent = (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {child.label}
                </>
              );

              if (LinkComponent) {
                return (
                  <LinkComponent
                    key={child.id}
                    href={child.path || "#"}
                    className={`flex items-center text-xs gap-2 py-1.5 px-2 rounded-md transition-colors ${
                      isActive
                        ? "text-white bg-[rgba(32,61,148,0.5)]"
                        : "text-gray-400 hover:text-white hover:bg-[rgba(32,61,148,0.3)]"
                    }`}
                  >
                    {childContent}
                  </LinkComponent>
                );
              }

              return (
                <a
                  key={child.id}
                  href={child.path || "#"}
                  className={`flex items-center text-xs gap-2 py-1.5 px-2 rounded-md transition-colors ${
                    isActive
                      ? "text-white bg-[rgba(32,61,148,0.5)]"
                      : "text-gray-400 hover:text-white hover:bg-[rgba(32,61,148,0.3)]"
                  }`}
                >
                  {childContent}
                </a>
              );
            })}
          </div>
        )}

        {item.gap && <hr className="border-t border-gray-600 my-3" />}
      </div>
    );
  }

  // Simple menu item (no children)
  const isActive = currentPath === item.path;
  const menuContent = (
    <>
      <div>{Icon && <Icon size={18} />}</div>
      <h2
        style={{ transitionDelay: `${index * 50}ms` }}
        className={`whitespace-pre text-[#f5f5f5de] duration-300 ${
          !isOpen && "opacity-0 translate-x-28 overflow-hidden"
        }`}
      >
        {item.label}
      </h2>
    </>
  );

  const className = `group relative flex items-center text-sm gap-3.5 p-2 rounded-md ${
    item.gap ? "mt-0" : ""
  } ${
    isActive
      ? "text-white bg-gradient-to-r from-[rgba(32,61,148,1)] to-[rgba(16,22,71,1)]"
      : "hover:text-white hover:bg-gradient-to-r hover:from-[rgba(32,61,148,1)] hover:to-[rgba(16,22,71,1)]"
  }`;

  return (
    <>
      {LinkComponent ? (
        <LinkComponent href={item.path || "#"} className={className} title={!isOpen ? item.label : undefined}>
          {menuContent}
        </LinkComponent>
      ) : (
        <a href={item.path || "#"} className={className} title={!isOpen ? item.label : undefined}>
          {menuContent}
        </a>
      )}
      {item.gap && <hr className="border-t border-gray-600 my-3" />}
    </>
  );
}
