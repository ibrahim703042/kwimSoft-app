import { AlertCircle, RefreshCw, XCircle, WifiOff, ServerCrash } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
  variant?: "error" | "warning" | "info" | "network" | "not-found";
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  error: {
    bg: "bg-destructive/10 border-destructive/20",
    text: "text-destructive",
    icon: XCircle,
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
    icon: AlertCircle,
  },
  network: {
    bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    text: "text-orange-700 dark:text-orange-400",
    icon: WifiOff,
  },
  "not-found": {
    bg: "bg-muted/50 border-border",
    text: "text-muted-foreground",
    icon: ServerCrash,
  },
};

export function ErrorState({
  title,
  message = "Une erreur est survenue",
  details,
  variant = "error",
  onRetry,
  onDismiss,
  className,
}: Readonly<ErrorStateProps>) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center gap-3",
        className
      )}
      role="alert"
    >
      <Icon className={cn("h-10 w-10", style.text)} aria-hidden="true" />
      {title && <h3 className={cn("text-sm font-semibold", style.text)}>{title}</h3>}
      <p className={cn("text-sm", style.text)}>{message}</p>
      {details && (
        <p className={cn("text-xs max-w-md opacity-75", style.text)}>{details}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn("p-1 rounded-md hover:bg-black/5", style.text)}
          aria-label="Fermer"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export interface ErrorBannerProps {
  message?: string;
  details?: string;
  variant?: ErrorStateProps["variant"];
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** Inline error banner for forms and sections */
export function ErrorBanner({
  message = "Une erreur est survenue",
  details,
  variant = "error",
  onRetry,
  onDismiss,
  className,
}: Readonly<ErrorBannerProps>) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        style.bg,
        className
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", style.text)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", style.text)}>{message}</p>
        {details && (
          <p className={cn("text-xs mt-1 opacity-75", style.text)}>{details}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="h-7 text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </Button>
        )}
        {onDismiss && (
          <button type="button" onClick={onDismiss} className={cn("p-1", style.text)} aria-label="Fermer">
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
