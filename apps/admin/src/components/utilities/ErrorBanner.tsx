import { AlertCircle, RefreshCw, XCircle, WifiOff, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorBannerProps {
  /** Error message to display */
  message?: string;
  /** Error details / technical info */
  details?: string;
  /** Error variant */
  variant?: "error" | "warning" | "info" | "network" | "not-found";
  /** Retry callback — shows a retry button when provided */
  onRetry?: () => void;
  /** Dismiss callback — shows a close button when provided */
  onDismiss?: () => void;
  /** Additional class names */
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

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message = "Une erreur est survenue",
  details,
  variant = "error",
  onRetry,
  onDismiss,
  className = "",
}) => {
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${className}`}
      role="alert"
    >
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${style.text}`} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        {details && (
          <p className={`text-xs mt-1 opacity-75 ${style.text}`}>{details}</p>
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
          <button
            onClick={onDismiss}
            className={`p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${style.text}`}
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
