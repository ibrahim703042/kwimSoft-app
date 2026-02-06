import React from "react";

interface ErrorBannerProps {
  message?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message = "Une erreur est survenue" }) => (
  <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-md">
    <p className="text-sm">{message}</p>
  </div>
);

export default ErrorBanner;
