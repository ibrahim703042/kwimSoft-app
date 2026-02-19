import Swal from "sweetalert2";

export type AlertType = "error" | "success" | "warning" | "info";

export interface AlertOptions {
  title?: string;
  text: string;
  type?: AlertType;
  confirmButtonText?: string;
}

const defaultTitles: Record<AlertType, string> = {
  error: "Erreur",
  success: "Succès",
  warning: "Attention",
  info: "Information",
};

/**
 * Show an error popup (e.g. network error, validation error).
 * Use this instead of inline Swal.fire for consistent UX.
 */
export function showErrorAlert(text: string, title?: string): Promise<void> {
  return Swal.fire({
    title: title ?? defaultTitles.error,
    text,
    icon: "error",
    confirmButtonText: "OK",
  }).then(() => undefined);
}

/**
 * Show a success popup.
 */
export function showSuccessAlert(text: string, title?: string): Promise<void> {
  return Swal.fire({
    title: title ?? defaultTitles.success,
    text,
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => undefined);
}

/**
 * Show a warning popup.
 */
export function showWarningAlert(text: string, title?: string): Promise<void> {
  return Swal.fire({
    title: title ?? defaultTitles.warning,
    text,
    icon: "warning",
    confirmButtonText: "OK",
  }).then(() => undefined);
}

/**
 * Show an info popup.
 */
export function showInfoAlert(text: string, title?: string): Promise<void> {
  return Swal.fire({
    title: title ?? defaultTitles.info,
    text,
    icon: "info",
    confirmButtonText: "OK",
  }).then(() => undefined);
}

/**
 * Generic alert with custom type and options.
 */
export function showAlert(options: AlertOptions): Promise<void> {
  const { title, text, type = "info", confirmButtonText = "OK" } = options;
  return Swal.fire({
    title: title ?? defaultTitles[type],
    text,
    icon: type,
    confirmButtonText,
  }).then(() => undefined);
}
