import Swal from "sweetalert2";

/**
 * Show success alert using SweetAlert2
 */
export function showSuccessAlert(message: string) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}

/**
 * Show error alert using SweetAlert2
 */
export function showErrorAlert(message: string) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    timer: 4000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}

/**
 * Show info alert using SweetAlert2
 */
export function showInfoAlert(message: string) {
  Swal.fire({
    icon: "info",
    title: "Info",
    text: message,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}

/**
 * Show warning alert using SweetAlert2
 */
export function showWarningAlert(message: string) {
  Swal.fire({
    icon: "warning",
    title: "Warning",
    text: message,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}
