import React from 'react';

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-medium text-gray-800">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
    </div>
  );
};

export default PageTitle;
