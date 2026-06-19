import type { ReactNode } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { TableSkeleton } from "./Skeleton";

export interface QueryStateProps {
  isLoading?: boolean;
  error?: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  loadingLabel?: string;
  children: ReactNode;
  /** Use table skeleton when loading (for table views) */
  tableSkeleton?: boolean;
}

function getErrorMessage(error: unknown): { message: string; details?: string; variant?: "network" | "not-found" | "error" } {
  const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
  if (err?.response?.status === 404) {
    return { message: "Ce service n'est pas encore disponible.", variant: "not-found" };
  }
  if (err?.message === "Network Error") {
    return { message: "Erreur réseau. Vérifiez votre connexion.", variant: "network" };
  }
  return {
    message: "Erreur lors du chargement des données.",
    details: err?.response?.data?.message || err?.message || "Veuillez réessayer.",
    variant: "error",
  };
}

export function QueryState({
  isLoading = false,
  error,
  isEmpty = false,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyAction,
  loadingLabel = "Chargement",
  children,
  tableSkeleton = false,
}: Readonly<QueryStateProps>) {
  if (isLoading) {
    if (tableSkeleton) {
      return <TableSkeleton />;
    }
    return (
      <div
        className="flex justify-center py-16"
        role="status"
        aria-live="polite"
        aria-label={loadingLabel}
      >
        <ClipLoader loading size={40} color="hsl(var(--primary))" />
      </div>
    );
  }

  if (error) {
    const { message, details, variant } = getErrorMessage(error);
    return (
      <ErrorState
        message={message}
        details={details}
        variant={variant}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return <>{children}</>;
}
