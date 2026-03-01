import { useEffect } from "react";

interface PageTitleProps {
  title: string;
}

/**
 * Component to set the document title
 * Usage: <PageTitle title="My Page" />
 */
export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    document.title = title ? `${title} - KwimSoft ERP` : "KwimSoft ERP";
  }, [title]);

  return null;
}
