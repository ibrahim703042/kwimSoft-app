import React from "react";

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => (
  <div className="bg-red-100 dark:bg-red-400 text-red-700 dark:text-white p-3 rounded-md">
    <p className="text-sm">{message}</p>
  </div>
);

export default ErrorBanner;
