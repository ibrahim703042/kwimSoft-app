import { ComponentType, ReactNode, useState } from "react";
import { LucideIcon, Menu, IndentDecrease } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeatureTabOption {
  name: string;
  component: ComponentType;
  icon: LucideIcon;
}

interface FeatureTabShellProps {
  title: string;
  options: FeatureTabOption[];
  defaultOption?: FeatureTabOption;
  footerOptions?: FeatureTabOption[];
  mobileTitle?: string;
  headerExtra?: ReactNode;
}

export default function FeatureTabShell({
  title,
  options,
  defaultOption,
  footerOptions = [],
  mobileTitle,
  headerExtra,
}: Readonly<FeatureTabShellProps>) {
  const [openSide, setOpenSide] = useState(false);
  const [selected, setSelected] = useState<FeatureTabOption>(
    defaultOption ?? options[0]
  );

  const SelectedComponent = selected.component;

  const renderNav = (items: FeatureTabOption[]) => (
    <ul className="mb-6 flex flex-col gap-1 text-sm">
      {items.map((link) => (
        <li key={link.name}>
          <button
            type="button"
            onClick={() => setSelected(link)}
            className={cn(
              "group relative flex w-full items-center gap-2.5 rounded-md py-1.5 px-2 font-medium duration-300 ease-in-out",
              link.name === selected.name
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-current={link.name === selected.name ? "page" : undefined}
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.name}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm md:hidden">
        <p className="text-sm font-medium text-foreground">{mobileTitle ?? title}</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpenSide((p) => !p)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-3 overflow-hidden">
        <aside
          className={cn(
            "hidden sm:flex flex-col rounded-2xl border bg-card shadow-sm transition-all duration-200",
            openSide ? "w-0 overflow-hidden border-0 p-0" : "w-[290px] shrink-0"
          )}
        >
          <div className="flex items-center justify-between px-6 pt-4">
            <p className="text-base font-semibold text-foreground">{title}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpenSide((p) => !p)}
              aria-label="Réduire le menu"
            >
              <IndentDecrease className="h-4 w-4" />
            </Button>
          </div>
          <hr className="my-4" />
          {headerExtra}
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            {renderNav(options)}
            {footerOptions.length > 0 && renderNav(footerOptions)}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <SelectedComponent />
        </div>
      </div>
    </div>
  );
}
